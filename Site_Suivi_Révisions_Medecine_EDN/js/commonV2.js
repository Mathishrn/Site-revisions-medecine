// js/common.js

// --- Utilitaires dates ---

function parseDate(str) {
  if (!str) return new Date();
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d, 12, 0, 0);
}

function formatDateISO(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function formatDateFr(str) {
  const d = parseDate(str);
  return d.toLocaleDateString("fr-FR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

function todayISO() {
  return formatDateISO(new Date());
}

// --- Gestion du stockage global ---

const STORAGE_KEY_STATE = "suivi_med_state_v1";

function initEmptyState() {
  const state = {
    globalStartDate: todayISO(),
    chapters: {}
  };

  CHAPITRES.forEach(ch => {
    state.chapters[ch.id] = {
      completed: false,
      learnedDate: null,
      reviews: []
    };
  });

  return state;
}

function loadState() {
  let state;
  const raw = localStorage.getItem(STORAGE_KEY_STATE);

  if (raw) {
    try {
      state = JSON.parse(raw);
    } catch (e) {
      console.error("Erreur JSON, réinitialisation du state", e);
      state = initEmptyState();
    }
  } else {
    state = initEmptyState();
  }

  if (!state.chapters) {
    state.chapters = {};
  }

  CHAPITRES.forEach(ch => {
    if (!state.chapters[ch.id]) {
      state.chapters[ch.id] = {
        completed: false,
        learnedDate: null,
        reviews: []
      };
    }
  });

  if (!state.globalStartDate) {
    state.globalStartDate = todayISO();
  }

  // 🔴 Nettoyage important :
  // - si le chapitre n'est PAS complété -> on enlève learnedDate et reviews
  // - si le chapitre est complété et a une date mais pas de reviews -> on génère
  // - si le chapitre est marqué "complété" mais SANS date (bug ancien) -> on le remet non complété
  CHAPITRES.forEach(ch => {
    const st = state.chapters[ch.id];
    if (!st) return;

    // Cas incohérent hérité d'anciennes versions :
    // completed = true mais pas de learnedDate -> on corrige
    if (st.completed && !st.learnedDate) {
      st.completed = false;
      st.learnedDate = null;
      st.reviews = [];
    }

    if (!st.completed) {
      st.learnedDate = null;
      st.reviews = [];
    } else {
      if (st.learnedDate && (!Array.isArray(st.reviews) || st.reviews.length === 0)) {
        st.reviews = generateReviewSchedule(st.learnedDate);
      }
    }

    if (!Array.isArray(st.reviews)) {
      st.reviews = [];
    }
  });


  saveState(state);
  return state;
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY_STATE, JSON.stringify(state));
}

// --- Génération des re-révisions pour un chapitre ---

function generateReviewSchedule(learnedDateStr) {
  const learnedDate = parseDate(learnedDateStr);
  const endDate = parseDate(END_DATE_STR);

  const reviews = [];
  for (let i = 0; i < REVIEW_OFFSETS_DAYS.length; i++) {
    const offset = REVIEW_OFFSETS_DAYS[i];
    const reviewDate = addDays(learnedDate, offset);
    if (reviewDate > endDate) {
      break;
    }
    reviews.push({
      index: reviews.length + 1,
      offsetDays: offset,
      date: formatDateISO(reviewDate),
      done: false
    });
  }

  return reviews;
}

// --- Bloc "date de fin de révisions" ---

function updateDeadlineBox(state) {
  const countdownElem = document.getElementById("deadline-countdown");
  const barElem = document.getElementById("deadline-progress-bar");
  if (!countdownElem || !barElem) return;

  const today = new Date();
  const end = parseDate(END_DATE_STR);

  const diffMs = end - today;
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysLeft = Math.max(0, Math.ceil(diffMs / msPerDay));

  if (daysLeft === 0 && today > end) {
    countdownElem.textContent =
      "Les révisions sont censées être terminées (date de fin dépassée).";
  } else {
    countdownElem.textContent = `Il reste ${daysLeft} jours avant la fin des révisions.`;
  }

  // MODIFICATION ICI : On utilise la date fixe START_DATE_STR
  // au lieu de state.globalStartDate
  const start = parseDate(START_DATE_STR);
  
  const totalMs = end - start;
  let elapsedMs = today - start;
  
  // Si on est avant le début officiel (ex: on est en août 2025), la barre reste à 0
  if (elapsedMs < 0) elapsedMs = 0;
  if (elapsedMs > totalMs) elapsedMs = totalMs;

  const ratio = totalMs > 0 ? (elapsedMs / totalMs) * 100 : 0;
  const ratioRounded = Math.min(100, Math.max(0, ratio));
  
  barElem.style.width = ratioRounded + "%";
}

// --- Toast (popup) ---

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) {
    alert(message);
    return;
  }
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 5000);
}

