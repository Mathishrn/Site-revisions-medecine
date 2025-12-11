// js/index.js

document.addEventListener("DOMContentLoaded", () => {
  let state = loadState();
  updateDeadlineBox(state);

  const liste = document.getElementById("liste-chapitres");
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
      const msg = buildMotivationMessage(state);
      motivationBox.textContent = msg;
      motivationBox.style.display = "block";
    });
  }

  // Fonction pour retirer les accents
  function removeAccents(str) {
    return str
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Enlève les accents classiques
      .replace(/œ/g, "oe") // Gère le œ
      .replace(/æ/g, "ae") // Gère le æ
      .trim();
  }

  async function askFirstLearningDate(previousDateStr) {
    const dateModal = document.getElementById("date-modal");
    const dateInput = document.getElementById("date-modal-input");
    const btnOk = document.getElementById("date-modal-ok");
    const btnCancel = document.getElementById("date-modal-cancel");
    const backdrop = document.getElementById("date-modal-backdrop");

    if (!dateModal || !dateInput || !btnOk || !btnCancel || !backdrop) {
      return todayISO();
    }

    return new Promise((resolve) => {
      const todayStr = todayISO();
      dateInput.value = previousDateStr || todayStr;

      dateModal.classList.add("open");
      dateModal.setAttribute("aria-hidden", "false");

      function closeModal() {
        dateModal.classList.remove("open");
        dateModal.setAttribute("aria-hidden", "true");
        btnOk.removeEventListener("click", onOk);
        btnCancel.removeEventListener("click", onCancel);
        backdrop.removeEventListener("click", onCancel);
        document.removeEventListener("keydown", onKeyDown);
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
        if (e.key === "Escape") {
          onCancel();
        }
        if (e.key === "Enter") {
          onOk();
        }
      }

      btnOk.addEventListener("click", onOk);
      btnCancel.addEventListener("click", onCancel);
      backdrop.addEventListener("click", onCancel);
      document.addEventListener("keydown", onKeyDown);
    });
  }

  const modal = document.getElementById("chapter-modal");
  const modalBackdrop = document.getElementById("modal-backdrop");
  const modalCloseBtn = document.getElementById("modal-close");
  const modalBody = document.getElementById("modal-body");

  function openChapterModal(chapterId) {
    state = loadState();
    const ch = CHAPITRES.find(c => c.id === chapterId);
    if (!ch) return;
    const st = state.chapters[chapterId];

    modalBody.innerHTML = "";

    const header = document.createElement("div");
    header.className = "modal-header-block";

    const title = document.createElement("h3");
    title.className = "modal-title";
    title.textContent = `${ch.id}. ${ch.titre}`;

    const desc = document.createElement("p");
    desc.className = "modal-desc";
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
    // 1. On la met à 0% au départ
    progressFill.style.width = "0%"; 

    // 2. On attend 50 millisecondes pour lancer l'animation vers le vrai pourcentage
    setTimeout(() => {
      progressFill.style.width = percentReviews + "%";
    }, 50);

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

        // --- MODIFICATION : Suppression du bouton "Réinitialiser" ---
        // Le code qui créait le bouton a été retiré ici.

        li.addEventListener("click", (e) => {
          if (e.target === checkbox) return;
          checkbox.checked = !checkbox.checked;
          checkbox.dispatchEvent(new Event("change"));
        });

        checkbox.addEventListener("change", () => {
          state = setReviewDone(chapterId, r.index, checkbox.checked);
          openChapterModal(chapterId);
          construireListe();
          applyFilters();
        });

        li.appendChild(checkbox);
        li.appendChild(label);
        // li.appendChild(resetBtn); // Suppression de l'ajout du bouton
        list.appendChild(li);
      });
    }

    modalBody.appendChild(list);

    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
  }

  function closeChapterModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  }

  modalBackdrop.addEventListener("click", closeChapterModal);
  modalCloseBtn.addEventListener("click", closeChapterModal);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("open")) {
      closeChapterModal();
    }
  });

  const liParId = {};
  const checkboxParId = {};

  // --- GESTION DU TRI AVEC MÉMOIRE ---
