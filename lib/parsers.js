module.exports = {
	textParagraphPropertiesParser: textParagraphPropertiesParser,
	textCharacterPropertiesParser: textCharacterPropertiesParser,
	listStyleParser: listStyleParser,
	slideMasterParser: slideMasterParser
};

function slideMasterParser(obj, entry, relations, defTextStyle) {
	let ret = {}
	obj.$$
	.filter(z => z['#name'] === 'p:txStyles')
	.forEach(a => {
		ret.txStyles = {};
		a.$$.forEach(b => {
			switch(b['#name']) {
				case 'p:titleStyle':
					ret.txStyles.titleStyle = listStyleParser(defTextStyle, b);
				break;
				case 'p:bodyStyle':
					ret.txStyles.bodyStyle = listStyleParser(defTextStyle, b)
				break;
				case 'otherStyle':
					ret.txStyles.otherStyle = listStyleParser(defTextStyle, b);
				break
			}
		});
	})
	obj.$$.forEach(a => {
		switch(a['#name']) {
			case 'p:sldLayoutIdLst':
				ret.slideLayoutIdList = a.$$.reduce((pre, cur) => {
					let rid = cur.$['r:id'];
					let target = relations[entry][rid];
					pre.push({id: cur.$.id, rid: rid, target: target});
					return pre;
				}, []);
			break;
			case 'p:clrMap':
				ret.colorMap = a.$;
			break
			case 'p:cSld':
				ret.commonSlideData = masterSlideDataParser(a, ret.txStyles);
			break;
		}
	});
	return ret;
}

function slideLayoutParser(obj, def) {

}

function slideParser(presentation, master, layout, obj) {

}

function masterSlideDataParser(obj, txStyles) {
	let ret = {};
	obj.$$.forEach(a => {
		switch(a['#name']) {
			case 'p:bg':
				a.$$
				.filter(b => b['#name'] === 'p:bgRef')
				.forEach(c => {
					c.$$.filter(d => d['#name'] === 'a:schemeClr')
					.forEach(e => {
						ret.background = e.$.val;
					});
				});
			break;
			case 'p:spTree':
				ret.shapes = [];
				a.$$.forEach(b => {
					switch(b['#name']) {
						case 'p:sp':
							ret.shapes.push(shapeParser(null, b, txStyles));
						break;
						case 'p:pic':
							ret.shapes.push(picParser(b));
						break;
					}
				});
			break;
		}
	});
	return ret;
}

function commonSlideDataParser(obj, layout) {
	let ret = {};
	obj.$$.forEach(a => {
		switch(a['#name']) {
			case 'p:bg':
				ret.background = commonChldParser(a, 'a:schemeClr');
			break;
			case 'p:spTree':
				ret.shapes = [];
				a.$$.forEach(b => {
					switch(b['#name']) {
						case 'p:sp':
							let spid = obj.
							ret.shapes.push(shapeParser(null, obj, ))
						break;
						case 'p:pic':
						break;
					}
				});
			break;
		}
	});
	return ret;
}

function shapeParser(def, obj, lstStyle) {
	if(typeof def === 'undefined' || def === null) {
		def = {
			/* attributes */
			id: null,
			type: 'shape',
			spType: null,
			x: null,
			y: null,
			cx: null,
			cy: null,
			presetGeom: null,
			/* children */
			textBody: null
		};
	} else {
		def = Object.assign({}, def);
	}
	obj.$$.forEach(a => {
		switch(a['#name']) {
			case 'p:nvSpPr':
				!!a.$$ && a.$$.forEach(b => {
					switch(b['#name']) {
						case 'p:cNvPr':
							def.id = b.$.id;
							def.name = b.$.name;
						break;
						case 'p:nvPr':
							if(!!b.$$ && b.$$.length > 0) {
								def.spType = b.$$.filter(x => x['#name'] === 'p:ph')[0].$.type;
							}
						break;
					}
				});
			break;
			case 'p:spPr':
				!!a.$$ && a.$$.forEach(b => {
					switch(b['#name']) {
						case 'a:xfrm':
							!!b.$$ && b.$$.forEach(c => {
								switch(c['#name']) {
									case 'a:off':
										def.x = parseInt(c.$.x, 10);
										def.y = parseInt(c.$.y, 10);
									break;
									case 'a:ext':
										def.cx = parseInt(c.$.cx, 10);
										def.cy = parseInt(c.$.cy, 10);
									break;
								}
							});
						break;
						case 'a:prstGeom':
							def.presetGeom = b.$.prst;
						break;
					}
				});
			break;
			case 'p:txBody':
				def.textBody = textBodyParser(null, a, lstStyle);
			break;
		}
	});
	return def;
}

