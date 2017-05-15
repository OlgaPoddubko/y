let searchInput,
  searchButton;

function renderHeader() {
  const bottomScript = document.body.querySelector('script');

  const header = document.createElement('header');
  document.body.insertBefore(header, bottomScript);

  const searchContainer = document.createElement('div');
  searchContainer.className = 'search-container';
  header.appendChild(searchContainer);

  searchInput = document.createElement('input');
  searchInput.placeholder = 'search';
  searchInput.type = 'search';
  searchInput.className = 'search-input';
  searchInput.setAttribute('autofocus', 'autofocus');
  searchContainer.appendChild(searchInput);

  searchButton = document.createElement('button');
  searchButton.className = 'search-button';
  searchContainer.appendChild(searchButton);

  const searchIcon = document.createElement('i');
  searchIcon.className = 'fa fa-search';
  searchIcon.setAttribute('aria-hidden', 'true');
  searchButton.appendChild(searchIcon);

  const main = document.createElement('main');
  document.body.insertBefore(main, bottomScript);
}
function setSearchAction(searchFunc) {
  searchInput.onkeypress = function (e) {
    if (e.keyCode == 13) {
      searchFunc(searchInput.value);
    }
  };
  searchButton.addEventListener('click', () => {
    searchFunc(searchInput.value);
  });
}

module.exports.setSearchAction = setSearchAction;
module.exports.renderHeader = renderHeader;
