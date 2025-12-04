// js/ui.js
// Fonctions liées à l'UI (rendu, modales, filtres)

const FOCUSABLE_SELECTORS = "a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex='-1'])";

function getFocusableElements(container) {
  return Array.from(container.querySelectorAll(FOCUSABLE_SELECTORS)).filter((el) => {
    return !el.hasAttribute("disabled") && el.getAttribute("aria-hidden") !== "true" && el.tabIndex !== -1;
  });
}

function createModalController(options) {
  const {
    modal,
    openButton = null,
    closeButton = null,
    backdrop = null,
    focusContainer = null,
    initialFocusSelector = null,
    onOpen = null,
    onClose = null,
    onEscape = null
  } = options;

  if (!modal) return { open: () => {}, close: () => {} };

  const focusScope = focusContainer || modal;
  let previousFocus = null;

  function focusFirstElement() {
    if (initialFocusSelector) {
      const target = modal.querySelector(initialFocusSelector);
      if (target && typeof target.focus === "function") {
        target.focus();
        return;
      }
    }

    const focusables = getFocusableElements(focusScope);
    if (focusables.length > 0 && typeof focusables[0].focus === "function") {
      focusables[0].focus();
    }
  }

  function trapTabKey(e) {
    if (e.key !== "Tab") return;

    const focusables = getFocusableElements(focusScope);
    if (focusables.length === 0) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const current = document.activeElement;

    if (e.shiftKey) {
      if (current === first || !focusables.includes(current)) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (current === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  function handleKeydown(e) {
    if (e.key === "Escape") {
      if (typeof onEscape === "function") {
        onEscape(close);
      } else {
        close();
      }
      return;
    }

    trapTabKey(e);
  }

  function open() {
    previousFocus = document.activeElement;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");

    if (typeof onOpen === "function") {
      onOpen();
    }

    document.addEventListener("keydown", handleKeydown);
    focusFirstElement();
  }

  function close() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.removeEventListener("keydown", handleKeydown);

    if (typeof onClose === "function") {
      onClose();
    }

    if (previousFocus && typeof previousFocus.focus === "function") {
      previousFocus.focus();
    }
    previousFocus = null;
  }

  if (openButton) {
    openButton.addEventListener("click", open);
  }

  if (closeButton) {
    closeButton.addEventListener("click", close);
  }

  if (backdrop) {
    backdrop.addEventListener("click", close);
  }

  return { open, close };
}

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

function updateDeadlineBox(state, settings = loadSettings()) {
  const countdownElem = document.getElementById("deadline-countdown");
  const barElem = document.getElementById("deadline-progress-bar");
  const titleElem = document.getElementById("deadline-title");
  if (!countdownElem || !barElem) return;

  const today = new Date();
  const end = parseDate(settings.endDate);

  const diffMs = end - today;
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysLeft = Math.max(0, Math.ceil(diffMs / msPerDay));

  if (daysLeft === 0 && today > end) {
    countdownElem.textContent =
      "Les révisions sont censées être terminées (date de fin dépassée).";
  } else {
    countdownElem.textContent = `Il reste ${daysLeft} jours avant la fin des révisions.`;
  }

  if (titleElem) {
    titleElem.textContent = `Date de fin de révisions : ${formatDateFr(settings.endDate)}`;
  }

  const start = parseDate(settings.startDate);

  const totalMs = end - start;
  let elapsedMs = today - start;

  if (elapsedMs < 0) elapsedMs = 0;
  if (elapsedMs > totalMs) elapsedMs = totalMs;

  const ratio = totalMs > 0 ? (elapsedMs / totalMs) * 100 : 0;
  const ratioRounded = Math.min(100, Math.max(0, ratio));

  barElem.style.width = ratioRounded + "%";
}

function buildMotivationMessage(state, settings = loadSettings()) {
  const total = CHAPITRES.length;
  let faits = 0;
  CHAPITRES.forEach(ch => {
    if (state.chapters[ch.id] && state.chapters[ch.id].completed) faits++;
  });

  const jours = getDaysLeft(settings);
  const pourcent = total > 0 ? (faits / total) * 100 : 0;

  const templates = [
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

function initDarkMode() {
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
}

function initFeedbackModal() {
  const btnOpen = document.getElementById("btn-open-feedback");
  const modalFB = document.getElementById("feedback-modal");
  const btnClose = document.getElementById("feedback-close");
  const backdrop = document.getElementById("feedback-backdrop");
  const form = document.getElementById("feedback-form");
  const focusContainer = document.getElementById("feedback-content");

  if (!btnOpen || !modalFB || !focusContainer) return;

  const feedbackController = createModalController({
    modal: modalFB,
    openButton: btnOpen,
    closeButton: btnClose,
    backdrop,
    focusContainer,
    initialFocusSelector: "#fb-name"
  });

  const closeFeedback = feedbackController.close;

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector(".submit-btn");
      const originalText = submitBtn.textContent;
      submitBtn.textContent = "Envoi en cours...";
      submitBtn.disabled = true;

      const myFormData = new FormData(form);

      fetch("/", {
        method: "POST",
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
}

function initUI(initialState, initialSettings) {
  let state = initialState;
  let settings = initialSettings;

  initDarkMode();
  initFeedbackModal();

  const liste = document.getElementById("liste-chapitres");
  if (!liste) {
    return;
  }

  updateDeadlineBox(state, settings);
  const searchInput = document.getElementById("search-input");
  const filterCompletedCheckbox = document.getElementById("filter-completed");
  const progressBar = document.getElementById("progress-bar");
  const progressText = document.getElementById("progress-text");
  const btnSave = document.getElementById("btn-save");
  const btnLoad = document.getElementById("btn-load");
  const fileInput = document.getElementById("file-input");

  const motivationBtn = document.getElementById("btn-motivation");
  const motivationBox = document.getElementById("motivation-box");
  if (motivationBtn && motivationBox) {
    motivationBtn.addEventListener("click", () => {
      state = loadState();
      const msg = buildMotivationMessage(state, settings);
      motivationBox.textContent = msg;
      motivationBox.style.display = "block";
    });
  }

  async function askFirstLearningDate(previousDateStr) {
    const dateModal = document.getElementById("date-modal");
    const dateInput = document.getElementById("date-modal-input");
    const btnOk = document.getElementById("date-modal-ok");
    const btnCancel = document.getElementById("date-modal-cancel");
    const backdrop = document.getElementById("date-modal-backdrop");
    const dateModalContent = document.getElementById("date-modal-content");

    if (!dateModal || !dateInput || !btnOk || !btnCancel || !backdrop || !dateModalContent) {
      return todayISO();
    }

    return new Promise((resolve) => {
      const todayStr = todayISO();
      dateInput.value = previousDateStr || todayStr;

      const dateController = createModalController({
        modal: dateModal,
        focusContainer: dateModalContent,
        initialFocusSelector: "#date-modal-input",
        onEscape: () => onCancel()
      });

      dateController.open();

      function closeModal() {
        dateController.close();
        btnOk.removeEventListener("click", onOk);
        btnCancel.removeEventListener("click", onCancel);
        backdrop.removeEventListener("click", onCancel);
        dateModal.removeEventListener("keydown", onKeyDown);
      }

      function onOk() {
        const val = dateInput.value;
        if (!val) {
          alert("Merci de choisir une date de 1ère apprentissage.");
          return;
        }
        closeModal();
        resolve(val);
      }

      function onCancel() {
        closeModal();
        resolve(null);
      }

      function onKeyDown(e) {
        if (e.key === "Enter") {
          onOk();
        }
      }

      btnOk.addEventListener("click", onOk);
      btnCancel.addEventListener("click", onCancel);
      backdrop.addEventListener("click", onCancel);
      dateModal.addEventListener("keydown", onKeyDown);
    });
  }

  const modal = document.getElementById("chapter-modal");
  const modalBackdrop = document.getElementById("modal-backdrop");
  const modalCloseBtn = document.getElementById("modal-close");
  const modalBody = document.getElementById("modal-body");
  const modalContent = document.getElementById("chapter-modal-content");

  const settingsBtn = document.getElementById("btn-settings");
  const settingsModal = document.getElementById("settings-modal");
  const settingsBackdrop = document.getElementById("settings-backdrop");
  const settingsCloseBtn = document.getElementById("settings-close");
  const settingsContent = document.getElementById("settings-content");
  const settingsStartInput = document.getElementById("settings-start-date");
  const settingsEndInput = document.getElementById("settings-end-date");
  const settingsOffsetsInput = document.getElementById("settings-offsets");
  const settingsApplyBtn = document.getElementById("settings-apply");
  const settingsCancelBtn = document.getElementById("settings-cancel");

  const chapterModalController = createModalController({
    modal,
    closeButton: modalCloseBtn,
    backdrop: modalBackdrop,
    focusContainer: modalContent,
    initialFocusSelector: "#modal-close"
  });

  const settingsModalController = createModalController({
    modal: settingsModal,
    closeButton: settingsCloseBtn,
    backdrop: settingsBackdrop,
    focusContainer: settingsContent,
    initialFocusSelector: "#settings-start-date"
  });

  function fillSettingsForm() {
    settings = loadSettings();
    if (settingsStartInput) settingsStartInput.value = settings.startDate;
    if (settingsEndInput) settingsEndInput.value = settings.endDate;
    if (settingsOffsetsInput) {
      settingsOffsetsInput.value = sanitizeOffsets(settings.reviewOffsets).join(", ");
    }
  }

  function parseOffsetsInput(rawValue) {
    const tokens = (rawValue || "")
      .split(/[;,\s]+/)
      .filter(Boolean)
      .map(Number);
    return sanitizeOffsets(tokens);
  }

  function recalculateAllChapters(currentState, newSettings) {
    const nextState = JSON.parse(JSON.stringify(currentState));
    nextState.globalStartDate = newSettings.startDate;

    Object.values(nextState.chapters).forEach((ch) => {
      if (!ch.completed || !ch.learnedDate) {
        ch.reviews = [];
        return;
      }

      const previousDone = new Map();
      if (Array.isArray(ch.reviews)) {
        ch.reviews.forEach((review) => {
          previousDone.set(review.offsetDays, !!review.done);
        });
      }

      const regenerated = generateReviewSchedule(ch.learnedDate, newSettings);
      ch.reviews = regenerated.map((rev) => ({
        ...rev,
        done: previousDone.get(rev.offsetDays) || false
      }));
    });

    return nextState;
  }

  if (settingsBtn && settingsModalController) {
    settingsBtn.addEventListener("click", () => {
      fillSettingsForm();
      settingsModalController.open();
    });
  }

  if (settingsCancelBtn) {
    settingsCancelBtn.addEventListener("click", () => settingsModalController.close());
  }

  if (settingsApplyBtn) {
    settingsApplyBtn.addEventListener("click", () => {
      const startDate = settingsStartInput && settingsStartInput.value
        ? settingsStartInput.value
        : settings.startDate;
      const endDate = settingsEndInput && settingsEndInput.value
        ? settingsEndInput.value
        : settings.endDate;
      const reviewOffsets = parseOffsetsInput(settingsOffsetsInput ? settingsOffsetsInput.value : "");

      if (parseDate(startDate) > parseDate(endDate)) {
        alert("La date de début doit être avant la date de fin.");
        return;
      }

      const confirmReset = window.confirm(
        "⚠️ Ce recalcul va régénérer toutes les re-révisions selon les nouveaux paramètres.\n" +
        "Les cases cochées peuvent être perdues si les dates changent.\n\n" +
        "Pense à exporter ta progression avec le bouton 'Sauvegarder la progression' avant de continuer.\n\n" +
        "Continuer ?"
      );

      if (!confirmReset) return;

      const backupState = loadState();
      saveBackupState(backupState);

      settings = { startDate, endDate, reviewOffsets };
      saveSettings(settings);

      const updatedState = recalculateAllChapters(backupState, settings);
      state = updatedState;
      saveState(state);

      construireListe();
      majProgression();
      if (typeof applyFilters === "function") {
        applyFilters();
      }
      updateDeadlineBox(state, settings);
      showToast("Paramètres appliqués et re-révisions recalculées ✅");
      settingsModalController.close();
    });
  }

  function openChapterModal(chapterId) {
    state = loadState();
    const ch = CHAPITRES.find(c => c.id === chapterId);
    if (!ch || !modalContent) return;
    const st = state.chapters[chapterId];

    modalBody.innerHTML = "";

    const header = document.createElement("div");
    header.className = "modal-header-block";

    const title = document.createElement("h3");
    title.className = "modal-title";
    title.id = "chapter-modal-title";
    title.textContent = `${ch.id}. ${ch.titre}`;

    const desc = document.createElement("p");
    desc.className = "modal-desc";
    desc.id = "chapter-modal-desc";
    desc.textContent = ch.description || "";

    header.appendChild(title);
    header.appendChild(desc);

    const metaDiv = document.createElement("div");
    metaDiv.className = "modal-meta";

    const learnedText = st.learnedDate
      ? `1ère apprentissage : ${formatDateFr(st.learnedDate)}`
      : "Chapitre pas encore marqué comme appris.";

    const totalReviews = st.reviews.length;
    const doneReviews = st.reviews.filter(r => r.done).length;
    const percentReviews = totalReviews > 0
      ? ((doneReviews / totalReviews) * 100).toFixed(1)
      : "0";

    const p1 = document.createElement("p");
    p1.textContent = learnedText;

    const p2 = document.createElement("p");
    p2.textContent = `Re-révisions faites : ${doneReviews}/${totalReviews} (${percentReviews} %).`;

    metaDiv.appendChild(p1);
    metaDiv.appendChild(p2);

    const progressContainer = document.createElement("div");
    progressContainer.className = "modal-progress-container";

    const progressLabel = document.createElement("div");
    progressLabel.className = "modal-progress-label";
    progressLabel.textContent = `Progression des re-révisions : ${percentReviews} %`;

    const progressBg = document.createElement("div");
    progressBg.className = "modal-progress-bg";

    const progressFill = document.createElement("div");
    progressFill.className = "modal-progress-fill";
    progressFill.style.width = percentReviews + "%";

    progressBg.appendChild(progressFill);
    progressContainer.appendChild(progressLabel);
    progressContainer.appendChild(progressBg);

    modalBody.appendChild(header);
    modalBody.appendChild(metaDiv);
    modalBody.appendChild(progressContainer);

    const list = document.createElement("ul");
    list.className = "modal-reviews-list";

    if (st.reviews.length === 0) {
      const li = document.createElement("li");
      li.textContent =
        "Aucune re-révision programmée pour ce chapitre (il faut d’abord le cocher dans le Suivi général).";
      list.appendChild(li);
    } else {
      st.reviews.forEach((r) => {
        const li = document.createElement("li");
        li.className = "modal-review-item";

        const isDone = !!r.done;
        if (isDone) li.classList.add("done");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = isDone;

        const label = document.createElement("span");
        label.className = "modal-review-label";

        let labelText =
          `Re-révision n°${r.index} – J+${r.offsetDays} – ${formatDateFr(r.date)}`;

        let reportText = "";
        if (st.learnedDate && typeof r.offsetDays === "number") {
          const learned = parseDate(st.learnedDate);
          const origDate = addDays(learned, r.offsetDays);
          const currentDate = parseDate(r.date);

          const diffMs = currentDate - origDate;
          const msPerDay = 1000 * 60 * 60 * 24;
          const deltaDays = Math.round(diffMs / msPerDay);

          if (deltaDays > 0) {
            reportText = ` (reporté de ${deltaDays} jour${deltaDays > 1 ? "s" : ""})`;
          }
        }

        label.textContent = labelText + reportText;

        li.addEventListener("click", (e) => {
          if (e.target === checkbox) return;
          checkbox.checked = !checkbox.checked;
          checkbox.dispatchEvent(new Event("change"));
        });

        checkbox.addEventListener("change", () => {
          state = setReviewDone(chapterId, r.index, checkbox.checked);
          openChapterModal(chapterId);
        });

        li.appendChild(checkbox);
        li.appendChild(label);
        list.appendChild(li);
      });
    }

    modalBody.appendChild(list);

    chapterModalController.open();
  }

  function closeChapterModal() {
    chapterModalController.close();
  }

  modalBackdrop.addEventListener("click", closeChapterModal);
  modalCloseBtn.addEventListener("click", closeChapterModal);

  const liParId = {};
  const checkboxParId = {};

  function construireListe() {
    if (!liste) return;
    liste.innerHTML = "";
    CHAPITRES.forEach(chap => {
      const st = state.chapters[chap.id];

      const li = document.createElement("li");
      li.className = "chapter-item";
      li.dataset.id = chap.id;
      li.dataset.searchText = (chap.id + " " + chap.titre + " " + (chap.description || ""))
        .toLowerCase();

      if (st.completed) {
        li.classList.add("completed");
      }

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "chapter-checkbox";
      checkbox.id = "chap-" + chap.id;
      checkbox.checked = !!st.completed;

      const label = document.createElement("label");
      label.className = "chapter-label";
      label.htmlFor = checkbox.id;

      const titleRow = document.createElement("div");
      titleRow.className = "chapter-title-row";

      const titleSpan = document.createElement("div");
      titleSpan.className = "chapter-title";
      titleSpan.textContent = `${chap.id}. ${chap.titre}`;

      const infoBtn = document.createElement("button");
      infoBtn.type = "button";
      infoBtn.className = "chapter-info-btn";
      infoBtn.textContent = "Détails";
      infoBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        openChapterModal(chap.id);
      });

      titleRow.appendChild(titleSpan);
      titleRow.appendChild(infoBtn);

      const subtitleSpan = document.createElement("div");
      subtitleSpan.className = "chapter-subtitle";

      if (st.learnedDate) {
        subtitleSpan.textContent =
          (chap.description || "") +
          ` (1ère apprentissage : ${formatDateFr(st.learnedDate)})`;
      } else {
        subtitleSpan.textContent = chap.description || "";
      }

      label.appendChild(titleRow);
      label.appendChild(subtitleSpan);

      li.appendChild(checkbox);
      li.appendChild(label);
      liste.appendChild(li);

      liParId[chap.id] = li;
      checkboxParId[chap.id] = checkbox;

      checkbox.addEventListener("change", async () => {
        const st = state.chapters[chap.id];

        if (checkbox.checked) {
          const chosenDate = await askFirstLearningDate(st.learnedDate);

          if (!chosenDate) {
            checkbox.checked = !!st.completed;
            return;
          }

          st.completed = true;
          st.learnedDate = chosenDate;

          if (!Array.isArray(st.reviews) || st.reviews.length === 0) {
            st.reviews = generateReviewSchedule(st.learnedDate);
          }

          saveState(state);
          majProgression();

          if (typeof applyFilters === "function") {
            applyFilters();
          }

          showToast(
            `Chapitre ${chap.id} validé, t'es une machine 🔥🔥`
          );
        } else {
          if (st.completed) {
            const confirmUncheck = window.confirm(
              "Tu es sur le point de décocher ce chapitre.\n\n" +
              "Cela va supprimer toutes les re-révisions générées automatiquement " +
              "et effacer la date de 1ère apprentissage.\n\n" +
              "Continuer ?"
            );
            if (!confirmUncheck) {
              checkbox.checked = true;
              return;
            }
          }

          st.completed = false;
          st.learnedDate = null;
          st.reviews = [];

          saveState(state);
          majProgression();

          if (typeof applyFilters === "function") {
            applyFilters();
          }
        }

        if (st.learnedDate) {
          subtitleSpan.textContent =
            (chap.description || "") +
            ` (1ère apprentissage : ${formatDateFr(st.learnedDate)})`;
        } else {
          subtitleSpan.textContent = chap.description || "";
        }

        if (st.completed) {
          li.classList.add("completed");
        } else {
          li.classList.remove("completed");
        }
      });
    });
  }

  function majProgression() {
    if (!progressBar || !progressText) return;
    const total = CHAPITRES.length;
    let faits = 0;
    CHAPITRES.forEach(chap => {
      if (state.chapters[chap.id].completed) faits++;
    });

    const pourcentage = total === 0 ? 0 : (faits / total) * 100;
    progressBar.style.width = pourcentage + "%";
    progressText.textContent =
      `${faits} sur ${total} chapitres appris – ${pourcentage.toFixed(2)} %`;
  }

  let currentSearchTerm = "";
  let filterCompletedOnly = false;

  function applyFilters() {
    if (!liste) return;
    const items = liste.querySelectorAll(".chapter-item");
    items.forEach(item => {
      const searchText = item.dataset.searchText || "";
      const isCompleted = item.classList.contains("completed");

      const matchesSearch = searchText.includes(currentSearchTerm);
      const matchesCompleted = filterCompletedOnly ? isCompleted : true;

      if (matchesSearch && matchesCompleted) {
        item.style.display = "";
      } else {
        item.style.display = "none";
      }
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      currentSearchTerm = (searchInput.value || "").toLowerCase().trim();
      applyFilters();
    });
  }

  if (filterCompletedCheckbox) {
    filterCompletedCheckbox.addEventListener("change", () => {
      filterCompletedOnly = filterCompletedCheckbox.checked;
      applyFilters();
    });
  }

  if (btnSave) {
    btnSave.addEventListener("click", () => {
      const blob = new Blob([JSON.stringify({ state, settings }, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `suivi-revisions-${todayISO()}.json`;
      a.click();

      URL.revokeObjectURL(url);
    });
  }

  if (btnLoad && fileInput) {
    btnLoad.addEventListener("click", () => fileInput.click());
    fileInput.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target.result;
          const parsed = JSON.parse(content);

          const { ok, message, state: importedState, chaptersCount } = validateImportedState(parsed);

          if (!ok) {
            alert(message || "Fichier invalide.");
            return;
          }

          const confirmation = window.confirm(
            "Vous êtes sur le point de remplacer votre progression actuelle.\n\n" +
            `Chapitres détectés : ${chaptersCount}\n` +
            `Date de début : ${formatDateFr(importedState.globalStartDate)}\n\n`
          );

          if (!confirmation) {
            return;
          }

          const backupState = loadState();
          saveBackupState(backupState);

          state = mergeWithCurrentChapitres(importedState);
          saveState(state);

          construireListe();
          majProgression();
          updateDeadlineBox(state, settings);
          showToast("Progression chargée avec succès !");
        } catch (err) {
          console.error(err);
          showToast("Erreur lors de la lecture du fichier.");
        }
      };
      reader.readAsText(file);
    });
  }

  construireListe();
  majProgression();
  applyFilters();
}
