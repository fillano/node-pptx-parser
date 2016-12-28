module.exports = slideParser;

function slideParser(entries, pptx, relations) {
	let target = entries[0], slide = pptx[target], ext = relations[target];
	let layoutTarget = '';
	for(let i in ext) {
		if(ext.hasOwnProperty(i)) {
			if(i.indexOf('ppt/slideLayouts') === 0) {
				layoutTarget = i;
			}
		}
	}
	let slideLayout = pptx[layoutTarget];
	let extLayout = relations[layoutTarget];
	let masterTarget = ''
	for(let i in extLayout) {
		for(let i in extLayout) {
			if(extLayout.hasOwnProperty(i)) {
				if(i.indexOf('ppt/slideMasters') === 0) {
					masterTarget = i;
				}
			}
		}
	}
	let slideMaster = pptx[masterTarget];
	let extTheme = relations[masterTarget];
	let themeTarget = '';
	for(let i in extTheme) {
		if(extTheme.hasOwnProperty(i)) {
			if(i.indexOf('ppt/theme') === 0) {
				themeTarget = i;
			}
		}
	}
	let theme = pptx[themeTarget];
	//parsing color scheme and color map in theme and slideMaster
	let ret = {};
	ret['colorScheme'] = {
		name: theme['a:theme']['a:themeElements'][0]['a:clrScheme'][0].$.name,
		dk1: theme['a:theme']['a:themeElements'][0]['a:clrScheme'][0]['a:dk1'][0]['a:srgbClr'][0].$.val,
		lt1: theme['a:theme']['a:themeElements'][0]['a:clrScheme'][0]['a:lt1'][0]['a:srgbClr'][0].$.val,
		dk2: theme['a:theme']['a:themeElements'][0]['a:clrScheme'][0]['a:dk2'][0]['a:srgbClr'][0].$.val,
		lt2: theme['a:theme']['a:themeElements'][0]['a:clrScheme'][0]['a:lt2'][0]['a:srgbClr'][0].$.val,
		accent1: theme['a:theme']['a:themeElements'][0]['a:clrScheme'][0]['a:accent1'][0]['a:srgbClr'][0].$.val,
		accent2: theme['a:theme']['a:themeElements'][0]['a:clrScheme'][0]['a:accent2'][0]['a:srgbClr'][0].$.val,
		accent3: theme['a:theme']['a:themeElements'][0]['a:clrScheme'][0]['a:accent3'][0]['a:srgbClr'][0].$.val,
		accent4: theme['a:theme']['a:themeElements'][0]['a:clrScheme'][0]['a:accent4'][0]['a:srgbClr'][0].$.val,
		accent5: theme['a:theme']['a:themeElements'][0]['a:clrScheme'][0]['a:accent5'][0]['a:srgbClr'][0].$.val,
		accent6: theme['a:theme']['a:themeElements'][0]['a:clrScheme'][0]['a:accent6'][0]['a:srgbClr'][0].$.val,
		hlink: theme['a:theme']['a:themeElements'][0]['a:clrScheme'][0]['a:hlink'][0]['a:srgbClr'][0].$.val,
		folHlink: theme['a:theme']['a:themeElements'][0]['a:clrScheme'][0]['a:folHlink'][0]['a:srgbClr'][0].$.val
	};
	ret['colorMap'] = slideMaster['p:sldMaster']['p:clrMap'][0].$;
	//parsing background color style in slideMaster
	ret['background'] = {
		solidFill: {
			srcRgbColor: slideMaster['p:sldMaster']['p:cSld'][0]['p:bg'][0]['p:bgRef'][0]['a:schemeClr'][0].$.val
		}
	};
	//parsing background shapes in slideMaster
	ret['shapes'] = [];
	if(!!slideMaster['p:sldMaster']['p:cSld'][0]['p:spTree'][0]['p:sp']) {
		slideMaster['p:sldMaster']['p:cSld'][0]['p:spTree'][0]['p:sp'].reduce((pre, cur) => {
			var ph = false;
			for(var i in cur['p:nvSpPr'][0]['p:nvPr'][0]) {
				if(i === 'p:ph') ph = true;
			}
			if(!ph) {
				var ret = {
					id: cur['p:nvSpPr'][0]['p:cNvPr'][0].$.id,
					type: 'shape',
					name: cur['p:nvSpPr'][0]['p:cNvPr'][0].$.name,
					x: cur['p:spPr'][0]['a:xfrm'][0]['a:off'][0].$.x,
					y: cur['p:spPr'][0]['a:xfrm'][0]['a:off'][0].$.y,
					cx: cur['p:spPr'][0]['a:xfrm'][0]['a:ext'][0].$.cx,
					cy: cur['p:spPr'][0]['a:xfrm'][0]['a:ext'][0].$.cy,
					presetGeom: cur['p:spPr'][0]['a:prstGeom'][0].$.prst,
					solidFill: !!cur['p:spPr'][0]['a:solidFill'] ? cur['p:spPr'][0]['a:solidFill'][0]['a:schemeClr'][0].$.val : ''
				};
				pre.push(ret);
				return pre;
			} else {
				return pre;
			}
		}, [])
		.forEach((shape, idx) => {
			ret['shapes'].push(shape);
		});
	}
	if(!!slideMaster['p:sldMaster']['p:cSld'][0]['p:spTree'][0]['p:pic']) {
		slideMaster['p:sldMaster']['p:cSld'][0]['p:spTree'][0]['p:pic'].reduce((pre, cur) => {
			var ret = {
				id: cur['p:nvPicPr'][0]['p:cNvPr'][0].$.id,
				type: 'pic',
				name: cur['p:nvPicPr'][0]['p:cNvPr'][0].$.name,
				x: cur['p:spPr'][0]['a:xfrm'][0]['a:off'][0].$.x,
				y: cur['p:spPr'][0]['a:xfrm'][0]['a:off'][0].$.y,
				cx: cur['p:spPr'][0]['a:xfrm'][0]['a:ext'][0].$.cx,
				cy: cur['p:spPr'][0]['a:xfrm'][0]['a:ext'][0].$.cy,
				presetGeom: cur['p:spPr'][0]['a:prstGeom'][0].$.prst,
				blip: {
					embed: relations[masterTarget][cur['p:blipFill'][0]['a:blip'][0].$['r:embed']],
					srcRect: {
						l: !!cur['p:blipFill'][0]['a:srcRect'][0].$.l ? cur['p:blipFill'][0]['a:srcRect'][0].$.l : 0,
						t: !!cur['p:blipFill'][0]['a:srcRect'][0].$.t ? cur['p:blipFill'][0]['a:srcRect'][0].$.t : 0,
						r: !!cur['p:blipFill'][0]['a:srcRect'][0].$.r ? cur['p:blipFill'][0]['a:srcRect'][0].$.r : 0,
						b: !!cur['p:blipFill'][0]['a:srcRect'][0].$.b ? cur['p:blipFill'][0]['a:srcRect'][0].$.b : 0
					}
				}
			};
			pre.push(ret);
			return pre;
		}, [])
		.forEach(pic => {
			ret['shapes'].push(pic);
		});
	}

	//parsing text style in slideMaster
	let titleStyle = {
		level1ParagraphProperty: {
			marL: !!slideMaster['p:sldMaster']['p:txStyles'][0]['p:titleStyle'][0]['a:lvl1pPr'][0].$.marL ? slideMaster['p:sldMaster']['p:txStyles'][0]['p:titleStyle'][0]['a:lvl1pPr'][0].$.marL : '0',
			indent: !!slideMaster['p:sldMaster']['p:txStyles'][0]['p:titleStyle'][0]['a:lvl1pPr'][0].$.indent ? !!slideMaster['p:sldMaster']['p:txStyles'][0]['p:titleStyle'][0]['a:lvl1pPr'][0].$.indent : '0',
			align: !!slideMaster['p:sldMaster']['p:txStyles'][0]['p:titleStyle'][0]['a:lvl1pPr'][0].$.algn ? slideMaster['p:sldMaster']['p:txStyles'][0]['p:titleStyle'][0]['a:lvl1pPr'][0].$.algn : 'l',
			defTabSz: slideMaster['p:sldMaster']['p:txStyles'][0]['p:titleStyle'][0]['a:lvl1pPr'][0].$.defTabSz,
			rtl: slideMaster['p:sldMaster']['p:txStyles'][0]['p:titleStyle'][0]['a:lvl1pPr'][0].$.rtl,
			eaLnBrk: slideMaster['p:sldMaster']['p:txStyles'][0]['p:titleStyle'][0]['a:lvl1pPr'][0].$.eaLnBrk,
			latinLnBrk: slideMaster['p:sldMaster']['p:txStyles'][0]['p:titleStyle'][0]['a:lvl1pPr'][0].$.latinLnBrk,
			hangingPunct: slideMaster['p:sldMaster']['p:txStyles'][0]['p:titleStyle'][0]['a:lvl1pPr'][0].$.hangingPunct,
			spaceBefore: slideMaster['p:sldMaster']['p:txStyles'][0]['p:titleStyle'][0]['a:lvl1pPr'][0]['a:spcBef'][0]['a:spcPct'][0].$.val,
			size: slideMaster['p:sldMaster']['p:txStyles'][0]['p:titleStyle'][0]['a:lvl1pPr'][0]['a:defRPr'][0].$.sz,
			kern: slideMaster['p:sldMaster']['p:txStyles'][0]['p:titleStyle'][0]['a:lvl1pPr'][0]['a:defRPr'][0].$.kern,
			color: slideMaster['p:sldMaster']['p:txStyles'][0]['p:titleStyle'][0]['a:lvl1pPr'][0]['a:defRPr'][0]['a:solidFill'][0]['a:schemeClr'][0].$.val,
			cap: slideMaster['p:sldMaster']['p:txStyles'][0]['p:titleStyle'][0]['a:lvl1pPr'][0]['a:defRPr'][0].$.cap,
			spc: slideMaster['p:sldMaster']['p:txStyles'][0]['p:titleStyle'][0]['a:lvl1pPr'][0]['a:defRPr'][0].$.spc,
			baseline: slideMaster['p:sldMaster']['p:txStyles'][0]['p:titleStyle'][0]['a:lvl1pPr'][0]['a:defRPr'][0].$.baseline
		}
	};

	let bodyStyle = {};

	for(let i=1; i<10; i++) {
		bodyStyle['level' + i + 'ParagraphProperty'] = {
			marL: !!slideMaster['p:sldMaster']['p:txStyles'][0]['p:bodyStyle'][0]['a:lvl'+i+'pPr'][0].$.marL ? slideMaster['p:sldMaster']['p:txStyles'][0]['p:bodyStyle'][0]['a:lvl'+i+'pPr'][0].$.marL : '0',
			indent: !!slideMaster['p:sldMaster']['p:txStyles'][0]['p:bodyStyle'][0]['a:lvl'+i+'pPr'][0].$.indent ? slideMaster['p:sldMaster']['p:txStyles'][0]['p:bodyStyle'][0]['a:lvl'+i+'pPr'][0].$.indent : '0',
			align: !!slideMaster['p:sldMaster']['p:txStyles'][0]['p:bodyStyle'][0]['a:lvl'+i+'pPr'][0].$.algn ? slideMaster['p:sldMaster']['p:txStyles'][0]['p:bodyStyle'][0]['a:lvl'+i+'pPr'][0].$.algn : 'l',
			defTabSz: !!slideMaster['p:sldMaster']['p:txStyles'][0]['p:bodyStyle'][0]['a:lvl'+i+'pPr'][0].$.defTabSz ? slideMaster['p:sldMaster']['p:txStyles'][0]['p:bodyStyle'][0]['a:lvl'+i+'pPr'][0].$.defTabSz : '0',
			rtl: !!slideMaster['p:sldMaster']['p:txStyles'][0]['p:bodyStyle'][0]['a:lvl'+i+'pPr'][0].$.rtl ? slideMaster['p:sldMaster']['p:txStyles'][0]['p:bodyStyle'][0]['a:lvl'+i+'pPr'][0].$.rtl : '0',
			eaLnBrk: !!slideMaster['p:sldMaster']['p:txStyles'][0]['p:bodyStyle'][0]['a:lvl'+i+'pPr'][0].$.eaLnBrk ? slideMaster['p:sldMaster']['p:txStyles'][0]['p:bodyStyle'][0]['a:lvl'+i+'pPr'][0].$.eaLnBrk : '0',
			latinLnBrk: !!slideMaster['p:sldMaster']['p:txStyles'][0]['p:bodyStyle'][0]['a:lvl'+i+'pPr'][0].$.latinLnBrk ? slideMaster['p:sldMaster']['p:txStyles'][0]['p:bodyStyle'][0]['a:lvl'+i+'pPr'][0].$.latinLnBrk : '0',
			hangingPunct: !!slideMaster['p:sldMaster']['p:txStyles'][0]['p:bodyStyle'][0]['a:lvl'+i+'pPr'][0].$.hangingPunct ? slideMaster['p:sldMaster']['p:txStyles'][0]['p:bodyStyle'][0]['a:lvl'+i+'pPr'][0].$.hangingPunct : '0',
			spaceBefore: !!slideMaster['p:sldMaster']['p:txStyles'][0]['p:bodyStyle'][0]['a:lvl'+i+'pPr'][0]['a:spcBef'] ? slideMaster['p:sldMaster']['p:txStyles'][0]['p:bodyStyle'][0]['a:lvl'+i+'pPr'][0]['a:spcBef'][0]['a:spcPct'][0].$.val : '0',
			size: slideMaster['p:sldMaster']['p:txStyles'][0]['p:bodyStyle'][0]['a:lvl'+i+'pPr'][0]['a:defRPr'][0].$.sz ? slideMaster['p:sldMaster']['p:txStyles'][0]['p:bodyStyle'][0]['a:lvl'+i+'pPr'][0]['a:defRPr'][0].$.sz : '0',
			kern: !!slideMaster['p:sldMaster']['p:txStyles'][0]['p:bodyStyle'][0]['a:lvl'+i+'pPr'][0]['a:defRPr'][0].$.kern ? slideMaster['p:sldMaster']['p:txStyles'][0]['p:bodyStyle'][0]['a:lvl'+i+'pPr'][0]['a:defRPr'][0].$.kern : '0',
			color: slideMaster['p:sldMaster']['p:txStyles'][0]['p:bodyStyle'][0]['a:lvl'+i+'pPr'][0]['a:defRPr'][0]['a:solidFill'][0]['a:schemeClr'][0].$.val,
			cap: !!slideMaster['p:sldMaster']['p:txStyles'][0]['p:bodyStyle'][0]['a:lvl'+i+'pPr'][0]['a:defRPr'][0].$.cap ? slideMaster['p:sldMaster']['p:txStyles'][0]['p:bodyStyle'][0]['a:lvl'+i+'pPr'][0]['a:defRPr'][0].$.cap : 'none',
			spc: !!slideMaster['p:sldMaster']['p:txStyles'][0]['p:bodyStyle'][0]['a:lvl'+i+'pPr'][0]['a:defRPr'][0].$.spc ? slideMaster['p:sldMaster']['p:txStyles'][0]['p:bodyStyle'][0]['a:lvl'+i+'pPr'][0]['a:defRPr'][0].$.spc : '0',
			baseline: !!slideMaster['p:sldMaster']['p:txStyles'][0]['p:bodyStyle'][0]['a:lvl'+i+'pPr'][0]['a:defRPr'][0].$.baseline ? slideMaster['p:sldMaster']['p:txStyles'][0]['p:bodyStyle'][0]['a:lvl'+i+'pPr'][0]['a:defRPr'][0].$.baseline : '0',
			buColor: !!slideMaster['p:sldMaster']['p:txStyles'][0]['p:bodyStyle'][0]['a:lvl'+i+'pPr'][0]['a:buClr'] ? slideMaster['p:sldMaster']['p:txStyles'][0]['p:bodyStyle'][0]['a:lvl'+i+'pPr'][0]['a:buClr'][0]['a:schemeClr'][0].$.val : 'tx1',
			buFont: !!slideMaster['p:sldMaster']['p:txStyles'][0]['p:bodyStyle'][0]['a:lvl'+i+'pPr'][0]['a:buFont'] ? slideMaster['p:sldMaster']['p:txStyles'][0]['p:bodyStyle'][0]['a:lvl'+i+'pPr'][0]['a:buFont'][0].$.typeface : 'Arial',
			buFontPitch: !!slideMaster['p:sldMaster']['p:txStyles'][0]['p:bodyStyle'][0]['a:lvl'+i+'pPr'][0]['a:buFont'] ? slideMaster['p:sldMaster']['p:txStyles'][0]['p:bodyStyle'][0]['a:lvl'+i+'pPr'][0]['a:buFont'][0].$.pitchFamily : '0',
			buChar: !!slideMaster['p:sldMaster']['p:txStyles'][0]['p:bodyStyle'][0]['a:lvl'+i+'pPr'][0]['a:buChar'][0].$.char ? slideMaster['p:sldMaster']['p:txStyles'][0]['p:bodyStyle'][0]['a:lvl'+i+'pPr'][0]['a:buChar'][0].$.char : '•'
		};
	}

	let otherStyle = {};
	for(let i=1; i<10; i++) {
		otherStyle['level' + i + 'ParagraphProperty'] = {
			marL: !!slideMaster['p:sldMaster']['p:txStyles'][0]['p:otherStyle'][0]['a:lvl'+i+'pPr'][0].$.marL ? slideMaster['p:sldMaster']['p:txStyles'][0]['p:otherStyle'][0]['a:lvl'+i+'pPr'][0].$.marL : '0',
			indent: !!slideMaster['p:sldMaster']['p:txStyles'][0]['p:otherStyle'][0]['a:lvl'+i+'pPr'][0].$.indent ? slideMaster['p:sldMaster']['p:txStyles'][0]['p:otherStyle'][0]['a:lvl'+i+'pPr'][0].$.indent : '0',
			align: !!slideMaster['p:sldMaster']['p:txStyles'][0]['p:otherStyle'][0]['a:lvl'+i+'pPr'][0].$.algn ? slideMaster['p:sldMaster']['p:txStyles'][0]['p:otherStyle'][0]['a:lvl'+i+'pPr'][0].$.algn : 'l',
			defTabSz: !!slideMaster['p:sldMaster']['p:txStyles'][0]['p:otherStyle'][0]['a:lvl'+i+'pPr'][0].$.defTabSz ? slideMaster['p:sldMaster']['p:txStyles'][0]['p:otherStyle'][0]['a:lvl'+i+'pPr'][0].$.defTabSz : '0',
			rtl: !!slideMaster['p:sldMaster']['p:txStyles'][0]['p:otherStyle'][0]['a:lvl'+i+'pPr'][0].$.rtl ? slideMaster['p:sldMaster']['p:txStyles'][0]['p:otherStyle'][0]['a:lvl'+i+'pPr'][0].$.rtl : '0',
			eaLnBrk: !!slideMaster['p:sldMaster']['p:txStyles'][0]['p:otherStyle'][0]['a:lvl'+i+'pPr'][0].$.eaLnBrk ? slideMaster['p:sldMaster']['p:txStyles'][0]['p:otherStyle'][0]['a:lvl'+i+'pPr'][0].$.eaLnBrk : '0',
			latinLnBrk: !!slideMaster['p:sldMaster']['p:txStyles'][0]['p:otherStyle'][0]['a:lvl'+i+'pPr'][0].$.latinLnBrk ? slideMaster['p:sldMaster']['p:txStyles'][0]['p:otherStyle'][0]['a:lvl'+i+'pPr'][0].$.latinLnBrk : '0',
			hangingPunct: !!slideMaster['p:sldMaster']['p:txStyles'][0]['p:otherStyle'][0]['a:lvl'+i+'pPr'][0].$.hangingPunct ? slideMaster['p:sldMaster']['p:txStyles'][0]['p:otherStyle'][0]['a:lvl'+i+'pPr'][0].$.hangingPunct : '0',
			spaceBefore: !!slideMaster['p:sldMaster']['p:txStyles'][0]['p:otherStyle'][0]['a:lvl'+i+'pPr'][0]['a:spcBef'] ? slideMaster['p:sldMaster']['p:txStyles'][0]['p:otherStyle'][0]['a:lvl'+i+'pPr'][0]['a:spcBef'][0]['a:spcPct'][0].$.val : '0',
			size: slideMaster['p:sldMaster']['p:txStyles'][0]['p:otherStyle'][0]['a:lvl'+i+'pPr'][0]['a:defRPr'][0].$.sz ? slideMaster['p:sldMaster']['p:txStyles'][0]['p:otherStyle'][0]['a:lvl'+i+'pPr'][0]['a:defRPr'][0].$.sz : '0',
			kern: !!slideMaster['p:sldMaster']['p:txStyles'][0]['p:otherStyle'][0]['a:lvl'+i+'pPr'][0]['a:defRPr'][0].$.kern ? slideMaster['p:sldMaster']['p:txStyles'][0]['p:otherStyle'][0]['a:lvl'+i+'pPr'][0]['a:defRPr'][0].$.kern : '0',
			color: slideMaster['p:sldMaster']['p:txStyles'][0]['p:otherStyle'][0]['a:lvl'+i+'pPr'][0]['a:defRPr'][0]['a:solidFill'][0]['a:schemeClr'][0].$.val,
			cap: !!slideMaster['p:sldMaster']['p:txStyles'][0]['p:otherStyle'][0]['a:lvl'+i+'pPr'][0]['a:defRPr'][0].$.cap ? slideMaster['p:sldMaster']['p:txStyles'][0]['p:otherStyle'][0]['a:lvl'+i+'pPr'][0]['a:defRPr'][0].$.cap : 'none',
			spc: !!slideMaster['p:sldMaster']['p:txStyles'][0]['p:otherStyle'][0]['a:lvl'+i+'pPr'][0]['a:defRPr'][0].$.spc ? slideMaster['p:sldMaster']['p:txStyles'][0]['p:otherStyle'][0]['a:lvl'+i+'pPr'][0]['a:defRPr'][0].$.spc : '0',
			baseline: !!slideMaster['p:sldMaster']['p:txStyles'][0]['p:otherStyle'][0]['a:lvl'+i+'pPr'][0]['a:defRPr'][0].$.baseline ? slideMaster['p:sldMaster']['p:txStyles'][0]['p:otherStyle'][0]['a:lvl'+i+'pPr'][0]['a:defRPr'][0].$.baseline : '0',
			buColor: !!slideMaster['p:sldMaster']['p:txStyles'][0]['p:otherStyle'][0]['a:lvl'+i+'pPr'][0]['a:buClr'] ? slideMaster['p:sldMaster']['p:txStyles'][0]['p:otherStyle'][0]['a:lvl'+i+'pPr'][0]['a:buClr'][0]['a:schemeClr'][0].$.val : 'tx1',
			buFont: !!slideMaster['p:sldMaster']['p:txStyles'][0]['p:otherStyle'][0]['a:lvl'+i+'pPr'][0]['a:buFont'] ? slideMaster['p:sldMaster']['p:txStyles'][0]['p:otherStyle'][0]['a:lvl'+i+'pPr'][0]['a:buFont'][0].$.typeface : 'Arial',
			buFontPitch: !!slideMaster['p:sldMaster']['p:txStyles'][0]['p:otherStyle'][0]['a:lvl'+i+'pPr'][0]['a:buFont'] ? slideMaster['p:sldMaster']['p:txStyles'][0]['p:otherStyle'][0]['a:lvl'+i+'pPr'][0]['a:buFont'][0].$.pitchFamily : '0',
			buChar: !!slideMaster['p:sldMaster']['p:txStyles'][0]['p:otherStyle'][0]['a:lvl'+i+'pPr'][0]['a:buChar'] ? slideMaster['p:sldMaster']['p:txStyles'][0]['p:otherStyle'][0]['a:lvl'+i+'pPr'][0]['a:buChar'][0].$.char : '•'
		};
	}

	ret['textStyle'] = {
		titleStyle: titleStyle,
		bodyStyle: bodyStyle,
		otherStyle: otherStyle
	};

	//parsing slideLayout, only non place holder required.

	if(!!slideLayout['p:sldLayout']['p:cSld'][0]['p:spTree'][0]['p:sp']) {
		slideLayout['p:sldLayout']['p:cSld'][0]['p:spTree'][0]['p:sp'].reduce((pre, cur) => {
			var ph = false;
			for(var i in cur['p:nvSpPr'][0]['p:nvPr'][0]) {
				if(i === 'p:ph') ph = true;
			}
			if(!ph) {
				var ret = {
					id: cur['p:nvSpPr'][0]['p:cNvPr'][0].$.id,
					type: 'shape',
					name: cur['p:nvSpPr'][0]['p:cNvPr'][0].$.name,
					x: cur['p:spPr'][0]['a:xfrm'][0]['a:off'][0].$.x,
					y: cur['p:spPr'][0]['a:xfrm'][0]['a:off'][0].$.y,
					cx: cur['p:spPr'][0]['a:xfrm'][0]['a:ext'][0].$.cx,
					cy: cur['p:spPr'][0]['a:xfrm'][0]['a:ext'][0].$.cy,
					presetGeom: cur['p:spPr'][0]['a:prstGeom'][0].$.prst,
					solidFill: !!cur['p:spPr'][0]['a:solidFill'] ? cur['p:spPr'][0]['a:solidFill'][0]['a:schemeClr'][0].$.val : ''
				};
				pre.push(ret);
				return pre;
			} else {
				return pre;
			}
		}, [])
		.forEach((shape, idx) => {
			ret['shapes'].push(shape);
		});
	}
	if(!!slideLayout['p:sldLayout']['p:cSld'][0]['p:spTree'][0]['p:pic']) {
		slideLayout['p:sldLayout']['p:cSld'][0]['p:spTree'][0]['p:pic'].reduce((pre, cur) => {
			var ret = {
				id: cur['p:nvPicPr'][0]['p:cNvPr'][0].$.id,
				type: 'pic',
				name: cur['p:nvPicPr'][0]['p:cNvPr'][0].$.name,
				x: cur['p:spPr'][0]['a:xfrm'][0]['a:off'][0].$.x,
				y: cur['p:spPr'][0]['a:xfrm'][0]['a:off'][0].$.y,
				cx: cur['p:spPr'][0]['a:xfrm'][0]['a:ext'][0].$.cx,
				cy: cur['p:spPr'][0]['a:xfrm'][0]['a:ext'][0].$.cy,
				presetGeom: cur['p:spPr'][0]['a:prstGeom'][0].$.prst,
				blip: {
					embed: relations[layoutTarget][cur['p:blipFill'][0]['a:blip'][0].$['r:embed']],
					srcRect: {
						l: !!cur['p:blipFill'][0]['a:srcRect'][0].$.l ? cur['p:blipFill'][0]['a:srcRect'][0].$.l : 0,
						t: !!cur['p:blipFill'][0]['a:srcRect'][0].$.t ? cur['p:blipFill'][0]['a:srcRect'][0].$.t : 0,
						r: !!cur['p:blipFill'][0]['a:srcRect'][0].$.r ? cur['p:blipFill'][0]['a:srcRect'][0].$.r : 0,
						b: !!cur['p:blipFill'][0]['a:srcRect'][0].$.b ? cur['p:blipFill'][0]['a:srcRect'][0].$.b : 0
					}
				}
			};
			pre.push(ret);
			return pre;
		}, [])
		.forEach(pic => {
			ret['shapes'].push(pic);
		});
	}

	//slide parsing, should trace slideLayout and slideMaster to get to properties of shapes with the same id
	//level style should be build form presentation's default then slideMater then a:pPr in a:p in order to determine the real properti to apply
	//shape with p:nvSpPr.p:cNvSpPr.txBox=='1' is text box, so no level style applied.

	if(!!slide['p:sld']['p:cSld'][0]['p:spTree'][0]['p:sp']) {
		ret['shapes'] = slide['p:sld']['p:cSld'][0]['p:spTree'][0]['p:sp'].reduce((pre, cur) => {
			var ret = shapeParser(cur);
			pre.push(ret);
			return pre;
		}, []);
	}


	return ret;

	function shapeParser(cur) {
		var ret = {
			id: cur['p:nvSpPr'][0]['p:cNvPr'][0].$.id,
			type: 'shape',
			name: cur['p:nvSpPr'][0]['p:cNvPr'][0].$.name,
			x: !!cur['p:spPr'][0]['a:xfrm'] ? cur['p:spPr'][0]['a:xfrm'][0]['a:off'][0].$.x : null,
			y: !!cur['p:spPr'][0]['a:xfrm'] ? cur['p:spPr'][0]['a:xfrm'][0]['a:off'][0].$.y : null,
			cx: !!cur['p:spPr'][0]['a:xfrm'] ? cur['p:spPr'][0]['a:xfrm'][0]['a:ext'][0].$.cx : null,
			cy: !!cur['p:spPr'][0]['a:xfrm'] ? cur['p:spPr'][0]['a:xfrm'][0]['a:ext'][0].$.cy : null,
			presetGeom: !!cur['p:spPr'][0]['a:prstGeom'] ? cur['p:spPr'][0]['a:prstGeom'][0].$.prst : null,
			solidFill: !!cur['p:spPr'][0]['a:solidFill'] ? cur['p:spPr'][0]['a:solidFill'][0]['a:schemeClr'][0].$.val : ''
		};
		if(!!cur['p:txBody'][0]['a:p'][0]['a:r']) {
			ret.paragraphs = textParser(cur['p:txBody']);
		}

		return ret;
	}

	function textParser(txt) {
		return txt[0]['a:p'].reduce((pre, cur) => {
			var ret = {
				text: cur['a:r'][0]['a:t']
			};
			pre.push(ret);
			return pre;
		}, []);
	}
}
