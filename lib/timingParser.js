const parsers = {
	'p:tnLst': function(obj) {
		let ret = {name:'p:tnLst'};
		ret.child = _chld(obj);
		return ret;
	},
	'p:bldLst': function(obj) {
		let ret = {name:'p:bldLst'};
		ret.child = _chld(obj);
		return ret;
	},
	'p:childTnLst': function(obj) {
		let ret = _attr(obj);
		ret.name = 'p:childTnLst';
		ret.childTnLst = _chld(obj);
		return ret;
	},
	'p:stCondLst': function(obj) {
		let ret = _attr(obj);
		ret.name = 'p:stCondLst';
		ret.stCondLst = _chld(obj);
		return ret;
	},
	'p:attrNameLst': function(obj) {
		let ret = _attr(obj);
		ret.name = 'p:attrNameLst';
		ret.attrNameLst = _chld(obj);
		return ret;
	},
	'p:tavLst': function(obj) {
		let ret = _attr(obj);
		ret.name = 'p:tavLst';
		ret.tavLst = _chld(obj);
		return ret;
	},
	'p:bldP': function(obj) {
		let ret = _attr(obj);
		ret.name = 'p:bldP';
		ret.child = _chld(obj);
		return ret;
	},
	'p:par': function(obj) {
		let ret = _attr(obj);
		ret.name = 'p:par';
		let tmpchild = _chld(obj);
		let cTn = tmpchild.filter(x => x.name === 'p:cTn')[0];
		ret = _assign(ret, cTn);
		return ret;
	},
	'p:cTn': function(obj) {
		let ret = _attr(obj);
		ret.name = 'p:cTn';
		let tmpchild = _chld(obj);
		tmpchild.forEach(cur => {
			ret = _assign(ret, cur);
		});
		return ret;
	},
	'p:seq': function(obj) {
		let ret = _attr(obj);
		ret.name = 'p:seq';
		let tmpchild = _chld(obj);
		let cTn = tmpchild.filter(x => x.name === 'p:cTn')[0];
		ret = _assign(ret, cTn);
		return ret;
	},
	'p:cond': function(obj) {
		let ret = _attr(obj);
		ret.name = 'p:cond';
		return ret;
	},
	'p:set': function(obj) {
		let ret = _attr(obj);
		ret.name = 'p:set';
		let tmpchild = _chld(obj);
		tmpchild.forEach(cur => {
			switch(cur.name) {
				case 'p:cBhvr':
					ret = _assign(ret, cur);
					break;
				case 'p:to':
					ret = _assign(ret, cur);
					break;
				default:
					if(!ret.child) ret.child = [];
					ret.child.push(cur);
					break;
			}
		});
		return ret;
	},
	'p:cBhvr': function(obj) {
		let ret = _attr(obj);
		ret.name = 'p:cBhvr';
		let tmpchild = _chld(obj);
		tmpchild.forEach(cur => {
			switch(cur.name) {
				case 'p:cTn':
					ret = _assign(ret, cur);
					break;
				case 'p:tgtEl':
					ret.tgtEl = cur.spid;
					break;
				case 'p:attrNameLst':
					ret.attrNameLst = cur.attrNameLst
					break;
				default:
					throw 'p:cBhvr child parsing not supported';
			}
		});
		return ret;
	},
	'p:tgtEl': function(obj) {
		let ret = _attr(obj);
		ret.name = 'p:tgtEl';
		let tmpchild = _chld(obj);
		tmpchild.forEach(cur => {
			switch(cur.name) {
				case 'p:spTgt':
					ret.spid = cur.spid;
					break;
			}
		});
		return ret;
	},
	'p:spTgt': function(obj) {
		let ret = _attr(obj);
		ret.name = 'p:spTgt';
		return ret;
	},
	'p:attrName': function(obj) {
		let ret = _attr(obj);
		ret = _assign(ret, _txt(obj));
		ret.name = 'p:attrName';
		return ret;
	},
	'p:to': function(obj) {
		let ret = _attr(obj);
		ret.name = 'p:to';
		let tmpchild = _chld(obj);
		tmpchild.forEach(cur => {
			ret.to = cur.val;
		});
		return ret;
	},
	'p:by': function(obj) {
		let ret = _attr(obj);
		ret.name = 'p:by';
		let tmpchild = _chld(obj);
		tmpchild.forEach(cur => {
			ret.to = cur.val;
		});
		return ret;
	},
	'p:strVal': function(obj) {
		let ret = _attr(obj);
		ret.name = 'p:strVal';
		return ret;
	},
	'p:animEffect': function(obj) {
		let ret = _attr(obj);
		ret.name = 'p:animEffect';
		let tmpchild = _chld(obj);
		tmpchild.forEach(cur => {
			switch(cur.name) {
				case 'p:cBhvr':
					ret = _assign(ret, cur);
					break;
				default:
					if(!ret.child) ret.child = [];
					ret.child.push(cur);
					break;
			}
		});
		return ret;
	},
	'p:animMotion': function(obj) {
		let ret = _attr(obj);
		ret.name = 'p:animMotion';
		let tmpchild = _chld(obj);
		tmpchild.forEach(cur => {
			switch(cur.name) {
				case 'p:cBhvr':
					ret = _assign(ret, cur);
					break;
				default:
					if(!ret.child) ret.child = [];
					ret.child.push(cur);
					break;
			}
		});
		return ret;
	},
	'p:animScale': function(obj) {
		let ret = _attr(obj);
		ret.name = 'p:animScale';
		let tmpchild = _chld(obj);
		tmpchild.forEach(cur => {
			switch(cur.name) {
				case 'p:cBhvr':
					ret = _assign(ret, cur);
					break;
				case 'p:by':
					ret.by = {x:cur.x, y:cur.y};
					break;
				default:
					if(!ret.child) ret.child = [];
					ret.child.push(cur);
					break;
			}
		});
		return ret;
	},
	'p:rCtr': function(obj) {
		let ret = _attr(obj);
		ret.name = 'p:rCtr';
		return ret;
	},
	'p:anim': function(obj) {
		let ret = _attr(obj);
		ret.name = 'p:anim';
		let tmpchild = _chld(obj);
		tmpchild.forEach(cur => {
			switch(cur.name) {
				case 'p:cBhvr':
				case 'p:tavLst':
					ret = _assign(ret, cur);
					break;
				default:
					if(!ret.child) ret.child = [];
					ret.child.push(cur);
					break;
			}
		});
		return ret;
	},
	'p:tav': function(obj) {
		let ret = _attr(obj);
		ret.name = 'p:tav';
		ret.child = _chld(obj);
		return ret;
	},
	'p:val': function(obj) {
		let ret = _attr(obj);
		ret.name = 'p:val';
		ret.child = _chld(obj);
		return ret;
	},
	'p:fltVal': function(obj) {
		let ret = _attr(obj);
		ret.name = 'p:fltVal';
		return ret;
	},
	'p:prevCondLst': function(obj) {
		let ret = _attr(obj);
		ret.name = 'p:prevCondLst';
		ret.child = _chld(obj);
		return ret;
	},
	'p:nextCondLst': function(obj) {
		let ret = _attr(obj);
		ret.name = 'p:nextCondLst';
		ret.child = _chld(obj);
		return ret;
	}
}

