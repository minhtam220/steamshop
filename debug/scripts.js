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

//implementing scrolling
const quotesEl = document.querySelector('.result');
const loader = document.querySelector('.loader');

//search for games
const getGames = async(page,limit) => {

  let url = BASE_URL + `/games/?`;
  
  const searchParam = new URLSearchParams(`?`);

  /*
  console.log("search = "+ search);
  console.log("genre = " + genreSelected);
  console.log("tag = " + tagSelected);
  console.log("searchParam" + searchParam);
  */

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

// show the games
const showGames = (games) => {

  let allGamesList = document.getElementById("games_list");

  // ' len is zero
  if (!games.length) {
    
    allGamesList.innerHTML = "No games";

    //return;

  } else {

    allGamesList.innerHTML = "";

    /*
    console.log("hostname " + window.location.hostname);
    console.log("pathname " + window.location.pathname);
    console.log("href " + window.location.href);
    */

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

};

const hideLoader = () => {
  loader.classList.remove('show');
};

const showLoader = () => {
  loader.classList.add('show');
};

let currentPage = 1;
const limit = 9;
let total = 0;

const hasMoreGames = (page, limit, total) => {
  const startIndex = (page - 1) * limit + 1;
  return total === 0 || startIndex < total;
};

// load quotes
const loadGames = async (page, limit) => {

  // show the loader
  showLoader();

  console.log("show loader");

  // 0.5 second later
  setTimeout(async () => {
      try {
          // if having more quotes to fetch
          if (hasMoreGames(page, limit, total)) {

              // call the API to get games
              const response = await getGames(page, limit);

              // show quotes
              showGames(response.data);

              // update the total
              total = response.total;

              console.log(total);

          }
      } catch (error) {
          console.log(error.message);
      } finally {
          hideLoader();
      }
  }, 500);

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

loadGames(currentPage, limit);











