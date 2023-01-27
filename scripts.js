const BASE_URL = `https://steam-api-dot-cs-platform-306304.et.r.appspot.com`;

//GAMES LIST
async function getAllGames() {
  let BASE_URL_GAMES = BASE_URL + `/games`;

  try {
    const response = await fetch(`${BASE_URL_GAMES}`);
    if (response.ok) {
      const data = await response.json();
      const games = data["data"];
      return games;
    }
  } catch (error) {
    console.log(error);
    return [];
  }
}

const renderAllGames = async () => {
  let games = [];

  try {
    // Get countries from the API
    games = await getAllGames();
    // ' len is zero
    if (!games.length) {
      console.log("No games.");
      return;
    }

    const ulAllGamesList = document.getElementById("all-games-list")
      .children[2];

    ulAllGamesList.innerHTML = "";

    games.forEach((game, index) => {
      //Create new `li` for each element
      const liAllGamesList = document.createElement("li");
      liAllGamesList.innerHTML = `<div class="bullet">${index + 1}</div>
      <div class="li-wrapper">
        <div class="li-title">${game.name}</div>
      </div>`;
      ulAllGamesList.appendChild(liAllGamesList);
    });
  } catch (err) {
    console.log("err", err);
  }
};

document.getElementById("get-all-games-btn").addEventListener("click", () => {
  renderAllGames();
});

//GENRES LIST
async function getGenres() {
  let BASE_URL_GENRES = BASE_URL + `/genres`;

  try {
    const response = await fetch(`${BASE_URL_GENRES}`);
    if (response.ok) {
      const data = await response.json();
      const genres = data["data"];
      return genres;
    }
  } catch (error) {
    console.log(error);
    return [];
  }
}

const renderGenres = async () => {
  let genres = [];

  try {
    // Get countries from the API
    genres = await getGenres();
    // ' len is zero
    if (!genres.length) {
      console.log("No genres.");
      return;
    }

    const ulGenresList = document.getElementById("genres-list").children[2];

    ulGenresList.innerHTML = "";

    genres.forEach((genre, index) => {
      //Create new `li` for each element
      const liGenresList = document.createElement("li");
      liGenresList.innerHTML = `<div class="bullet">${index + 1}</div>
      <div class="li-wrapper">
        <div class="li-title">${genre.name}</div>
      </div>`;
      ulGenresList.appendChild(liGenresList);
    });
  } catch (err) {
    console.log("err", err);
  }
};

document.getElementById("get-genres-btn").addEventListener("click", () => {
  renderGenres();
});

//TAGS LIST
async function getTags() {
  let BASE_URL_TAGS = BASE_URL + `/tags`;

  try {
    const response = await fetch(`${BASE_URL_TAGS}`);
    if (response.ok) {
      const data = await response.json();
      const tags = data["data"];
      return tags;
    }
  } catch (error) {
    console.log(error);
    return [];
  }
}

const renderTags = async () => {
  let tags = [];

  try {
    // Get countries from the API
    tags = await getGenres();
    // ' len is zero
    if (!tags.length) {
      console.log("No tags.");
      return;
    }

    const ulTagsList = document.getElementById("tags-list").children[2];

    ulTagsList.innerHTML = "";

    tags.forEach((tag, index) => {
      //Create new `li` for each element
      const liTagsList = document.createElement("li");
      liTagsList.innerHTML = `<div class="bullet">${index + 1}</div>
      <div class="li-wrapper">
        <div class="li-title">${tag.name}</div>
      </div>`;
      ulTagsList.appendChild(liTagsList);
    });
  } catch (err) {
    console.log("err", err);
  }
};

document.getElementById("get-tags-btn").addEventListener("click", () => {
  renderTags();
});

//FEATURES LIST
async function getFeatures() {
  let BASE_URL_FEATURES = BASE_URL + `/features`;

  try {
    const response = await fetch(`${BASE_URL_FEATURES}`);
    if (response.ok) {
      const data = await response.json();
      const features = data["data"];
      return features;
    }
  } catch (error) {
    console.log(error);
    return [];
  }
}

const renderFeatures = async () => {
  let features = [];

  try {
    // Get countries from the API
    features = await getFeatures();
    // ' len is zero
    if (!features.length) {
      console.log("No features.");
      return;
    }

    const ulFeaturesList = document.getElementById("features-list").children[2];

    ulFeaturesList.innerHTML = "";

    features.forEach((feature, index) => {
      //Create new `li` for each element
      const liFeaturesList = document.createElement("li");
      liFeaturesList.innerHTML = `<div class="bullet">${index + 1}</div>
      <div class="li-wrapper">
        <div class="li-title">${feature.name}</div>
      </div>`;
      ulFeaturesList.appendChild(liFeaturesList);
    });
  } catch (err) {
    console.log("err", err);
  }
};

document.getElementById("get-features-btn").addEventListener("click", () => {
  renderFeatures();
});

//SINGLE
async function getSingleGame() {
  let BASE_URL_SINGLE_GAME = BASE_URL + `/single-game/20`;

  try {
    const response = await fetch(`${BASE_URL_SINGLE_GAME}`);
    if (response.ok) {
      const data = await response.json();
      console.log(data);
      const single = data["data"];
      console.log(single);
      return single;
    }
  } catch (error) {
    console.log(error);
    return [];
  }
}

const renderSingleGame = async () => {
  let single;

  try {
    // Get countries from the API
    single = await getSingleGame();

    const ulSingleList = document.getElementById("single-game").children[2];

    ulSingleList.innerHTML = "";

    //Create new `li` for each element
    const liSingleList = document.createElement("li");
    liSingleList.innerHTML = `<div class="bullet">1</div>
      <div class="li-wrapper">
        <div class="li-title">${single.name}</div>
      </div>`;
    ulSingleList.appendChild(liSingleList);
  } catch (err) {
    console.log("err", err);
  }
};

document.getElementById("get-single-game-btn").addEventListener("click", () => {
  renderSingleGame();
});
