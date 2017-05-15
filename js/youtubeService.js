let xhr = require('./xhr');

const apiKey ='AIzaSyBkPL9Z0loT04dU7mqqtaKbfJW_9ucqgok';

let searchUrl = 'https://www.googleapis.com/youtube/v3/search?key={key}&type=video&part=snippet&maxResults={maxResults}&q={keyword}'.replace('{key}', apiKey);
let nextPageSearchUrl = 'https://www.googleapis.com/youtube/v3/search?key={key}&type=video&pageToken={pageToken}&part=snippet&maxResults={maxResults}&q={keyword}'.replace('{key}', apiKey);
let videosUrl = 'https://www.googleapis.com/youtube/v3/videos?key={key}&id={id}&part=snippet,statistics'.replace('{key}', apiKey);

async function search(keyword, maxResults) {
    let url = searchUrl.replace('{keyword}', keyword).replace('{maxResults}', maxResults);
    let response = await xhr.httpGet(url);
    let videoList = parseResponse(response);
    return videoList;
}

async function videoStatistics(ids) {//resp.statistics.viewCount
    //
    //let idStr = ids.join(); //id=nq4aU9gmZQk,REu2BcnlD34,qbPTdW7KgOg
    let url = videosUrl.replace('{id}', ids);
    let response = await xhr.httpGet(url);
    let videoStatistics = parseResponse(response); // пока не используется
    console.log(videoStatistics);
    return videoStatistics;
}

async function downloadMore(pageToken, keyword, maxResults = 15) {
    let url = nextPageSearchUrl.replace('{keyword}', keyword).replace('{maxResults}', maxResults).replace('{pageToken}', pageToken);
    let response = await xhr.httpGet(url);
    let addVideoList = parseResponse(response);
    console.log(addVideoList); //
    return addVideoList;
}

function parseResponse(searchResponse) {
    return JSON.parse(searchResponse);
}

module.exports.search = search;
module.exports.downloadMore = downloadMore;
module.exports.videoStatistics = videoStatistics;
