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
	ret['background'] = {
		solidFill: {
			srcRgbColor: slideMaster['p:sldMaster']['p:cSld'][0]['p:bg'][0]['p:bgRef'][0]['a:schemeClr'][0].$.val
		}
	};
	ret['shapes'] = slideMaster['p:sldMaster']['p:cSld'][0]['p:spTree'][0]['p:sp'].reduce(function(pre, cur) {
		var ph = false;
		for(var i in cur['p:nvSpPr'][0]['p:nvPr']) {
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
	}, []);
	/*if(!!slideMaster['p:sldMaster']['p:cSld'][0]['p:spTree'][0]['p:pic']) {
		ret['shapes'] = slideMaster['p:sldMaster']['p:cSld'][0]['p:spTree'][0]['p:pic'].reduce(function(pre, cur) {
			var ret = {
				id: cur[':nvPicPr'][0]['p:cNvPr'][0].$.id,
				type: 'pic',
				name: cur['p:nvPicPr'][0]['p:cNvPr'][0].$.name,
				x: cur['p:spPr'][0]['a:xfrm'][0]['a:off'][0].$.x,
				y: cur['p:spPr'][0]['a:xfrm'][0]['a:off'][0].$.y,
				cx: cur['p:spPr'][0]['a:xfrm'][0]['a:ext'][0].$.cx,
				cy: cur['p:spPr'][0]['a:xfrm'][0]['a:ext'][0].$.cy,
				presetGeom: cur['p:spPr'][0]['a:prstGrom'][0].$.prst,
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
		}, ret['shapes']);
	}*/
	
	return ret;
}