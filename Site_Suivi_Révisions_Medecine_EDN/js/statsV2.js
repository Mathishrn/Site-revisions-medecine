document.addEventListener("DOMContentLoaded", () => {
  const state = loadState();
  updateDeadlineBox(state);

  const motivationBtn = document.getElementById("btn-motivation");
  const motivationBox = document.getElementById("motivation-box");
  if (motivationBtn && motivationBox) {
    motivationBtn.addEventListener("click", () => {
      const msg = buildMotivationMessage(state);
      motivationBox.textContent = msg;
      motivationBox.style.display = "block";
    });

  const sortSelect = document.getElementById("subject-sort");
if (sortSelect) {
  sortSelect.addEventListener("change", () => {
    const state = loadState();
    applySubjectSortAndRender(state);
  });
}
  }

  calculateAndRenderStats(state);
});

function calculateAndRenderStats(state) {
  const subjectsMap = {}; 
  
  // learnedDates = 1ères fois uniquement (pour définir la date de début)
  let learnedDates = []; 
  
  // allActionsDates = TOUTES les actions (pour l'activité et moyenne par jour)
  let allActionsDates = [];

  const allReviewsFuture = []; 
  let totalLate = 0; 
  const todayStr = formatDateISO(new Date());

  CHAPITRES.forEach(ch => {
    const st = state.chapters[ch.id];
    const isDone = st && st.completed;
    
    // Stats par matière
    const matList = (ch.matieres && ch.matieres.length > 0) ? ch.matieres : ["Autres / Transversal"];
    matList.forEach(mat => {
      if (!subjectsMap[mat]) {
        subjectsMap[mat] = { name: mat, total: 0, done: 0 };
      }
      subjectsMap[mat].total++;
      if (isDone) subjectsMap[mat].done++;
    });

    // Dates
    if (isDone && st.learnedDate) {
      learnedDates.push(st.learnedDate);
      allActionsDates.push(st.learnedDate);
    }

    if (st && Array.isArray(st.reviews)) {
      st.reviews.forEach(r => {
        if (r.done && r.date) {
            allActionsDates.push(r.date);
        }
        if (!r.done && r.date) {
            allReviewsFuture.push(r.date);
            if (r.date <= todayStr) totalLate++;
        }
      });
    }
  });

  learnedDates.sort();
  allActionsDates.sort();

  // --- RENDUS ---

  // A. KPIs
  const kpiData = renderKPIs(learnedDates, state, totalLate);
  renderGoals(kpiData.weekCount, allActionsDates);

  // B. Projections
  renderProjections(learnedDates, state);

  // C. Activité (Total actions)
  renderActivityChart(allActionsDates); 

  // D. Jours Productifs (MOYENNE)
  renderWeekdayChart(allActionsDates, learnedDates);

  // E. La Vague
  renderFutureLoadChart(allReviewsFuture);

  // F. Tops & Flops (Podiums)
  const subjectsArray = Object.values(subjectsMap);
  subjectsArray.forEach(sub => {
    sub.percent = sub.total > 0 ? (sub.done / sub.total) * 100 : 0;
  });

  // FILTRE : On exclut "Autres / Transversal" uniquement pour les Podiums
  const subjectsForPodium = subjectsArray.filter(s => s.name !== "Autres / Transversal");

  // Top (Décroissant) - Basé sur la liste filtrée
  const sortedDesc = [...subjectsForPodium].sort((a, b) => b.percent - a.percent || b.done - a.done);
  renderSubjectsCards(sortedDesc.slice(0, 3), "top-subjects-container", true);

  // Flop (Croissant, >0 items, <100%) - Basé sur la liste filtrée
  const sortedAsc = [...subjectsForPodium]
    .filter(s => s.total > 0 && s.percent < 100)
    .sort((a, b) => a.percent - b.percent || a.done - b.done);
  renderSubjectsCards(sortedAsc.slice(0, 3), "flop-subjects-container", false);


  // G. Liste détaillée (MODIFIÉ POUR LE TRI)
  // On stocke les données brutes dans une variable globale ou accessible
  window.cachedSubjectsData = subjectsArray; 
  
  // On lance le premier rendu (par défaut A-Z)
  applySubjectSortAndRender(state);
}

