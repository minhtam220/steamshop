[].slice
  .call(document.querySelectorAll(".dropdown .nav-link"))
  .forEach(function (el) {
    el.addEventListener("click", onClick, false);
  });

function onClick(e) {
  e.preventDefault();
  var el = this.parentNode;
  console.log(el);
  el.classList.contains("show-submenu") ? hideSubMenu(el) : showSubMenu(el);
}

function showSubMenu(el) {
  el.classList.add("show-submenu");
  document.addEventListener("click", function onDocClick(e) {
    e.preventDefault();
    if (el.contains(e.target)) {
      return;
    }
    document.removeEventListener("click", onDocClick);
    hideSubMenu(el);
  });
}

function hideSubMenu(el) {
  el.classList.remove("show-submenu");
}

const BASE_URL = `https://steam-api-dot-cs-platform-306304.et.r.appspot.com`;
let genre
let search

//SEARCH GAMES
async function getGames() {
  let BASE_URL_GAMES;

  if (genre === undefined) {
    BASE_URL_GAMES = BASE_URL + `/games/?q=${q}`;
  } else {
    BASE_URL_GAMES = BASE_URL + `/games/?genres=${genre}`;
  }
  console.log(BASE_URL_GAMES);

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

const renderGames = async (genre) => {
  let games = [];
  search = document.getElementById("search-query").value;

  try {
    // Get games from the API
    games = await getGames(search, genre);

    // ' len is zero
    if (!games.length) {
      console.log("No games.");
      return;
    }

    const allGamesList = document.getElementById("all_games_list");

    allGamesList.innerHTML = "";

    games.forEach((game, index) => {
      //Create new `Game Wrapper` for each element
      const divGameWrapper = document.createElement("div");
      divGameWrapper.innerHTML = `
      <div class="game_wrapper">
          <img
            src="${game.header_image}"
            alt=""
          />
          <div class="game_info">
            <div class="game_name">${game.name}</div>
            <div class="game_price">USD ${game.price}</div>
            <div class="game_genres">${game.genres}</div>
          </div>
        </div>`;

      allGamesList.appendChild(divGameWrapper);

      return;
    });
  } catch (err) {
    console.log("err", err);
  }
};

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

const init = async () => {
  let genres = [];

  try {
    // Get countries from the API
    genres = await getGenres();
    // ' len is zero
    if (!genres.length) {
      console.log("No genres.");
      return;
    }

    const allGenresList = document.getElementById("all_genres_list");

    allGenresList.innerHTML = "";

    genres.forEach((genre, index) => {
      //Create new `Game Wrapper` for each element
      const divGenres = document.createElement("div");
      divGenres.innerHTML = `
      <button
      id="list-genres"
      class="btn"
      onclick={renderGames('${genre.name}')}>
      ${genre.name}
    </button>`;
      allGenresList.appendChild(divGenres);
    });
    console.log("loaded");
  } catch (err) {
    console.log("err", err);
  }
};

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
