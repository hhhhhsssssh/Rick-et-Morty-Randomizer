

// Fonction pour générer un nombre aléatoire entre min et max (inclus)
function generateRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const characterCache = {};

function fetchCharacterInfo(characterId) {
  return fetch(`https://rickandmortyapi.com/api/character/${characterId}`)
    .then(function(response) {
      if (!response.ok) {
        throw new Error(`Erreur HTTP, statut : ${response.status}`);
      }
      return response.json();
    })
    .then(function(data) {
      // Stocker les informations dans le cache
      characterCache[characterId] = data;
      return data;
    })
    .catch(function(error) {
      console.error(
        `Une erreur s'est produite lors de la récupération des informations pour le personnage avec l'ID ${characterId} :`,
        error
      );
      return null; // En cas d'erreur, retourne null
    });
}

// Fonction pour afficher les cartes de personnages aléatoires
async function displayRandomCharacterCards() {
  const charactersContainer = document.getElementById("character-container");
  charactersContainer.innerHTML = ""; // Efface le contenu précédent du conteneur de personnages

  for (let i = 0; i < 12; i++) {
    const characterId = generateRandomNumber(1, 826); // Génère un ID de personnage aléatoire entre 1 et 826
    const characterInfo = await fetchCharacterInfo(characterId);

    // Création de la carte de personnage
    const card = document.createElement("div");
    card.classList.add("character-card");
    card.innerHTML = `
      <img src="${characterInfo.image}" alt="${characterInfo.name}" />
      <h2>${characterInfo.name}</h2>
      <p><span>Status: </span>${characterInfo.status}</p>
      <p><span>Genre: </span>${characterInfo.gender}</p>
      <p><span>Species: </span>${characterInfo.species}</p>
    `;

    // Ajouter un gestionnaire d'événements au clic sur la carte pour ouvrir le modal
    card.addEventListener("click", () => openModal(characterInfo));

    charactersContainer.appendChild(card);
  }
}

// Appel initial pour afficher 12 cartes de personnages aléatoires
displayRandomCharacterCards();

/***********************************************************************************BOUTONS*******************************************************************************************/

// Ajouter des écouteurs d'événements aux boutons de filtrage
const refreshButton = document.getElementById("refresh-button");
refreshButton.addEventListener("click", () => displayRandomCharacterCards());

// Gestionnaire d'événements pour le bouton "alive-button"
const aliveButton = document.getElementById("alive-button");
aliveButton.addEventListener("click", async () => {
  await displayRandomCharacterCardsWithStatus("Alive");
});

// Gestionnaire d'événements pour le bouton "dead-button"
const deadButton = document.getElementById("dead-button");
deadButton.addEventListener("click", async () => {
  await displayRandomCharacterCardsWithStatus("Dead");
});

// Gestionnaire d'événements pour le bouton "unknown-button"
const unknownButton = document.getElementById("unknown-button");
unknownButton.addEventListener("click", async () => {
  await displayRandomCharacterCardsWithStatus("unknown");
});
/************************************************************************************************************************************************************************************/


// Fonction pour afficher les cartes de personnages aléatoires avec un statut spécifique
async function displayRandomCharacterCardsWithStatus(status) {
  const charactersContainer = document.getElementById("character-container");
  charactersContainer.innerHTML = ""; // Efface le contenu précédent du conteneur de personnages

  for (let i = 0; i < 12; i++) {
    let characterInfo;
    do {
      const characterId = generateRandomNumber(1, 826); // Génère un ID de personnage aléatoire entre 1 et 826
      characterInfo = await fetchCharacterInfo(characterId);
    } while (characterInfo.status !== status);

    // Création de la carte de personnage
    const card = document.createElement("div");
    card.classList.add("character-card");
    card.innerHTML = `
      <img src="${characterInfo.image}" alt="${characterInfo.name}" />
      <h2>${characterInfo.name}</h2>
      <p><span>Status: </span>${characterInfo.status}</p>
      <p><span>Genre: </span>${characterInfo.gender}</p>
      <p><span>Species: </span>${characterInfo.species}</p>
    `;

    charactersContainer.appendChild(card);
  }
}

// Fonction pour ouvrir le modal avec les informations du personnage
function openModal(characterInfo) {
  const modal = document.getElementById("myModal");
  const modalContent = document.querySelector(".modal-content");

  // Remplacer le contenu du modal avec les informations du personnage
  modalContent.innerHTML = `
    <span class="close">&times;</span>
    <img src="${characterInfo.image}" alt="${characterInfo.name}" />
    <h2>${characterInfo.name}</h2>
    <p>Origin Location: ${characterInfo.origin.name}</p>
    <p>Last Known Location: ${characterInfo.location.name}</p>
    <p>Episodes: <span id="episodes-list-${characterInfo.id}"></span></p>
`;

// Récupération et affichage des épisodes
const episodesList = document.getElementById(`episodes-list-${characterInfo.id}`);
const episodeNumbers = [];

characterInfo.episode.forEach((episodeURL, index) => {
  fetch(episodeURL)
    .then((response) => response.json())
    .then((data) => {
      const episodeNumber = data.episode.slice(-2); // Extrait le numéro de l'épisode de l'URL
      episodeNumbers.push(episodeNumber);

      // Vérifie si c'est le dernier épisode à ajouter
      if (index === characterInfo.episode.length - 1) {
        episodesList.textContent = episodeNumbers.join(', '); // Joint tous les numéros avec une virgule et les ajoute
      }
    })
    .catch((error) =>
      console.error("Erreur lors de la récupération de l'épisode :", error)
    );
});

  // Afficher le modal
  modal.style.display = "block";

  // Ajouter un gestionnaire d'événements au clic sur le symbole de fermeture
  const closeModalButton = modalContent.querySelector(".close");
  closeModalButton.addEventListener("click", () => {
    modal.style.display = "none";
  });
}

// Fermer le modal lorsqu'un clic est effectué en dehors du contenu du modal
window.addEventListener("click", (event) => {
  const modal = document.getElementById("myModal");
  if (event.target == modal) {
    modal.style.display = "none";
  }
});
