"use strict";

function makeArticle(path, fileName, title) {
    return '<article>'
    + '<h3><a href="' + path + fileName + '.html">' + title + '</a></h3>'
    + '</article>';
}

function handleArticleCsv(str, path) {
    return str
    .split("\n")
    .map(function (x) { return x.split(','); })
    .filter(function (x) { return x.length == 2; })
    .map(function (x) { return makeArticle(path, x[0], x[1]); })
    .join('');
}

fetch('/api/dictum')
.then(function(response) {
    if (!response.ok) { throw response; }
    return response.text();
})
.then(function(str) {
    document.getElementById('dictum').innerText = str;
})
.catch(function(response) {});

fetch('/api/isuser')
.then(function(response) {
    if (!response.ok) { throw response; }
    return response.json();
})
.then(function(res) {
    document.getElementById('contents_useronly').style.display = 'inherit';
    document.getElementById('h3_userinfo').innerHTML = 'Welcome, ' + res + '. <a href="/api/auth/logout">Log Out</a>';
})
.catch(function(response) {
    if (response.status == 401)
        document.getElementById('h3_userinfo').innerHTML = '<a href="/api/auth/page/gitlab/forward">Login via GitLab</a>';
});

fetch('pure/offprint/index.csv')
.then(function(response) { return response.text(); })
.then(function(str) {
    document.getElementById('contents_pubdyn_offprint').innerHTML += handleArticleCsv(str, 'pure/offprint/');
});

fetch('/p/kakitsubata/index.csv')
.then(function(response) {
    if (!response.ok) { throw response; }
    return response.json();
})
.then(function(str) {
    document.getElementById('contents_adminonly').innerHTML += handleArticleCsv(str, '/p/kakitsubata/');
})
.catch(function(response) {});
