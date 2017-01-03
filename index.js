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
	let slideMasters = require('./lib/slideMasterParser')(entries, pptx, relations, presentation);
	console.log(JSON.stringify(slideMasters['ppt/slideMasters/slideMaster1.xml'].commonSlideData, null, 2));
	let slideLayouts = require('./lib/slideLayoutParser')(entries, pptx, relations, presentation, slideMasters)
	let slides = require('./lib/slidesParser')(entries, pptx, relations, presentation, slideMasters, slideLayouts);
	return {
		relations: relations,
		types: types,
		presentation: presentation,
		slides: slides
	};
}