// --- Stats & phrases de motivation ---

function getDaysLeft() {
  const today = new Date();
  const end = parseDate(END_DATE_STR);
  const diffMs = end - today;
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.max(0, Math.ceil(diffMs / msPerDay));
}

function buildMotivationMessage(state) {
  const total = CHAPITRES.length;
  let faits = 0;
  CHAPITRES.forEach(ch => {
    if (state.chapters[ch.id] && state.chapters[ch.id].completed) faits++;
  });

  const jours = getDaysLeft();
  const pourcent = total > 0 ? (faits / total) * 100 : 0;

  const templates = [
    // --- Les classiques & Vision de l'avenir ---
    "Tu as déjà validé {faits}/{total} chapitres ({pourcent} %) avec encore {jours} jours devant toi. Tu es en train de te construire une vraie vie de médecin.",
    "Chaque chapitre coché te rapproche de ta blouse blanche. {faits} chapitres sur {total}, {pourcent} % du chemin : futur chirurgien, tu es sur la bonne voie.",
    "Tu tiens le rythme : {faits} chapitres faits, {jours} jours restants. Bientôt tu feras des visites, des blocs, et tu seras payé pour ce que tu apprends aujourd’hui.",
    "Tu investis dans ta future vie : {faits}/{total} chapitres, {pourcent} %. Bientôt, ce sera toi qui dictera la conduite à tenir en staff.",
    "Encore {jours} jours avant la fin des révisions. Imagine le soulagement après l’examen, les vacances, et le fait de pouvoir dire « je suis médecin ».",
    "Tu construis ton cerveau de praticien bloc après bloc : {faits} chapitres, {pourcent} %. Un jour tu ouvriras un abdomen comme si c’était une to-do list.",
    "{faits} chapitres sur {total}, ce n’est pas “un peu”, c’est une vraie montagne déjà gravie. Le reste, c’est juste la dernière portion jusqu’à ta vie de médecin.",
    "{jours} jours restants, {pourcent} % déjà accomplis. Tu t’organises comme une machine de guerre, c’est comme ça qu’on finit dans les spécialités qui font rêver.",
    "Chaque re-révision, c’est un futur patient que tu sauveras sans stresser. Ton futur interne en chef te remerciera d’avoir autant bossé.",
    "Tu avances chapitre par chapitre, mais en vrai tu construis ta carrière entière. {faits}/{total} déjà faits, continue.",
    "Le futur salaire de médecin est déjà en train de se rapprocher, un QCM et un chapitre à la fois. {pourcent} % du programme validé.",
    "Un jour tu rentreras chez toi après le bloc en te disant : « Heureusement que j’ai fait toutes ces re-révisions ». Tu es en train de préparer cette version de toi.",
    "Les autres vont peut-être improviser, toi tu seras prêt. {faits} chapitres validés, {jours} jours encore pour consolider.",
    "L’énergie que tu mets aujourd’hui, c’est le confort de ta vie de médecin demain : horaires, salaire, respect. Tu es en train de te l’offrir.",
    "Tu n’es pas juste en train de réviser, tu es en train de sécuriser ta liberté future : choisir ta spécialité, ta ville, ton style de vie.",
    "Quand tu hésites, pense aux gardes payées, à l’indépendance, à la fierté de tes proches. Tout ça commence par ces {faits} chapitres déjà maîtrisés.",
    "Tu construis ta confiance case par case. Arriver en stage en connaissant ton cours, ça change tout. Et tu es clairement sur cette trajectoire.",
    "Tu es en train de devenir ce médecin solide sur qui les autres comptent. {pourcent} % du programme, c’est déjà énorme.",
    "Dans quelques années, tu expliqueras à des externes comment réviser efficacement. Et tu pourras leur dire : « J’ai fait exactement ce que je fais aujourd’hui ».",
    "Chaque journée de révisions te rapproche du moment où tu pourras enfin souffler en te disant : « C’est fait, je l’ai fait ». Et ce moment arrive.",

    // --- Discipline & "Coup de pied au c*l" ---
    "Si c’était facile, tout le monde le ferait. T'as choisi la voie royale, assume tes {pourcent} % !",
    "La douleur de la discipline pèse des grammes, celle du regret pèse des tonnes. Fonce valider le reste.",
    "Ferme les réseaux sociaux. Tes futurs patients ne sont pas sur ton feed, ils sont dans les {total} chapitres.",
    "Le concours ne veut pas savoir si tu es fatigué, il veut savoir si tu es prêt. Et avec {faits} chapitres, tu le deviens.",
    "Arrête de scroller, commence à bosser. Tes concurrents sont déjà à la bibliothèque.",
    "Pas d'excuses, que des résultats. {faits}/{total}, c'est bien, mais on vise le sommet.",
    "Tu es fatigué ? On s'en fiche. Le concours s'en fiche. Continue, tu as fait {pourcent} % du chemin.",
    "Arrête de négocier avec toi-même. T'es pas en stage là, t'es le patron de ton temps.",
    "C'est dur ? C'est normal. C'est fait pour sélectionner ceux qui le veulent vraiment.",
    "Personne ne viendra faire le travail à ta place. C'est ton nom qui sera sur la feuille d'examen, c'est ton avenir qui se joue.",
    "Révise ce chapitre. Sinon, c'est sûr, tu vas tomber dessus le jour J. C'est la loi de Murphy.",
    "Le talent, c'est bien. L'obsession du travail bien fait, c'est mieux. {pourcent} % validés, sois obsédé par la fin.",
    "Ta motivation va et vient, ta discipline doit rester constante. {jours} jours pour tout donner.",
    
    // --- Humour & Vie d'externe ---
    "Dis-toi que chaque chapitre validé, c'est virtuellement 25€ qui rentrent dans ta poche future.",
    "Le café n'est pas un substitut au sommeil, mais pour l'instant, c'est ton meilleur ami pour finir les {jours} jours restants.",
    "Mieux vaut pleurer devant ses fiches maintenant que devant le chef de service demain.",
    "Courage, bientôt tu pourras porter une blouse sans avoir l'air d'un enfant déguisé.",
    "L'avantage de bosser autant, c'est que tu n'as pas le temps de dépenser de l'argent !",
    "La médecine, c'est comme le vélo : sauf que le vélo est en feu, la route est en feu, et tu es en enfer. Mais {pourcent} % sont déjà derrière toi !",
    "Dors, mange, révise, répète. C'est pas glamour, mais c'est efficace. {faits} chapitres au compteur.",
    "Pense à ce moment où tu pourras enfin désinstaller cette application de révisions.",
    "Tu n'as pas besoin de vie sociale, tu as besoin de valider l'item {faits}. (C'est faux, appelle tes amis après ce chapitre).",
    "Regarde cette barre de progression : {pourcent} %. C'est pas juste des pixels, c'est ton abonnement Netflix de l'année prochaine.",
    
    // --- Inspiration courte & Impact ---
    "Tu n'apprends pas pour un concours, tu apprends pour le patient qui comptera sur toi. Déjà {faits} chapitres acquis pour lui.",
    "Pense à la tête de tes proches quand tu diras 'Docteur' avant ton prénom. Ça vaut bien quelques heures de plus.",
    "Ton stéthoscope t'attend. Ne le fais pas attendre trop longtemps.",
    "La médecine n'est pas un métier, c'est une identité. Construis-la, item après item.",
    "Dans 20 ans, tu ne regretteras pas d'avoir sacrifié cette soirée. Fonce.",
    "Tu ne révises pas des statistiques, tu révises comment sauver des vies. (Bon ok, parfois c'est juste des stats).",
    "Chaque re-révision faite aujourd'hui est une angoisse de moins pour demain.",
    "Sois fier. Peu de gens ont la capacité de travail que tu déploies actuellement.",
    "Visualise le jour des résultats. Fais en sorte que ce soit le plus beau jour de ta vie.",
    "Tu es le héros de ta propre histoire. Ne laisse pas le chapitre {faits} être celui où tu abandonnes."
  ];

  const tpl = templates[Math.floor(Math.random() * templates.length)];
  return tpl
    .replace("{faits}", faits)
    .replace("{total}", total)
    .replace("{pourcent}", pourcent.toFixed(1))
    .replace("{jours}", jours);
}

