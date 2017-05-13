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

let service = __webpack_require__(4);
let renderHeader = __webpack_require__(1);
let renderMain = __webpack_require__(2);

renderHeader.renderHeader();

let searchInput = document.body.querySelector(".search-input");
searchInput.onkeypress = function (e) {
        e = e || window.event;
        if (e.keyCode == 13) makeCustomQuery();
    }

let searchButton = document.body.querySelector(".search-button");
searchButton.addEventListener('click', makeCustomQuery);

function makeCustomQuery(){
    let query = searchInput.value;
    service.search(query, 15).then(function (response) {
        console.log(response);
        renderMain.renderMain(response);
    }).catch(function (error) {
        console.log(error);
    });
}



/***/ }),
/* 1 */
/***/ (function(module, exports) {

function renderHeader(){
    let bottomScript = document.body.querySelector("script");

    let header = document.createElement("header");
    document.body.insertBefore(header, bottomScript);

    let searchContainer = document.createElement("div");
    searchContainer.className = "search-container";
    header.appendChild(searchContainer);

    let searchInput = document.createElement("input");
    searchInput.placeholder = "search";
    searchInput.type = "search";
    searchInput.className = "search-input";
    searchInput.setAttribute("autofocus", "autofocus");
    searchContainer.appendChild(searchInput);

    let searchButton = document.createElement("button");
    searchButton.className = "search-button";
    searchContainer.appendChild(searchButton);

    let searchIcon = document.createElement("i");
    searchIcon.className = "fa fa-search";
    searchIcon.setAttribute("aria-hidden", "true");
    searchButton.appendChild(searchIcon);

    let main = document.createElement("main");
    document.body.insertBefore(main, bottomScript);
};

module.exports.renderHeader = renderHeader;


/***/ }),
/* 2 */
/***/ (function(module, exports) {

// преобразовать дату публикации
function renderMain(resp) {
    let items = resp.items;
    let tmpl;

    if(items.length === 0) {
        tmpl = '<p class="empty-result">Sorry, no items to your query :(</p>';
    }

    else {
        tmpl = '<div class="main-inner">\
                    <button class="arrow prev">⇦</button>\
                    <div class="gallery">\
                        <% for (let i=1; i<=items.length-1; i++) { %> \
                            <section id="">\
                                <div class="thumbnail">\
                                    <a href="http://www.youtube.com/watch?v=<%=items[i].id.videoId%>" class="link">\
                                        <img src="<%=items[i].snippet.thumbnails.medium.url%>" alt="" width="100%" height="auto">\
                                        <i class="fa fa-play-circle" aria-hidden="true"></i>\
                                    </a>\
                                </div>\
                                <div class="information">\
                                    <h2><a href="http://www.youtube.com/watch?v=<%=items[i].id.videoId%>" class="link title"><%=items[i].snippet.title%></a></h2>\
                                    <ul>\
                                        <li class="cannel"><a href=""><i class="fa fa-user" aria-hidden="true"></i><%=items[i].snippet.channelTitle%></a></li>\
                                        <li class="published-at"><i class="fa fa-calendar" aria-hidden="true"></i><%=items[i].snippet.publishedAt%></li>\
                                        <li class="views"><i class="fa fa-eye" aria-hidden="true"></i>no information</li>\
                                    </ul>\
                                    <p class="description"><%=items[i].snippet.description%></p>\
                                </div>\
                            </section> \
                        <% } %>\
				    </div>\
				    <button class="arrow next">⇨</button>\
				</div>';
    }

    let main = document.body.querySelector("main");
    main.innerHTML = _.template(tmpl)(resp);

// remove from here
    let width = 325;
    let count = 4; // количество изображений

    let carousel = document.querySelector('.main-inner');
    let gallery = carousel.querySelector('.gallery');
    let listElems = carousel.querySelectorAll('section');

    let position = 0; // текущий сдвиг влево

    carousel.querySelector('.prev').onclick = function() {
        position = position + width * count;
        gallery.style.marginLeft = position + 'px';
    };

    carousel.querySelector('.next').onclick = function() {
        position = position - width * count;
        gallery.style.marginLeft = position + 'px';
    };

// на мышку, отменить поведение брайзера -- выделение текста при mousemove
    document.body.addEventListener('mousedown', mousedown);
  //  document.body.addEventListener('mousemove', mousemove);
    document.body.addEventListener('mouseup', mouseup);

    drag = false;
    current_drag = 0;

    function mousedown(e) {
        drag = true;
        current_drag = e.x;
    };

    function mouseup(e){
        if (drag) {
            if (e.x - current_drag >= 150) {
                position = position + width * count;
                gallery.style.marginLeft = position + 'px';
            }
            else if (e.x - current_drag <= -150) {
                position = position - width * count;
                gallery.style.marginLeft = position + 'px';
            };
        }
        drag = false;

    }
// swipe
/*
    document.body.addEventListener('touchstart', mousedown);
    //document.body.addEventListener('touchmove', touchmove);
    document.body.addEventListener('touchend', mouseup);
*/
};
/*
function parsePublishedDate(dateString) {
    let date = new Date(Date.parse(dateString));
    return (date.getMonth() + 1) + "." + date.getDate() + "." + date.getFullYear();
}
*/
module.exports.renderMain = renderMain;


/***/ }),
/* 3 */
/***/ (function(module, exports) {

function httpGet(url) {
    return new Promise(function (resolve, reject) {
        let request = new XMLHttpRequest();
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
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

const apiKey ='AIzaSyBkPL9Z0loT04dU7mqqtaKbfJW_9ucqgok';

let searchUrl = 'https://www.googleapis.com/youtube/v3/search?key={key}&type=video&part=snippet&maxResults={maxResults}&q={keyword}'.replace('{key}', apiKey);
let videosUrl = 'https://www.googleapis.com/youtube/v3/videos?key={key}&id={id}&part=snippet,statistics'.replace('{key}', apiKey);

let xhr = __webpack_require__(3);

async function search(keyword, maxResults) {
    let url = searchUrl.replace('{keyword}', keyword).replace('{maxResults}', maxResults);
    let response = await xhr.httpGet(url);
    let videoList = parseSearchResponse(response);
    return videoList;
}

async function videoStatistics(ids) {
    let idStr = ids.join(); //id=nq4aU9gmZQk,REu2BcnlD34,qbPTdW7KgOg
    let url = videosUrl.replace('{id}', idStr);
    let response = await xhr.httpGet(url);
    let videoStatistics = parseVideoResponse(response); // пока это не осмыслено
    return videoStatistics;
}

function parseSearchResponse(searchResponse) {
    //console.log(JSON.parse(searchResponse));
    return JSON.parse(searchResponse);
}

function parseVideoResponse(videoResponse) {
    //console.log(JSON.parse(videoResponse));
    return JSON.parse(videoResponse);
}

module.exports.search = search;
module.exports.videoStatistics = videoStatistics;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(0);


/***/ })
/******/ ]);