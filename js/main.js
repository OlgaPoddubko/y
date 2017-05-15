const service = require('./youtubeService');
const renderHeader = require('./renderHeader');
// let renderMain = require('./renderMain');
const renderMainGrid = require('./renderMainGrid');

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
