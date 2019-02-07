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

function makeReplyField(id) {
    return '<form onsubmit="rep_post(' + id + ', reply.value); return false">'
    + '<textarea name="reply"></textarea><br />'
    + '<input type="submit" value="Post" />'
    + '</form>';
}

function makeTr(msg) {
    return '<tr>'
    + '<td>' + makeDateTime(msg.time) + '</td>'
    + '<td>' + msg.userName + '</td>'
    + '<td>' + escapeHTML(msg.message) + '</td>'
    + '<td>' + (msg.replymsg ? escapeHTML(msg.replymsg) : makeReplyField(msg.msgid)) + '</td>'
    + '</tr>';
}

function makeTable(messages) {
    return '<table>'
    + '<th>Time</th><th>User Name</th><th>Message</th><th>Reply Message</th>'
    + messages.map(makeTr).join('')
    + '</table>';
}

function rep_post(msgid, reply) {
    fetch('/api/board/manage', {
        method: 'POST',
        body: JSON.stringify({
            boardId: msgid,
            reply: reply
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(function(response) {
        refreshBoard();
    });
}

function refreshBoard() {
    fetch('/api/board/manage')
    .then(function(response) {
        if (!response.ok) { throw response; }
        return response.json();
    })
    .then(function(messages) {
        document.getElementById('div_table').innerHTML = makeTable(messages);
    })
    .catch(function(response) {
        if (response.status == 401)
            document.body.innerHTML = '<h1>Please become an administrator to use this feature!</h1>';
    });
}

refreshBoard();
