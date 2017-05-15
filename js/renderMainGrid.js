let service = require('./youtubeService');

let nextPageToken;
let itemsNumber = 0;

function addSection(resp) {
    let items = resp.items;
    itemsNumber += items.length;

    for (let i = 1; i < items.length; i++) {
        let item = resp.items[i];

        let date = new Date(Date.parse(item.snippet.publishedAt));
        let publishDate = ((date.getMonth() + 1) + "." + date.getDate() + "." + date.getFullYear());

        let videoId = item.id.videoId;
        service.videoStatistics(videoId).then(function (response) {
            let views = response.items[0].statistics.viewCount;
            fillSection(item, publishDate, views);

        }).catch(function (error) {
            console.log(error);
        });
    }
    nextPageToken = resp.nextPageToken;
}

function fillSection(item, publishDate, views) {
    let tmpl = '<div class="thumbnail">\
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

    let gallery = document.body.querySelector(".gallery");
    let newSection = document.createElement("section");
    newSection.innerHTML = _.template(tmpl)(item);

    newSection.querySelector('.published-at').insertAdjacentText('beforeEnd', publishDate);
    newSection.querySelector('.views').insertAdjacentText('beforeEnd', views);
    gallery.appendChild(newSection);
}

function renderMainGrid(resp) {
    let tmpl;
    let items = resp.items;

    if (items.length === 0) {
        tmpl = '<p class="empty-result">Sorry, no items to your query :(</p>';
    }

    else {
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

    let main = document.body.querySelector("main");
    main.innerHTML = _.template(tmpl)();

    addSection(resp);

// pagination
    let paging = document.querySelector('.paging');
    paging.querySelector('.prev').addEventListener('click', pagePrev);
    paging.querySelector('.next').addEventListener('click', pageNext);

    document.body.addEventListener('mousedown', mousedown);
    document.body.addEventListener('mousemove', mousemove);
    document.body.addEventListener('mouseup', mouseup);

    let width = 350;
    let columns = 4;
    let position = 0;
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
        if ((currentPageNumber + 1) * columns > itemsNumber) {
            service.downloadMore(nextPageToken, query).then(function (response) {
                addSection(response);
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
            };
        }
        drag = false;
    };
}

module.exports.renderMainGrid = renderMainGrid;
//module.exports.getNextPageToken = getNextPageToken;//-
//module.exports.itemsNumber = itemsNumber;//-
