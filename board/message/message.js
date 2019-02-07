"use strict";

function escapeHTML(html) {
    var p = document.createElement('p');
    p.innerText = html;
    return p.innerHTML;
}

function makeDateTime(str) {
    return '<time datetime="' + str + '">'
    + (new Date(str)).toLocaleString('ja-JP')
    + '</time>';
}

function btn_post(str) {
    fetch('/api/board/message', {
        method: 'POST',
        body: JSON.stringify(str),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(function(response) {
        document.getElementById('comment').value = '';
        refreshBoard();
    });
}

function makeTr(msg) {
    return '<tr>'
    + '<td>' + makeDateTime(msg.time) + '</td>'
    + '<td>' + escapeHTML(msg.message) + '</td>'
    + '<td>' + escapeHTML(msg.reply) + '</td>'
    + '</tr>';
}

function makeTable(messages) {
    return '<table><th>Time</th><th>Message</th><th>Reply</th>'
    + messages.map(makeTr).join('')
    + '</table>';
}

function refreshBoard() {
    fetch('/api/board/message')
    .then(function(response) {
        if (!response.ok) { throw response; }
        return response.json();
    })
    .then(function(messages) {
        document.getElementById('div_table').innerHTML = makeTable(messages);
    })
    .catch(function(response) {
        if (response.status == 401)
            document.body.innerHTML = '<h1>Please use this feature after logged in!</h1>';
    });
}

refreshBoard();
