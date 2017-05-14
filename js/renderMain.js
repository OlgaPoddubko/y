let swipe = require('./swipe');// пока не востребовано
let service = require('./youtubeService');
let addSection = require('./addSection');
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
