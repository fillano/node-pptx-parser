module.exports = presentationParser;

const parsers = require('./parsers');

function presentationParser(entries, pptx, relations) {
	let presentation = {};
	let root = pptx['ppt/presentation.xml'].$$;
	presentation['slideMasterIdList'] = [];
	presentation['slideIdList'] = [];

	root.forEach(z => {
		switch(z['#name']) {
			case 'p:sldMasterIdLst':
				z.$$.forEach(a => {
					let rid = a.$['r:id'];
					let target = relations['ppt/presentation.xml'][rid];
					presentation['slideMasterIdList'].push({id: a.$.id, rid: rid, target: target});
				});
			break;
			case 'p:sldIdLst':
				z.$$.forEach(b => {
					let rid = b.$['r:id'];
					let target = relations['ppt/presentation.xml'][rid];
					presentation['slideIdList'].push({id: b.$.id, rid: rid, target: target});
				});
			break;
			case 'p:sldSz':
				presentation['slideSize'] = {
					type: z.$.type,
					cx: z.$.cx,
					cy: z.$.cy
				};
			break;
			case 'p:defaultTextStyle':
				presentation.defaultTextStyle = parsers.presentationListStyleParser(null, z);
			break;
		}
	});
	return presentation;
}
