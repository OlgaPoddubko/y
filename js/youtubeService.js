const apiKey ='AIzaSyBkPL9Z0loT04dU7mqqtaKbfJW_9ucqgok';

let searchUrl = 'https://www.googleapis.com/youtube/v3/search?key={key}&type=video&part=snippet&maxResults={maxResults}&q={keyword}'.replace('{key}', apiKey);
let videosUrl = 'https://www.googleapis.com/youtube/v3/videos?key={key}&id={id}&part=snippet,statistics'.replace('{key}', apiKey);

let xhr = require('./xhr');

async function search(keyword, maxResults) {
    let url = searchUrl.replace('{keyword}', keyword).replace('{maxResults}', maxResults);
    let response = await xhr.httpGet(url);
    let videoList = parseSearchResponse(response);
    return videoList;
}

async function videoStatistics(ids) {
    let idStr = ids.join(); //id=nq4aU9gmZQk,REu2BcnlD34,qbPTdW7KgOg
    let url = videosUrl.replace('{id}', idStr);
    let response = await xhr.httpGet(url);
    let videoStatistics = parseVideoResponse(response); // пока это не осмыслено
    return videoStatistics;
}

function parseSearchResponse(searchResponse) {
    //console.log(JSON.parse(searchResponse));
    return JSON.parse(searchResponse);
}

function parseVideoResponse(videoResponse) {
    //console.log(JSON.parse(videoResponse));
    return JSON.parse(videoResponse);
}

module.exports.search = search;
module.exports.videoStatistics = videoStatistics;
