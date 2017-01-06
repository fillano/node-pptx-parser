module.exports = slideParser;
const parsers = require('./parsers');

function slideParser(entry, pptx, relations, presentation, themes, slideMasters, slideLayouts) {
	let layout = Object.keys(relations[entry]).reduce((pre1, cur1) => {
		if(cur1.search(/^ppt\/slideLayouts\/slideLayout[0-9]+\.xml$/) > -1) pre1 = cur1;
		return pre1;
	}, '');
	let master = Object.keys(relations[layout]).reduce((pre1, cur1) => {
		if(cur1.search(/^ppt\/slideMasters\/slideMaster[0-9]+\.xml$/) > -1) pre1 = cur1;
		return pre1;
	}, '');
	let theme = Object.keys(relations[master]).reduce((pre1, cur1) => {
		if(cur1.search(/^ppt\/theme\/theme[0-9]+\.xml$/) > -1) pre1 = cur1;
		return pre1;
	}, '');
	return parsers.slideParser(pptx[entry], entry, relations[entry], slideMasters[master].txStyles, themes[theme], slideLayouts[layout]);
}
