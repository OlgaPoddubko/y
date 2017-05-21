const xhr = require('./xhr');

const apiKey = 'AIzaSyBkPL9Z0loT04dU7mqqtaKbfJW_9ucqgok';

const searchUrl = 'https://www.googleapis.com/youtube/v3/search?key={key}&type=video&part=snippet&maxResults={maxResults}&q={keyword}'.replace('{key}', apiKey);
const nextPageSearchUrl = 'https://www.googleapis.com/youtube/v3/search?key={key}&type=video&pageToken={pageToken}&part=snippet&maxResults={maxResults}&q={keyword}'.replace('{key}', apiKey);
const videosUrl = 'https://www.googleapis.com/youtube/v3/videos?key={key}&id={id}&part=snippet,statistics'.replace('{key}', apiKey);

async function search(keyword, maxResults) {
  const url = searchUrl.replace('{keyword}', keyword).replace('{maxResults}', maxResults);
  const response = await xhr.httpGet(url);
  const videoList = JSON.parse(response);
  return videoList;
}

async function videoStatistics(ids) {
  const url = videosUrl.replace('{id}', ids);
  const response = await xhr.httpGet(url);
  const videoStat = JSON.parse(response);
  return videoStat;
}

async function downloadMore(pageToken, keyword, maxResults = 15) {
  const url = nextPageSearchUrl.replace('{keyword}', keyword).replace('{maxResults}', maxResults).replace('{pageToken}', pageToken);
  const response = await xhr.httpGet(url);
  const addVideoList = JSON.parse(response);
  return addVideoList;
}

module.exports = { search, downloadMore, videoStatistics };
