let service = require('./youtubeService');
let renderHeader = require('./renderHeader');
//let renderMain = require('./renderMain');
let renderMainGrid = require('./renderMainGrid');

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
        renderMainGrid.renderMainGrid(response);
    }).catch(function (error) {
        console.log(error);
    });
};
