const path = require('path');

module.exports = parser;

function parser(data, opts) {
	if (typeof data === 'string') {
		var pptx = JSON.parse(data);
	} else {
		var pptx = data;
	}
	let entries = Object.keys(pptx);
	let relations = require('./lib/relationParser')(entries, pptx);
	let types = require('./lib/typeParser')(entries, pptx);
	let presentation = require('./lib/presentationParser')(entries, pptx, relations);
	let themes = require('./lib/themeParser')(entries, pptx, presentation);
	let slideMasters = require('./lib/slideMasterParser')(entries, pptx, relations, presentation, themes);
	let slideLayouts = require('./lib/slideLayoutParser')(entries, pptx, relations, themes);
	let slides = require('./lib/slidesParser')(entries, pptx, relations, presentation, themes, slideMasters, slideLayouts);

	let ret = require('./lib/summarize')(relations, presentation, themes, slideMasters, slideLayouts, slides);

	/*opts = {file: 'main.js'};
	if(!!opts && !!opts.file && typeof opts.file === 'string') {
		const fs = require('fs');
		fs.writeFile(opts.file, 'var data = ' + JSON.stringify(ret, null, 2), 'utf-8', err => {
			if(!!err) console.error(err);
		});
	}*/

	return ret;
}
