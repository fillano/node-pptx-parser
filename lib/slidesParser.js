module.exports = slidesParser;

function slidesParser(entries, pptx, relations, presentation, slideMasters, slideLayouts) {
	return presentation.slideIdList.reduce((pre, cur) => {
		pre[cur.rid] = require('./slideParser')([cur.target], pptx, relations, slideMasters, slideLayouts);
		return pre;
	}, {});
}