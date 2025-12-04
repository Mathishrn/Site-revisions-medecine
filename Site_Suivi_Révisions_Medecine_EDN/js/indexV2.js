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

  const chapterModalController = createModalController({
    modal,
    closeButton: modalCloseBtn,
    backdrop: modalBackdrop,
    focusContainer: modalContent,
    initialFocusSelector: "#modal-close"
  });

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
        });

        li.appendChild(checkbox);
        li.appendChild(label);
        // li.appendChild(resetBtn); // Suppression de l'ajout du bouton
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
    const t = currentSearchTerm.toLowerCase().trim();

    CHAPITRES.forEach(chap => {
      const li = liParId[chap.id];
      if (!li) return;

      const st = state.chapters[chap.id];
      let visible = true;

      if (t) {
        const texte = li.dataset.searchText || "";
        if (!texte.includes(t)) {
          visible = false;
        }
      }

      if (filterCompletedOnly && (!st || !st.completed)) {
        visible = false;
      }

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
    const data = {
      version: 1,
      date: new Date().toISOString(),
      state: state
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
        if (!data.state || !data.state.chapters) {
          alert("Fichier de progression invalide.");
          return;
        }
        state = mergeWithCurrentChapitres(data.state);
        saveState(state);

        construireListe();
        majProgression();
        updateDeadlineBox(state);
        alert("Progression chargée avec succès !");
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

  construireListe();
  majProgression();
  applyFilters();

});
