module.exports = summarize;

const deepAssign = require('./tools').deepAssign;

function summarize(relations, presentation, themes, slideMasters, slideLayouts, slides) {
	let ret = {
		relations: relations,
		presentation: presentation,
		themes: themes,
		slideMasters: slideMasters,
		/*rawSlides: slides,*/
		slideLayouts: slideLayouts
	};
	ret.slides = presentation.slideIdList.reduce((pre, cur) => {
		let ret = {};
		let slide = slides[cur.rid];
		let layoutTarget = Object.keys(relations[cur.target]).filter(z => z.search(/^ppt\/slideLayouts\/slideLayout[0-9]+\.xml$/) > -1)[0];
		let layout = slideLayouts[layoutTarget];
		let masterTarget = Object.keys(relations[layoutTarget]).filter(z => z.search(/^ppt\/slideMasters\/slideMaster[0-9]\.xml$/) > -1)[0];
		let master = slideMasters[masterTarget];
		let themeTarget = Object.keys(relations[masterTarget]).filter(z => z.search(/^ppt\/theme\/theme[0-9]+\.xml$/) > -1)[0];
		let theme = themes[themeTarget];
		let curr_rid = cur.rid;

		ret.colorScheme = theme.colorScheme;
		if(slide.colorMapOverride === 'master') {
			if(layout.colorMapOverride === 'master') {
				ret.colorMap = master.colorMap;
			}
		}

		let defaultTextStyle = processListStyle(null, presentation.defaultTextStyle);

		let masterStyles = Object.keys(master.txStyles).reduce((pre, cur) => {
			pre[cur] = processListStyle(defaultTextStyle, master.txStyles[cur]);
			return pre;
		}, {});

		ret.commonSlideData = {background: master.commonSlideData.background};

		let backgroundShapes = master.commonSlideData.shapes
		.filter(z => z.type === 'pic' || (z.type === 'shape' && (z.spType === null && z.spIdx === null)));
		console.log('\t\tbackgroundShapes', backgroundShapes.length);
		
		let layoutShapes = layout.commonSlideData.shapes
		.filter(z => z.type === 'pic' || (z.type === 'shape' && (z.spType === null && z.spIdx === null)));
		console.log('\t\tlayoutShapes', layoutShapes.length);
		
		let placeholderShapes = slide.commonSlideData.shapes
		.filter(z => z.type === 'shape' && (z.spType !== null || z.spIdx !== null))
		.reduce((pre, cur) => {
			if(cur.spIdx === null) {
				//title
				let style = masterStyles['titleStyle'];
				let layoutShape = layout.commonSlideData.shapes.filter(z => !!z.spType && z.spIdx === null)[0];
				let masterShape = master.commonSlideData.shapes.filter(z => z.spType === 'title')[0];
				pre.push(processShape(cur, layoutShape, masterShape, style));
			} else {
				let style = masterStyles['bodyStyle'];
				let layoutShape = layout.commonSlideData.shapes.filter(z => {
					return z.spIdx === cur.spIdx;
				})[0];
				let masterShape = master.commonSlideData.shapes.filter(z => z.spType === 'title')[0];
				pre.push(processShape(cur, layoutShape, masterShape, style));
			}

			return pre;
		}, []);
		console.log('\t\tplaceholderShapes', placeholderShapes.length);
		
		let customShapes = slide.commonSlideData.shapes
		.filter(z => z.type === 'pic' || (z.spType === null && z.spIdx === null))
		.reduce((pre, cur) => {
			if(cur.type === 'pic') {
				pre.push(cur);
			} else {
				let style = masterStyles['otherStyle'];
				pre.push(cur);
			}
			return pre;
		}, []);
		console.log('\t\tcustomShapes', customShapes.length);
		
		ret.commonSlideData.shapes = backgroundShapes.concat(layoutShapes).concat(placeholderShapes).concat(customShapes);
		console.log('\t\tfinalShapes', ret.commonSlideData.shapes.length);

		ret.timing = slide.timing;

		pre[cur.rid] = ret;
		return pre;
	}, {});
	return ret;
}

function processListStyle(def, obj) {
	let ret = {};
	if(!!def) ret = Object.assign(ret, def);
	ret.defaultParagraphStyle = !!obj.defaultParagraphStyle ? obj.defaultParagraphStyle : {};
	Object.keys(obj)
	.filter(z => z.search(/^level[1-9]+ParagraphProperty$/) > -1)
	.forEach(a => {
		if(!!ret[a]) {
			ret[a] = deepAssign(ret[a], ret.defaultParagraphStyle);
			ret[a] = deepAssign(ret[a], obj[a]);
		} else {
			ret[a] = deepAssign({}, ret.defaultParagraphStyle);
			ret[a] = deepAssign(ret[a], obj[a]);
		}
	});
	return ret;
}

function processShape(slide, layout, master, style) {
	let ret = {textBody:{defaultListStyle:style}};

	if(!!master) {
		console.log('proccessing master')
		ret = mergeShape(ret, master, style);
	}
	if(!!layout) {
		console.log('processing layout')
		ret = mergeShape(ret, layout);
	}
	console.log('processing slide')
	ret = mergeShape(ret, slide);

	return ret;
}

function mergeShape(base, target, style) {
	let ret = {};
	ret = deepAssign(base, target);

	if(!!ret.textBody && !!ret.textBody.paragraphs && ret.textBody.paragraphs.length > 0) {
		ret.textBody.defaultListStyle = deepAssign(base.textBody.defaultListStyle, target.textBody.defaultListStyle);
		ret.textBody.paragraphs = ret.textBody.paragraphs.reduce((pre, cur) => {
			let level = 1;
			if(!!cur.lvl) {
				level = cur.lvl + 1;
			}
			let tmp = deepAssign(ret.textBody.defaultListStyle['level'+level+'ParagraphProperty'], cur);
			let runs = [];
			tmp.runs.forEach(r => {
				let run = deepAssign(ret.textBody.defaultListStyle['level'+level+'ParagraphProperty'].defRPr, r);
				runs.push(run);
			})
			tmp.runs = runs;
			/*if(!!tmp.runs) {
				var p = [];
				tmp.runs.forEach(cur1 => {
					if(cur1.type === 'r') {
						var tmp1 = deepAssign(ret.textBody.defaultListStyle['level'+level+'ParagraphProperty'].defRPr, cur1.rPr);
						p.push(deepAssign(tmp1, cur1));
					}
					if(cur1.type === 'br' || cur1.type === 'end' || cur1.type === 'fld') {
						p.push(cur);
					}
				});
				tmp.runs = p;
			}*/
			pre.push(tmp);
			return pre;
		}, []);
	}
	return ret;
}