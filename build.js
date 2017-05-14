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

let swipe = __webpack_require__(5);// пока не востребовано
let service = __webpack_require__(1);
let addSection = __webpack_require__(3);
let updatedItemsNumber = addSection.updatedItemsNumber; // не востребовано

let nextPageToken;
let itemsNumber = 0;

// преобразовать дату публикации
function renderMain(resp) {
    nextPageToken = resp.nextPageToken;

    let items = resp.items;
    itemsNumber += items.length;

    let tmpl;

    if (items.length === 0) {
        tmpl = '<p class="empty-result">Sorry, no items to your query :(</p>';
    }

    else {
        tmpl = '<div class="main-inner">\
                    <div class="gallery">\
                        <% for (let i = 1; i < items.length; i++) { %> \
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
				</div>\
                <div class="paging">\
                    <span class="page prev"></span>\
                    <span class="page curr"></span>\
                    <span class="page next"></span>\
                </div>';
    }

    let main = document.body.querySelector("main");
    main.innerHTML = _.template(tmpl)(resp);
    /*
     // предполагаемое подключение, не работает
     let paging = document.querySelector('.paging');
     paging.querySelector('.prev').addEventListener('click', swipe.pagePrev);
     paging.querySelector('.next').addEventListener('click', swipe.pageNext);

     document.body.addEventListener('mousedown', swipe.mousedown);
     document.body.addEventListener('mousemove', swipe.mousemove);
     document.body.addEventListener('mouseup', swipe.mouseup);
     */
// pagination
    let paging = document.querySelector('.paging');
    paging.querySelector('.prev').addEventListener('click', pagePrev);
    paging.querySelector('.next').addEventListener('click', pageNext);

    document.body.addEventListener('mousedown', mousedown);
    document.body.addEventListener('mousemove', mousemove);
    document.body.addEventListener('mouseup', mouseup);

    let width = 350;
    let columns = 4; // количество изображений
    let position = 0; // текущий сдвиг влево
    let gallery = document.querySelector('.gallery');
    let currentPageNumber = 1;

    function pagePrev() {
        position = Math.min(position + width * columns, 0);
        gallery.style.marginLeft = position + 'px';
        if (currentPageNumber > 1) {
            currentPageNumber -= 1;
        }
    };

    let searchInput = document.body.querySelector(".search-input");
    let query = searchInput.value;

    function pageNext() {
        if(updatedItemsNumber) {
            itemsNumber = updatedItemsNumber;
        }

        if ((currentPageNumber + 1) * columns > itemsNumber) {// заменить items.length на queue.length
            service.downloadMore(nextPageToken, query).then(function (response) {
                console.log(response);
                addSection.addSection(response);
            }).catch(function (error) {
                console.log(error);
            });
        }
        position = position - width * columns;
        gallery.style.marginLeft = position + 'px';

        currentPageNumber += 1;
    };

// pagination with mouse
    let drag = false;
    let current_drag = 0;

    function mousedown(e) {
        drag = true;
        current_drag = e.x;
    };

    function mousemove(e) {
        e.preventDefault(); // несовершенно
    };

    function mouseup(e) {
        if (drag) {
            if (e.x - current_drag >= 150) {
                pagePrev();
            }
            else if (e.x - current_drag <= -150) {
                pageNext();
            }
            ;
        }
        drag = false;
    };

    return nextPageToken;
}

/*
function parsePublishedDate(dateString) {
    let date = new Date(Date.parse(dateString));
    return (date.getMonth() + 1) + "." + date.getDate() + "." + date.getFullYear();
};
*/

module.exports.renderMain = renderMain;
module.exports.nextPageToken = nextPageToken;
module.exports.itemsNumber = itemsNumber;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

let xhr = __webpack_require__(6);

const apiKey ='AIzaSyBkPL9Z0loT04dU7mqqtaKbfJW_9ucqgok';

let searchUrl = 'https://www.googleapis.com/youtube/v3/search?key={key}&type=video&part=snippet&maxResults={maxResults}&q={keyword}'.replace('{key}', apiKey);
let nextPageSearchUrl = 'https://www.googleapis.com/youtube/v3/search?key={key}&type=video&pageToken={pageToken}&part=snippet&maxResults={maxResults}&q={keyword}'.replace('{key}', apiKey);
let videosUrl = 'https://www.googleapis.com/youtube/v3/videos?key={key}&id={id}&part=snippet,statistics'.replace('{key}', apiKey);

let nextPageToken;
console.log(nextPageToken);


async function search(keyword, maxResults) {
    let url = searchUrl.replace('{keyword}', keyword).replace('{maxResults}', maxResults);
    let response = await xhr.httpGet(url);
    let videoList = parseResponse(response);
    nextPageToken = videoList.nextPageToken;
    console.log(nextPageToken);//
    return videoList;
}

