//CODES FOR NAVIGATION BAR NEW
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

//MAIN CODES
//declare variables
const BASE_URL = `https://steam-api-dot-cs-platform-306304.et.r.appspot.com`;
let genresList;
let genreSelected = "";

let tagsList;
let tagSelected = "";

let search = "";

let gamesList;
let gameSelected;

//fetch data from the URL
async function fetchData(url) {

  console.log("fetchData " + url);

  try {
    const response = await fetch(`${url}`);
    if (response.ok) {
      const data = await response.json();
      const result = data["data"];
      return result;
    }
  } catch (error) {
    console.log(error);
    return [];
  }

}

//search for games
async function searchGames() {

  let url;
  
  if (genreSelected !== "" && search !== "" && tagSelected !== ""){
    url = BASE_URL + `/games/?q=${search}&genres=${genreSelected}&steamspy_tags=${tagSelected}`;
  } else if (genreSelected === ""){
    url = BASE_URL + `/games/?q=${search}&steamspy_tags=${tagSelected}`;
  } else if (tagSelected === ""){
    url = BASE_URL + `/games/?q=${search}&genres=${genreSelected}`;
  } else if (search === ""){
    url = BASE_URL + `/games/?genres=${genreSelected}&steamspy_tags=${tagSelected}`;
  } else {
    url = BASE_URL + `/games`;
  };

  console.log("searchGames " + url);

  let games = fetchData(url);

  return games;

}

//render games 
const renderGames = async () => {
   
  games = [];

  console.log("renderGames"+ search);

  try {
    // Search games from the API
    games = await searchGames();

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

    });
  } catch (err) {
    console.log("err", err);
  }
};

//select genre
function selectGenre (genre) {
  
  genreSelected = genre;
  renderGames();
  
};

//select Tag
function selectTag (tag) {
  
  tagSelected = tag;
  renderGames();
  
};

//select search
function selectSearch () {
  search = document.getElementById("search_query").value;
  genreSelected = "";
  renderGames();  
};

//get the genres list
async function getGenres() {
  let url = BASE_URL + `/genres`;

  let genres = fetchData(url);

  return genres;
}

//get the tags list
async function getTags() {
  let url = BASE_URL + `/steamspy-tags`;

  let tags = fetchData(url);

  return tags;
}


const init = async () => {
  let genres = [];
  let tags = [];

  try {

    // Get genres list from the API
    genres = await getGenres();
    // ' len is zero
    if (!genres.length) {
      console.log("No genres.");
      return;
    }

    const allGenresList = document.getElementById("genres_list");

    allGenresList.innerHTML = "Search by genres";

    genres.forEach((genre, index) => {
      //Create new `Game Wrapper` for each element
      const divGenres = document.createElement("div");
      divGenres.innerHTML = `
      <button
      id="select_genre"
      class="btn"
      onclick={selectGenre('${genre.name}')}>
      ${genre.name}
    </button>`;
      allGenresList.appendChild(divGenres);
    });

    // Get tags list from the API
    tags = await getTags();
    // ' len is zero
    if (!tags.length) {
      console.log("No tags.");
      return;
    }

    const allTagsList = document.getElementById("tags_list");

    allTagsList.innerHTML = "Search by tags";

    tags.forEach((tag, index) => {
      //Create new `Tag Wrapper` for each element
      const divTags = document.createElement("div");
      divTags.innerHTML = `
      <button
      id="select_tag"
      class="btn"
      onclick={selectTag('${tag.name}')}>
      ${tag.name}
    </button>`;
      allTagsList.appendChild(divTags);
    });

    renderGames();

    console.log("loaded");
  } catch (err) {
    console.log("err", err);
  }
};


