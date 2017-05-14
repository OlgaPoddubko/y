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