const sortSelect = document.getElementById("chapter-sort");

// 1. Au chargement : on remet le dernier tri choisi (s'il existe)
if (sortSelect) {
  const savedSort = localStorage.getItem("pref_chapter_sort");
  if (savedSort) {
    sortSelect.value = savedSort;
  }

  // 2. Au changement : on sauvegarde et on applique
  sortSelect.addEventListener("change", () => {
    localStorage.setItem("pref_chapter_sort", sortSelect.value);
    construireListe();
    applyFilters();
  });
}

  function construireListe() {
    liste.innerHTML = "";
    
    // 1. Création d'une copie triable
    let sortedChapters = [...CHAPITRES];
    const sortValue = sortSelect ? sortSelect.value : "id-asc";

    // 2. Application du tri
    sortedChapters.sort((a, b) => {
      const stA = state.chapters[a.id];
      const stB = state.chapters[b.id];

      // --- 1. TRI PAR NUMÉRO (Ascendant / Descendant) ---
      if (sortValue === "id-asc") return a.id - b.id;
      if (sortValue === "id-desc") return b.id - a.id;

      // --- 2. TRI PAR DATE D'APPRENTISSAGE ---
      if (sortValue === "date-desc" || sortValue === "date-asc") {
        // Règle : Les validés TOUJOURS en haut
        if (stA.completed !== stB.completed) {
          return stA.completed ? -1 : 1;
        }
        // Si les deux sont faits, on trie par date d'apprentissage
        if (stA.completed) {
          const dateA = new Date(stA.learnedDate).getTime();
          const dateB = new Date(stB.learnedDate).getTime();
          if (sortValue === "date-desc") return dateB - dateA; // Récents en haut
          if (sortValue === "date-asc")  return dateA - dateB; // Anciens en haut
        }
        return a.id - b.id;
      }

      // --- 3. TRI PAR STATUT (Fait / Pas fait) ---
      if (sortValue === "status") {
        if (stA.completed !== stB.completed) return stA.completed ? -1 : 1;
        return a.id - b.id;
      }

      // --- 4. IDÉE N°1 : URGENCE (Prochaine révision la plus proche) ---
      if (sortValue === "next-review") {
        // Fonction pour trouver la date de la prochaine révision
        const getNextDate = (st) => {
          if (!st.completed || !st.reviews) return "9999-99-99"; // Pas fait = Tout en bas
          const next = st.reviews.find(r => !r.done);
          if (!next) return "8888-88-88"; // Fait mais fini (plus de révision) = En bas (mais avant les non faits)
          return next.date;
        };

        const nextA = getNextDate(stA);
        const nextB = getNextDate(stB);

        if (nextA !== nextB) {
          // Tri croissant (Date la plus petite/proche en premier)
          return nextA.localeCompare(nextB);
        }
        return a.id - b.id;
      }

      // --- 5. IDÉE N°2 : COMPLEXITÉ (Nombre de révisions déjà effectuées) ---
      if (sortValue === "review-count") {
        // On compte combien de cases "faites" il y a
        const getCount = (st) => {
          if (!st.completed || !st.reviews) return -1; // Non fait
          return st.reviews.filter(r => r.done).length;
        };

        const countA = getCount(stA);
        const countB = getCount(stB);

        // Tri décroissant : Ceux qu'on a le plus bossé en haut
        if (countA !== countB) return countB - countA;
        return a.id - b.id;
      }

      return 0;
    });
      
    sortedChapters.forEach(chap => {
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
          // 1. Demande la date d'apprentissage
          const chosenDateStr = await askFirstLearningDate(st.learnedDate);

          if (!chosenDateStr) {
            // Si l'utilisateur annule, on décoche
            checkbox.checked = !!st.completed;
            return;
          }

          // 2. LOGIQUE INTELLIGENTE : Vérification Date de Début
          // On récupère les réglages actuels
          const settings = getSettings(); 
          const globalStart = settings.startDate; // ex: "2025-09-01"
          
          // Si la date choisie est AVANT la date officielle de début
          if (chosenDateStr < globalStart) {
            const confirmChange = confirm(
              `⚠️ Cohérence des dates détectée.\n\n` +
              `Tu as indiqué avoir appris ce chapitre le ${formatDateFr(chosenDateStr)}, ` +
              `mais tes révisions commencent officiellement le ${formatDateFr(globalStart)}.\n\n` +
              `Voulez-vous avancer la date de début des révisions au ${formatDateFr(chosenDateStr)} pour que tout colle ?`
            );

            if (confirmChange) {
              settings.startDate = chosenDateStr;
              saveSettings(settings); // Sauvegarde la nouvelle date
              updateDeadlineBox(state); // Met à jour la barre de progression visuelle
              showToast("Date de début de révisions mise à jour !");
            }
          }

          // 3. Validation du chapitre
          st.completed = true;
          st.learnedDate = chosenDateStr;

          // Génération des révisions (si pas déjà fait)
          if (!Array.isArray(st.reviews) || st.reviews.length === 0) {
            st.reviews = generateReviewSchedule(st.learnedDate);
          }

          saveState(state);
          majProgression();

          if (typeof applyFilters === "function") {
            applyFilters();
          }

          showToast(`Chapitre ${chap.id} validé, t'es une machine ! 🔥🔥`);

        } else {
          // Cas du décochage (inchangé mais inclus pour être complet)
          if (st.completed) {
            const confirmUncheck = window.confirm(
              "Attention : Décocher ce chapitre va effacer son historique de révisions.\nContinuer ?"
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

        // Mise à jour visuelle du sous-titre
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
    // 1. On nettoie le terme recherché (minuscules + sans accents)
    // On s'assure que currentSearchTerm n'est pas undefined
    const term = currentSearchTerm || "";
    const t = removeAccents(term.trim());

    CHAPITRES.forEach(chap => {
      const li = liParId[chap.id];
      if (!li) return;

      const st = state.chapters[chap.id];
      let visible = true;

      // A. FILTRE RECHERCHE TEXTUELLE
      if (t) {
        // On récupère le texte caché dans l'élément HTML
        const texteOriginal = li.dataset.searchText || "";
        // On lui enlève aussi les accents pour comparer ce qui est comparable
        const texteSansAccent = removeAccents(texteOriginal);
        
        if (!texteSansAccent.includes(t)) {
          visible = false;
        }
      }

      // B. FILTRE "DÉJÀ APPRIS" (Checkbox)
      if (filterCompletedOnly && (!st || !st.completed)) {
        visible = false;
      }

      // C. APPLICATION DE LA VISIBILITÉ
      li.style.display = visible ? "" : "none";
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      currentSearchTerm = e.target.value || "";
      applyFilters();
    });
  }

  if (filterCompletedCheckbox) {
    filterCompletedCheckbox.addEventListener("change", (e) => {
      filterCompletedOnly = e.target.checked;
      applyFilters();
    });
  }

btnSave.addEventListener("click", async () => { // Note l'ajout de "async" ici
    const currentSettings = getSettings();
    const data = {
      version: 2,
      date: new Date().toISOString(),
      state: state,
      settings: currentSettings
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const filename = "progression_medecine_" + todayISO() + ".json";

    // 1. Essayer la nouvelle méthode "Enregistrer sous" (Chrome, Edge, Opera)
    if (window.showSaveFilePicker) {
      try {
        const handle = await window.showSaveFilePicker({
          suggestedName: filename,
          types: [{
            description: 'Fichier de progression JSON',
            accept: { 'application/json': ['.json'] },
          }],
        });
        
        const writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
        
        // Si ça marche, on s'arrête là
        return; 
      } catch (err) {
        // Si l'utilisateur clique sur "Annuler", on ne fait rien (c'est normal)
        if (err.name === 'AbortError') {
          return; 
        }
        // Sinon, on continue vers la méthode classique en cas d'erreur technique
        console.warn("L'API File System a échoué, passage à la méthode classique.");
      }
    }

    // 2. Méthode classique (Fallback pour Firefox, Safari, Mobile)
    // Cela téléchargera directement dans "Downloads" selon les réglages du navigateur
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  });

  btnLoad.addEventListener("click", () => {
    fileInput.value = "";
    fileInput.click();
  });

  fileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        
        // Vérification de base
        if (!data.state || !data.state.chapters) {
          alert("Fichier de progression invalide.");
          return;
        }

        // 1. Restauration de la progression (Chapitres)
        state = mergeWithCurrentChapitres(data.state);
        saveState(state);

        // 2. Restauration des Paramètres (s'ils existent dans le fichier)
        if (data.settings) {
          saveSettings(data.settings); // Fonction de commonV2.js
          console.log("Paramètres restaurés :", data.settings);
        }

        // 3. Mise à jour de l'interface
        construireListe();
        majProgression();
        
        // Mise à jour de la deadline (Barre de progression temporelle) avec les nouveaux paramètres
        updateDeadlineBox(state);

        alert("Progression et paramètres chargés avec succès !");
        
        // Petit reload pour être sûr que tout (planning, stats) prenne en compte les nouveaux intervalles
        window.location.reload(); 

      } catch (err) {
        console.error(err);
        alert("Erreur lors de la lecture du fichier.");
      }
    };
    reader.readAsText(file);
  });

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

// --- GESTION DES PARAMÈTRES AVANCÉS ---
  const btnSettings = document.getElementById("btn-settings");
  const modalSettings = document.getElementById("settings-modal");
  const closeSettings = document.getElementById("settings-close");
  const backdropSettings = document.getElementById("settings-backdrop");
  const btnSaveSettings = document.getElementById("btn-save-settings");
  
  // Champs Dates & Intervalles
  const inputStart = document.getElementById("set-start-date");
  const inputEnd = document.getElementById("set-end-date");
  const inputOffsets = document.getElementById("set-offsets");

  // Nouveaux Champs : Jours Bloqués
  const selectBlockedDay = document.getElementById("select-blocked-day");
  const btnAddBlockedDay = document.getElementById("btn-add-blocked-day");
  const listBlockedDays = document.getElementById("blocked-days-list");
  
  // Nouveaux Champs : Vacances
  const inputVacStart = document.getElementById("vacation-start");
  const inputVacEnd = document.getElementById("vacation-end");
  const btnAddVacation = document.getElementById("btn-add-vacation");
  const listVacations = document.getElementById("vacation-list");

  // Variables temporaires pour stocker les choix avant sauvegarde
  let tempBlockedWeekdays = [];
  let tempVacations = [];

  const WEEKDAY_NAMES = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

  // Fonction pour dessiner les tags (étiquettes bleues)
  function renderTags() {
    // 1. Tags Jours Bloqués
    if(listBlockedDays) {
      listBlockedDays.innerHTML = "";
      tempBlockedWeekdays.forEach(dayIndex => {
        const tag = document.createElement("div");
        tag.className = "tag-item";
        tag.innerHTML = `<span>🚫 ${WEEKDAY_NAMES[dayIndex]}</span>`;
        
        const removeBtn = document.createElement("span");
        removeBtn.className = "tag-remove";
        removeBtn.textContent = "✖";
        
        // MODIF ROBUSTE : addEventListener
        removeBtn.addEventListener("click", () => {
          tempBlockedWeekdays = tempBlockedWeekdays.filter(d => d !== dayIndex);
          renderTags();
        });
        
        tag.appendChild(removeBtn);
        listBlockedDays.appendChild(tag);
      });
    }

    // 2. Tags Vacances
    if(listVacations) {
      listVacations.innerHTML = "";
      tempVacations.forEach((vac, idx) => {
        const tag = document.createElement("div");
        tag.className = "tag-item";
        
        // Formatage joli des dates
        const d1 = new Date(vac.start);
        const d2 = new Date(vac.end);
        const fmt = { day: 'numeric', month: 'short' };
        const label = `🏖️ ${d1.toLocaleDateString('fr-FR', fmt)} au ${d2.toLocaleDateString('fr-FR', fmt)}`;

        tag.innerHTML = `<span>${label}</span>`;
        
        const removeBtn = document.createElement("span");
        removeBtn.className = "tag-remove";
        removeBtn.textContent = "✖";
        
        // MODIF ROBUSTE : addEventListener
        removeBtn.addEventListener("click", () => {
          tempVacations.splice(idx, 1);
          renderTags();
        });
        
        tag.appendChild(removeBtn);
        listVacations.appendChild(tag);
      });
    }
  }

  if (btnSettings && modalSettings) {
    // OUVERTURE MODALE : On charge les données existantes
    btnSettings.addEventListener("click", () => {
      const s = getSettings();
      inputStart.value = s.startDate;
      inputEnd.value = s.endDate;
      inputOffsets.value = s.offsets;
      
      // On clone les tableaux pour ne pas modifier directement sans sauvegarder
      tempBlockedWeekdays = [...(s.blockedWeekdays || [])];
      tempVacations = [...(s.vacations || [])];
      
      renderTags();
      modalSettings.classList.add("open");
    });

    function closeSet() { modalSettings.classList.remove("open"); }
    closeSettings.addEventListener("click", closeSet);
    backdropSettings.addEventListener("click", closeSet);

    // ACTION : Ajouter un Jour Bloqué
    if(btnAddBlockedDay) {
        btnAddBlockedDay.addEventListener("click", () => {
        const val = parseInt(selectBlockedDay.value, 10);
        if (isNaN(val)) return; // Rien sélectionné
        
        if (!tempBlockedWeekdays.includes(val)) {
            tempBlockedWeekdays.push(val);
            tempBlockedWeekdays.sort(); // Garder l'ordre Dimanche -> Samedi
            renderTags();
        }
        });
    }

    // ACTION : Ajouter une Période de Vacances
    if(btnAddVacation) {
        btnAddVacation.addEventListener("click", () => {
        const s = inputVacStart.value;
        const e = inputVacEnd.value;
        
        if (!s || !e) return alert("Il faut une date de début et une date de fin.");
        if (s > e) return alert("La date de début doit être avant la fin !");
        
        tempVacations.push({ start: s, end: e });
        // On trie par date chronologique
        tempVacations.sort((a,b) => a.start.localeCompare(b.start));
        
        // Reset des champs
        inputVacStart.value = "";
        inputVacEnd.value = "";
        renderTags();
        });
    }

    // --- AJOUT : BOUTON RÉINITIALISER (MODIFIÉ) ---
    const btnResetSettings = document.getElementById("btn-reset-settings");
    
    if (btnResetSettings) {
      // ICI LA MODIFICATION CLÉ : addEventListener au lieu de .onclick
      btnResetSettings.addEventListener("click", () => {
        const confirmReset = confirm(
          "⚠️ Es-tu sûr de vouloir tout réinitialiser ?\n\n" +
          "Cela va remettre les dates, le rythme et les jours bloqués aux valeurs par défaut.\n" +
          "Ton planning sera recalculé (mais l'historique de ce qui est déjà fait sera conservé)."
        );

        if (confirmReset) {
          // 1. On efface les réglages perso du stockage
          localStorage.removeItem("suivi_med_settings_v1");
          
          // 2. On lance le recalcul (qui utilisera du coup les valeurs par défaut)
          // La fonction recalculateAllSchedules est dans commonV2.js
          recalculateAllSchedules();
          
          alert("Paramètres remis à zéro !");
          window.location.reload(); // On recharge pour appliquer les changements
        }
      });
    }

    // ACTION : SAUVEGARDER
    btnSaveSettings.addEventListener("click", () => {
      const newStart = inputStart.value;
      const newEnd = inputEnd.value;
      const newOffsets = inputOffsets.value;

      // SÉCURITÉ 1 : Champs vides
      if (!newStart || !newEnd || !newOffsets) {
        return alert("Tous les champs (dates et rythme) sont obligatoires.");
      }

      // SÉCURITÉ 2 : Voyageur Temporel (Début > Fin)
      if (newStart >= newEnd) {
        return alert("⛔ Erreur de dates !\nLa date de début doit être strictement AVANT la date de fin.");
      }

      // SÉCURITÉ 3 : Burn-out (7 jours bloqués)
      if (tempBlockedWeekdays.length >= 7) {
        return alert("⛔ Impossible !\nTu ne peux pas bloquer les 7 jours de la semaine, sinon tu ne pourras jamais réviser 😅.");
      }

      // SÉCURITÉ 4 : Cohérence avec l'historique (Déjà présent mais important)
      const currentMinLearned = getMinLearnedDate(state); // (Assure-toi que cette fonction est accessible ou définie dans le fichier)
      if (currentMinLearned && newStart > currentMinLearned) {
        return alert(`⛔ Impossible !\nTu as déjà validé un chapitre le ${formatDateFr(currentMinLearned)}.\nLa date de début ne peut pas être après.`);
      }

      // Si tout est bon, on sauvegarde
      const newSettings = {
        startDate: newStart,
        endDate: newEnd,
        offsets: newOffsets,
        blockedWeekdays: tempBlockedWeekdays,
        vacations: tempVacations
      };
      
      if (confirm("⚠️ Sauvegarder et recalculer le planning ?\n(L'historique des révisions faites sera conservé.)")) {
        saveSettings(newSettings);
        const count = recalculateAllSchedules();
        updateDeadlineBox(loadState());
        if(typeof closeSet === 'function') closeSet(); // Ferme la modale
        else if(modalSettings) modalSettings.classList.remove("open");
        
        alert(`C'est tout bon ! ${count} chapitres mis à jour.`);
        window.location.reload();
      }
    });
  }

  // Petite fonction utilitaire pour trouver la date la plus ancienne apprise
  function getMinLearnedDate(currentState) {
    let minDate = null;
    CHAPITRES.forEach(ch => {
      const st = currentState.chapters[ch.id];
      if (st && st.completed && st.learnedDate) {
        if (!minDate || st.learnedDate < minDate) {
          minDate = st.learnedDate;
        }
      }
    });
    return minDate;
  }

  // --- GESTION MODAL INFO COOKIES (RESTAURATION) ---
  const btnInfo = document.getElementById("btn-info");
  const modalInfo = document.getElementById("info-modal");
  const closeInfo = document.getElementById("info-close");
  const backdropInfo = document.getElementById("info-backdrop");
  const btnInfoOk = document.getElementById("btn-info-ok");

  if (btnInfo && modalInfo) {
    btnInfo.addEventListener("click", () => {
      modalInfo.classList.add("open");
      modalInfo.setAttribute("aria-hidden", "false");
    });
    
    function closeInfoModal() {
      modalInfo.classList.remove("open");
      modalInfo.setAttribute("aria-hidden", "true");
    }

    if(closeInfo) closeInfo.addEventListener("click", closeInfoModal);
    if(backdropInfo) backdropInfo.addEventListener("click", closeInfoModal);
    if(btnInfoOk) btnInfoOk.addEventListener("click", closeInfoModal);
  }

  construireListe();
  majProgression();
  applyFilters();

});