async function videoStatistics(ids) {
    let idStr = ids.join(); //id=nq4aU9gmZQk,REu2BcnlD34,qbPTdW7KgOg
    let url = videosUrl.replace('{id}', idStr);
    let response = await xhr.httpGet(url);
    let videoStatistics = parseResponse(response); // пока это не осмыслено
    return videoStatistics;
}

// подгрузка с подставными значениями

async function downloadMore(pageToken, keyword, maxResults = 15) {
    let url = nextPageSearchUrl.replace('{keyword}', keyword).replace('{maxResults}', maxResults).replace('{pageToken}', pageToken);
    let response = await xhr.httpGet(url);
    let addVideoList = parseResponse(response);
    //nextPageToken = addVideoList.nextPageToken;
   // console.log(nextPageToken);
    console.log(addVideoList); //
    return addVideoList;
}

function parseResponse(searchResponse) {
    //console.log(JSON.parse(searchResponse));
    return JSON.parse(searchResponse);
}

module.exports.search = search;
module.exports.downloadMore = downloadMore;
module.exports.videoStatistics = videoStatistics;
module.exports.nextPageToken = nextPageToken;// не работает


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

let service = __webpack_require__(1);
let renderHeader = __webpack_require__(4);
let renderMain = __webpack_require__(0);

renderHeader.renderHeader();

let searchInput = document.body.querySelector(".search-input");
searchInput.onkeypress = function (e) {
        if (e.keyCode == 13) {
            makeCustomQuery();
        }
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
};


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

let renderMain = __webpack_require__(0);
let nextPageToken = renderMain.nextPageToken;
let itemsNumber = renderMain.itemsNumber;

let updatedItemsNumber; // бесполезная, не работает

function addSection(resp) {

    let items = resp.items;

    updatedItemsNumber = itemsNumber + items.length;
    let gallery = document.body.querySelector(".gallery");

    for (let i = 1; i < items.length; i++) {
        let item = resp.items[i];

        let tmpl = '<section id="">\
                    <div class="thumbnail">\
                        <a href="http://www.youtube.com/watch?v=<%=id.videoId%>" class="link">\
                            <img src="<%=snippet.thumbnails.medium.url%>" alt="" width="100%" height="auto">\
                            <i class="fa fa-play-circle" aria-hidden="true"></i>\
                        </a>\
                    </div>\
                    <div class="information">\
                        <h2><a href="http://www.youtube.com/watch?v=<%=id.videoId%>" class="link title"><%=snippet.title%></a></h2>\
                        <ul>\
                            <li class="cannel"><a href=""><i class="fa fa-user" aria-hidden="true"></i><%=snippet.channelTitle%></a></li>\
                            <li class="published-at"><i class="fa fa-calendar" aria-hidden="true"></i><%=snippet.publishedAt%></li>\
                            <li class="views"><i class="fa fa-eye" aria-hidden="true"></i>no information</li>\
                        </ul>\
                        <p class="description"><%=snippet.description%></p>\
                    </div>\
                </section>';

        let gallery = document.body.querySelector(".gallery");
        let newSection = document.createElement("section");
        newSection.innerHTML = _.template(tmpl)(item);
        gallery.appendChild(newSection);
    }
    nextPageToken = resp.nextPageToken;
    console.log(nextPageToken);
}

module.exports.updatedItemsNumber = updatedItemsNumber;
module.exports.nextPageToken = nextPageToken;
module.exports.addSection = addSection;


/***/ }),
/* 4 */
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
/* 5 */
/***/ (function(module, exports) {

let width = 350;
let columns = 4; // количество изображений
let position = 0; // текущий сдвиг влево

let gallery = document.querySelector('.gallery'); // null ?
let paging = document.querySelector('.paging'); // null ?

function pagePrev() {
    position = position + width * columns;
    gallery.style.marginLeft = position + 'px';
};

function pageNext() {
    position = position - width * columns;
    gallery.style.marginLeft = position + 'px';
};

let drag = false;
let current_drag = 0;

function mousedown(e) {
    drag = true;
    current_drag = e.x;
};

function mousemove(e) {
    e.preventDefault(); // несовершенно
};

function mouseup(e){
    if (drag) {
        if (e.x - current_drag >= 150) {
            pagePrev();
        }
        else if (e.x - current_drag <= -150) {
            pageNext();
        };
    }
    drag = false;
};
module.exports.pagePrev = pagePrev;
module.exports.pageNext = pageNext;

module.exports.mousedown = mousedown;
module.exports.mousemove = mousemove;
module.exports.mouseup = mouseup;



/***/ }),
/* 6 */
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
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(2);


/***/ })
/******/ ]);