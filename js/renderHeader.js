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
