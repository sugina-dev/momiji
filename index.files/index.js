'use strict';

const makeArticle = (path, fileName, title) => `<article><a href="${path + fileName}.html">${title}</a></article>`;

const makeArtiles = (res, path) => res
	.map(x => makeArticle(path, x[0], x[1]))
	.join('');

const handleArticleJson = (str, path) => makeArtiles(str, path);
