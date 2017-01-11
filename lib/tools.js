module.exports = {
	deepAssign: deepAssign
}

function deepAssign(a, b) {
	if(b === null || 'undefined' === typeof b) return a;
	let ret = {};
	if(a === null || 'undefined' === typeof a) a = {};

	Object.keys(a).forEach(x => {
		if(!!b && b[x]) {
			if(typeof a[x] === 'object' && typeof b[x] === 'object' && !Array.isArray(b[x])) {
				ret[x] = deepAssign(a[x], b[x]);
			} else {
				ret[x] = b[x];
			}
		} else {
			ret[x] = a[x];
		}
	});
	Object.keys(b).forEach(x => {
		if(!!a[x]) {
			if(typeof a[x] === 'object' && typeof b[x] === 'object' && !Array.isArray(b[x])) {
				ret[x] = deepAssign(a[x], b[x]);
			} else {
				ret[x] = b[x];
			}
		} else {
			ret[x] = b[x];
		}
	});
	return ret;
}