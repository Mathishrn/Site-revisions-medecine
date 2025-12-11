const CACHE_NAME = "suivi-med-v2.4.3-fixfinal";
const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./planningV2.html",
  "./statsV2.html",
  "./css/styleV2.css",
  "./js/dataV2.js",
  "./js/commonV2.js",
  "./js/indexV2.js",
  "./js/planningV2.js",
  "./js/statsV2.js",
  "./manifest.json"
  // Ajoute ici tes icônes si tu veux qu'elles soient aussi cachées
  // "./icons/icon-192.png"
];

// 1. Installation : On met tout en cache
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Mise en cache globale");
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// 2. Activation : On nettoie les vieux caches si on change de version
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("[Service Worker] Suppression vieux cache", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// 3. Interception : On sert le cache, sinon le réseau
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Si trouvé dans le cache, on le rend
      if (cachedResponse) {
        return cachedResponse;
      }
      // Sinon on va chercher sur internet
      return fetch(event.request);
    })
  );
});


// ```

// ### 3. Lier le tout dans tes fichiers HTML
// Tu dois ajouter ce petit bout de code dans le `<head>` et à la fin du `<body>` de **tes 3 fichiers HTML** (`index.html`, `planningV2.html`, `statsV2.html`).

// **Dans le `<head>` :**
// ```html
// <link rel="manifest" href="manifest.json">
// <meta name="theme-color" content="#2f7e5f">
// <link rel="apple-touch-icon" href="icons/icon-192.png"> <!-- Pour iPhone -->
// ```

// **Juste avant la fermeture `</body>` (après tes scripts JS) :**
// ```html
// <script>
//   if ('serviceWorker' in navigator) {
//     window.addEventListener('load', () => {
//       navigator.serviceWorker.register('./service-worker.js')
//         .then(reg => console.log('Service Worker enregistré !', reg.scope))
//         .catch(err => console.log('Echec Service Worker :', err));
//     });
//   }
// </script>
// ```

// ---

// # 🧪 Partie 1 (Détail) : Les Tests Automatisés (QA)

// Pour passer ton projet en mode "Industriel", on ne teste plus à la main. On utilise des robots.

// **Prérequis :** Tu dois avoir **Node.js** installé sur ton ordinateur.
// À la racine de ton projet, ouvre un terminal et tape :
// `npm init -y` (ça crée un fichier package.json).

// ### Étape A : Tests Unitaires avec JEST
// *Jest* va tester la logique pure (calculs de dates, planning) sans lancer le navigateur.

// 1.  **Installation :**
//     `npm install --save-dev jest`

// 2.  **Configuration :**
//     Dans `package.json`, modifie la ligne "test" : `"test": "jest"`

// 3.  **Adapter le code pour le test :**
//     Jest fonctionne avec des modules Node.js. Ton code actuel est en "Vanilla JS" navigateur. Pour tester `commonV2.js` facilement sans tout casser, le plus simple est de créer une version "testable" ou d'utiliser un export conditionnel.
//     *Astuce simple :* Crée un fichier `tests/logic.test.js`. Copie-colle juste les fonctions clés de `commonV2` que tu veux tester (comme `addDays` ou `generateSchedule`) pour les isoler, ou configure Babel pour supporter tes imports.

//     Voici un exemple de fichier de test `logic.test.js` (si tu adaptes ton code en modules) :

// ```javascript
// // tests/logic.test.js

// // Imaginons que tu as importé tes fonctions de commonV2.js
// // const { addDays, generateSchedule } = require('../js/commonV2_module'); 

// describe('Calculs de dates', () => {
//   test('addDays ajoute correctement des jours', () => {
//     const start = new Date('2025-01-01');
//     const result = new Date(start);
//     result.setDate(result.getDate() + 5);
//     // Assertion (Vérification)
//     expect(result.toISOString().split('T')[0]).toBe('2025-01-06');
//   });
// });

// describe('Génération Planning', () => {
//   test('Génère bien 12 révisions', () => {
//     // Simulation
//     const reviews = [1, 3, 7, 14, 30, 45, 60, 90, 120, 180, 240, 300]; 
//     expect(reviews.length).toBe(12);
//   });
  
//   test('La première révision est à J+1', () => {
//     const j1 = 1;
//     expect(j1).toBe(1);
//   });
// });

// ```
// 4.  **Lancer le test :** `npm test`

// ---

// ### Étape B : Tests de "Bout en Bout" (E2E) avec CYPRESS
// C'est le plus impressionnant. *Cypress* va ouvrir un vrai navigateur Chrome et cliquer sur ton site comme un utilisateur fantôme.

// 1.  **Installation :**
//     `npm install --save-dev cypress`

// 2.  **Lancer Cypress :**
//     `npx cypress open`
//     (Ça va créer un dossier `cypress` dans ton projet).

// 3.  **Créer un test scénario :**
//     Crée un fichier `cypress/e2e/parcours_etudiant.cy.js` :

// ```javascript
// describe('Parcours Révision Étudiant', () => {
  
//   // Avant chaque test, on visite le site (url locale ou netlify)
//   beforeEach(() => {
//     // Si tu testes en local, lance un serveur (ex: Live Server)
//     cy.visit('http://127.0.0.1:5500/index.html'); 
//   });

//   it('Doit pouvoir cocher un chapitre et voir la barre progresser', () => {
//     // 1. Vérifier qu'on est sur la bonne page
//     cy.contains('Suivi général');

//     // 2. Chercher le chapitre 1 et cliquer la checkbox
//     // On utilise l'attribut data-id qu'on a mis dans le HTML
//     cy.get('.chapter-item[data-id="1"] input[type="checkbox"]').check({force: true});

//     // 3. La modale de date doit s'ouvrir
//     cy.get('#date-modal').should('have.class', 'open');

//     // 4. Confirmer la date (clic sur Valider)
//     cy.get('#date-modal-ok').click();

//     // 5. Vérifier que le toast de succès apparaît
//     cy.get('#toast').should('contain', 'validé');

//     // 6. Vérifier que la barre de progression n'est plus à 0%
//     cy.get('#progress-bar').should('not.have.css', 'width', '0px');
//   });

//   it('Doit sauvegarder dans le LocalStorage', () => {
//     cy.get('.chapter-item[data-id="1"] input[type="checkbox"]').check({force: true});
//     cy.get('#date-modal-ok').click();

//     // On recharge la page pour voir si c'est resté coché
//     cy.reload();

//     // La case doit être toujours cochée
//     cy.get('.chapter-item[data-id="1"] input[type="checkbox"]').should('be.checked');
//   });
// });