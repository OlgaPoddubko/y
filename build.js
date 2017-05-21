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
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const xhr = __webpack_require__(5);

const apiKey = 'AIzaSyBkPL9Z0loT04dU7mqqtaKbfJW_9ucqgok';

const searchUrl = 'https://www.googleapis.com/youtube/v3/search?key={key}&type=video&part=snippet&maxResults={maxResults}&q={keyword}'.replace('{key}', apiKey);
const nextPageSearchUrl = 'https://www.googleapis.com/youtube/v3/search?key={key}&type=video&pageToken={pageToken}&part=snippet&maxResults={maxResults}&q={keyword}'.replace('{key}', apiKey);
const videosUrl = 'https://www.googleapis.com/youtube/v3/videos?key={key}&id={id}&part=snippet,statistics'.replace('{key}', apiKey);

async function search(keyword, maxResults) {
  const url = searchUrl.replace('{keyword}', keyword).replace('{maxResults}', maxResults);
  const response = await xhr.httpGet(url);
  const videoList = JSON.parse(response);
  return videoList;
}

async function videoStatistics(ids) {
  const url = videosUrl.replace('{id}', ids);
  const response = await xhr.httpGet(url);
  const videoStat = JSON.parse(response);
  return videoStat;
}

async function downloadMore(pageToken, keyword, maxResults = 15) {
  const url = nextPageSearchUrl.replace('{keyword}', keyword).replace('{maxResults}', maxResults).replace('{pageToken}', pageToken);
  const response = await xhr.httpGet(url);
  const addVideoList = JSON.parse(response);
  return addVideoList;
}

module.exports = { search, downloadMore, videoStatistics };


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

const service = __webpack_require__(0);
const pagination = __webpack_require__(3);

let nextPageToken;
let itemsNumber = 0;

function fillSection(item, publishDate, views) {
  const tmpl = '<div class="thumbnail">' +
        '<a href="http://www.youtube.com/watch?v=<%=id.videoId%>" class="link">' +
        '<img src="<%=snippet.thumbnails.medium.url%>" alt="" width="100%" height="auto">' +
        '<i class="fa fa-play-circle" aria-hidden="true"></i>' +
        '</a>' +
        '</div>' +
        '<div class="information">' +
        '<h2><a href="http://www.youtube.com/watch?v=<%=id.videoId%>" class="link title"><%=snippet.title%></a></h2>' +
        '<ul>' +
        '<li class="cannel"><i class="fa fa-user" aria-hidden="true"></i><%=snippet.channelTitle%></li>' +
        '<li class="published-at"><i class="fa fa-calendar" aria-hidden="true"></i></li>' +
        '<li class="views"><i class="fa fa-eye" aria-hidden="true"></i></li>' +
        '</ul>' +
        '<p class="description"><%=snippet.description%></p>' +
        '</div>';

  const gallery = document.body.querySelector('.gallery');
  const newSection = document.createElement('section');
  newSection.innerHTML = _.template(tmpl)(item);

  newSection.querySelector('.published-at').insertAdjacentText('beforeEnd', publishDate);
  newSection.querySelector('.views').insertAdjacentText('beforeEnd', views);
  gallery.appendChild(newSection);
}

function addSection(resp) {
  const items = resp.items;
  itemsNumber += items.length;

  for (let i = 1; i < items.length; i += 1) {
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
      console.warn(error);
    });
  }
  nextPageToken = resp.nextPageToken;
}


function renderMain(resp) {
  let tmpl;
  const items = resp.items;

  if (items.length === 0) {
    tmpl = '<p class="empty-result">Sorry, no items to your query :(</p>';
  } else {
    tmpl = '<div class="main-inner">' +
            '<div class="gallery">' +
            '</div>' +
            '</div>' +
            '<div class="paging">' +
            '<span class="page prev-three"><span class="tooltip"></span></span>' +
            '<span class="page prev-two"><span class="tooltip"></span></span>' +
            '<span class="page prev-one"><span class="tooltip"></span></span>' +
            '<span class="page curr"><span class="tooltip"></span></span>' +
            '<span class="page next"><span class="tooltip"></span></span>' +
            '</div>';
  }

  const main = document.body.querySelector('main');
  main.innerHTML = _.template(tmpl)();

  addSection(resp);
  pagination.pagination(nextPageToken, itemsNumber);
}