function picParser(def, obj) {

}

function textBodyParser(def, obj, lstStyle) {
	let ret = {};
	if(!!def) ret = Object.assign({}, def);
	ret.paragraphs = [];
	obj.$$.forEach(a => {
		switch(a['#name']) {
			case 'a:bodyPr':
				ret = Object.assign(ret, a.$);
			break;
			case 'a:p':
				ret.paragraphs.push(textParagraphParser(null, a, textParagraphPropertiesParser(lstStyle, a)));
			break;
			case 'a:lstStyle':
				//ret.defaultListStyle = textParagraphPropertiesParser(lstStyle.defaultParagraphStyle, a);
				break;
			default:
				console.log(a['#name']);
		}
	});
	return ret;
}

function textParagraphParser(def, obj, style) {
	let ret = {};
	if(!!def) ret = Object.assign({}, def);
	obj.$$.filter(a => a['#name'] === 'a:pPr').forEach(b => {
		if(!!b.$.lvl) {
			let l = parseInt(b.$.lvl, 10);
			ret.lvl = l;
			ret = Object.assign(ret, style.bodyStyle['level'+(l+1)+'ParagraphProperty']);
		}
	});
	obj.$$.forEach(a => {
		switch(a['#name']) {
			case 'a:r':
				break;
			case 'a:br':
				break;
			case 'a:fld':
				break;
		}
	});
	return ret;
}

function textRunParser(def, obj) {

}

function listStyleParser(def, obj) {
	let ret = {};
	if(!!def) {
		ret = Object.assign({}, def);
		obj.$$.filter(b => b['#name'] === 'a:defPPr').forEach(c => ret.defaultParagraphStyle = textParagraphPropertiesParser(ret.defaultParagraphStyle, c));	
	} else {
		obj.$$.filter(b => b['#name'] === 'a:defPPr').forEach(c => ret.defaultParagraphStyle = textParagraphPropertiesParser(null, c));
	}
	obj.$$.forEach(c => {
		for(let i=1; i<10; i++) {
			if(c['#name'] === 'a:lvl' + i + 'pPr') {
				ret['level' + i + 'ParagraphProperty'] = textParagraphPropertiesParser(ret.defaultParagraphStyle, c);
			}
		}
	});
	return ret;
}

