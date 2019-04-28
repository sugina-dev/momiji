'use strict';

const makeArticle = (path, fileName, title) => `<article>
	<h3><a href="${path + fileName}.html">${title}</a></h3>
</article>`;

const handleArticleCsv = (str, path) => str
	.split('\n')
	.map(x => x.split(','))
	.filter(x => x.length == 2)
	.map(x => makeArticle(path, x[0], x[1]))
	.join('');

(async () => {
	const response = await fetch('/t/dictum/');
	if (!response.ok) {
		return;
	} else {
		const str = await response.text();
		document.getElementById('dictum').innerText = str;
	}
})();

(async () => {
	const response = await fetch('/api/isuser');
	if (!response.ok) {
		if (response.status == 401)
			document.getElementById('h3_userinfo').innerHTML = '<a href="/api/auth/page/gitlab/forward">Log In via GitLab</a>';
	} else {
		const res = await response.text();
		document.getElementById('contents_useronly').innerHTML = `<section>
	<h2>User Utilities</h2>
	<article>
		<h3><a href="board/message/">Message Board</a></h3>
	</article>
</section>`;
		document.getElementById('h3_userinfo').innerHTML = `Welcome, ${res}. <a href="/api/auth/logout">Log Out</a>`;
	}
})();

const adminArticlesLoaded = (async () => {
	const response = await fetch('/p/kakitsubata/index.csv');
	if (!response.ok) {
		return;
	} else {
		const str = await response.text();
		document.getElementById('contents_adminonly').innerHTML = `<section>
	<h2>Admin Utilities</h2>
	<article>
		<h3><a href="board/manage/">Message Board Manager</a></h3>
	</article>
</section>`;
		document.getElementById('contents_adminonly').innerHTML += handleArticleCsv(str, '/p/kakitsubata/');
	}
})();

(async () => {
	const preloadHtmlSegmentLoaded = fetch('/p/preload.txt');
	await adminArticlesLoaded;
	const response = await preloadHtmlSegmentLoaded;
	if (!response.ok) {
		return;
	} else {
		const str = await response.text();
		document.getElementById('contents_adminonly').innerHTML += str;
	}
})();
