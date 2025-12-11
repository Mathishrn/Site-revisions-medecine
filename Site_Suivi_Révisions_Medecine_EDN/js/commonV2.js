// js/commonV2.js

// --- UTILITAIRES DATES ---

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

// --- GESTION DU STOCKAGE ---

const STORAGE_KEY_STATE = "suivi_med_state_v1";
const STORAGE_KEY_SETTINGS = "suivi_med_settings_v1";

// --- GESTION INTELLIGENTE DES PARAMÈTRES (V3) ---

function getSettings() {
  const defaults = {
    startDate: typeof START_DATE_STR !== 'undefined' ? START_DATE_STR : "2025-09-01",
    endDate: typeof END_DATE_STR !== 'undefined' ? END_DATE_STR : "2026-08-30",
    offsets: typeof REVIEW_OFFSETS_DAYS !== 'undefined' ? REVIEW_OFFSETS_DAYS.join(", ") : "1, 3, 7, 14, 30, 45, 60, 90, 120, 180, 240, 300",
    blockedWeekdays: [], 
    vacations: []        
  };
  
  const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
  if (!raw) return defaults;
  
  try {
    const s = JSON.parse(raw);
    return { ...defaults, ...s };
  } catch(e) {
    return defaults;
  }
}

function saveSettings(newSettings) {
  localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(newSettings));
}

function getOffsetsArray() {
  const s = getSettings();
  return s.offsets.split(",")
    .map(x => parseInt(x.trim(), 10))
    .filter(x => !isNaN(x) && x > 0)
    .sort((a,b) => a - b);
}

/**
 * SMART RESCHEDULE : Vérifie si une date est bloquée
 */
function isDateBlocked(dateObj, settings) {
  const iso = formatDateISO(dateObj);
  
  // 1. Vérif Weekday (0=Dimanche, 6=Samedi)
  const day = dateObj.getDay();
  if (settings.blockedWeekdays && settings.blockedWeekdays.includes(day)) return true;

  // 2. Vérif Vacances
  if (settings.vacations && settings.vacations.length > 0) {
    for (let p of settings.vacations) {
      if (iso >= p.start && iso <= p.end) return true;
    }
  }

  return false;
}

/**
 * SMART RESCHEDULE : Trouve la prochaine date libre
 */
function findNextAvailableDate(targetDate, settings) {
  let d = new Date(targetDate);
  // Sécurité : on ne cherche pas plus de 365 jours pour éviter boucle infinie
  let safeGuard = 0;
  
  while (isDateBlocked(d, settings) && safeGuard < 365) {
    d = addDays(d, 1);
    safeGuard++;
  }

  // Si on a dépassé la limite, c'est que tout est bloqué.
  // On retourne la date cible originale pour éviter un crash ou une date en 2030.
  if (safeGuard >= 730) {
      return new Date(targetDate); 
  }

  return d;
}

