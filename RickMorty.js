// Function to generate a random number between min and max (inclusive)
function generateRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const characterCache = {};

function fetchCharacterInfo(characterId) {
  return fetch(`https://rickandmortyapi.com/api/character/${characterId}`)
    .then(function (response) {
      if (!response.ok) {
        throw new Error(`Erreur HTTP, statut : ${response.status}`);
      }
      return response.json();
    })
    .then(function (data) {
      // Store the information in the cache
      characterCache[characterId] = data;
      return data;
    })
    .catch(function (error) {
      console.error(
        `Une erreur s'est produite lors de la récupération des informations pour le personnage avec l'ID ${characterId} :`,
        error
      );
      return null; // If there's an error, return null
    });
}

// Function to display random character cards
async function displayRandomCharacterCards() {
  const charactersContainer = document.getElementById("character-container");
  charactersContainer.innerHTML = ""; // Clear the previous content of the character container

  for (let i = 0; i < 12; i++) {
    const characterId = generateRandomNumber(1, 826); // Generate a random character ID between 1 and 826
    const characterInfo = await fetchCharacterInfo(characterId);

    // Create the character card
    const card = document.createElement("div");
    card.classList.add("character-card");
    card.innerHTML = `
      <img src="${characterInfo.image}" alt="${characterInfo.name}" />
      <h2>${characterInfo.name}</h2>
      <p><span>Status: </span>${characterInfo.status}</p>
      <p><span>Genre: </span>${characterInfo.gender}</p>
      <p><span>Species: </span>${characterInfo.species}</p>
    `;

    // Add an event handler for clicking on the card to open the modal
    card.addEventListener("click", () => openModal(characterInfo));

    charactersContainer.appendChild(card);
  }
}

// Initial call to display 12 random character cards
displayRandomCharacterCards();

/***********************************************************************************buttons*******************************************************************************************/

// Add event listeners to the filtering buttons
const refreshButton = document.getElementById("refresh-button");
refreshButton.addEventListener("click", () => displayRandomCharacterCards());

// Event handler for the "alive-button" button
const aliveButton = document.getElementById("alive-button");
aliveButton.addEventListener("click", async () => {
  await displayRandomCharacterCardsWithStatus("Alive");
});

// Event handler for the "dead-button" button
const deadButton = document.getElementById("dead-button");
deadButton.addEventListener("click", async () => {
  await displayRandomCharacterCardsWithStatus("Dead");
});

// Event handler for the "unknown-button" button
const unknownButton = document.getElementById("unknown-button");
unknownButton.addEventListener("click", async () => {
  await displayRandomCharacterCardsWithStatus("unknown");
});
/************************************************************************************************************************************************************************************/

// Function to display random character cards with a specific status
async function displayRandomCharacterCardsWithStatus(status) {
  const charactersContainer = document.getElementById("character-container");
  charactersContainer.innerHTML = ""; // Clear the previous content of the character container

  for (let i = 0; i < 12; i++) {
    let characterInfo;
    do {
      const characterId = generateRandomNumber(1, 826); // Generate a random character ID between 1 and 826
      characterInfo = await fetchCharacterInfo(characterId);
    } while (characterInfo.status !== status);

    // Create the character card
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

// Function to open the modal with the character information
function openModal(characterInfo) {
  const modal = document.getElementById("myModal");
  const modalContent = document.querySelector(".modal-content");

  // Replace the modal content with the character information
  modalContent.innerHTML = `
    <span class="close">&times;</span>
    <img src="${characterInfo.image}" alt="${characterInfo.name}" />
    <h2>${characterInfo.name}</h2>
    <p>Origin Location: ${characterInfo.origin.name}</p>
    <p>Last Known Location: ${characterInfo.location.name}</p>
    <p>Episodes: <span id="episodes-list-${characterInfo.id}"></span></p>
`;

  // Retrieve and display the episodes
  const episodesList = document.getElementById(
    `episodes-list-${characterInfo.id}`
  );
  const episodeNumbers = [];

  characterInfo.episode.forEach((episodeURL, index) => {
    fetch(episodeURL)
      .then((response) => response.json())
      .then((data) => {
        const episodeNumber = data.episode.slice(-2); // Extract the episode number from the URL
        episodeNumbers.push(episodeNumber);

        // Check if it's the last episode to add
        if (index === characterInfo.episode.length - 1) {
          episodesList.textContent = episodeNumbers.join(", "); // Concatenate all numbers with a comma and add them
        }
      })
      .catch((error) =>
        console.error("Erreur lors de la récupération de l'épisode :", error)
      );
  });

  // Display the modal
  modal.style.display = "block";

  // Add an event handler for clicking on the close symbol
  const closeModalButton = modalContent.querySelector(".close");
  closeModalButton.addEventListener("click", () => {
    modal.style.display = "none";
  });
}

// Close the modal when a click is made outside the modal content
window.addEventListener("click", (event) => {
  const modal = document.getElementById("myModal");
  if (event.target == modal) {
    modal.style.display = "none";
  }
});