// --- NOUVELLE FONCTION DE TRI ---
function applySubjectSortAndRender(state) {
  const sortSelect = document.getElementById("subject-sort");
  const sortValue = sortSelect ? sortSelect.value : "name-asc";
  
  // On travaille sur une copie pour ne pas abîmer l'ordre original
  let data = [...window.cachedSubjectsData]; 

  data.sort((a, b) => {
    switch (sortValue) {
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc": // Inverse A-Z
        return b.name.localeCompare(a.name);
        
      case "percent-desc": // Mieux réussis en haut
        return b.percent - a.percent || a.name.localeCompare(b.name);
      case "percent-asc": // Moins avancés en haut
        return a.percent - b.percent || a.name.localeCompare(b.name);
        
      case "count-desc": // Les plus grosses matières en haut
        return b.total - a.total || a.name.localeCompare(b.name);
      case "count-asc": // Les petites matières en haut
        return a.total - b.total || a.name.localeCompare(b.name);
        
      default:
        return 0;
    }
  });

  // 1. On affiche la liste triée (cela recrée tous les éléments HTML)
  renderSubjectsList(data, state);

  // 2. FIX RECHERCHE : On réapplique immédiatement le filtre si du texte est présent
  const searchInput = document.getElementById("subject-search");
  if (searchInput && searchInput.value.trim() !== "") {
    // Cette ligne simule une frappe au clavier pour déclencher ton filtre existant
    searchInput.dispatchEvent(new Event("input"));
  }
}

// Ajout de l'écouteur d'événement au chargement
document.addEventListener("DOMContentLoaded", () => {
  const sortSelect = document.getElementById("subject-sort");
  if (sortSelect) {
    const savedSort = localStorage.getItem("pref_subject_sort");
    if (savedSort) {
      sortSelect.value = savedSort;
    }
    
    sortSelect.addEventListener("change", () => {
      // 2. Sauvegarde du nouveau choix
      localStorage.setItem("pref_subject_sort", sortSelect.value);
      
      const state = loadState();
      applySubjectSortAndRender(state);
    });
  }
  // ... le reste de tes écouteurs ...
});

// -------------------------------------------------------------------------
// Helpers KPIs & Projections
// -------------------------------------------------------------------------

function renderKPIs(learnedDates, state, totalLate) {
  // --- 1. CONFIGURATION DES DATES ---
  const today = new Date();
  const currentMonthISO = formatDateISO(today).substring(0, 7); // ex: "2025-12"
  
  // Trouver le lundi de la semaine courante
  const d = new Date(today);
  const day = d.getDay(); 
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); 
  const monday = new Date(d.setDate(diff));
  const mondayISO = formatDateISO(monday);

  // --- 2. CALCULS APPRENTISSAGE (Nouveaux chapitres) ---
  let learnWeek = 0;
  let learnMonth = 0;

  // learnedDates contient déjà uniquement les dates de 1ère apprentissage (filtré dans calculateAndRenderStats)
  learnedDates.forEach(dateStr => {
    if (dateStr.startsWith(currentMonthISO)) learnMonth++;
    if (dateStr >= mondayISO) learnWeek++;
  });

  const totalLearned = learnedDates.length;


  // --- 3. CALCULS RÉVISIONS (Re-révisions validées) ---
  let revTotal = 0;
  let revWeek = 0;
  let revMonth = 0;

  // On doit parcourir tout le state pour trouver toutes les reviews FAITES
  CHAPITRES.forEach(ch => {
    const st = state.chapters[ch.id];
    if (st && st.reviews) {
      st.reviews.forEach(r => {
        if (r.done && r.date) {
          revTotal++;
          if (r.date.startsWith(currentMonthISO)) revMonth++;
          if (r.date >= mondayISO) revWeek++;
        }
      });
    }
  });

  // --- 4. AFFICHAGE DANS LE DOM ---
  
  // Bloc Apprentissage
  const elLearnTotal = document.getElementById("kpi-learn-total");
  const elLearnWeek = document.getElementById("kpi-learn-week");
  const elLearnMonth = document.getElementById("kpi-learn-month");
  
  if (elLearnTotal) elLearnTotal.textContent = `${totalLearned} / ${CHAPITRES.length}`;
  if (elLearnWeek) elLearnWeek.textContent = learnWeek;
  if (elLearnMonth) elLearnMonth.textContent = learnMonth;

  // Bloc Révisions
  const elRevTotal = document.getElementById("kpi-rev-total");
  const elRevWeek = document.getElementById("kpi-rev-week");
  const elRevMonth = document.getElementById("kpi-rev-month");
  const elRevLate = document.getElementById("kpi-rev-late");

  if (elRevTotal) elRevTotal.textContent = revTotal;
  if (elRevWeek) elRevWeek.textContent = revWeek;
  if (elRevMonth) elRevMonth.textContent = revMonth;

  // Retard
  if (elRevLate) {
    elRevLate.textContent = totalLate;
    elRevLate.style.color = totalLate > 0 ? "#c62828" : "#2e7d32";
    if(totalLate === 0) elRevLate.textContent = "0 🎉";
  }

  // On retourne les compteurs "hebdo" globaux (somme des deux) pour les objectifs
  return { 
    weekCount: learnWeek + revWeek, // Pour la barre d'objectif hebdo
    monthCount: learnMonth + revMonth 
  };
}

