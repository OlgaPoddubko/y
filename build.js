/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const xhr = __webpack_require__(4);

const apiKey = 'AIzaSyBkPL9Z0loT04dU7mqqtaKbfJW_9ucqgok';

const searchUrl = 'https://www.googleapis.com/youtube/v3/search?key={key}&type=video&part=snippet&maxResults={maxResults}&q={keyword}'.replace('{key}', apiKey);
const nextPageSearchUrl = 'https://www.googleapis.com/youtube/v3/search?key={key}&type=video&pageToken={pageToken}&part=snippet&maxResults={maxResults}&q={keyword}'.replace('{key}', apiKey);
const videosUrl = 'https://www.googleapis.com/youtube/v3/videos?key={key}&id={id}&part=snippet,statistics'.replace('{key}', apiKey);

async function search(keyword, maxResults) {
  const url = searchUrl.replace('{keyword}', keyword).replace('{maxResults}', maxResults);
  const response = await xhr.httpGet(url);
  const videoList = parseResponse(response);
  return videoList;
}

async function videoStatistics(ids) {
    // let idStr = ids.join();
  const url = videosUrl.replace('{id}', ids);
  const response = await xhr.httpGet(url);
  const videoStatistics = parseResponse(response);
  return videoStatistics;
}

async function downloadMore(pageToken, keyword, maxResults = 15) {
  const url = nextPageSearchUrl.replace('{keyword}', keyword).replace('{maxResults}', maxResults).replace('{pageToken}', pageToken);
  const response = await xhr.httpGet(url);
  const addVideoList = parseResponse(response);
  return addVideoList;
}

function parseResponse(searchResponse) {
  return JSON.parse(searchResponse);
}

module.exports.search = search;
module.exports.downloadMore = downloadMore;
module.exports.videoStatistics = videoStatistics;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

const service = __webpack_require__(0);
const renderHeader = __webpack_require__(2);
// let renderMain = require('./renderMain');
const renderMainGrid = __webpack_require__(3);

renderHeader.renderHeader();
renderHeader.setSearchAction(makeCustomQuery);

function makeCustomQuery(query) {
  // const query = searchInput.value;
  service.search(query, 15).then((response) => {
    console.log(response);
    renderMainGrid.renderMainGrid(response);
  }).catch((error) => {
    console.log(error);
  });
}


