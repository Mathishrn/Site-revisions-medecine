// js/planning.js

document.addEventListener("DOMContentLoaded", () => {
  let state = loadState();
  updateDeadlineBox(state);

  const LS_KEY_MAX_TITLE = "planning_maxTitleChars";
  const LS_KEY_SHOW_META = "planning_showReviewMeta";
  const LS_KEY_MAX_WIDTH = "planning_maxWidth";


  const nextLimitInput = document.getElementById("next-limit");
  const btnRefreshNext = document.getElementById("btn-refresh-next");
  // Bloc "Re-révisions du jour"
  const todayListElem = document.getElementById("today-reviews-list");
  const todayIncludePastCheckbox = document.getElementById("today-include-past");
  const todayPrevBtn = document.getElementById("today-prev");
  const todayNextBtn = document.getElementById("today-next");
  const todayLabelElem = document.getElementById("today-label");
  const titleLengthInput = document.getElementById("title-length-input");
  const titleLengthBtn = document.getElementById("btn-apply-title-length");
  const titleMetaToggle = document.getElementById("title-meta-toggle");

  const planningWidthInput = document.getElementById("planning-width-input");
  const planningWidthBtn = document.getElementById("btn-apply-planning-width");

  // Le conteneur qui porte la largeur du planning
  const planningContainer = document.querySelector(".planning-container") || document.querySelector("main.container");

  const weekViewElem = document.getElementById("week-view");
  const weekLabelElem = document.getElementById("week-label");
  const weekPrevBtn = document.getElementById("week-prev");
  const weekNextBtn = document.getElementById("week-next");

  const monthViewElem = document.getElementById("month-view");
  const monthLabelElem = document.getElementById("month-label");
  const monthPrevBtn = document.getElementById("month-prev");
  const monthNextBtn = document.getElementById("month-next");

  const modal = document.getElementById("chapter-modal");
  const modalBackdrop = document.getElementById("modal-backdrop");
  const modalCloseBtn = document.getElementById("modal-close");
  const modalBody = document.getElementById("modal-body");

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

  const today = new Date();
  let currentDayForTodayView = today;
  let currentWeekStart = getMondayOfWeek(today);
  let currentMonthYear = { year: today.getFullYear(), month: today.getMonth() };

  // Longueur max des titres dans les pastilles (semaine + mois)
  let maxTitleChars = 18; // valeur par défaut

  // Affiche-t-on le détail "(n°X, J+Y, fait)" dans les pastilles ?
  let showReviewMeta = true;

  // --- Chargement des préférences depuis localStorage ---

  const savedMaxTitle = localStorage.getItem(LS_KEY_MAX_TITLE);
  if (savedMaxTitle !== null) {
    const n = parseInt(savedMaxTitle, 10);
    if (!isNaN(n) && n > 0) {
      maxTitleChars = n;
    }
  }

  const savedShowMeta = localStorage.getItem(LS_KEY_SHOW_META);
  if (savedShowMeta !== null) {
    showReviewMeta = savedShowMeta === "true";
  }


  function buildReviewLabel(t) {
    let titre = t.chapterTitre || "";

    if (maxTitleChars > 0 && titre.length > maxTitleChars) {
      titre = titre.slice(0, maxTitleChars - 1) + "…";
    }

    let label = `${t.chapterId}. ${titre}`;

    if (showReviewMeta) {
      let meta = ` (n°${t.reviewIndex}, J+${t.offsetDays}`;
      if (t.done) {
        meta += ", fait";
      }
      meta += ")";
      label += meta;
    }

    return label;
  }

  function getMondayOfWeek(d) {
    const date = new Date(d);
    const day = date.getDay();
    const diff = (day === 0 ? -6 : 1) - day;
    date.setDate(date.getDate() + diff);
    return date;
  }

  function setReviewDone(chapterId, reviewIndex, done) {
    // Cette fonction est définie globalement dans common.js
    // Mais on peut utiliser window.setReviewDone ou la redéfinir localement si besoin
    // Ici on suppose que common.js est chargé avant.
    // Pour être sûr, on refait l'appel via common ou on recharge le state
    return window.setReviewDone(chapterId, reviewIndex, done);
  }

  // -------- A. Re-révisions du jour --------

  function renderTodayReviews() {
    if (!todayListElem) return;

    state = loadState();
    todayListElem.innerHTML = "";

    const includePast = !todayIncludePastCheckbox || todayIncludePastCheckbox.checked;
    const targetStr = formatDateISO(currentDayForTodayView);

    if (todayLabelElem) {
      const d = parseDate(targetStr);
      todayLabelElem.textContent = d.toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric"
      });
    }

    const todayReviews = [];

    CHAPITRES.forEach(ch => {
      const st = state.chapters[ch.id];
      if (!st || !Array.isArray(st.reviews)) return;

      st.reviews.forEach(r => {
        if (!r.date) return;
        const isDone = !!r.done;
        const rDate = r.date;

        if (includePast) {
          if (rDate > targetStr) return;
          if (rDate < targetStr && isDone) return; 
        } else {
          if (rDate !== targetStr) return;
        }

        todayReviews.push({
          chapterId: ch.id,
          chapterTitre: ch.titre,
          reviewIndex: r.index,
          offsetDays: r.offsetDays,
          date: rDate,
          done: !!r.done,
          status: r.status || "normal"
        });
      });
    });

    if (todayReviews.length === 0) {
      const li = document.createElement("li");
      li.textContent = "Aucune re-révision prévue pour cette date 🎉";
      todayListElem.appendChild(li);
      return;
    }

    // Tri : Non faites en haut, Faites en bas
    todayReviews.sort((a, b) => {
      if (a.date !== b.date) return a.date < b.date ? -1 : 1;
      // Les faites (done=true) vont à la fin
      if (a.done !== b.done) return a.done ? 1 : -1;
      
      if (a.chapterId !== b.chapterId) return a.chapterId - b.chapterId;
      return a.reviewIndex - b.reviewIndex;
    });

    todayReviews.forEach(item => {
      const li = document.createElement("li");
      li.className = "review-item";

      const isLate = item.date < targetStr;
      const isDone = item.done;

      if (isLate) li.classList.add("late");
      if (isDone) li.classList.add("done");

      const mainLine = document.createElement("div");
      mainLine.className = "review-main-line";

      const left = document.createElement("div");
      left.className = "review-left";

      const dateSpan = document.createElement("span");
      dateSpan.className = "review-date";
      dateSpan.textContent = formatDateFr(item.date);
      if (isLate && !isDone) {
        const badge = document.createElement("span");
        badge.className = "late-badge";
        badge.textContent = "RETARD";
        dateSpan.appendChild(badge);
      }

      const chapLink = document.createElement("span");
      chapLink.className = "review-chapter-link";
      let titre = item.chapterTitre || "";
      if (typeof maxTitleChars === "number" && maxTitleChars > 0 && titre.length > maxTitleChars) {
        titre = titre.slice(0, maxTitleChars - 1) + "…";
      }
      chapLink.textContent = `${item.chapterId}. ${titre}`;
      chapLink.dataset.chapterId = item.chapterId;
      chapLink.addEventListener("click", () => {
        openChapterModal(item.chapterId);
      });

      left.appendChild(dateSpan);
      left.appendChild(chapLink);

      const actions = document.createElement("div");
      actions.className = "review-actions";

      const doneLabel = document.createElement("label");
      const doneCheckbox = document.createElement("input");
      doneCheckbox.type = "checkbox";
      doneCheckbox.className = "review-done-checkbox";
      doneCheckbox.checked = isDone;
      doneCheckbox.addEventListener("change", (e) => {
        // On utilise window.setReviewDone défini dans common.js
        state = window.setReviewDone(item.chapterId, item.reviewIndex, e.target.checked);
        renderTodayReviews();
        renderWeekView();
        renderMonthView();
      });
      doneLabel.appendChild(doneCheckbox);
      doneLabel.appendChild(document.createTextNode(" Fait"));

      const skipBtn = document.createElement("button");
      skipBtn.type = "button";
      skipBtn.className = "nav-button";
      skipBtn.textContent = "Pas aujourd’hui";
      skipBtn.addEventListener("click", () => {
        state = window.toggleReviewSkipToday(item.chapterId, item.reviewIndex);
        renderTodayReviews();
        renderWeekView();
        renderMonthView();
      });

      actions.appendChild(doneLabel);
      actions.appendChild(skipBtn);

      mainLine.appendChild(left);
      mainLine.appendChild(actions);

      const meta = document.createElement("div");
      meta.className = "review-meta";
      meta.textContent = `Re-révision n°${item.reviewIndex} – J+${item.offsetDays}` + (isDone ? " (faite)" : "");

      li.appendChild(mainLine);
      li.appendChild(meta);

      todayListElem.appendChild(li);
    });
  }

  if (todayIncludePastCheckbox) {
    todayIncludePastCheckbox.addEventListener("change", () => {
      renderTodayReviews();
    });
  }

  if (todayPrevBtn) {
    todayPrevBtn.addEventListener("click", () => {
      currentDayForTodayView = addDays(currentDayForTodayView, -1);
      renderTodayReviews();
    });
  }

  if (todayNextBtn) {
    todayNextBtn.addEventListener("click", () => {
      currentDayForTodayView = addDays(currentDayForTodayView, 1);
      renderTodayReviews();
    });
  }

  // -------- C. Vue hebdomadaire --------

  function renderWeekView() {
    state = loadState();
    weekViewElem.innerHTML = "";

    const start = new Date(currentWeekStart);
    const end = addDays(start, 6);

    const startStr = formatDateFr(formatDateISO(start));
    const endStr = formatDateFr(formatDateISO(end));
    weekLabelElem.textContent = `Semaine du ${startStr} au ${endStr}`;

    const reviewsByDate = {};
    CHAPITRES.forEach(ch => {
      const st = state.chapters[ch.id];
      if (!st || !Array.isArray(st.reviews)) return;
      st.reviews.forEach(r => {
        if (r.date < formatDateISO(start) || r.date > formatDateISO(end)) return;
        if (!reviewsByDate[r.date]) reviewsByDate[r.date] = [];

        reviewsByDate[r.date].push({
          chapterId: ch.id,
          chapterTitre: ch.titre,
          reviewIndex: r.index,
          offsetDays: r.offsetDays,
          date: r.date,
          done: !!r.done,
          status: r.status || "normal",
          moved: r.moved === true,
          linkedFrom: typeof r.linkedFrom === "number" ? r.linkedFrom : null,
          skipFrom: typeof r.skipFrom === "number" ? r.skipFrom : null
        });
      });
    });

    const todayStr = todayISO();

    for (let i = 0; i < 7; i++) {
      const d = addDays(start, i);
      const dayISO = formatDateISO(d);

      const divDay = document.createElement("div");
      divDay.className = "week-day";
      if (dayISO === todayStr) {
        divDay.classList.add("today");
      }

      const dayTitle = document.createElement("div");
      dayTitle.className = "week-day-title";
      dayTitle.textContent = d.toLocaleDateString("fr-FR", {
        weekday: "short",
        day: "2-digit",
        month: "short"
      });

      const ul = document.createElement("ul");
      ul.className = "week-day-list";

      const tasks = reviewsByDate[dayISO] || [];
      
      // --- TRI : Faites en bas ---
      tasks.sort((a, b) => {
        // Si statut 'done' différent, celui qui est 'true' va après (1)
        if (a.done !== b.done) return a.done ? 1 : -1;
        // Sinon tri par index
        return a.reviewIndex - b.reviewIndex;
      });

      if (tasks.length === 0) {
        const liEmpty = document.createElement("li");
        liEmpty.textContent = "—";
        ul.appendChild(liEmpty);
      } else {
        tasks.forEach(t => {
          const li = document.createElement("li");
          li.className = "week-review";
          
          if (t.done) li.classList.add("done");
          if (t.status === "skipped") {
            li.classList.add("failed");
            li.classList.add("moved-original");
          }
          if (t.moved) li.classList.add("moved-original");
          if (t.linkedFrom !== null || t.skipFrom !== null) {
            li.classList.add("moved-child");
          }

          const link = document.createElement("a");
          link.textContent = buildReviewLabel(t);
          link.href = "javascript:void(0)";
          link.addEventListener("click", () => {
            openChapterModal(t.chapterId);
          });

          li.appendChild(link);
          ul.appendChild(li);
        });
      }

      divDay.appendChild(dayTitle);
      divDay.appendChild(ul);
      weekViewElem.appendChild(divDay);
    }
  }

  weekPrevBtn.addEventListener("click", () => {
    currentWeekStart = addDays(currentWeekStart, -7);
    renderWeekView();
  });

  weekNextBtn.addEventListener("click", () => {
    currentWeekStart = addDays(currentWeekStart, 7);
    renderWeekView();
  });

  // -------- B. Vue mensuelle --------

  function renderMonthView() {
    state = loadState();
    monthViewElem.innerHTML = "";

    const year = currentMonthYear.year;
    const month = currentMonthYear.month;

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    monthLabelElem.textContent = firstDay.toLocaleDateString("fr-FR", {
      month: "long",
      year: "numeric"
    });

    const reviewsByDate = {};
    CHAPITRES.forEach(ch => {
      const st = state.chapters[ch.id];
      if (!st || !Array.isArray(st.reviews)) return;
      st.reviews.forEach(r => {
        if (!r.date.startsWith(`${year}-${String(month + 1).padStart(2, "0")}`)) return;
        if (!reviewsByDate[r.date]) reviewsByDate[r.date] = [];

        reviewsByDate[r.date].push({
          chapterId: ch.id,
          chapterTitre: ch.titre,
          reviewIndex: r.index,
          offsetDays: r.offsetDays,
          date: r.date,
          done: !!r.done,
          status: r.status || "normal",
          moved: r.moved === true,
          linkedFrom: typeof r.linkedFrom === "number" ? r.linkedFrom : null,
          skipFrom: typeof r.skipFrom === "number" ? r.skipFrom : null
        });
      });
    });

    const table = document.createElement("table");
    table.className = "month-grid";

    const thead = document.createElement("thead");
    const trHead = document.createElement("tr");
    const jours = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
    jours.forEach(j => {
      const th = document.createElement("th");
      th.textContent = j;
      trHead.appendChild(th);
    });
    thead.appendChild(trHead);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");

    let startIndex = firstDay.getDay();
    if (startIndex === 0) startIndex = 7;

    let currentRow = document.createElement("tr");
    for (let i = 1; i < startIndex; i++) {
      const td = document.createElement("td");
      currentRow.appendChild(td);
    }

    const daysInMonth = lastDay.getDate();
    const todayStr = todayISO();

    for (let day = 1; day <= daysInMonth; day++) {
      if (currentRow.children.length === 7) {
        tbody.appendChild(currentRow);
        currentRow = document.createElement("tr");
      }

      const td = document.createElement("td");
      const d = new Date(year, month, day);
      const dateStr = formatDateISO(d);

      if (dateStr === todayStr) {
        td.classList.add("today");
      }

      const dayNumber = document.createElement("div");
      dayNumber.className = "month-day-number";
      dayNumber.textContent = day;

      const ul = document.createElement("ul");
      ul.className = "month-day-list";

      const tasks = reviewsByDate[dateStr] || [];
      
      // --- TRI : Faites en bas ---
      tasks.sort((a, b) => {
        if (a.done !== b.done) return a.done ? 1 : -1;
        return a.reviewIndex - b.reviewIndex;
      });

      tasks.forEach(t => {
        const li = document.createElement("li");
        li.className = "month-review";
        
        if (t.done) li.classList.add("done");
        if (t.status === "skipped") {
          li.classList.add("failed");
          li.classList.add("moved-original");
        }
        if (t.moved) li.classList.add("moved-original");
        if (t.linkedFrom !== null || t.skipFrom !== null) {
          li.classList.add("moved-child");
        }

        const link = document.createElement("a");
        link.textContent = buildReviewLabel(t);
        link.href = "javascript:void(0)";
        link.addEventListener("click", () => {
          openChapterModal(t.chapterId);
        });

        li.appendChild(link);
        ul.appendChild(li);
      });

      td.appendChild(dayNumber);
      td.appendChild(ul);
      currentRow.appendChild(td);
    }

    while (currentRow.children.length < 7) {
      const td = document.createElement("td");
      currentRow.appendChild(td);
    }
    tbody.appendChild(currentRow);
    table.appendChild(tbody);

    monthViewElem.appendChild(table);
  }

  // -------- Options d'affichage --------

  if (titleLengthInput) {
    titleLengthInput.value = String(maxTitleChars);
  }

  if (titleLengthBtn && titleLengthInput) {
    titleLengthBtn.addEventListener("click", () => {
      const val = parseInt(titleLengthInput.value, 10);
      if (!isNaN(val) && val > 0) {
        maxTitleChars = val;
        localStorage.setItem(LS_KEY_MAX_TITLE, String(val));
        renderTodayReviews();
        renderWeekView();
        renderMonthView();
      }
    });
  }

  if (titleMetaToggle) {
    titleMetaToggle.checked = showReviewMeta;
    titleMetaToggle.addEventListener("change", () => {
      showReviewMeta = !!titleMetaToggle.checked;
      localStorage.setItem(LS_KEY_SHOW_META, showReviewMeta ? "true" : "false");
      renderWeekView();
      renderMonthView();
    });
  }

  monthPrevBtn.addEventListener("click", () => {
    if (currentMonthYear.month === 0) {
      currentMonthYear.year -= 1;
      currentMonthYear.month = 11;
    } else {
      currentMonthYear.month -= 1;
    }
    renderMonthView();
  });

  monthNextBtn.addEventListener("click", () => {
    if (currentMonthYear.month === 11) {
      currentMonthYear.year += 1;
      currentMonthYear.month = 0;
    } else {
      currentMonthYear.month += 1;
    }
    renderMonthView();
  });

  // -------- Largeur planning --------

  if (planningContainer && planningWidthInput) {
    const savedWidth = localStorage.getItem(LS_KEY_MAX_WIDTH);
    if (savedWidth !== null) {
      const w = parseInt(savedWidth, 10);
      if (!isNaN(w) && w > 0) {
        planningContainer.style.maxWidth = w + "px";
        planningWidthInput.value = w;
      }
    } else {
      const computed = getComputedStyle(planningContainer);
      const currentMax = parseInt(computed.maxWidth, 10);
      if (!isNaN(currentMax)) {
        planningWidthInput.value = currentMax;
      } else {
        planningWidthInput.value = planningContainer.clientWidth;
      }
    }
  }

  if (planningContainer && planningWidthBtn && planningWidthInput) {
    planningWidthBtn.addEventListener("click", () => {
      const val = parseInt(planningWidthInput.value, 10);
      if (!isNaN(val) && val >= 500 && val <= 2000) {
        planningContainer.style.maxWidth = val + "px";
        localStorage.setItem(LS_KEY_MAX_WIDTH, String(val));
        renderWeekView();
        renderMonthView();
      }
    });
  }

  // -------- Modal chapitre --------

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
        let isDelayed = false;

        if (st.learnedDate && typeof r.offsetDays === "number") {
          const learned = parseDate(st.learnedDate);
          const origDate = addDays(learned, r.offsetDays);
          const currentDate = parseDate(r.date);

          const diffMs = currentDate - origDate;
          const msPerDay = 1000 * 60 * 60 * 24;
          const deltaDays = Math.round(diffMs / msPerDay);

          if (deltaDays > 0) {
            reportText = ` (reporté de ${deltaDays} jour${deltaDays > 1 ? "s" : ""})`;
            isDelayed = true;
          }
        }

        label.textContent = labelText + reportText;

        const resetBtn = document.createElement("button");
        resetBtn.type = "button";
        resetBtn.className = "nav-button";
        resetBtn.textContent = "Annuler report";

        if (isDelayed) {
          resetBtn.addEventListener("click", (e) => {
            e.stopPropagation();

            let state = loadState();
            const st2 = state.chapters[chapterId];
            if (!st2 || !st2.learnedDate || !Array.isArray(st2.reviews)) return;

            const review = st2.reviews.find(rr => rr.index === r.index);
            if (!review) return;

            const learned = parseDate(st2.learnedDate);
            const origDate = addDays(learned, review.offsetDays);
            const origISO = formatDateISO(origDate);

            review.date = origISO;
            review.done = false;
            review.status = "normal";

            saveState(state);

            openChapterModal(chapterId);
            if (typeof renderTodayReviews === "function") renderTodayReviews();
            if (typeof renderWeekView === "function") renderWeekView();
            if (typeof renderMonthView === "function") renderMonthView();
          });
        } else {
          resetBtn.style.display = "none";
        }

        li.addEventListener("click", (e) => {
            if (e.target === checkbox || e.target === resetBtn) return;
            checkbox.checked = !checkbox.checked;
            checkbox.dispatchEvent(new Event("change"));
        });

        checkbox.addEventListener("change", () => {
          state = window.setReviewDone(chapterId, r.index, checkbox.checked);
          openChapterModal(chapterId);
          if (typeof renderTodayReviews === "function") renderTodayReviews();
          if (typeof renderWeekView === "function") renderWeekView();
          if (typeof renderMonthView === "function") renderMonthView();
        });

        li.appendChild(checkbox);
        li.appendChild(label);
        li.appendChild(resetBtn);
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

  window.addEventListener("focus", () => {
    renderTodayReviews();
    renderWeekView();
    renderMonthView();
  });

  renderTodayReviews();
  renderWeekView();
  renderMonthView();
});