// --- Helpers de manipulation des re-révisions (state global) ---


/**
 * Ajoute une re-révision manuelle à un chapitre pour une date donnée.
 * Retourne le state à jour.
 */
function addManualReview(chapterId, dateISO) {
  let state = loadState();
  const st = getOrInitChapterState(state, chapterId);

  const dateObj = parseDate(dateISO);
  let offset = null;
  if (st.learnedDate) {
    const learned = parseDate(st.learnedDate);
    const diffMs = dateObj - learned;
    const msPerDay = 1000 * 60 * 60 * 24;
    offset = Math.round(diffMs / msPerDay);
  }

  const maxIndex = st.reviews.reduce((max, r) => Math.max(max, r.index || 0), 0);
  st.reviews.push({
    index: maxIndex + 1,
    offsetDays: offset !== null ? offset : 0,
    date: dateISO,
    done: false
  });

  saveState(state);
  return state;
}

/**
 * Supprime une re-révision par son index logique.
 */
function deleteReview(chapterId, reviewIndex) {
  let state = loadState();
  const st = state.chapters[chapterId];
  if (!st || !Array.isArray(st.reviews)) {
    return state;
  }

  st.reviews = st.reviews.filter(r => r.index !== reviewIndex);
  saveState(state);
  return state;
}

