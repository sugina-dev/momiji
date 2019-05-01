'use strict';

const makeArticle = (path, fileName, title) => `<article><a href="${path + fileName}.html">${title}</a></article>`;

const makeArtiles = (res, path) => res
	.map(x => makeArticle(path, x[0], x[1]))
	.join('');

const handleArticleJson = (str, path) => makeArtiles(str, path);

const dictumLoaded = (async () => {
	const response = await fetch('/t/dictum/');
	if (!response.ok) {
		return;
	} else {
		document.getElementById('dictum').innerText = await response.text();
	}
})();

const userLoaded = (async () => {
	const response = await fetch('/api/isuser');
	if (!response.ok) {
		if (response.status == 401)
			document.getElementById('h3_userinfo').innerHTML = '<a href="/api/auth/page/gitlab/forward">Log In via GitLab.</a>';
	} else {
		const res = await response.text();
		document.getElementById('contents_useronly').style.display = 'inherit';
		document.getElementById('h3_userinfo').innerHTML = `Welcome, ${res}. <a href="/api/auth/logout">Log Out.</a>`;
	}
})();

const adminArticlesLoaded = (async () => {
	const response = await fetch('/p/kakitsubata/index.json');
	if (!response.ok) {
		return;
	} else {
		const str = await response.text();
		document.getElementById('contents_adminonly').style.display = 'inherit';
		document.getElementById('contents_adminonly').outerHTML += handleArticleJson(str, '/p/kakitsubata/');
	}
})();

const adminLoaded = (async () => {
	const [_, response] = await Promise.all([adminArticlesLoaded, fetch('/p/preload.txt')]);
	if (!response.ok) {
		return;
	} else {
		document.getElementById('contents_adminonly').outerHTML += await response.text();
	}
})();

(async () => {
	await Promise.all([dictumLoaded, userLoaded, adminLoaded]);
	document.body.style.display = 'inherit';
})();
