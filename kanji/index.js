"use strict";

function makeLi(o) { return '<li>' + o.char + ': ' + o.yomikata + '</li>'; }

function makeList(xs) { return '<ul>' + xs.map(makeLi).join('') + '</ul>'; }

function queryKunyomi(ch) {
    fetch('/api/kunyomi?q=' + ch)
    .then(function(response) {
        if (!response.ok) { throw response; }
        return response.json();
    })
    .then(function(res) {
        document.getElementById('kunyomi').innerHTML = res.length ? makeList(res) : '<p>No result</p>';
    }).catch(function(response) {
        if (response.status == 400)
            document.getElementById('kunyomi').innerHTML = '<p>Invalid query character</p>';
    });

    fetch('/api/hanja?q=' + ch)
    .then(function(response) {
        if (!response.ok) { throw response; }
        return response.json();
    })
    .then(function(res) {
        document.getElementById('hanja').innerHTML = res.length ? makeList(res) : '<p>No result</p>';
    }).catch(function(response) {
        if (response.status == 400)
            document.getElementById('hanja').innerHTML = '<p>Invalid query character</p>';
    });
}
