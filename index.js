const path = require('path');

module.exports = parser;

function parser(data) {
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
	let types = require('./lib/typeParser')(entries, pptx);
	let presentation = require('./lib/presentationParser')(entries, pptx, relations);
	let themes = require('./lib/themeParser')(entries, pptx, presentation);
	//console.log(JSON.stringify(themes, null, 2));
	let slideMasters = require('./lib/slideMasterParser')(entries, pptx, relations, presentation, themes);
	//console.log(JSON.stringify(slideMasters, null, 2));
	let slideLayouts = require('./lib/slideLayoutParser')(entries, pptx, relations, presentation, themes, slideMasters);
	//console.log(JSON.stringify(slideLayouts['ppt/slideLayouts/slideLayout2.xml'], null, 2));
	let slides = require('./lib/slidesParser')(entries, pptx, relations, presentation, themes, slideMasters, slideLayouts);
	//console.log(JSON.stringify(slides['rId4'], null, 2));

	let ret = {
		relations: relations,
		types: types,
		presentation: presentation,
		slides: slides
	};

	const fs = require('fs');
	fs.writeFile('main.json', JSON.stringify(ret, null, 2), 'utf-8', err => {
		if(!!err) console.error(err);
	});

	return ret;
}