function renderProjections(learnedDates, state) {
  const paceElem = document.getElementById("stat-pace");
  const endElem = document.getElementById("stat-estimated-end");
  const noteElem = document.getElementById("stat-estimated-note");
  const realDoneCount = learnedDates.length;

  if (realDoneCount < 3) {
    paceElem.textContent = "-";
    endElem.textContent = "Calcul en cours...";
    noteElem.textContent = "Données insuffisantes.";
    return;
  }

  let start = parseDate(learnedDates[0]); 
  const today = new Date();
  const diffTime = Math.abs(today - start);
  const daysElapsed = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const pace = realDoneCount / daysElapsed; 
  paceElem.textContent = pace.toFixed(2);

  const remaining = CHAPITRES.length - realDoneCount;
  if (remaining <= 0) {
    endElem.textContent = "Terminé ! 🎓";
  } else {
    const daysNeeded = Math.ceil(remaining / pace);
    const estimatedDate = addDays(today, daysNeeded);
    endElem.textContent = estimatedDate.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
    noteElem.textContent = `Basé sur ton rythme depuis le ${start.toLocaleDateString("fr-FR")}.`;
  }
}

// -------------------------------------------------------------------------
// Graphiques
// -------------------------------------------------------------------------

function renderActivityChart(allActionsDates) {
  const ctx = document.getElementById('activityChart');
  if (!ctx) return;

  const labels = [];
  const dataCounts = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const d = addDays(today, -i);
    const iso = formatDateISO(d);
    labels.push(d.toLocaleDateString("fr-FR", { weekday: "short" }));
    const count = allActionsDates.filter(ld => ld === iso).length;
    dataCounts.push(count);
  }

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Actions validées',
        data: dataCounts,
        backgroundColor: '#2f7e5f',
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { beginAtZero: true, ticks: { stepSize: 1 } },
        x: { grid: { display: false } }
      },
      plugins: { legend: { display: false } }
    }
  });
}

// --- Jours Productifs (MOYENNE) ---
function renderWeekdayChart(allActionsDates, learnedDates) {
    const ctx = document.getElementById('weekdayChart');
    if (!ctx) return;

    // 1. Calculer le total par jour
    const totalActionsByDay = [0,0,0,0,0,0,0];
    allActionsDates.forEach(iso => {
        const d = parseDate(iso);
        const dayIdx = d.getDay();
        totalActionsByDay[dayIdx]++;
    });

    // 2. Calculer le nombre d'occurrences de chaque jour depuis le début
    const occurrencesByDay = [0,0,0,0,0,0,0];
    
    let startDate = learnedDates.length > 0 ? parseDate(learnedDates[0]) : new Date();
    const today = new Date(); 

    let current = new Date(startDate);
    current.setHours(12,0,0,0);
    const endLoop = new Date(today);
    endLoop.setHours(12,0,0,0);

    while (current <= endLoop) {
        const dIdx = current.getDay();
        occurrencesByDay[dIdx]++;
        current.setDate(current.getDate() + 1);
    }

    // 3. Calculer la moyenne
    const averageData = [];
    for(let i=0; i<7; i++) {
        const count = occurrencesByDay[i] > 0 ? (totalActionsByDay[i] / occurrencesByDay[i]) : 0;
        averageData[i] = parseFloat(count.toFixed(1)); 
    }

    // 4. Réorganiser Lun->Dim
    const sundayVal = averageData.shift(); 
    averageData.push(sundayVal);

    const labels = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Moyenne actions / jour',
                data: averageData,
                backgroundColor: 'rgba(255, 112, 67, 0.8)',
                borderColor: '#ff7043',
                borderWidth: 1,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true },
                x: { grid: { display: false } }
            },
            plugins: { 
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.raw + " actions en moyenne";
                        }
                    }
                }
            }
        }
    });
}

