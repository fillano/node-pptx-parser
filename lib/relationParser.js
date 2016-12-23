const path = require('path');

module.exports = relationParser;

function relationParser(entries, pptx) {
	let relations = {};
	entries.sort().filter(x => {
		if(x.indexOf('ppt') === 0 && x.indexOf('.rels') > -1)
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