function textParagraphPropertiesParser(def, obj) {
	if('undefined' === typeof def || def === null) {
		def = {
			/* attributes */
			algn: null,
			defTabSz: null,
			eaLnBrk: null,
			fontAlgn: null,
			hangingPunct: null,
			indent: null,
			latinLnBrk: null,
			lvl: null,
			marL: null,
			marR: null,
			rtl: null,
			/* child elements */
			lnSpc: null,
			spcBef: null,
			spcAft: null,
			tabLst: null,
			defRPr: null,
			extLst: null,
			buClr: null,
			buSzPts: null,
			buFont: null,
			buChar: null,
			buNone: null
		};
	} else {
		//def = deepCopy(def);
		def = Object.assign({}, def);
		if(def.defTabSz !== null && typeof def.defTabSz === 'string') {
			def.defTabSz = parseInt(def.defTabSz, 10);
		}
		if(def.indent !== null && typeof def.indent === 'string') {
			def.indent = parseInt(def.indent, 10);
		}
		if(def.lvl !== null && typeof def.lvl === 'string') {
			def.lvl = parseInt(def.lvl, 10);
		}
		if(def.marL !== null && typeof def.marL === 'string') {
			def.marL = parseInt(def.marL, 10);
		}
		if(def.marR !== null && typeof def.marR === 'string') {
			def.marR = parseInt(def.marR, 10);
		}
		if(def.eaLnBrk !== null && typeof def.eaLnBrk === 'string') {
			def.eaLnBrk = def.eaLnBrk === '1' ? true : false;
		}
		if(def.latinLnBrk !== null && typeof def.latinLnBrk === 'string') {
			def.latinLnBrk = def.latinLnBrk === '1' ? true : false;
		}
		if(def.rtl !== null && typeof def.rtl === 'string') {
			def.rtl = def.rtl === '1' ? true : false;
		}
	}
	let attr = ['algn', 'defTabSz', 'eaLnBrk', 'fontAlgn', 'hangingPunct', 'indent', 'latinLnBrk', 'lvl', 'marL', 'marR', 'rtl'];
	let chld = ['a:lnSpc', 'a:spcBef', 'a:spcAft', 'a:tabLst', 'a:defRPr', 'a:extLst', 'a:buClr', 'a:buSzPts', 'a:buFont', 'a:buChar'];
	let chldParser = {
		'a:defRPr': o => textCharacterPropertiesParser(def.defRPr, o),
		'a:spcBef': o => parseInt(commonChldParser(o, 'a:spcPct'), 10),
		'a:spcAft': o => parseInt(commonChldParser(o, 'a:spcPct'), 10),
		'a:buClr': o => commonChldParser(o, 'a:schemeClr'),
		'a:buFont': o => o.$.typeface,
		'a:buChar': o => o.$.char,
		'a:buNone': () => true,
		'a:lnSpc': o => parseInt(commonChldParser(o, 'a:spcPct'), 10)
	};

	Object.keys(def).forEach(a => {
		if(attr.indexOf(a) > -1) {
			if(!!obj && !!obj.$ && !!obj.$[a]) {
				if(obj.$[a] !== null && (a === 'defTabSz' || a === 'marL' || a === 'marR' || a === 'lvl' || a === 'indent') && typeof obj.$[a] === 'string') {
					def[a] = parseInt(obj.$[a], 10);
				} else {
					if(obj.$[a] !== null && (a === 'eaLnBrk' || a === 'latinLnBrk' || a === 'rtl') && typeof obj.$[a] === 'string') {
						def[a] = obj.$[a] === '1' ? true : false;
					} else {
						def[a] = obj.$[a];
					}
				}
			}
		}
		if(chld.indexOf('a:'+a) > -1) {
			if(!!obj && !!obj.$$) {
				let t = obj.$$.filter(b => {return b['#name'] === 'a:'+a});
				if(!!t && t.length === 1) {
					if(!!chldParser[t[0]['#name']]) {
						def[a] = chldParser[t[0]['#name']](t[0]);
					}
				}
			}
		}
	});
	return def;
}

function commonChldParser(o, n) {
	if(!!o && !!o.$$) {
		let t = o.$$.filter(z => z['#name'] === n);
		if(!!t && t.length === 1) {
			return t[0].$.val;
		}
	}
	return null;
}

