"use strict";

function escapeHTML(html) {
    var p = document.createElement('p');
    p.innerText = html;
    return p.innerHTML;
}

function btn_post() {
    fetch('/api/board/message', {
        method: 'POST',
        body: JSON.stringify(document.getElementById("textarea_comment").value),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(function(response) {
        return response.text();
    })
    .then(function(res) {
        document.getElementById("textarea_comment").value = "";
        refreshBoard();
    });
}

function refreshBoard() {
    fetch('/api/board/message')
    .then(function(response) {
        if (!response.ok) { throw response; }
        return response.json();
    })
    .then(function(messages) {
        var content = "<table><th>Time</th><th>Message</th><th>Reply</th>";
        for (var i = 0; i < messages.length; i++) {
            content += "<tr>"
            + "<td>" + messages[i].time + "</td>"
            + "<td>" + escapeHTML(messages[i].message) + "</td>"
            + "<td>" + escapeHTML(messages[i].reply) + "</td>"
            + "</tr>";
        }
        content += "</table>";
        document.getElementById("div_table").innerHTML = content;
    })
    .catch(function(response) {
        if (response.status == 401)
            document.body.innerHTML = "<h1>Please use this feature after logged in!</h1>";
    });
}

refreshBoard();