function renderFutureLoadChart(allReviewsFuture) {
    const ctx = document.getElementById('futureLoadChart');
    if (!ctx) return;

    const labels = [];
    const dataCounts = [];
    const today = new Date();

    for (let i = 0; i < 30; i++) {
        const d = addDays(today, i);
        const iso = formatDateISO(d);
        labels.push(d.getDate() + '/' + (d.getMonth()+1));
        const count = allReviewsFuture.filter(rd => rd === iso).length;
        dataCounts.push(count);
    }

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Révisions prévues',
                data: dataCounts,
                borderColor: '#7e57c2',
                backgroundColor: 'rgba(126, 87, 194, 0.2)',
                fill: true,
                tension: 0.4,
                pointRadius: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true },
                x: { grid: { display: false }, ticks: { maxTicksLimit: 15 } }
            },
            plugins: { legend: { display: false } }
        }
    });
}

// --- PODIUM + ANIMATION ---
function renderSubjectsCards(list, containerId, isTop) {
  const container = document.getElementById(containerId);
  if(!container) return;
  container.innerHTML = "";
  
  container.className = "podium-container";

  if (list.length === 0) {
      container.innerHTML = "<p style='color:#777; font-size:13px; align-self:center;'>Données insuffisantes...</p>";
      return;
  }

  const medals = isTop ? ["🥇", "🥈", "🥉"] : ["⚠️", "🚧", "🐌"];
  
  const podiumOrder = [];
  
  if (list[1]) podiumOrder.push({ data: list[1], rank: 2, icon: medals[1] });
  if (list[0]) podiumOrder.push({ data: list[0], rank: 1, icon: medals[0] });
  if (list[2]) podiumOrder.push({ data: list[2], rank: 3, icon: medals[2] });

  podiumOrder.forEach((item) => {
    const sub = item.data;
    const rankClass = `rank-${item.rank}`;
    const fillClass = isTop ? "top-fill" : "flop-fill"; 

    const card = document.createElement("div");
    card.className = `podium-card ${rankClass}`;
    
    const fillDiv = document.createElement("div");
    fillDiv.className = `podium-fill ${fillClass}`;
    
    const contentDiv = document.createElement("div");
    contentDiv.className = "podium-content";

    const iconDiv = document.createElement("div");
    iconDiv.className = "podium-medal";
    iconDiv.textContent = item.icon;

    const titleDiv = document.createElement("div");
    titleDiv.className = "podium-title";
    titleDiv.textContent = sub.name;

    const percentDiv = document.createElement("div");
    percentDiv.className = "podium-percent";
    percentDiv.textContent = `${sub.percent.toFixed(0)}%`;

    if (isTop) {
        percentDiv.style.color = "#2e7d32";
    } else {
        percentDiv.style.color = "#c62828";
    }

    contentDiv.appendChild(iconDiv);
    contentDiv.appendChild(titleDiv);
    contentDiv.appendChild(percentDiv);

    card.appendChild(fillDiv);
    card.appendChild(contentDiv);
    container.appendChild(card);

    setTimeout(() => {
        fillDiv.style.height = `${sub.percent}%`;
    }, 100);
  });
}


// --- Liste Détaillée ---
function renderSubjectsList(subjects, state) {
  const container = document.getElementById("subjects-list");
  container.innerHTML = "";

  subjects.forEach(sub => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "subject-item";

    const header = document.createElement("div");
    header.className = "subject-header";
    
    const infoDiv = document.createElement("div");
    infoDiv.className = "subject-info";

    const nameRow = document.createElement("div");
    nameRow.className = "subject-name-row";
    
    const nameSpan = document.createElement("span");
    nameSpan.className = "subject-name";
    nameSpan.textContent = sub.name;

    const countSpan = document.createElement("span");
    countSpan.className = "subject-count";
    countSpan.textContent = `${sub.done}/${sub.total}`;

    nameRow.appendChild(nameSpan);
    nameRow.appendChild(countSpan);

    const progressBg = document.createElement("div");
    progressBg.className = "subject-progress-bg";
    
    const progressFill = document.createElement("div");
    progressFill.className = "subject-progress-fill";
    progressFill.style.width = `${sub.percent}%`;
    
    if (sub.percent < 30) progressFill.style.backgroundColor = "#e57373"; 
    else if (sub.percent < 70) progressFill.style.backgroundColor = "#ffb74d"; 
    else progressFill.style.backgroundColor = "#66bb6a"; 

    progressBg.appendChild(progressFill);
    
    const percentText = document.createElement("div");
    percentText.className = "subject-percent-text";
    percentText.textContent = `${sub.percent.toFixed(2)}%`;
    percentText.style.color = progressFill.style.backgroundColor;

    infoDiv.appendChild(nameRow);
    infoDiv.appendChild(progressBg);
    infoDiv.appendChild(percentText);

    header.appendChild(infoDiv);

    const content = document.createElement("div");
    content.className = "subject-content";
    const ul = document.createElement("ul");
    
    sub.chapters = [];
    CHAPITRES.forEach(ch => {
        const mat = (ch.matieres && ch.matieres.length > 0) ? ch.matieres : ["Autres / Transversal"];
        if (mat.includes(sub.name)) {
             sub.chapters.push({
                 id: ch.id, 
                 title: ch.titre, 
                 done: state.chapters[ch.id].completed
             });
        }
    });

    sub.chapters.forEach(ch => {
      const li = document.createElement("li");
      li.className = ch.done ? "subject-chapter done" : "subject-chapter";
      
      const icon = document.createElement("span");
      icon.textContent = ch.done ? "✅" : "⬜";
      icon.style.marginRight = "8px";

      const text = document.createElement("span");
      text.textContent = `${ch.id}. ${ch.title}`;

      li.appendChild(icon);
      li.appendChild(text);
      ul.appendChild(li);
    });
    content.appendChild(ul);

    header.addEventListener("click", () => {
      itemDiv.classList.toggle("open");
    });

    itemDiv.appendChild(header);
    itemDiv.appendChild(content);
    container.appendChild(itemDiv);
  });
}

