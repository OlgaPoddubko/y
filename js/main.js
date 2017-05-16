const service = require('./youtubeService');
const renderHeader = require('./renderHeader');
const renderMain = require('./renderMain');

renderHeader.renderHeader();

function makeCustomQuery(query) {
  service.search(query, 15).then((response) => {
    renderMain.renderMain(response);
  }).catch((error) => {
    console.warn(error);
  });
}

renderHeader.setSearchAction(makeCustomQuery);
