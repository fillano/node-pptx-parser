module.exports = summarize;

function summarize(relations, presentation, themes, slideMasters, slideLayouts, slides) {
	let ret = {
		relations: relations,
		presentation: presentation,
		themes: themes
	};
	ret.slides = presentation.slideIdList.reduce((pre, cur) => {
		let ret = {};
		let slide = slides[cur.rid];
		let layoutTarget = Object.keys(relations[cur.target]).filter(z => z.search(/^ppt\/slideLayouts\/slideLayout[0-9]+\.xml$/) > -1)[0];
		//console.log(layoutTarget);
		let layout = slideLayouts[layoutTarget];
		let masterTarget = Object.keys(relations[layoutTarget]).filter(z => z.search(/^ppt\/slideMasters\/slideMaster[0-9]\.xml$/) > -1)[0];
		//console.log(masterTarget);
		let master = slideMasters[masterTarget];
		let themeTarget = Object.keys(relations[masterTarget]).filter(z => z.search(/^ppt\/theme\/theme[0-9]+\.xml$/) > -1)[0];
		let theme = themes[themeTarget];



		pre[cur.rid] = ret;
		return pre;
		//let master = slideMasters[Object.keys(relations[cur.target]).filter(z=>z.search(/^ppt\/slideMasters\/slideMasters[0-9]+\.xml/)>-1)[0]];
	}, {});
	return ret;
}