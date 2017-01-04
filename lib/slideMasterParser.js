module.exports = slideMasterParser;
const parsers = require('./parsers');

function slideMasterParser(entries, pptx, relations, presentation) {
	return entries
		.filter(f => f.match(/slideMaster[0-9]+\.xml$/g))
		.reduce((pre, cur) => {
			pre[cur] = parsers.slideMasterParser(pptx[cur], cur, relations[cur], presentation.defaultTextStyle);
			return pre;
		}, {});
}