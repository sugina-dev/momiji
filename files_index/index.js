"use strict";

function makeArticle(path, fileName, title) {
    return '<article>'
    + '<h3><a href="' + path + fileName + '.html">' + title + '</a></h3>'
    + '</article>';
}

fetch('https://api.sugina.cc/dictum')
.then(function(response) {
    return response.text();
})
.then(function(str) {
    document.getElementById('dictum').innerText = str;
});

fetch('https://api.sugina.cc/isuser')
.then(function(response) {
    if (!response.ok) { throw response; }
    return response.json();
})
.then(function(res) {
    document.getElementById('contents_useronly').style.display = 'inherit';
    document.getElementById('h3_userinfo').innerHTML = 'Welcome, ' + res + '. <a href="https://api.sugina.cc/auth/logout">Log Out</a>';
})
.catch(function(response) {
    if (response.status == 401)
        document.getElementById('h3_userinfo').innerHTML = '<a href="https://api.sugina.cc/auth/login">Log In</a>';
});

fetch('https://api.sugina.cc/isadmin')
.then(function(response) {
    if (!response.ok) { throw response; }
    return response.json();
})
.then(function(res) {
    if (res) {
        document.getElementById('contents_adminonly').style.display = 'inherit';

        fetch('/pridyn/kakitsubata/index.csv')
        .then(function(response) { return response.text(); })
        .then(function(str) {
            document.getElementById('contents_adminonly').innerHTML += str
            .split("\n")
            .map(function (x) { return x.split(','); })
            .filter(function (x) { return x.length == 2; })
            .map(function (x) { return makeArticle('/pridyn/kakitsubata/', x[0], x[1]); })
            .join('');
        });
    }
})
.catch(function(response) {});

fetch('pure/offprint/index.csv')
.then(function(response) {
    return response.text();
})
.then(function(str) {
    document.getElementById('contents_pubdyn_offprint').innerHTML += str
    .split("\n")
    .map(function (x) { return x.split(','); })
    .filter(function (x) { return x.length == 2; })
    .map(function (x) { return makeArticle('pure/offprint/', x[0], x[1]); })
    .join('');
});
