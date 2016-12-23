module.exports = presentationParser;

function presentationParser(entries, pptx, relations) {
	let presentation = {};
	let root = pptx['ppt/presentation.xml']['p:presentation'];
	presentation['slideMasterIdList'] = [];
	root['p:sldMasterIdLst'][0]['p:sldMasterId'].forEach(a => {
		let rid = a.$['r:id'];
		let target = relations['ppt/presentation.xml'][rid];
		presentation['slideMasterIdList'].push({id: a.$.id, rid: rid, target: target});
	});
	presentation['slideIdList'] = [];
	root['p:sldIdLst'][0]['p:sldId'].forEach(b => {
		let rid = b.$['r:id'];
		let target = relations['ppt/presentation.xml'][rid];
		presentation['slideIdList'].push({id: b.$.id, rid: rid, target: target});
	});
	presentation['slideSize'] = {
		type: root['p:sldSz'][0].$.type,
		cx: root['p:sldSz'][0].$.cx,
		cy: root['p:sldSz'][0].$.cy
	};
	let ts = root['p:defaultTextStyle'][0];
	presentation['defaultTextStyle'] = {};
	presentation['defaultTextStyle']['defaultParagraphStyle'] = {};
	presentation['defaultTextStyle']['defaultParagraphStyle']['defaultRunProperty'] = {
		lang: ts['a:defPPr'][0]['a:defRPr'][0].$.lang
	};
	for(let i=1; i<10; i++) {
		presentation['defaultTextStyle']['level' + i + 'ParagraphProperty'] = {
			marL: ts['a:lvl' + i + 'pPr'][0].$.marL,
			algn: ts['a:lvl' + i + 'pPr'][0].$.algn,
			defTabSz: ts['a:lvl' + i + 'pPr'][0].$.defTabSz,
			rtl: ts['a:lvl' + i + 'pPr'][0].$.rtl,
			eaLnBrk: ts['a:lvl' + i + 'pPr'][0].$.eaLnBrk,
			latinLnBrk: ts['a:lvl' + i + 'pPr'][0].$.latinLnBrk,
			hangingPunct: ts['a:lvl' + i + 'pPr'][0].$.hangingPunct
		};
		let drp = ts['a:lvl' + i + 'pPr'][0]['a:defRPr'][0];
		presentation['defaultTextStyle']['level' + i + 'ParagraphProperty'].defaultRunProperty = {
			size: drp.$.sz,
			kern: drp.$.kern,
			color: drp['a:solidFill'][0]['a:schemeClr'][0].$.val
		};
	}

	return presentation;
}