// --- GESTION DES OBJECTIFS ---
function renderGoals(weekCount, allActionsDates) {
  // 1. Calcul du compte journalier (todayCount)
  const todayISO = formatDateISO(new Date());
  const todayCount = allActionsDates.filter(d => d === todayISO).length;

  // 2. Récupération des objectifs sauvegardés
  const savedDayGoal = localStorage.getItem("goal_day") || 5;
  const savedWeekGoal = localStorage.getItem("goal_week") || 30;

  const dayInput = document.getElementById("goal-day-input");
  const weekInput = document.getElementById("goal-week-input");
  
  if(dayInput) {
    dayInput.value = savedDayGoal;
    // Mise à jour visuelle
    updateGoalUI("day", todayCount, savedDayGoal);
    
    // Sauvegarde au changement
    dayInput.addEventListener("change", (e) => {
      const val = e.target.value;
      localStorage.setItem("goal_day", val);
      updateGoalUI("day", todayCount, val);
    });
  }

  if(weekInput) {
    weekInput.value = savedWeekGoal;
    updateGoalUI("week", weekCount, savedWeekGoal);

    weekInput.addEventListener("change", (e) => {
      const val = e.target.value;
      localStorage.setItem("goal_week", val);
      updateGoalUI("week", weekCount, val);
    });
  }
}

function updateGoalUI(type, current, max) {
  const bar = document.getElementById(`goal-${type}-bar`);
  const text = document.getElementById(`goal-${type}-text`);
  
  const pct = Math.min(100, (current / max) * 100);
  
  if(bar) bar.style.width = `${pct}%`;
  if(text) text.textContent = `${current} / ${max}`;
  
  // Couleur verte si atteint
  if(bar && pct >= 100) bar.style.backgroundColor = "#4caf50";
  else if (bar) bar.style.backgroundColor = "#29b6f6";
}

// Fonction utilitaire (si pas déjà dispo)
function removeAccents(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

// --- RECHERCHE MATIÈRE (Accents + Croix) ---
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("subject-search");
  const searchClearBtn = document.getElementById("subject-search-clear");
  
  if(searchInput) {
    const handleSearch = () => {
      const rawTerm = searchInput.value;
      const term = removeAccents(rawTerm);
      const items = document.querySelectorAll(".subject-item");
      
      // Gestion croix
      if(searchClearBtn) {
        searchClearBtn.style.display = rawTerm ? "block" : "none";
      }

      items.forEach(item => {
        const nameRaw = item.querySelector(".subject-name").textContent;
        const name = removeAccents(nameRaw);
        
        if(name.includes(term)) {
          item.style.display = "";
        } else {
          item.style.display = "none";
        }
      });
    };

    searchInput.addEventListener("input", handleSearch);

    // Clic sur la croix
    if(searchClearBtn) {
      searchClearBtn.addEventListener("click", () => {
        searchInput.value = "";
        handleSearch(); // Relance la recherche à vide (affiche tout)
        searchInput.focus();
      });
    }
  }
  const sortSelect = document.getElementById("subject-sort");
if (sortSelect) {
  sortSelect.addEventListener("change", () => {
    const state = loadState();
    applySubjectSortAndRender(state);
  });
}
});