const service = require('./youtubeService');
const renderMain = require('./renderMain');

function checkColumnsNumber() {
  const mainInner = document.querySelector('.main-inner');
  const mainInnerWidth = global.getComputedStyle(mainInner).width;

  switch (mainInnerWidth) {
    case '1400px':
      return 4;
    case '1030px':
      return 3;
    case '680px':
      return 2;
    default:
      return 1;
  }
}

function showPageNumber(e) {
  const target = e.target;

  if (!target.matches('.tooltip')) {
    const tooltip = target.querySelector('.tooltip');
    tooltip.style.visibility = 'visible';
  }
}

function pagination(nextPageToken, itemsNumber) {
  const pageItemsArr = [];
  document.querySelectorAll('.page').forEach(item => pageItemsArr.push(item));
  pageItemsArr.forEach(item => item.addEventListener('mousedown', showPageNumber));

  let itNum = itemsNumber;
  let nextPageNumber = Number(document.querySelector('.next  > .tooltip').innerHTML);
  let currentPageNumber = Number(document.querySelector('.curr  > .tooltip').innerHTML);

  const columns = checkColumnsNumber();
  const columnWidth = 350;

  let galleryMagrinLeft = 0;

  const gallery = document.body.querySelector('.gallery');


  const searchInput = document.body.querySelector('.search-input');
  const query = searchInput.value;

  function changePage(e) {
    if (e.target.matches('.next')) {
      currentPageNumber += 1;
      const oldCurr = document.querySelector('.curr');
      oldCurr.classList.remove('curr');
      oldCurr.classList.add('ord');
      oldCurr.querySelector('.tooltip').style.visibility = 'hidden';

      const oldNext = document.querySelector('.next');
      oldNext.classList.remove('next');
      oldNext.classList.add('curr');

      if ((nextPageNumber + 1) * columns > itNum) {
        service.downloadMore(nextPageToken, query).then((response) => {
          renderMain.addSection(response);
          itNum += response.items.length;
        }).catch((error) => {
          console.warn(error);
        });
      }

      galleryMagrinLeft -= columnWidth * columns;
      gallery.style.marginLeft = `${galleryMagrinLeft}px`;

      nextPageNumber += 1;

        // абсолютно ужасный код создания нового span-а

      const paging = document.body.querySelector('.paging');
      const newPageItem = document.createElement('span');
      newPageItem.className = 'page next';

      const tmpl = '<span class="tooltip"></span>';
      newPageItem.innerHTML = _.template(tmpl)();
      newPageItem.querySelector('.tooltip').innerHTML = nextPageNumber;
      paging.appendChild(newPageItem);
      pageItemsArr.push(newPageItem);
      newPageItem.addEventListener('mousedown', showPageNumber);
      newPageItem.addEventListener('click', changePage);
    } else {
      const newCurrIndex = pageItemsArr.indexOf(e.target);
      const oldCurrIndex = pageItemsArr.indexOf(document.querySelector('.curr'));
      const coefficient = newCurrIndex - oldCurrIndex;

      galleryMagrinLeft -= columnWidth * columns * coefficient;
      gallery.style.marginLeft = `${galleryMagrinLeft}px`;

      currentPageNumber += (1 * coefficient);

      const oldCurr = document.querySelector('.curr');
      oldCurr.classList.remove('curr');
      oldCurr.classList.add('ord');
      oldCurr.querySelector('.tooltip').style.visibility = 'hidden';

      const newCurr = e.target;
      newCurr.classList.remove('ord');
      newCurr.classList.add('curr');
      newCurr.querySelector('.tooltip').style.visibility = 'visible';
    }
  }

  function pagePrev() {
    galleryMagrinLeft = Math.min(galleryMagrinLeft + (columnWidth * columns), 0);
    gallery.style.marginLeft = `${galleryMagrinLeft}px`;

    if (currentPageNumber > 1) {
      const oldCurr = document.querySelector('.curr');
      oldCurr.classList.remove('curr');
      oldCurr.classList.add('ord');
      oldCurr.querySelector('.tooltip').style.visibility = 'hidden';

      const oldCurrIndex = pageItemsArr.indexOf(oldCurr);

      const newCurr = pageItemsArr[oldCurrIndex - 1];
      newCurr.classList.remove('ord');
      newCurr.classList.add('curr');
      newCurr.querySelector('.tooltip').style.visibility = 'visible';

      currentPageNumber -= 1;
    }
  }

  function pageNext() {
    currentPageNumber += 1;
    const oldCurr = document.querySelector('.curr');
    oldCurr.classList.remove('curr');
    oldCurr.classList.add('ord');
    oldCurr.querySelector('.tooltip').style.visibility = 'hidden';

    const oldCurrIndex = pageItemsArr.indexOf(oldCurr);

    if (oldCurrIndex === pageItemsArr.length - 2) {
      const oldNext = document.querySelector('.next');
      oldNext.classList.remove('next');
      oldNext.classList.add('curr');

      if ((nextPageNumber + 1) * columns > itNum) {
        service.downloadMore(nextPageToken, query).then((response) => {
          renderMain.addSection(response);
          itNum += response.items.length;
        }).catch((error) => {
          console.warn(error);
        });
      }

      galleryMagrinLeft -= columnWidth * columns;
      gallery.style.marginLeft = `${galleryMagrinLeft}px`;

      nextPageNumber += 1;

        // абсолютно ужасный код создания нового span-а

      const paging = document.body.querySelector('.paging');
      const newPageItem = document.createElement('span');
      newPageItem.className = 'page next';

      const tmpl = '<span class="tooltip"></span>';
      newPageItem.innerHTML = _.template(tmpl)();
      newPageItem.querySelector('.tooltip').innerHTML = nextPageNumber;
      paging.appendChild(newPageItem);
      pageItemsArr.push(newPageItem);
      newPageItem.addEventListener('mousedown', showPageNumber);
      newPageItem.addEventListener('click', changePage);
    } else {
      const newCurr = pageItemsArr[oldCurrIndex + 1];
      newCurr.classList.remove('ord');
      newCurr.classList.add('curr');
      newCurr.querySelector('.tooltip').style.visibility = 'visible';

      galleryMagrinLeft -= columnWidth * columns;
      gallery.style.marginLeft = `${galleryMagrinLeft}px`;
    }
  }

  pageItemsArr.forEach(item => item.addEventListener('click', changePage));
// pagination with mousemove

  let drag = false;
  let currentDrag = 0;

  function mousedown(e) {
    drag = true;
    currentDrag = e.x;
  }

  function mousemove(e) {
    e.preventDefault();
  }

  function mouseup(e) {
    if (drag) {
      if (e.x - currentDrag >= 150) {
        pagePrev();
      } else if (e.x - currentDrag <= -150) {
        pageNext();
      }
    }
    drag = false;
  }

  const mainInner = document.querySelector('.main-inner');
  mainInner.addEventListener('mousedown', mousedown);
  mainInner.addEventListener('mousemove', mousemove);
  mainInner.addEventListener('mouseup', mouseup);

    // swipe

  let xDown = null;
  let yDown = null;

  function handleTouchStart(e) {
    xDown = e.touches[0].clientX;
    yDown = e.touches[0].clientY;
  }

  function handleTouchMove(e) {
    if (!xDown || !yDown) {
      return;
    }

    const xUp = e.touches[0].clientX;
    const yUp = e.touches[0].clientY;

    const xDiff = xDown - xUp;
    const yDiff = yDown - yUp;
    if (Math.abs(xDiff) + Math.abs(yDiff) > 150) {
      if (Math.abs(xDiff) > Math.abs(yDiff)) {
        if (xDiff > 0) {
          pageNext();
        } else {
          pagePrev();
        }
      }
      xDown = null;
      yDown = null;
    }
  }

  mainInner.addEventListener('touchstart', handleTouchStart, false);
  mainInner.addEventListener('touchmove', handleTouchMove, false);
}

module.exports.pagination = pagination;

