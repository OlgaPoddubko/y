const service = require('./youtubeService');

let nextPageToken;
let itemsNumber = 0;

function fillSection(item, publishDate, views) {
  const tmpl = '<div class="thumbnail">' +
        '<a href="http://www.youtube.com/watch?v=<%=id.videoId%>" class="link">' +
        '<img src="<%=snippet.thumbnails.medium.url%>" alt="" width="100%" height="auto">' +
        '<i class="fa fa-play-circle" aria-hidden="true"></i>' +
        '</a>' +
        '</div>' +
        '<div class="information">' +
        '<h2><a href="http://www.youtube.com/watch?v=<%=id.videoId%>" class="link title"><%=snippet.title%></a></h2>' +
        '<ul>' +
        '<li class="cannel"><i class="fa fa-user" aria-hidden="true"></i><%=snippet.channelTitle%></li>' +
        '<li class="published-at"><i class="fa fa-calendar" aria-hidden="true"></i></li>' +
        '<li class="views"><i class="fa fa-eye" aria-hidden="true"></i></li>' +
        '</ul>' +
        '<p class="description"><%=snippet.description%></p>' +
        '</div>';

  const gallery = document.body.querySelector('.gallery');
  const newSection = document.createElement('section');
  newSection.innerHTML = _.template(tmpl)(item);

  newSection.querySelector('.published-at').insertAdjacentText('beforeEnd', publishDate);
  newSection.querySelector('.views').insertAdjacentText('beforeEnd', views);
  gallery.appendChild(newSection);
}

function addSection(resp) {
  const items = resp.items;
  itemsNumber += items.length;

  for (let i = 1; i < items.length; i += 1) {
    const item = resp.items[i];

    const date = new Date(Date.parse(item.snippet.publishedAt));
    let day = date.getDate();
    if (day < 10) {
      day = `0${day}`;
    }
    let month = date.getMonth() + 1;
    if (month < 10) {
      month = `0${month}`;
    }
    const publishDate = (`${day}.${month}.${date.getFullYear()}`);

    const videoId = item.id.videoId;
    service.videoStatistics(videoId).then((response) => {
      const views = response.items[0].statistics.viewCount;
      fillSection(item, publishDate, views);
    }).catch((error) => {
      console.warn(error);
    });
  }
  nextPageToken = resp.nextPageToken;
}