module.exports = function(timing) {
	if(!!timing && !!timing.$$) {
		let result = {};
		let tmpchild = _chld(timing);
		tmpchild.forEach(cur => {
			switch(cur.name) {
				case 'p:tnLst':
					result.tnLst = cur.child;
					break;
				case 'p:bldLst':
					result.bldLst = cur.child;
					break;
				default:
					throw 'unsupported timing direct child.';
			}
		});
		return result;
	} else {
		return {};
	}
};

function _attr(obj) {
	if(!!obj.$) {
		return _assign({}, obj.$);
	} else {
		return {};
	}
}

function _txt(obj) {
	if(!!obj._) {
		return {val: obj._};
	} else {
		return {};
	}
}

function _chld(obj) {
	if(!!obj.$$) {
		let result = obj.$$.reduce((pre, cur) => {
			if(parsers[cur['#name']]) {
				pre.push(parsers[cur['#name']](cur));
			} else {
				throw 'unsupported object: ' + cur['#name'];
			}
			return pre;
		}, []);
		return result;
	} else {
		return [];
	}
}

function _assign(a, b) {
	let ret = {};
	if(!!a) {
		Object.keys(a).forEach(key => {
			ret[key] = a[key];
		});
	}
	if(!!b) {
		Object.keys(b).forEach(key => {
			if(key !== 'name') {
				ret[key] = b[key];
			}
		});
	}
	return ret;
}