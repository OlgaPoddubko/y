let renderMain = require('./renderMain');
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
