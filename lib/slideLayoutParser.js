module.exports = slideLayoutParser;
const parsers = require('./parsers');

function slideLayoutParser(entries, pptx, relations, presentation, themes, slideMasters) {
	return entries.filter(z => z.search(/^ppt\/slideLayouts\/slideLayout[0-9]+\.xml$/) > -1)
	.reduce((pre, cur) => {
		let master = Object.keys(relations[cur]).reduce((pre1, cur1) => {
			if(cur1.search(/^ppt\/slideMasters\/slideMaster[0-9]+\.xml$/) > -1) pre1 = cur1;
			return pre1;
		}, '');
		let theme = Object.keys(relations[master]).reduce((pre1, cur1) => {
			if(cur1.search(/^ppt\/theme\/theme[0-9]+\.xml$/) > -1) pre1 = cur1;
			return pre1;
		}, '');
		pre[cur] = parsers.slideLayoutParser(pptx[cur], cur, relations[cur], presentation.defaultTextStyle, themes[theme], slideMasters[master]);
		return pre;
	}, {});
}