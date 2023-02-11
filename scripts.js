//CODES FOR NAVIGATION BAR
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

  //console.log("fetchData " + url);

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

  let GAME_URL = BASE_URL + `/games/?`;
  
  const searchParam = new URLSearchParams(`?`);

  console.log("search = "+ search);
  console.log("genre = " + genreSelected);
  console.log("tag = " + tagSelected);
  console.log("searchParam" + searchParam);

  if (search !== ""){
    searchParam.append("q",search);
  } 
  
  if (genreSelected !== ""){
    searchParam.append("genres",genreSelected);
  } 

  if (tagSelected !== ""){
    searchParam.append("steamspy_tags",tagSelected);
  }

  //
  let games = [];

  let data = [];
  
  let pageIndex = 1;

  const dataLimit = 100;

  let dataLength = 101;

  while (dataLength > 100) {

    searchParam.append("page",pageIndex);

    searchParam.append("limit",dataLimit);

    console.log(GAME_URL + searchParam.toString());

    data = fetchData(GAME_URL + searchParam.toString());

    dataLength = data.length;

    games = data;

    pageIndex = pageIndex + 1;

    searchParam.delete("page");

    searchParam.delete("limit");

    console.log("data " + data.length);

    console.log("games " + games.length);

  }

  return games;

}

//render games 
const renderGames = async () => {
   
  games = [];

  //console.log("renderGames"+ search);

  try {
    // Search games from the API
    games = await searchGames();

    let allGamesList = document.getElementById("games_list");

    // ' len is zero
    if (!games.length) {
      
      allGamesList.innerHTML = "No games";

      //return;

    } else {

      //const allGamesList = document.getElementById("all_games_list");

      allGamesList.innerHTML = "";
  
      games.forEach((game, index) => {
        //Create new `Game Wrapper` for each element
        let divGameWrapper = document.createElement("div");
        divGameWrapper.className = "game_wrapper";
        divGameWrapper.innerHTML = ` 
            <img
            src="${game.header_image}"/>  
            <div class="game_price">$ ${game.price}</div>
            `;
  
        allGamesList.appendChild(divGameWrapper);
      });
    };

  } catch (err) {
    console.log("err", err);
  }
};


//select genre option
function selectGenreOption () {
  
  let e = document.getElementById("select_genre_option");
  let value = e.value;
  let text = e.options[e.selectedIndex].text;

  selectGenre(text);

  //renderGames();
  
};

//select genre
function selectGenre (genreParam) {
  
  genreSelected = genreParam;
  renderGames();
  
};

//select genre option
function selectTagOption () {
  
  let e = document.getElementById("select_tag_option");
  let value = e.value;
  let text = e.options[e.selectedIndex].text;

  selectTag(text);

  //renderGames();
  
};

//select Tag
function selectTag (tagParam) {
  
  tagSelected = tagParam;
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
  let url = BASE_URL + `/genres?page=1&limit=100`;

  let genres = fetchData(url);

  return genres;
}

//get the tags list
async function getTags() {
  let url = BASE_URL + `/steamspy-tags?page=1&limit=100`;

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
    
    let selectGenresList = document.getElementById("select_genre_option");
   
    genres.forEach((genre, index) => {
      //create option for each genre 
      let option = document.createElement("option");
      option.value = option.text = `${genre.name}`;
      selectGenresList.add(option);
    });


    // Get tags list from the API
    tags = await getTags();
    // ' len is zero
    if (!tags.length) {
      console.log("No tags.");
      return;
    }

    let selectTagsList = document.getElementById("select_tag_option");
        
    tags.forEach((tag, index) => {
      //create option for each tag
      let option = document.createElement("option");
      option.value = option.text = `${tag.name}`;
      selectTagsList.add(option);
    });

    renderGames();

  } catch (err) {
    console.log("err", err);
  }
};

//document.getElementById("select_genre_option").addEventListener("onchange", selectGenreOption());


