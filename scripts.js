//NEW CODES
//declare variables
const BASE_URL = `https://steam-api-dot-cs-platform-306304.et.r.appspot.com`;

//variables for select by genre
let genresList;
let genreSelected = "";

//variables for select by tag
let tagsList;
let tagSelected = "";

let search = "";

let gamesList;
let gameSelected;

let genres = [];
let tags = [];

let currentPage = 1;
const limit = 10;
let total = 0;

//COMMON FUNCTIONS
//fetch data from the URL
async function fetchData(url) {

  console.log("fetchData " + url);

  try {
    const response = await fetch(`${url}`);
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.log(error);
    return [];
  }

}

//PROCEDURAL FUNCTIONS
//initialize the page on first load
const init = async () => {

  try {

    //calling loadGenres to load genres
    loadGenres();

    //calling loadGenres to load tags
    loadTags();

    //calling loadGames to load games based on current page index
    loadGames(currentPage, limit);

  } catch (err) {
    console.log("err", err);
  }
};

// init() => loadGenres()
// load genres
const loadGenres = async () => {

  // show the loader
  //showLoader();

  // 0.5 second later
  setTimeout(async () => {
      try {

        console.log("loading Genres");

        // call the API to get games
        const response = await getGenres();

        // show games
        showGenres(response.data);

      } catch (error) {
          console.log(error.message);
      } finally {

        console.log("loaded Genres");

        //hideLoader();

      }
  }, 500);

};

// loadGenres(page,limit) => getGenres(page,limit)
// get genres 
const getGenres = async() => {

  let url = BASE_URL + `/genres/?`;
  
  const searchParam = new URLSearchParams(`?`);

  searchParam.append("page",1);

  searchParam.append("limit",1000);

  const response = await fetchData(url + searchParam.toString());

  return response;

}

let selectGenresList = document.getElementById("select_genre");

// loadGames(page,limit) => showGenres(games)
// render the select for genres
const showGenres = (genres) => {

  genres.forEach((genre, index) => {
    //create option for each genre 
    let option = document.createElement("option");
    option.value = option.text = `${genre.name}`;
    selectGenresList.add(option);
  });
  
};


// init() => loadTags()
// load tags
const loadTags = async () => {

  // show the loader
  //showLoader();

  // 0.5 second later
  setTimeout(async () => {
      try {

        console.log("loading Tags");

        // call the API to get games
        const response = await getTags();

        // show games
        showTags(response.data);

      } catch (error) {
          console.log(error.message);
      } finally {

        console.log("loaded Tags");

        //hideLoader();

      }
  }, 500);

};

// loadTags(page,limit) => getTags()
// get tags
const getTags = async() => {

  let url = BASE_URL + `/steamspy-tags/?`;
  
  const searchParam = new URLSearchParams(`?`);

  searchParam.append("page",1);

  searchParam.append("limit",1000);

  const response = await fetchData(url + searchParam.toString());

  return response;

}

let selectTagsList = document.getElementById("select_tag");

// loadTags(page,limit) => showTags(tags)
// render the select for tags
const showTags = (tags) => {

  tags.forEach((tag, index) => {
    //create option for each genre 
    let option = document.createElement("option");
    option.value = option.text = `${tag.name}`;
    selectTagsList.add(option);
  });
  
};

// init() => loadGames(currentPage, limit)
// load games based on current page index
const loadGames = async (page, limit) => {

  // show the loader
  //showLoader();

  console.log("show loader");

  // 0.5 second later
  setTimeout(async () => {
      try {
          // if having more quotes to fetch
          if (hasMoreGames(page, limit, total)) {

              // call the API to get games
              const response = await getGames(page, limit);

              // show games
              showGames(response.data);

              // update the total
              total = response.total;

              console.log(total);

          }
      } catch (error) {
          console.log(error.message);
      } finally {
          //hideLoader();
      }
  }, 500);

};

// loadGames(page,limit) => hasMoreGames(page, limit, total)
// check if there are still more games to be loaded
const hasMoreGames = (page, limit, total) => {
  const startIndex = (page - 1) * limit + 1;
  return total === 0 || startIndex < total;
};

// loadGames(page,limit) => getGames(page,limit)
// get games based on current page index, 
// genre
// tag
// keywords
const getGames = async(page,limit) => {

  let url = BASE_URL + `/games/?`;
  
  const searchParam = new URLSearchParams(`?`);

  if (search !== ""){
    searchParam.append("q",search);
  } 
  
  if (genreSelected !== ""){
    searchParam.append("genres",genreSelected);
  } 

  if (tagSelected !== ""){
    searchParam.append("steamspy_tags",tagSelected);
  }

  searchParam.append("page",page);

  searchParam.append("limit",limit);

  const response = await fetchData(url + searchParam.toString());

  return response;

}

let allGamesList = document.getElementById("games_list");

