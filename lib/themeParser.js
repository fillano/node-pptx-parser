module.exports = themeParser;
const parsers = require('./parsers.js');

function themeParser(entries, pptx, presentation) {
	return entries
	.filter(f => f.match(/theme[0-9]+\.xml$/g))
	.reduce((pre, cur) => {
		pre[cur] = parsers.themeParser(pptx[cur], presentation);
		return pre;
	}, {});
}