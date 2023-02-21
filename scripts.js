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

//implementing scrolling
const sample1 = document.getElementById('sample_1');
const sample2 = document.getElementById('sample_2');
const loader = document.querySelector('.loader');

//COMMON FUNCTIONS
//fetch data from the URL
async function fetchData(url) {

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
    
    sample1.remove();
    sample2.remove();

    //calling loadGames to load games based on current page index
    loadGames(currentPage, limit);

  } catch (err) {
    console.log("err", err);
  }
};

// init() => loadGenres()
// load genres
const loadGenres = async () => {

  // 0.5 second later
  setTimeout(async () => {
      try {

        // call the API to get games
        const response = await getGenres();

        // show games
        showGenres(response.data);

      } catch (error) {
          console.log(error.message);
      } finally {

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

  // 0.5 second later
  setTimeout(async () => {
      try {

        // call the API to get games
        const response = await getTags();

        // show games
        showTags(response.data);

      } catch (error) {
          console.log(error.message);
      } finally {

        

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
// selectGenre () => loadGames(currentPage, limit)
// selectTag () => loadGames(currentPage, limit)
// selectSearch () => loadGames(currentPage, limit)
// load games based on current page index
const loadGames = async (page, limit) => {

  // show the loader
  showLoader();

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

          }
      } catch (error) {
          console.log(error.message);
      } finally {
          hideLoader();
      }
  }, 500);

};

// loadGames(page,limit) => hideLoader = ()
const hideLoader = () => {
  loader.classList.remove('show');
};

// loadGames(page,limit) => showLoader = ()
const showLoader = () => {
  loader.classList.add('show');
};

// loadGames(page,limit) => hasMoreGames(page, limit, total)
// check if there are still more games to be loaded
const hasMoreGames = (page, limit, total) => {
  const startIndex = (page - 1) * limit + 1;
  return total === 0 || startIndex < total;
};

window.addEventListener('scroll', () => {
  const {
      scrollTop,
      scrollHeight,
      clientHeight
  } = document.documentElement;

  if (scrollTop + clientHeight >= scrollHeight - 5 &&
      hasMoreGames(currentPage, limit, total)) {
      currentPage++;
      loadGames(currentPage, limit);
  }
}, {
  passive: true
});

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

  console.log(url + searchParam.toString());

  const response = await fetchData(url + searchParam.toString());

  return response;

}

let allGamesList = document.getElementById("games_list");

// loadGames(page,limit) => showGames(games)
// render the div for games
const showGames = (games) => {

  let viewURL =  window.location.href.toString();

  viewURL = viewURL.replace("index.html","view.html");

  console.log(loader);
  
  loader.remove();

  console.log(allGamesList);

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

  allGamesList.appendChild(loader);
  
};



//selectGenre () => loadGames(currentPage, limit)
function selectGenre () {
  
  let e = document.getElementById("select_genre");
  genreSelected = e.options[e.selectedIndex].text;

  allGamesList.innerHTML = '';

  currentPage = 1;
  total = 0;

  loadGames(currentPage, limit);

};

//selectTag () => loadGames(currentPage, limit)
function selectTag () {
  
  let e = document.getElementById("select_tag");
  tagSelected = e.options[e.selectedIndex].text;

  allGamesList.innerHTML = '';

  currentPage = 1;
  total = 0;

  loadGames(currentPage, limit);

};

//selectSearch () => loadGames(currentPage, limit)
function selectSearch () {

  let e = document.getElementById("search_query");
  search = e.value;

  allGamesList.innerHTML = '';

  currentPage = 1;
  total = 0;

  loadGames(currentPage, limit);

};


//OLD CODES

//view single game by app id
async function getSingleGame(appidParam) {

  let url = BASE_URL + `/single-game/` + appidParam;

  let response = await fetchData(url);

  return response;

}

//render games 
const viewSingleGame = async () => {
   
  game = [];

  let appid = getAppId("appid");

  try {
    // Search games from the API
    let response = await getSingleGame(appid);
    game = response.data;
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













