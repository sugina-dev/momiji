"use strict";

function makeArticle(path, fileName, title) {
    return '<article>'
    + '<h3><a href="' + path + fileName + '.html">' + title + '</a></h3>'
    + '</article>';
}

fetch('/api/dictum')
.then(function(response) { return response.text(); })
.then(function(str) {
    document.getElementById('dictum').innerText = str;
});

fetch('/api/username')
.then(function(response) { return response.json(); })
.then(function(res) {
    if (!res) {
        document.getElementById('h3_userinfo').innerHTML = '<a href="/auth/login">Log In</a>';
    } else {
        document.getElementById('contents_useronly').style.display = 'inherit';
        document.getElementById('h3_userinfo').innerHTML = 'Welcome, ' + res + '. <a href="/auth/logout">Log Out</a>';
    }
});

fetch('/api/isadmin')
.then(function(response) { return response.json(); })
.then(function(res) {
    if (res) {
        document.getElementById('contents_adminonly').style.display = 'inherit';

        fetch('/api/kakitsubata/index.csv')
        .then(function(response) { return response.text(); })
        .then(function(str) {
            document.getElementById('contents_adminonly').innerHTML += str
            .split("\n")
            .map(function (x) { return x.split(','); })
            .filter(function (x) { return x.length == 2; })
            .map(function (x) { return makeArticle('/api/kakitsubata/', x[0], x[1]); })
            .join('');
        });
    }
});

fetch('pure/offprint/index.csv')
.then(function(response) { return response.text(); })
.then(function(str) {
    document.getElementById('contents_pubdyn_offprint').innerHTML += str
    .split("\n")
    .map(function (x) { return x.split(','); })
    .filter(function (x) { return x.length == 2; })
    .map(function (x) { return makeArticle('pure/offprint/', x[0], x[1]); })
    .join('');
});
