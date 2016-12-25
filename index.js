const path = require('path');

module.exports = parser;

function parser(data) {
	let pptx = JSON.parse(data);
	let entries = [];
	for(let i in pptx) {
		if(pptx.hasOwnProperty(i)) {
			entries.push(i);
		}
	}
	let relations = require('./lib/relationParser')(entries, pptx);
	let types = require('./lib/typeParser')(entries, pptx);
	let presentation = require('./lib/presentationParser')(entries, pptx, relations);
	let slides = require('./lib/slidesParser')(entries, pptx, relations, presentation);
	return {
		relations: relations,
		types: types,
		presentation: presentation,
		slides: slides
	};
}
