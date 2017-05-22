const service = require('./youtubeService');
const renderMain = require('./renderMain');

function checkPageItemsNumber(currentPageNumber) {
  const prevOne = document.querySelector('.prev-one');
  const prevTwo = document.querySelector('.prev-two');
  const prevThree = document.querySelector('.prev-three');

  if (currentPageNumber === 1) {
    prevOne.style.display = 'none';
    prevTwo.style.display = 'none';
    prevThree.style.display = 'none';
  }

  if (currentPageNumber === 2) {
    prevOne.style.display = 'inline-block';
    prevTwo.style.display = 'none';
    prevThree.style.display = 'none';
  }
  if (currentPageNumber === 3) {
    prevOne.style.display = 'inline-block';
    prevTwo.style.display = 'inline-block';
    prevThree.style.display = 'none';
  }

  if (currentPageNumber >= 4) {
    prevOne.style.display = 'inline-block';
    prevTwo.style.display = 'inline-block';
    prevThree.style.display = 'inline-block';
  }
}

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

function hidePageNumber(e) {
  const target = e.target;
  target.style.visibility = 'hidden';

  target.removeEventListener('mouseup', hidePageNumber);
}

function showPageNumber(e) {
  const target = e.target;

  if (!target.matches('.tooltip')) {
    const tooltip = target.querySelector('.tooltip');
    tooltip.style.visibility = 'visible';
    target.addEventListener('mouseup', hidePageNumber);
  }
}

function pagination(nextPageToken, itemsNumber) {
  let itNum = itemsNumber;
  let currentPageNumber = 1;
  checkPageItemsNumber(currentPageNumber);

  const columns = checkColumnsNumber();
  const columnWidth = 350;

  let galleryMagrinLeft = 0;

  const pageItems = document.querySelectorAll('.page');
  pageItems.forEach(item => item.addEventListener('mousedown', showPageNumber));

  const currTt = document.querySelector('.curr  > .tooltip');
  const nextTt = document.querySelector('.next  > .tooltip');
  const prevOneTt = document.querySelector('.prev-one > .tooltip');
  const prevTwoTt = document.querySelector('.prev-two  > .tooltip');
  const prevThreeTt = document.querySelector('.prev-three  > .tooltip');
  currTt.innerHTML = currentPageNumber;

  const gallery = document.body.querySelector('.gallery');

  function pagePrev() {
    galleryMagrinLeft = Math.min(galleryMagrinLeft + (columnWidth * columns), 0);
    gallery.style.marginLeft = `${galleryMagrinLeft}px`;
    if (currentPageNumber > 1) {
      currentPageNumber -= 1;

      currTt.innerHTML = currentPageNumber;
      nextTt.innerHTML = currentPageNumber + 1;
      prevOneTt.innerHTML = currentPageNumber - 1;
      prevTwoTt.innerHTML = currentPageNumber - 2;
      prevThreeTt.innerHTML = currentPageNumber - 3;

      checkPageItemsNumber(currentPageNumber);
    }
  }

  const searchInput = document.body.querySelector('.search-input');
  const query = searchInput.value;

  function pageNext() {
    if ((currentPageNumber + 2) * columns > itNum) {
      service.downloadMore(nextPageToken, query).then((response) => {
        renderMain.addSection(response);
        itNum += response.items.length;
      }).catch((error) => {
        console.warn(error);
      });
    }

    galleryMagrinLeft -= columnWidth * columns;
    gallery.style.marginLeft = `${galleryMagrinLeft}px`;

    currentPageNumber += 1;

    currTt.innerHTML = currentPageNumber;
    nextTt.innerHTML = currentPageNumber + 1;
    prevOneTt.innerHTML = currentPageNumber - 1;
    prevTwoTt.innerHTML = currentPageNumber - 2;
    prevThreeTt.innerHTML = currentPageNumber - 3;

    checkPageItemsNumber(currentPageNumber);
  }

  function changePage(e) {
    let coefficient;

    if (e.target.matches('.next')) {
      coefficient = 1;
    } else if (e.target.matches('.tooltip')) {
      coefficient = 0;
    } else if (e.target.matches('.prev-one')) {
      coefficient = -1;
    } else if (e.target.matches('.prev-two')) {
      coefficient = -2;
    } else if (e.target.matches('.prev-three')) {
      coefficient = -3;
    }

    if ((currentPageNumber + 2) * columns * coefficient > itNum) {
      service.downloadMore(nextPageToken, query).then((response) => {
        renderMain.addSection(response);
        itNum += response.items.length;
      }).catch((error) => {
        console.warn(error);
      });
    }

    galleryMagrinLeft -= columnWidth * columns * coefficient;
    gallery.style.marginLeft = `${galleryMagrinLeft}px`;

    currentPageNumber += (1 * coefficient);

    currTt.innerHTML = currentPageNumber;
    nextTt.innerHTML = currentPageNumber + 1;
    prevOneTt.innerHTML = currentPageNumber - 1;
    prevTwoTt.innerHTML = currentPageNumber - 2;
    prevThreeTt.innerHTML = currentPageNumber - 3;

    checkPageItemsNumber(currentPageNumber);
  }

  pageItems.forEach(item => item.addEventListener('click', changePage));

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
