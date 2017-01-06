module.exports = slideMasterParser;
const parsers = require('./parsers');

function slideMasterParser(entries, pptx, relations, presentation, themes) {
	return entries
		.filter(f => f.match(/slideMaster[0-9]+\.xml$/g))
		.reduce((pre, cur) => {
			let theme = themes[Object.keys(relations[cur]).reduce((pre, cur) => {
				if(cur.match(/^ppt\/theme\/theme[0-9]+\.xml/)) pre = cur;
				return pre;
			}, '')];
			pre[cur] = parsers.slideMasterParser(pptx[cur], cur, relations[cur], presentation.defaultTextStyle, theme);
			return pre;
		}, {});
}