module.exports.renderMain = renderMain;
module.exports.addSection = addSection;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

const service = __webpack_require__(0);
const renderHeader = __webpack_require__(4);
const renderMain = __webpack_require__(1);

renderHeader.renderHeader();

function makeCustomQuery(query) {
  service.search(query, 15).then((response) => {
    renderMain.renderMain(response);
  }).catch((error) => {
    console.warn(error);
  });
}

renderHeader.setSearchAction(makeCustomQuery);


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {const service = __webpack_require__(0);
const renderMain = __webpack_require__(1);

function checkPageItemsNumber(currentPageNumber) {
  const prevOne = document.querySelector('.prev-one');
  const prevTwo = document.querySelector('.prev-two');
  const prevThree = document.querySelector('.prev-three');

  if (currentPageNumber === 1) {
    prevOne.style.display = 'none';
    prevTwo.style.display = 'none';
    prevThree.style.display = 'none';
  }

  if (currentPageNumber === 2) {
    prevOne.style.display = 'inline-block';
    prevTwo.style.display = 'none';
    prevThree.style.display = 'none';
  }
  if (currentPageNumber === 3) {
    prevOne.style.display = 'inline-block';
    prevTwo.style.display = 'inline-block';
    prevThree.style.display = 'none';
  }

  if (currentPageNumber >= 4) {
    prevOne.style.display = 'inline-block';
    prevTwo.style.display = 'inline-block';
    prevThree.style.display = 'inline-block';
  }
}

function checkColumnsNumber() {
  const mainInner = document.querySelector('.main-inner');
  const mainInnerWidth = global.getComputedStyle(mainInner).width;

  switch (mainInnerWidth) {
    case '1400px':
      return 4;
    case '1030px':
      return 3;
    case '680px':
      return 2;
    default:
      return 1;
  }
}

function hidePageNumber(e) {
  const target = e.target;
  target.style.visibility = 'hidden';

  target.removeEventListener('mouseup', hidePageNumber);
}

function showPageNumber(e) {
  const target = e.target;

  if (!target.matches('.tooltip')) {
    const tooltip = target.querySelector('.tooltip');
    tooltip.style.visibility = 'visible';
    target.addEventListener('mouseup', hidePageNumber);
  }
}

function pagination(nextPageToken, itemsNumber) {
  let currentPageNumber = 1;
  checkPageItemsNumber(currentPageNumber);

  const columns = checkColumnsNumber();
  const columnWidth = 350;

  let galleryMagrinLeft = 0;

  const pageItems = document.querySelectorAll('.page');
  pageItems.forEach(item => item.addEventListener('mousedown', showPageNumber));

  const currTt = document.querySelector('.curr  > .tooltip');
  const nextTt = document.querySelector('.next  > .tooltip');
  const prevOneTt = document.querySelector('.prev-one > .tooltip');
  const prevTwoTt = document.querySelector('.prev-two  > .tooltip');
  const prevThreeTt = document.querySelector('.prev-three  > .tooltip');
  currTt.innerHTML = currentPageNumber;

  const gallery = document.body.querySelector('.gallery');

  function pagePrev() {
    galleryMagrinLeft = Math.min(galleryMagrinLeft + (columnWidth * columns), 0);
    gallery.style.marginLeft = `${galleryMagrinLeft}px`;
    if (currentPageNumber > 1) {
      currentPageNumber -= 1;

      currTt.innerHTML = currentPageNumber;
      nextTt.innerHTML = currentPageNumber + 1;
      prevOneTt.innerHTML = currentPageNumber - 1;
      prevTwoTt.innerHTML = currentPageNumber - 2;
      prevThreeTt.innerHTML = currentPageNumber - 3;

      checkPageItemsNumber(currentPageNumber);
    }
  }

  const searchInput = document.body.querySelector('.search-input');
  const query = searchInput.value;

  function pageNext() {
    if ((currentPageNumber + 2) * columns > itemsNumber) {
      service.downloadMore(nextPageToken, query).then((response) => {
        renderMain.addSection(response);
      }).catch((error) => {
        console.warn(error);
      });
    }

    galleryMagrinLeft -= columnWidth * columns;
    gallery.style.marginLeft = `${galleryMagrinLeft}px`;

    currentPageNumber += 1;

    currTt.innerHTML = currentPageNumber;
    nextTt.innerHTML = currentPageNumber + 1;
    prevOneTt.innerHTML = currentPageNumber - 1;
    prevTwoTt.innerHTML = currentPageNumber - 2;
    prevThreeTt.innerHTML = currentPageNumber - 3;

    checkPageItemsNumber(currentPageNumber);
  }

  function changePage(e) {
    let coefficient;

    if (e.target.matches('.next')) {
      coefficient = 1;
    } else if (e.target.matches('.tooltip')) {
      coefficient = 0;
    } else if (e.target.matches('.prev-one')) {
      coefficient = -1;
    } else if (e.target.matches('.prev-two')) {
      coefficient = -2;
    } else if (e.target.matches('.prev-three')) {
      coefficient = -3;
    }

    if ((currentPageNumber + 2) * columns * coefficient > itemsNumber) {
      service.downloadMore(nextPageToken, query).then((response) => {
        renderMain.addSection(response);
      }).catch((error) => {
        console.warn(error);
      });
    }

    galleryMagrinLeft -= columnWidth * columns * coefficient;
    gallery.style.marginLeft = `${galleryMagrinLeft}px`;

    currentPageNumber += (1 * coefficient);

    currTt.innerHTML = currentPageNumber;
    nextTt.innerHTML = currentPageNumber + 1;
    prevOneTt.innerHTML = currentPageNumber - 1;
    prevTwoTt.innerHTML = currentPageNumber - 2;
    prevThreeTt.innerHTML = currentPageNumber - 3;

    checkPageItemsNumber(currentPageNumber);
  }

  pageItems.forEach(item => item.addEventListener('click', changePage));

// pagination with mousemove

  let drag = false;
  let currentDrag = 0;

  function mousedown(e) {
    drag = true;
    currentDrag = e.x;
  }

  function mousemove(e) {
    e.preventDefault();
  }

  function mouseup(e) {
    if (drag) {
      if (e.x - currentDrag >= 150) {
        pagePrev();
      } else if (e.x - currentDrag <= -150) {
        pageNext();
      }
    }
    drag = false;
  }

  const mainInner = document.querySelector('.main-inner');
  mainInner.addEventListener('mousedown', mousedown);
  mainInner.addEventListener('mousemove', mousemove);
  mainInner.addEventListener('mouseup', mouseup);

  // swipe

  let xDown = null;
  let yDown = null;

  function handleTouchStart(e) {
    xDown = e.touches[0].clientX;
    yDown = e.touches[0].clientY;
  }

  function handleTouchMove(e) {
    if (!xDown || !yDown) {
      return;
    }

    const xUp = e.touches[0].clientX;
    const yUp = e.touches[0].clientY;

    const xDiff = xDown - xUp;
    const yDiff = yDown - yUp;
    if (Math.abs(xDiff) + Math.abs(yDiff) > 150) {
      if (Math.abs(xDiff) > Math.abs(yDiff)) {
        if (xDiff > 0) {
          pageNext();
        } else {
          pagePrev();
        }
      }
      xDown = null;
      yDown = null;
    }
  }

  mainInner.addEventListener('touchstart', handleTouchStart, false);
  mainInner.addEventListener('touchmove', handleTouchMove, false);
}

module.exports.pagination = pagination;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)))

/***/ }),
/* 4 */
/***/ (function(module, exports) {

let searchInput;
let searchButton;

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
  searchInput.addEventListener('keypress', (e) => {
    if (e.keyCode === 13) {
      searchFunc(searchInput.value);
    }
  });
  searchButton.addEventListener('click', () => {
    searchFunc(searchInput.value);
  });
}

module.exports = { setSearchAction, renderHeader };


/***/ }),
/* 5 */
/***/ (function(module, exports) {

function httpGet(url) {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open('GET', url);

    request.onload = () => {
      if (request.status === 200) {
        resolve(request.response);
      } else {
        reject(Error(request.statusText));
      }
    };

    request.onerror = () => {
      reject(Error('Network Error'));
    };

    request.send();
  });
}

module.exports.httpGet = httpGet;


/***/ }),
/* 6 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(2);


/***/ })
/******/ ]);