function textCharacterPropertiesParser(def, obj) {
	if(typeof def === 'undefine' || def === null) {
		def = {
			/* attributes */
			altLang: null,
			b: null,
			baseline: null,
			bmk: null,
			cap: null,
			dirty: null,
			err: null,
			i: null,
			kern: null,
			kumimoji: null,
			lang: null,
			noProof: null,
			normalizeH: null,
			smtClean: null,
			spc: null,
			strike: null,
			sz: null,
			u: null,
			/* child elements */
			ln: null,
			solidFill: null,
			effectLst: null,
			highlight: null,
			uLn: null,
			uFill: null,
			latin: null,
			ea: null,
			cs: null,
			sym: null,
			hlinkClick: null,
			hlinkMouseOver: null,
			rtl: null,
			extLst: null
		};
	} else {
		def = Object.assign({}, def);
		if(!! def.spc && def.spc !== null && typeof def.spc === 'string') {
			def.spc = parseInt(def.spc, 10);
		}
		if(!! def.kern && def.kern !== null && typeof def.kern === 'string') {
			def.kern = parseInt(def.kern, 10);
		}
		if(!! def.sz && def.sz !== null && typeof def.sz === 'string') {
			def.sz = parseInt(def.sz, 10);
		}
		if(!! def.kumimoji && def.kumimoji !== null && typeof def.kumimoji === 'string') {
			def.kumimoji = def.kumimoji === '1' ? true : false;
		}
		if(!! def.b && def.b !== null && typeof def.b === 'string') {
			def.b = def.b === '1' ? true : false;
		}
		if(!! def.i && def.i !== null && typeof def.i === 'string') {
			def.i = def.i === '1' ? true : false;
		}
		if(!! def.noProof && def.noProof !== null && typeof def.noProof === 'string') {
			def.noProof = def.noProof === '1' ? true : false;
		}
		if(!! def.normalizeH && def.normalizeH !== null && typeof def.normalizeH === 'string') {
			def.normalizeH = def.normalizeH === '1' ? true : false;
		}
		if(!! def.dirty && def.dirty !== null && typeof def.dirty === 'string') {
			def.dirty = def.dirty === '1' ? true : false;
		}
		if(!! def.err && def.err !== null && typeof def.err === 'string') {
			def.err = def.err === '1' ? true : false;
		}
		if(!! def.smtClean && def.smtClean !== null && typeof def.smtClean === 'string') {
			def.smtClean = def.smtClean === '1' ? true : false;
		}
	}
	let attr = ['altLang', 'b', 'baseline', 'bmk', 'cap', 'dirty', 'err', 'i', 'kern', 'kumimoji', 'lang', 'noProof', 'normalizeH', 'smtClean', 'spc', 'strike', 'sz', 'u'];
	let chld = ['a:ln', 'a:solidFill', 'a:effectLst', 'a:highlight', 'a:uLn', 'a:uFill', 'a:latin', 'a:latin', 'a:ea', 'a:cs', 'a:sym', 'a:hlinkClick', 'a:hlinkMouseOver', 'a:rtl', 'a:extLst'];
	let chldParser = {
		'a:latin': o => o.$.typeface,
		'a:ea': o => o.$.typeface,
		'a:cs': o => o.$.typeface,
		'a:solidFill': o => commonChldParser(o, 'a:schemeClr'),
		'a:highlight': o => commonChldParser(o, 'a:schemeClr')
	};
	Object.keys(def).forEach(a => {
		if(attr.indexOf(a) > -1) {
			if(!!obj && !!obj.$ && !!obj.$[a]) {
				if(obj.$[a] !== null && (a === 'kern' || a === 'spc' && a === 'sz') && typeof obj.$[a] === 'string') {
					def[a] = obj.$[a];
				} else {
					if(obj.$[a] !== null && (a === 'kumimoji' || a === 'b' && a === 'i' && a === 'noProof' || a === 'normalizeH' || a === 'dirty' || a === 'err' || a === 'smtClean') && typeof obj.$[a] === 'string') {
						def[a] = obj.$[a] === '1' ? true : false;
					} else {
						def[a] = obj.$[a];
					}
				}
			}
		}
		if(chld.indexOf('a:'+a) > -1) {
			if(!!obj && !!obj.$$) {
				let t = obj.$$.filter(b => {return b['#name'] === 'a:'+a});
				if(!!t && t.length === 1) {
					if(!!chldParser[t[0]['#name']]) {
						def[a] = chldParser[t[0]['#name']](t[0]);
					}
				}
			}
		}
	});
	return def;
}
