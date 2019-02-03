"use strict";

function makeLi(str) { return '<li>' + str + '</li>'; }

function makeList(xs) { return '<ul>' + xs.map(makeLi).join('') + '</ul>'; }

function queryKunyomi() {
    var wrd = document.getElementById('textInput').value;

    fetch('/api/kunyomi?q=' + wrd)
    .then(function(response) { return response.json(); })
    .then(function(res) {
        if (res) {
            document.getElementById('kunyomi_title').style.display = 'inherit';
            document.getElementById('kunyomi_res').innerHTML = makeList(res);
        } else {
            document.getElementById('kunyomi_title').display = 'none';
            document.getElementById('kunyomi_res').innerHTML = '';
        }
    });

    fetch('/api/hanja?q=' + wrd)
    .then(function(response) { return response.json(); })
    .then(function(res) {
        if (res) {
            document.getElementById('hanja_title').style.display = 'inherit';
            document.getElementById('hanja_res').innerHTML = makeList(res);
        } else {
            document.getElementById('hanja_title').style.display = 'none';
            document.getElementById('hanja_res').innerHTML = '';
        }
    });
}
