const path = require('path');

module.exports = parser;

function parser(data, opts) {
	if (typeof data === 'string') {
		var pptx = JSON.parse(data);
	} else {
		var pptx = data;
	}
	let entries = [];
	for(let i in pptx) {
		if(pptx.hasOwnProperty(i)) {
			entries.push(i);
		}
	}
	let relations = require('./lib/relationParser')(entries, pptx);
	//console.log(JSON.stringify(relations['ppt/slides/slide1.xml']));
	let types = require('./lib/typeParser')(entries, pptx);
	let presentation = require('./lib/presentationParser')(entries, pptx, relations);
	//console.log(JSON.stringify(presentation, null, 2));
	let themes = require('./lib/themeParser')(entries, pptx, presentation);
	//console.log(JSON.stringify(themes, null, 2));
	let slideMasters = require('./lib/slideMasterParser')(entries, pptx, relations, presentation, themes);
	//console.log(JSON.stringify(slideMasters, null, 2));
	let slideLayouts = require('./lib/slideLayoutParser')(entries, pptx, relations, themes);
	//console.log(JSON.stringify(slideLayouts['ppt/slideLayouts/slideLayout1.xml'], null, 2));
	let slides = require('./lib/slidesParser')(entries, pptx, relations, presentation, themes, slideMasters, slideLayouts);
	//console.log(JSON.stringify(slides['rId2'], null, 2));

	//let sum = require('./lib/summarize')(relations, presentation, themes, slideMasters, slideLayouts, slides);

	let ret = {
		relations: relations,
		types: types,
		presentation: presentation,
		themes: themes,
		slides: slides
		/*slideMasters: slideMasters,
		slideLayouts: slideLayouts,
		slides: slides*/
	};
	//opts = {file: 'main.js'};
	if(!!opts && !!opts.file && typeof opts.file === 'string') {
		const fs = require('fs');
		fs.writeFile(opts.file, JSON.stringify(ret, null, 2), 'utf-8', err => {
			if(!!err) console.error(err);
		});
	}

	return ret;
}
