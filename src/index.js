/// <reference path="../typings/index.d.ts" />

const Termimori = require('../');
const _ = require('lodash');

const termimori = new Termimori(document.querySelector('.sample'), [
	{
		color: 'rgb(0, 255, 0)',
		innerText: '(*\'-\') < '
	}
]);
termimori.on('zoi', () => '今日も1日がんばるぞい！').on('tweet', (args) => {
	const q = _.slice(args._, 1);
	window.open(`http://twitter.com/?status=${q}`);
	return `${q} とツイートしました`;
});