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
	return ret;
}