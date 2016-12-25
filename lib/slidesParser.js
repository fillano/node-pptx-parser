module.exports = slidesParser;

function slidesParser(entries, pptx, relations, presentation) {
	return presentation.slideIdList.reduce((pre, cur) => {
		pre[cur.rid] = require('./slideParser')([cur.target], pptx, relations);
		return pre;
	}, {});
}