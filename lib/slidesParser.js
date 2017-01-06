module.exports = slidesParser;

function slidesParser(entries, pptx, relations, presentation, themes, slideMasters, slideLayouts) {
	return presentation.slideIdList.reduce((pre, cur) => {
		pre[cur.rid] = require('./slideParser')(cur.target, pptx, relations, presentation, themes, slideMasters, slideLayouts);
		return pre;
	}, {});
}