function renderMain(resp) {
  let tmpl;
  const items = resp.items;

  if (items.length === 0) {
    tmpl = '<p class="empty-result">Sorry, no items to your query :(</p>';
  } else {
    tmpl = '<div class="main-inner">' +
            '<div class="gallery">' +
            '</div>' +
            '</div>' +
            '<div class="paging">' +
            '<span class="page prev-three"><span class="tooltip"></span></span>' +
            '<span class="page prev-two"><span class="tooltip"></span></span>' +
            '<span class="page prev-one"><span class="tooltip"></span></span>' +
            '<span class="page curr"><span class="tooltip"></span></span>' +
            '<span class="page next"><span class="tooltip"></span></span>' +
            '</div>';
  }

  const main = document.body.querySelector('main');
  main.innerHTML = _.template(tmpl)();

  addSection(resp);

// pagination
  const sectionWidth = 350;

  const mainInner = document.querySelector('.main-inner');
  const mainInnerWidth = global.getComputedStyle(mainInner).width;

  let columns;
  switch (mainInnerWidth) {
    case '1400px': columns = 4;
      break;
    case '1030px': columns = 3;
      break;
    case '680px': columns = 2;
      break;
    default: columns = 1;
      break;
  }

  let position = 0;
  const gallery = document.body.querySelector('.gallery');

  let currentPageNumber = 1;

  const prevOne = document.querySelector('.prev-one');
  const prevTwo = document.querySelector('.prev-two');
  const prevThree = document.querySelector('.prev-three');

  function checkPageItemsNumber() {
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
  checkPageItemsNumber();

  const pageItems = document.querySelectorAll('.page');

  const currTt = document.querySelector('.curr  > .tooltip');
  const nextTt = document.querySelector('.next  > .tooltip');
  const prevOneTt = document.querySelector('.prev-one > .tooltip');
  const prevTwoTt = document.querySelector('.prev-two  > .tooltip');
  const prevThreeTt = document.querySelector('.prev-three  > .tooltip');

  currTt.innerHTML = currentPageNumber;

  function hidePageNumber(e) {
    const target = e.target;
    target.style.visibility = 'hidden';

    target.removeEventListener('mouseup', hidePageNumber);
  }

  function showPageNumber(e) {
    const target = e.target;

    if (target.matches('.tooltip')) {
      console.log('tooltip');
      return;
    }

    const tooltip = target.querySelector('.tooltip');
    tooltip.style.visibility = 'visible';
    target.addEventListener('mouseup', hidePageNumber);
  }

  pageItems.forEach(item => item.addEventListener('mousedown', showPageNumber));

  function pagePrev() {
    position = Math.min(position + (sectionWidth * columns), 0);
    gallery.style.marginLeft = `${position}px`;
    if (currentPageNumber > 1) {
      currentPageNumber -= 1;

      currTt.innerHTML = currentPageNumber;
      nextTt.innerHTML = currentPageNumber + 1;
      prevOneTt.innerHTML = currentPageNumber - 1;
      prevTwoTt.innerHTML = currentPageNumber - 2;
      prevThreeTt.innerHTML = currentPageNumber - 3;

      checkPageItemsNumber();
    }
  }

  const searchInput = document.body.querySelector('.search-input');
  const query = searchInput.value;

  function pageNext() {
    if ((currentPageNumber + 2) * columns > itemsNumber) {
      service.downloadMore(nextPageToken, query).then((response) => {
        addSection(response);
      }).catch((error) => {
        console.warn(error);
      });
    }

    position -= sectionWidth * columns;
    gallery.style.marginLeft = `${position}px`;

    currentPageNumber += 1;

    currTt.innerHTML = currentPageNumber;
    nextTt.innerHTML = currentPageNumber + 1;
    prevOneTt.innerHTML = currentPageNumber - 1;
    prevTwoTt.innerHTML = currentPageNumber - 2;
    prevThreeTt.innerHTML = currentPageNumber - 3;

    checkPageItemsNumber();
  }

  function changePage(e) {
    let coefficient;
    console.log(e.target);

    if (e.target.matches('.next')) {
      coefficient = 1;
    } else if (e.target.matches('.curr')) {
      return;
    } else if (e.target.matches('.prev-one')) {
      coefficient = -1;
    } else if (e.target.matches('.prev-two')) {
      coefficient = -2;
    } else if (e.target.matches('.prev-three')) {
      coefficient = -3;
    }

    if ((currentPageNumber + 2) * columns * coefficient > itemsNumber) {
      service.downloadMore(nextPageToken, query).then((response) => {
        addSection(response);
      }).catch((error) => {
        console.warn(error);
      });
    }

    position -= sectionWidth * columns * coefficient;
    gallery.style.marginLeft = `${position}px`;

    currentPageNumber += (1 * coefficient);

    currTt.innerHTML = currentPageNumber;
    nextTt.innerHTML = currentPageNumber + 1;
    prevOneTt.innerHTML = currentPageNumber - 1;
    prevTwoTt.innerHTML = currentPageNumber - 2;
    prevThreeTt.innerHTML = currentPageNumber - 3;

    checkPageItemsNumber();
  }


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

  pageItems.forEach(item => item.addEventListener('click', changePage));

  mainInner.addEventListener('mousedown', mousedown);
  mainInner.addEventListener('mousemove', mousemove);
  mainInner.addEventListener('mouseup', mouseup);

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

module.exports.renderMain = renderMain;