/**
 * Déplace une re-révision vers une nouvelle date en conservant l'historique :
 * - la révision originale est marquée comme "moved" (barrée, non active)
 * - une nouvelle révision est créée à la nouvelle date, liée à l'ancienne
 */
function moveReviewWithHistory(chapterId, reviewIndex, newDateISO) {
  let state = loadState();
  const st = state.chapters[chapterId];
  if (!st || !Array.isArray(st.reviews)) {
    return state;
  }

  const review = st.reviews.find(r => r.index === reviewIndex);
  if (!review) {
    return state;
  }

  if (review.date === newDateISO) {
    return state;
  }

  const newDate = parseDate(newDateISO);

  let newOffset = review.offsetDays || 0;
  if (st.learnedDate) {
    const learned = parseDate(st.learnedDate);
    const diffMs = newDate - learned;
    const msPerDay = 1000 * 60 * 60 * 24;
    newOffset = Math.round(diffMs / msPerDay);
  }

  // 1) on marque l'original comme "déplacé"
  review.moved = true;
  review.movedToDate = newDateISO;
  review.done = false;

  // 2) nouveau clone enfant
  const maxIndex = st.reviews.reduce((max, r) => Math.max(max, r.index || 0), 0);
  const child = {
    index: maxIndex + 1,
    offsetDays: newOffset,
    date: newDateISO,
    done: false,
    status: "normal",
    linkedFrom: reviewIndex
  };

  // 👉 On insère le clone juste après l'original dans le tableau
  const pos = st.reviews.indexOf(review);
  if (pos === -1) {
    st.reviews.push(child);
  } else {
    st.reviews.splice(pos + 1, 0, child);
  }

  saveState(state);
  return state;
}

function updateReviewDate(chapterId, reviewIndex, newDateISO) {
  let state = loadState();
  const st = state.chapters[chapterId];
  if (!st || !Array.isArray(st.reviews)) return state;
  const review = st.reviews.find(r => r.index === reviewIndex);
  if (!review) return state;

  review.date = newDateISO;
  saveState(state);
  return state;
}

function setReviewDone(chapterId, reviewIndex, done) {
  let state = loadState();
  const st = state.chapters[chapterId];
  if (!st || !Array.isArray(st.reviews)) {
    return state;
  }
  const review = st.reviews.find(r => r.index === reviewIndex);
  if (!review) {
    return state;
  }

  review.done = !!done;
  saveState(state);
  return state;
}

function getOrInitChapterState(state, chapterId) {
  if (!state.chapters[chapterId]) {
    state.chapters[chapterId] = {
      completed: false,
      learnedDate: null,
      reviews: []
    };
  }
  if (!Array.isArray(state.chapters[chapterId].reviews)) {
    state.chapters[chapterId].reviews = [];
  }
  return state.chapters[chapterId];
}

/**
 * Toggle "fait / pas fait" pour une re-révision.
 * - done = true  -> marque comme faite
 *    - si elle était en "pas aujourd'hui", on annule le skip (on supprime le clone du lendemain)
 * - done = false -> enlève juste le fait
 */
