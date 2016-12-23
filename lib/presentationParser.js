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
	return presentation;
}
