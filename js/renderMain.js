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
    let width = 350;
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
    document.body.addEventListener('mousemove', mousemove);
    document.body.addEventListener('mouseup', mouseup);

    drag = false;
    current_drag = 0;

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
                position = position + width * count;
                gallery.style.marginLeft = position + 'px';
            }
            else if (e.x - current_drag <= -150) {
                position = position - width * count;
                gallery.style.marginLeft = position + 'px';
            };
        }
        drag = false;

    };
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