function toggleReviewDone(chapterId, reviewIndex, done) {
  let state = loadState();
  const st = state.chapters[chapterId];
  if (!st || !Array.isArray(st.reviews)) return state;

  const review = st.reviews.find(r => r.index === reviewIndex);
  if (!review) return state;

  if (done) {
    if (review.status === "skipped" && typeof review.skipChildIndex === "number") {
      const idx = st.reviews.findIndex(r => r.index === review.skipChildIndex);
      if (idx !== -1) {
        st.reviews.splice(idx, 1);
      }
      delete review.skipChildIndex;
    }
    review.status = "normal";
    review.done = true;
  } else {
    review.done = false;
  }

  saveState(state);
  return state;
}

/**
 * "Pas aujourd'hui" :
 * - A chaque clic, on décale simplement la date de la re-révision de +1 jour.
 * - On laisse offsetDays tel quel (J+ initial).
 * - Le "reporté de X jours" se calcule par la différence entre la date actuelle
 *   et la date théorique (learnedDate + offsetDays).
 */
function toggleReviewSkipToday(chapterId, reviewIndex) {
  let state = loadState();
  const st = state.chapters[chapterId];
  if (!st || !Array.isArray(st.reviews)) return state;

  const review = st.reviews.find(r => r.index === reviewIndex);
  if (!review || !review.date) return state;

  const currentDate = parseDate(review.date);
  const newDate = addDays(currentDate, 1);
  const newDateISO = formatDateISO(newDate);

  review.date = newDateISO;
  review.done = false;
  review.status = "normal";

  saveState(state);
  return state;
}


// ... (Tout le code précédent reste là) ...

// --- Gestion du Dark Mode ---

function initDarkMode() {
  const btn = document.getElementById("btn-theme-toggle");
  
  // 1. Vérifier la préférence sauvegardée
  const savedTheme = localStorage.getItem("theme_preference");
  
  // Si "dark" est sauvegardé, on l'active tout de suite
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    if (btn) btn.textContent = "☀️"; // Icône Soleil pour repasser en jour
  }

  // 2. Gestion du clic
  if (btn) {
    btn.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
      
      const isDark = document.body.classList.contains("dark-mode");
      
      // Sauvegarde
      localStorage.setItem("theme_preference", isDark ? "dark" : "light");
      
      // Changement d'icône
      btn.textContent = isDark ? "☀️" : "🌙";
    });
  }
}

// On lance l'init au chargement de la page
document.addEventListener("DOMContentLoaded", () => {
  initDarkMode();
});


// --- GESTION DU FEEDBACK (CORRIGÉ) ---

document.addEventListener("DOMContentLoaded", () => {
  const btnOpen = document.getElementById("btn-open-feedback");
  const modalFB = document.getElementById("feedback-modal");
  const btnClose = document.getElementById("feedback-close");
  const backdrop = document.getElementById("feedback-backdrop");
  const form = document.getElementById("feedback-form");

  if (!btnOpen || !modalFB) return;

  // Ouvrir
  btnOpen.addEventListener("click", () => {
    modalFB.classList.add("open");
    modalFB.setAttribute("aria-hidden", "false");
  });

  // Fermer
  function closeFeedback() {
    modalFB.classList.remove("open");
    modalFB.setAttribute("aria-hidden", "true");
  }

  if (btnClose) btnClose.addEventListener("click", closeFeedback);
  if (backdrop) backdrop.addEventListener("click", closeFeedback);

  // Soumission du formulaire
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault(); // On ne recharge pas la page

      const submitBtn = form.querySelector(".submit-btn");
      const originalText = submitBtn.textContent;
      submitBtn.textContent = "Envoi en cours...";
      submitBtn.disabled = true;

      // Création des données (incluant le fichier s'il y en a un)
      const myFormData = new FormData(form);

      // Envoi à Netlify
      fetch("/", {
        method: "POST",
        // IMPORTANT : On NE MET PAS de header "Content-Type" ici.
        // Le navigateur va mettre automatiquement "multipart/form-data" 
        // avec la bonne frontière pour le fichier.
        body: myFormData,
      })
      .then((response) => {
        if (response.ok) {
          closeFeedback();
          showToast("Message envoyé ! Merci pour ton retour 💌");
          form.reset();
        } else {
          throw new Error("Erreur réseau : " + response.statusText);
        }
      })
      .catch((error) => {
        console.error("Erreur envoi formulaire :", error);
        alert("Oups, l'envoi a échoué. Vérifie ta connexion.");
      })
      .finally(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      });
    });
  }
});