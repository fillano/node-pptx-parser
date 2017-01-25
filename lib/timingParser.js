module.exports = timingParser;
const fs = require('fs');

function timingParser(target, o) {
	let ret = {};
	o.$$.forEach(a => {
		switch(a['#name']) {
			case 'p:tnLst':
			ret.timeNodeList = nodeWalker(a);
			break;
			case 'p:bldLst':
			ret.buildList = nodeWalker(a);
			break;
		}
	});
	return ret;
}

let idx = 0;
function nodeWalker(o) {
	idx++;
	let ret = [{name:o['#name'],depth:idx,attr:o.$}];
	if(!!o._) ret['val'] = o._;
	if(!!o.$$) {
		ret = ret.concat(o.$$.reduce((pre, cur) => {
			pre = pre.concat(nodeWalker(cur));
			return pre;
		}, []));
	}
	idx--;
	return ret;
}