/***/ }),
/* 2 */
/***/ (function(module, exports) {

let searchInput,
  searchButton;

function renderHeader() {
  const bottomScript = document.body.querySelector('script');

  const header = document.createElement('header');
  document.body.insertBefore(header, bottomScript);

  const searchContainer = document.createElement('div');
  searchContainer.className = 'search-container';
  header.appendChild(searchContainer);

  searchInput = document.createElement('input');
  searchInput.placeholder = 'search';
  searchInput.type = 'search';
  searchInput.className = 'search-input';
  searchInput.setAttribute('autofocus', 'autofocus');
  searchContainer.appendChild(searchInput);

  searchButton = document.createElement('button');
  searchButton.className = 'search-button';
  searchContainer.appendChild(searchButton);

  const searchIcon = document.createElement('i');
  searchIcon.className = 'fa fa-search';
  searchIcon.setAttribute('aria-hidden', 'true');
  searchButton.appendChild(searchIcon);

  const main = document.createElement('main');
  document.body.insertBefore(main, bottomScript);
}
function setSearchAction(searchFunc) {
  searchInput.onkeypress = function (e) {
    if (e.keyCode == 13) {
      searchFunc(searchInput.value);
    }
  };
  searchButton.addEventListener('click', () => {
    searchFunc(searchInput.value);
  });
}

module.exports.setSearchAction = setSearchAction;
module.exports.renderHeader = renderHeader;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

const service = __webpack_require__(0);

let nextPageToken;
let itemsNumber = 0;

function addSection(resp) {
  const items = resp.items;
  itemsNumber += items.length;

  for (let i = 1; i < items.length; i++) {
    const item = resp.items[i];

    const date = new Date(Date.parse(item.snippet.publishedAt));
    let day = date.getDate();
    if (day < 10) {
      day = `0${day}`;
    }
    let month = date.getMonth() + 1;
    if (month < 10) {
      month = `0${month}`;
    }

    const publishDate = (`${day}.${month}.${date.getFullYear()}`);

    const videoId = item.id.videoId;
    service.videoStatistics(videoId).then((response) => {
      const views = response.items[0].statistics.viewCount;
      fillSection(item, publishDate, views);
    }).catch((error) => {
      console.log(error);
    });
  }
  nextPageToken = resp.nextPageToken;
}

function fillSection(item, publishDate, views) {
  const tmpl = '<div class="thumbnail">\
                        <a href="http://www.youtube.com/watch?v=<%=id.videoId%>" class="link">\
                            <img src="<%=snippet.thumbnails.medium.url%>" alt="" width="100%" height="auto">\
                            <i class="fa fa-play-circle" aria-hidden="true"></i>\
                        </a>\
                    </div>\
                    <div class="information">\
                        <h2><a href="http://www.youtube.com/watch?v=<%=id.videoId%>" class="link title"><%=snippet.title%></a></h2>\
                        <ul>\
                            <li class="cannel"><i class="fa fa-user" aria-hidden="true"></i><%=snippet.channelTitle%></li>\
                            <li class="published-at"><i class="fa fa-calendar" aria-hidden="true"></i></li>\
                            <li class="views"><i class="fa fa-eye" aria-hidden="true"></i></li>\
                        </ul>\
                        <p class="description"><%=snippet.description%></p>\
                    </div>';

  const gallery = document.body.querySelector('.gallery');
  const newSection = document.createElement('section');
  newSection.innerHTML = _.template(tmpl)(item);

  newSection.querySelector('.published-at').insertAdjacentText('beforeEnd', publishDate);
  newSection.querySelector('.views').insertAdjacentText('beforeEnd', views);
  gallery.appendChild(newSection);
}

function renderMainGrid(resp) {
  let tmpl;
  const items = resp.items;

  if (items.length === 0) {
    tmpl = '<p class="empty-result">Sorry, no items to your query :(</p>';
  } else {
    tmpl = '<div class="main-inner">\
                    <div class="gallery">\
				    </div>\
				</div>\
                <div class="paging">\
                    <span class="page prev"></span>\
                    <span class="page curr"></span>\
                    <span class="page next"></span>\
                </div>';
  }

  const main = document.body.querySelector('main');
  main.innerHTML = _.template(tmpl)();

  addSection(resp);

// pagination
  const paging = document.querySelector('.paging');
  paging.querySelector('.prev').addEventListener('click', pagePrev);
  paging.querySelector('.next').addEventListener('click', pageNext);

  document.body.addEventListener('mousedown', mousedown);
  document.body.addEventListener('mousemove', mousemove);
  document.body.addEventListener('mouseup', mouseup);

  const width = 350;
  const columns = 4;
  let position = 0;
  const gallery = document.querySelector('.gallery');
  let currentPageNumber = 1;

  function pagePrev() {
    position = Math.min(position + width * columns, 0);
    gallery.style.marginLeft = `${position}px`;
    if (currentPageNumber > 1) {
      currentPageNumber -= 1;
    }
  }

  const searchInput = document.body.querySelector('.search-input');
  const query = searchInput.value;

  function pageNext() {
    if ((currentPageNumber + 1) * columns > itemsNumber) {
      service.downloadMore(nextPageToken, query).then((response) => {
        addSection(response);
      }).catch((error) => {
        console.log(error);
      });
    }
    position -= width * columns;
    gallery.style.marginLeft = `${position}px`;

    currentPageNumber += 1;
  }

// pagination with mouse
  let drag = false;
  let current_drag = 0;

  function mousedown(e) {
    drag = true;
    current_drag = e.x;
  }

  function mousemove(e) {
    e.preventDefault(); // несовершенно
  }

  function mouseup(e) {
    if (drag) {
      if (e.x - current_drag >= 150) {
        pagePrev();
      } else if (e.x - current_drag <= -150) {
        pageNext();
      }
    }
    drag = false;
  }
}

module.exports.renderMainGrid = renderMainGrid;



/***/ }),
/* 4 */
/***/ (function(module, exports) {

function httpGet(url) {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open('GET', url);

    request.onload = function () {
      if (request.status == 200) {
        resolve(request.response);
      } else {
        reject(Error(request.statusText));
      }
    };

    request.onerror = function () {
      reject(Error('Network Error'));
    };

    request.send();
  });
}

module.exports.httpGet = httpGet;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(1);


/***/ })
/******/ ]);