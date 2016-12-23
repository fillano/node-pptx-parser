const args = require('minimist')(process.argv.slice(2));
const path = require('path');
const fs = require('fs');

if(args._.length < 1) {
	console.log('Usage: node node-pptx-parser [path to main.json]');
}

let target = args._[0];
if(target.indexOf('main.json') < 0)
	target += path.sep + 'main.json';

fs.readFile(target, {encoding: 'utf-8'}, (err, data) => {
	if(!!err) return console.error(err);
	parser(data);
});

module.exports = parser;

function parser(data) {
	let pptx = JSON.parse(data);
	let entries = [];
	for(let i in pptx) {
		if(pptx.hasOwnProperty(i)) {
			entries.push(i);
		}
	}
	let relations = relationParser(entries, pptx);
	let types = typeParser(entries, pptx);
	let presentation = presentationParser(entries, pptx, relations);
	console.log(JSON.stringify(presentation, null, 2));
	return {
		relations: relations,
		types: types,
		presentation: presentation
	};
}

function relationParser(entries, pptx) {
	let relations = {};
	entries.sort().filter(x => {
		if(x.indexOf('ppt/') > -1 && x.indexOf('.rels') > -1)
			return true;
		return false;
	}).forEach(y => {
		pptx[y].Relationships.Relationship.forEach(z => {
			let key = y
			.split(path.sep)
			.filter(u => {
				if(u === '_rels') return false;
				return true;
			})
			.join(path.sep);
			key = key.substr(0, key.length - 5);
			if(!relations[key]) {
				relations[key] = {};
			}
			if(key === 'ppt/presentation.xml') {
				relations[key][z.$.Id] = 'ppt' + path.sep + z.$.Target
				relations[key]['ppt' + path.sep + z.$.Target] = z.$.Id;
			} else {
				relations[key][z.$.Id] = z.$.Target.replace('..', 'ppt');
				relations[key][z.$.Target.replace('..', 'ppt')] = z.$.Id;
			}
		})
	});
	return relations;
}

function typeParser(entries, pptx) {
	let types = {};
	entries.sort().filter(x => {
		if(x.indexOf('ppt/') > -1 && x.indexOf('.rels') > -1)
			return true;
		return false;
	}).forEach(y => {
		pptx[y].Relationships.Relationship.forEach(z => {
			let key = y
			.split(path.sep)
			.filter(u => {
				if(u === '_rels') return false;
				return true;
			})
			.join(path.sep);
			key = key.substr(0, key.length - 5);
			if(key === 'ppt/presentation.xml') {
				if(!!types[z.$.Type]) {
					types[z.$.Type].push({id: z.$.Id, target: z.$.Target});
				} else {
					types[z.$.Type] = [];
					types[z.$.Type].push({id: z.$.Id, target: z.$.Target});
				}
			} else {
				if(!!types[z.$.Type]) {
					types[z.$.Type].push({id: z.$.Id, target: z.$.Target.replace('..', 'ppt')});
				} else {
					types[z.$.Type] = [];
					types[z.$.Type].push({id: z.$.Id, target: z.$.Target.replace('..', 'ppt')});
				}
			}
		})
	});
	return types;
}

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
	presentation['defaultTextStyle'] = root['p:defaultTextStyle'][0];
	return presentation;
}
