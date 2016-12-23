const path = require('path');

module.exports = typeParser;

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