// --- STATE MANAGEMENT ---

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

  // Initialisation lazy
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

  // Correction de cohérence
  CHAPITRES.forEach(ch => {
    const st = state.chapters[ch.id];
    if (!st) return;

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

// --- GÉNÉRATION & CALCULS PLANNING ---

/**
 * Génère le planning complet (utilisé lors du premier cochage)
 */
function generateReviewSchedule(learnedDateStr) {
  const learnedDate = parseDate(learnedDateStr);
  
  const settings = getSettings();
  const endDate = parseDate(settings.endDate);
  const offsets = getOffsetsArray();

  const reviews = [];
  for (let i = 0; i < offsets.length; i++) {
    const offset = offsets[i];
    let theoreticalDate = addDays(learnedDate, offset);
    
    // SMART RESCHEDULE : Décalage si bloqué
    let finalDate = findNextAvailableDate(theoreticalDate, settings);

    if (finalDate > endDate) break;

    reviews.push({
      index: i + 1,
      offsetDays: offset,
      date: formatDateISO(finalDate),
      done: false
    });
  }

  return reviews;
}

/**
 * RECALCUL GLOBAL INTELLIGENT
 * Préserve l'historique (ce qui est fait reste fait)
 * Applique les nouveaux intervalles et exclusions sur le futur
 */
function recalculateAllSchedules() {
  let state = loadState();
  const settings = getSettings();
  const offsets = getOffsetsArray(); // ex: [1, 3, 7, 25, 60...]
  const endDate = parseDate(settings.endDate);
  
  let countUpdated = 0;

  CHAPITRES.forEach(ch => {
    const st = state.chapters[ch.id];
    if (!st || !st.completed || !st.learnedDate) return;

    const learnedDate = parseDate(st.learnedDate);
    
    // 1. Récupérer l'historique (ce qui est DÉJÀ FAIT)
    const history = st.reviews.filter(r => r.done);

    // 2. Récupérer les "Préservés" (NON FAIT mais DÉPLACÉ ou REPORTÉ)
    // C'est ici qu'on corrige : on garde 'moved' ET 'skipped'
    const preserved = st.reviews.filter(r => !r.done && (r.moved || r.status === 'skipped'));

    // 3. Calculer le niveau actuel (le plus grand J+ validé)
    let maxOffsetDone = 0;
    if (history.length > 0) {
      maxOffsetDone = Math.max(...history.map(r => r.offsetDays));
    }

    // 4. Identifier les Offsets qui sont déjà "réservés" par un report
    // (Pour ne pas recréer un J+3 théorique si on a déjà un J+3 reporté)
    const preservedOffsets = preserved.map(r => r.offsetDays);

    // 5. Calculer les futurs Offsets à générer
    // Condition : > au dernier fait ET pas déjà dans les préservés
    const futureOffsets = offsets.filter(off => 
      off > maxOffsetDone && !preservedOffsets.includes(off)
    );

    const futureReviews = [];

    for (let i = 0; i < futureOffsets.length; i++) {
      const offset = futureOffsets[i];
      let theoreticalDate = addDays(learnedDate, offset);
      
      // SMART RESCHEDULE (Jours bloqués / Vacances)
      let finalDate = findNextAvailableDate(theoreticalDate, settings);
      
      if (finalDate > endDate) break;
      
      futureReviews.push({
        index: 0, // sera recalculé
        offsetDays: offset,
        date: formatDateISO(finalDate),
        done: false,
        status: "normal"
      });
    }

    // 6. Fusionner tout : Historique + Préservés + Nouveaux Futurs
    const newSchedule = [...history, ...preserved, ...futureReviews];

    // 7. Tri Chronologique
    newSchedule.sort((a, b) => {
      if (a.date === b.date) return 0;
      return a.date < b.date ? -1 : 1;
    });
    
    // 8. Renumérotation propre (1, 2, 3...)
    newSchedule.forEach((r, idx) => {
      r.index = idx + 1;
    });

    st.reviews = newSchedule;
    countUpdated++;
  });

  saveState(state);
  return countUpdated;
}

// --- BOÎTE DEADLINE ---

function updateDeadlineBox(state) {
  const countdownElem = document.getElementById("deadline-countdown");
  const barElem = document.getElementById("deadline-progress-bar");
  const titleElem = document.querySelector(".deadline-title");

  if (!countdownElem || !barElem) return;

  const today = new Date();
  
  const settings = getSettings();
  const start = parseDate(settings.startDate);
  const end = parseDate(settings.endDate);

  if (titleElem) {
    const dateStr = end.toLocaleDateString("fr-FR", {
      day: "numeric", 
      month: "long", 
      year: "numeric"
    });
    titleElem.textContent = `Date de fin de révisions : ${dateStr}`;
  }

  const diffMs = end - today;
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysLeft = Math.max(0, Math.ceil(diffMs / msPerDay));

  if (daysLeft === 0 && today > end) {
    countdownElem.textContent = "La date de fin est dépassée.";
  } else {
    countdownElem.textContent = `Il reste ${daysLeft} jours avant la fin.`;
  }
  
  const totalMs = end - start;
  let elapsedMs = today - start;
  
  if (elapsedMs < 0) elapsedMs = 0;
  if (elapsedMs > totalMs) elapsedMs = totalMs;

  const ratio = totalMs > 0 ? (elapsedMs / totalMs) * 100 : 0;
  barElem.style.width = Math.min(100, Math.max(0, ratio)) + "%";
}

// --- TOAST ---

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

// --- STATS HELPER ---

function getDaysLeft() {
  const today = new Date();
  const settings = getSettings();
  const end = parseDate(settings.endDate);
  const diffMs = end - today;
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.max(0, Math.ceil(diffMs / msPerDay));
}

// --- MOTIVATION (Version Complète Restaurée) ---

function buildMotivationMessage(state) {
  const total = CHAPITRES.length;
  let faits = 0;
  Object.values(state.chapters).forEach(c => {
    if (c.completed) faits++;
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

// --- UTILITAIRES DE MANIPULATION DU STATE (Restaurés) ---

/**
 * Ajoute une re-révision manuelle à un chapitre.
 */
function addManualReview(chapterId, dateISO) {
  let state = loadState();
  const st = state.chapters[chapterId];
  if (!st) return state;

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
 * Supprime une re-révision par son index.
 */
function deleteReview(chapterId, reviewIndex) {
  let state = loadState();
  const st = state.chapters[chapterId];
  if (!st || !Array.isArray(st.reviews)) return state;

  st.reviews = st.reviews.filter(r => r.index !== reviewIndex);
  saveState(state);
  return state;
}

/**
 * Déplace une re-révision en conservant l'original marqué "moved".
 */
function moveReviewWithHistory(chapterId, reviewIndex, newDateISO) {
  let state = loadState();
  const st = state.chapters[chapterId];
  if (!st || !Array.isArray(st.reviews)) return state;

  const review = st.reviews.find(r => r.index === reviewIndex);
  if (!review) return state;
  if (review.date === newDateISO) return state;

  const newDate = parseDate(newDateISO);
  let newOffset = review.offsetDays || 0;
  if (st.learnedDate) {
    const learned = parseDate(st.learnedDate);
    const diffMs = newDate - learned;
    const msPerDay = 1000 * 60 * 60 * 24;
    newOffset = Math.round(diffMs / msPerDay);
  }

  review.moved = true;
  review.movedToDate = newDateISO;
  review.done = false;

  const maxIndex = st.reviews.reduce((max, r) => Math.max(max, r.index || 0), 0);
  const child = {
    index: maxIndex + 1,
    offsetDays: newOffset,
    date: newDateISO,
    done: false,
    status: "normal",
    linkedFrom: reviewIndex
  };

  const pos = st.reviews.indexOf(review);
  if (pos === -1) st.reviews.push(child);
  else st.reviews.splice(pos + 1, 0, child);

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
  if (!st || !Array.isArray(st.reviews)) return state;
  const review = st.reviews.find(r => r.index === reviewIndex);
  if (!review) return state;

  review.done = !!done;
  saveState(state);
  return state;
}

function toggleReviewDone(chapterId, reviewIndex, done) {
  let state = loadState();
  const st = state.chapters[chapterId];
  if (!st || !Array.isArray(st.reviews)) return state;
  
  const review = st.reviews.find(r => r.index === reviewIndex);
  if (!review) return state;

  if (done) {
    if (review.status === "skipped" && typeof review.skipChildIndex === "number") {
      const idx = st.reviews.findIndex(r => r.index === review.skipChildIndex);
      if (idx !== -1) st.reviews.splice(idx, 1);
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

function toggleReviewSkipToday(chapterId, reviewIndex) {
  let state = loadState();
  const st = state.chapters[chapterId];
  if (!st || !Array.isArray(st.reviews)) return state;
  const review = st.reviews.find(r => r.index === reviewIndex);
  if (!review || !review.date) return state;
  
  // CORRECTION : On utilise le Smart Reschedule
  const settings = getSettings();
  const currentDate = parseDate(review.date);
  
  // On commence à chercher à partir de demain
  const nextDay = addDays(currentDate, 1);
  
  // On trouve la prochaine date VRAIMENT disponible (hors dimanches/vacances)
  const finalDate = findNextAvailableDate(nextDay, settings);
  
  review.date = formatDateISO(finalDate);
  review.done = false;
  review.status = "skipped"; // Petit marquage pour dire qu'on a sauté
  
  saveState(state);
  return state;
}


// --- DARK MODE INIT ---

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("btn-theme-toggle");
  
  const savedTheme = localStorage.getItem("theme_preference");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    if (btn) btn.textContent = "☀️"; 
  }

  if (btn) {
    btn.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
      const isDark = document.body.classList.contains("dark-mode");
      localStorage.setItem("theme_preference", isDark ? "dark" : "light");
      btn.textContent = isDark ? "☀️" : "🌙";
    });
  }
});


// --- GESTION FEEDBACK & NOUVEAUTÉS (Correctif) ---

document.addEventListener("DOMContentLoaded", () => {
  // 1. Feedback
  const btnOpen = document.getElementById("btn-open-feedback");
  const modalFB = document.getElementById("feedback-modal");
  const btnClose = document.getElementById("feedback-close");
  const backdrop = document.getElementById("feedback-backdrop");
  const form = document.getElementById("feedback-form");

  if (btnOpen && modalFB) {
    btnOpen.addEventListener("click", () => {
      modalFB.classList.add("open");
      modalFB.setAttribute("aria-hidden", "false");
    });
    
    function closeFeedback() {
      modalFB.classList.remove("open");
      modalFB.setAttribute("aria-hidden", "true");
    }
    
    if (btnClose) btnClose.addEventListener("click", closeFeedback);
    if (backdrop) backdrop.addEventListener("click", closeFeedback);

    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector(".submit-btn");
        const originalText = submitBtn.textContent;
        submitBtn.textContent = "Envoi...";
        submitBtn.disabled = true;

        const myFormData = new FormData(form);
        fetch("/", { method: "POST", body: myFormData })
          .then((response) => {
            if (response.ok) {
              closeFeedback();
              showToast("Message envoyé ! Merci 💌");
              form.reset();
            } else { throw new Error("Erreur réseau"); }
          })
          .catch((error) => {
            console.error(error);
            alert("Erreur d'envoi.");
          })
          .finally(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
          });
      });
    }
  }

  // 2. Nouveautés
  const btnNews = document.getElementById("btn-news");
  const modalNews = document.getElementById("news-modal");
  const btnCloseNews = document.getElementById("news-close");
  const backdropNews = document.getElementById("news-backdrop");

  if (btnNews && modalNews) {
    function openNews() {
      modalNews.classList.add("open");
      modalNews.setAttribute("aria-hidden", "false");
    }
    function closeNews() {
      modalNews.classList.remove("open");
      modalNews.setAttribute("aria-hidden", "true");
    }
    btnNews.addEventListener("click", openNews);
    if (btnCloseNews) btnCloseNews.addEventListener("click", closeNews);
    if (backdropNews) backdropNews.addEventListener("click", closeNews);
  }
});