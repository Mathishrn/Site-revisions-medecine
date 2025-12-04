// js/state.js
// Gestion du state (init, sauvegarde, validations)

const STORAGE_KEY_STATE = "suivi_med_state_v1";
const STORAGE_KEY_BACKUP = "suivi_med_state_backup";
const STORAGE_KEY_SETTINGS = "suivi_med_settings_v1";

function getDefaultSettings() {
  return {
    startDate: START_DATE_STR,
    endDate: END_DATE_STR,
    reviewOffsets: REVIEW_OFFSETS_DAYS
  };
}

function loadSettings() {
  const defaults = getDefaultSettings();
  const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);

  if (!raw) {
    return defaults;
  }

  try {
    const parsed = JSON.parse(raw);
    const startDate = typeof parsed.startDate === "string" && parsed.startDate
      ? parsed.startDate
      : defaults.startDate;
    const endDate = typeof parsed.endDate === "string" && parsed.endDate
      ? parsed.endDate
      : defaults.endDate;
    const reviewOffsets = sanitizeOffsets(parsed.reviewOffsets);

    const parsedStart = parseDate(startDate);
    const parsedEnd = parseDate(endDate);

    if (isNaN(parsedStart.getTime()) || isNaN(parsedEnd.getTime()) || parsedStart > parsedEnd) {
      return defaults;
    }

    return { startDate, endDate, reviewOffsets };
  } catch (error) {
    console.warn("Paramètres invalides en stockage, retour aux valeurs par défaut", error);
    return defaults;
  }
}

function saveSettings(settings) {
  if (!settings) return;
  const safeSettings = {
    startDate: settings.startDate,
    endDate: settings.endDate,
    reviewOffsets: sanitizeOffsets(settings.reviewOffsets)
  };
  localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(safeSettings));
}

function initEmptyState() {
  const state = {
    globalStartDate: todayISO(),
    chapters: {},
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
    } else if (st.learnedDate && (!Array.isArray(st.reviews) || st.reviews.length === 0)) {
      st.reviews = generateReviewSchedule(st.learnedDate);
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

function saveBackupState(state) {
  if (!state) return;
  localStorage.setItem(STORAGE_KEY_BACKUP, JSON.stringify(state));
}

function mergeWithCurrentChapitres(oldState) {
  const newState = {
    globalStartDate: oldState.globalStartDate || todayISO(),
    chapters: {}
  };

  CHAPITRES.forEach(ch => {
    if (oldState.chapters && oldState.chapters[ch.id]) {
      const old = oldState.chapters[ch.id];
      newState.chapters[ch.id] = {
        completed: !!old.completed,
        learnedDate: old.learnedDate || null,
        reviews: Array.isArray(old.reviews) ? old.reviews : []
      };
    } else {
      newState.chapters[ch.id] = {
        completed: false,
        learnedDate: null,
        reviews: []
      };
    }
  });

  return newState;
}

function validateImportedState(payload) {
  if (!payload || typeof payload !== "object") {
    return { ok: false, message: "Le fichier ne contient pas d'objet JSON valide." };
  }

  const importedState = payload.state || payload;

  if (!importedState || typeof importedState !== "object") {
    return { ok: false, message: "Structure 'state' manquante." };
  }

  const { globalStartDate = todayISO(), chapters } = importedState;

  if (globalStartDate && typeof globalStartDate !== "string") {
    return { ok: false, message: "La date de début doit être une chaîne ISO (yyyy-mm-dd)." };
  }

  if (!chapters || typeof chapters !== "object") {
    return { ok: false, message: "Champs 'chapters' manquant ou invalide." };
  }

  const chapterEntries = Object.entries(chapters);
  for (const [id, ch] of chapterEntries) {
    if (!ch || typeof ch !== "object") {
      return { ok: false, message: `Chapitre ${id} invalide.` };
    }

    if (typeof ch.completed !== "boolean") {
      return { ok: false, message: `Le champ 'completed' du chapitre ${id} doit être un booléen.` };
    }

    if (ch.learnedDate !== null && typeof ch.learnedDate !== "string") {
      return { ok: false, message: `Le champ 'learnedDate' du chapitre ${id} doit être une date ISO ou null.` };
    }

    if (!Array.isArray(ch.reviews)) {
      return { ok: false, message: `Le champ 'reviews' du chapitre ${id} doit être une liste.` };
    }

    for (const review of ch.reviews) {
      if (!review || typeof review !== "object") {
        return { ok: false, message: `Une re-révision du chapitre ${id} est invalide.` };
      }

      const hasValidTypes =
        typeof review.index === "number" &&
        typeof review.offsetDays === "number" &&
        typeof review.date === "string" &&
        typeof review.done === "boolean";

      if (!hasValidTypes) {
        return { ok: false, message: `Les re-révisions du chapitre ${id} doivent contenir index, offsetDays, date et done avec les bons types.` };
      }
    }
  }

  return {
    ok: true,
    state: { globalStartDate, chapters },
    chaptersCount: chapterEntries.length
  };
}

function addManualReview(chapterId, dateISO) {
  let state = loadState();
  const st = state.chapters[chapterId];
  if (!st || !Array.isArray(st.reviews)) {
    return state;
  }

  const newReview = {
    index: st.reviews.length + 1,
    offsetDays: null,
    date: dateISO,
    done: false,
    status: "manual"
  };

  st.reviews.push(newReview);
  saveState(state);
  return state;
}

function cloneReview(chapterId, reviewIndex, newDateISO) {
  let state = loadState();
  const st = state.chapters[chapterId];
  if (!st || !Array.isArray(st.reviews)) return state;
  const review = st.reviews.find(r => r.index === reviewIndex);
  if (!review) return state;

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