// loadGames(page,limit) => showGames(games)
// render the div for games
const showGames = (games) => {

  let viewURL =  window.location.href.toString();

  viewURL = viewURL.replace("index.html","view.html");

  games.forEach((game, index) => {
    //Create new `Game Wrapper` for each element
    let divGameWrapper = document.createElement("div");
    divGameWrapper.className = "game_wrapper";
    divGameWrapper.innerHTML = ` 
        <a href="${viewURL}?appid=${game.appid}" target="_blank"><img
        src="${game.header_image}"/></a>
        <div class="game_info">
          <div class="game_name">${game.name}</div>
          <div class="game_price">$ ${game.price}</div>
        </div>
        `;

    allGamesList.appendChild(divGameWrapper);
  });
  
};

//select genre
function selectGenre () {
  
  let e = document.getElementById("select_genre");
  genreSelected = e.options[e.selectedIndex].text;

  currentPage = 1;
  total = 0;

  loadGames(currentPage, limit);

};


//OLD CODES


//get the tags list
async function getAllTags() {
  
  let TAGS_URL = BASE_URL + `/steamspy-tags/?`;

  const searchParam = new URLSearchParams(`?`);

  let tags = [];

  let data = [];
  
  let pageIndex = 1;

  const dataLimit = 100;

  let dataLength = 101;

  while (dataLength > 99 ) {

    searchParam.append("page",pageIndex);

    searchParam.append("limit",dataLimit);

    data = await fetchData(TAGS_URL + searchParam.toString());

    dataLength = data.length;

    tags = tags.concat(data);

    pageIndex = pageIndex + 1;

    searchParam.delete("page");

    searchParam.delete("limit");

  }

  return tags;
}

//select tag
function selectTag () {
  
  let e = document.getElementById("select_tag");
  tagSelected = e.options[e.selectedIndex].text;

  renderGames();
  
};

//select search
function selectSearch () {

  let e = document.getElementById("search_query");
  search = e.value;

  renderGames();  

};

//search for games
async function searchGames() {

  let url = BASE_URL + `/games/?`;
  
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

  let games = [];

  let data = [];
  
  let pageIndex = 1;

  const dataLimit = 100;

  let dataLength = 101;

  while (pageIndex < 3) {

    searchParam.append("page",pageIndex);

    searchParam.append("limit",dataLimit);

    data = await fetchData(url + searchParam.toString());

    dataLength = data.length;

    games = games.concat(data);

    pageIndex = pageIndex + 1;

    searchParam.delete("page");

    searchParam.delete("limit");

  }

  console.log(games.length);

  return games;

}

//render games 
const renderGames = async () => {
   
  games = [];

  try {
    // Search games from the API
    games = await searchGames();

    let allGamesList = document.getElementById("games_list");

    // ' len is zero
    if (!games.length) {
      
      allGamesList.innerHTML = "No games";

      //return;

    } else {

      allGamesList.innerHTML = "";
  
      console.log("hostname " + window.location.hostname);
      console.log("pathname " + window.location.pathname);
      console.log("href " + window.location.href);

      let viewURL =  window.location.href.toString();

      viewURL = viewURL.replace("index.html","view.html");

      games.forEach((game, index) => {
        //Create new `Game Wrapper` for each element
        let divGameWrapper = document.createElement("div");
        divGameWrapper.className = "game_wrapper";
        divGameWrapper.innerHTML = ` 
            <a href="${viewURL}?appid=${game.appid}" target="_blank"><img
            src="${game.header_image}"/></a>
            <div class="game_info">
              <div class="game_name">${game.name}</div>
              <div class="game_price">$ ${game.price}</div>
            </div>
            `;
  
        allGamesList.appendChild(divGameWrapper);
      });
    };

  } catch (err) {
    console.log("err", err);
  }
};


//view single game by app id
async function viewSingleGame(appidParam) {

  let url = BASE_URL + `/single-game/` + appidParam;

  let game = await fetchData(url);

  return game;

}

//render games 
const renderSingleGame = async () => {
   
  game = [];

  let appid = getAppId("appid");

  try {
    // Search games from the API
    game = await viewSingleGame(appid);

    let singleGameList = document.getElementById("single_game");

    singleGameList.innerHTML = ``;
    
    //Create new `Game Wrapper` for each element
    let divGameWrapper = document.createElement("div");
    divGameWrapper.className = "single_game_wrapper";
    divGameWrapper.innerHTML = ` 
    <h1>${game.name}</h1>
    <h2>$ ${game.price}</h2>
    <img id="single_game_image" src="${game.header_image}"/>  
    <br>
    <div id="single_game_description">${game.description}</div>
    <br>
    Popular user-defined tags for this product:
    <div id="single_game_tags">${game.steamspy_tags}</div>
    `;

    singleGameList.appendChild(divGameWrapper);

    } catch (err) {
      console.log("err", err);
    }
};

function getAppId(q) {
  return (window.location.search.match(new RegExp('[?&]' + q + '=([^&]+)')) || [, null])[1];
}

function toggleLogo() {
  var x = document.getElementById("myTopnav");
  
  if (x.className === "top_menu_responsive on") {
    x.className = "top_menu_responsive off";
    console.log(x.className);
  } else {
    x.className = "top_menu_responsive on";
    console.log(x.className);
  }
}













