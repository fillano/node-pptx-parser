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
				case 'p:otherStyle':
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
					let target = relations[rid];
					pre.push({id: cur.$.id, rid: rid, target: target});
					return pre;
				}, []);
			break;
			case 'p:clrMap':
				ret.colorMap = a.$;
			break
			case 'p:cSld':
				ret.commonSlideData = masterSlideDataParser(a, ret.txStyles, relations);
			break;
		}
	});
	return ret;
}

function slideLayoutParser(obj, def) {

}

function slideParser(presentation, master, layout, obj) {

}

function masterSlideDataParser(obj, txStyles, relations) {
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
							ret.shapes.push(picParser(b, relations));
						break;
					}
				});
			break;
		}
	});
	return ret;
}

function commonSlideDataParser(obj, txStyles, relations) {
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
							ret.shapes.push(shapeParser(null, b, txStyles));
						break;
						case 'p:pic':
							ret.shapes.push(picParser(b, relations));
						break;
					}
				});
			break;
		}
	});
	return ret;
}

function shapeParser(def, obj, lstStyles) {
	if(typeof def === 'undefined' || def === null) {
		def = {type: 'shape'};
	} else {
		def = Object.assign({type: 'shape'}, def);
	}
	obj.$$.filter(x => x['#name'] === 'p:nvSpPr').forEach(a => {
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
				case 'p:cNvSpPr':
				//console.log(JSON.stringify(b, null, 2))
				break;
				default:
				break;
			}
		});
	});
	obj.$$.forEach(a => {
		switch(a['#name']) {
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
						case 'a:solidFill':
							//console.log(JSON.stringify(b, null, 2));
							def.solidFill = {
								srgbColor: b.$$.filter(x=>x['#name']==='a:schemeClr')[0].$.val
							}
						break;
					}
				});
			break;
			case 'p:txBody':
				def.textBody = textBodyParser(null, a, lstStyles, def.spType);
			break;
		}
	});
	return def;
}

function picParser(obj, relations) {
	let ret = {
		type: 'pic'
	};
	obj.$$.forEach(a => {
		switch(a['#name']) {
			case 'p:nvPicPr':
			a.$$.forEach(b => {
				switch(b['#name']) {
					case 'p:cNvPr':
						if(!!b.$) {
							ret.id = b.$.id;
							ret.name = b.$.name;
							ret.descr = b.$.descr;
						}
						break;
					case 'p:cNvPicPr':
						break;
					case 'p:nvPr':
						break;
				}
			});
			break;
			case 'p:blipFill':
			if(!!a.$) {
				Object.keys(a.$).forEach(b => {
					switch(b) {
						case 'rotWithShape':
							ret[b] = !!(parseInt(a.$[b], 10));
							break;
						default:
							ret[b] = a.$[b];
							break;
					}
				});
			}
			if(!!a.$$) {
				a.$$.forEach(b => {
					switch(b['#name']) {
						case 'a:blip':
							if(!!ret.blip) {
								ret.blip.embed = relations[b.$['r:embed']];
							} else {
								ret.blip = {};
								ret.blip.embed = relations[b.$['r:embed']];
							}
							break;
						case 'a:srcRect':
						if(!!b.$) {
							let rect = {l:0,t:0,r:0,b:0};
							if(!!ret.blip) {
								ret.blip.srcRect = Object.assign(rect, b.$);
							} else {
								ret.blip = {};
								ret.blip.srcRect = Object.assign(rect, b.$);
							}
						}
						break;
						case 'a:stretch':
						break;
					}
				});
			}
			break;
			case 'p:spPr':
			if(!!a.$$) {
				a.$$.forEach(b => {
					switch(b['#name']) {
						case 'a:xfrm':
						if(!!b.$$) {
							b.$$.forEach(c => {
								switch(c['#name']) {
									case 'a:off':
									ret.x = c.$.x;
									ret.y = c.$.y;
									break;
									case 'a:ext':
									ret.cx = c.$.cx;
									ret.cy = c.$.cy;
									break;
								}
							});
						}
						break;
						case 'a:prstGeom':
						if(!!b.$ && !!b.$.prst) {
							ret.presetGeom = b.$.prst;
						}
						break;
					}
				});
			}
			break;
		}
	});
	return ret;
}

function textBodyParser(def, obj, lstStyles, spType) {
	let ret = {};
	if(!!def) ret = Object.assign({}, def);
	if(obj.$$.filter(x => x['#name'] === 'a:p').length > 0) {
		ret.paragraphs = [];
	}
	let defaultListStyle = {};
	obj.$$.filter(x => x['#name'] === 'a:lstStyle').forEach(a => {
		switch(spType) {
			case 'title':
				defaultListStyle = textParagraphPropertiesParser(lstStyles.titleStyle, a);
				break;
			case 'body':
				defaultListStyle = textParagraphPropertiesParser(lstStyles.bodyStyle, a);
				break;
			default:
				defaultListStyle = textParagraphPropertiesParser(lstStyles.otherStyle, a);
				break;
		}
	});
	obj.$$.forEach(a => {
		switch(a['#name']) {
			case 'a:bodyPr':
				ret = Object.assign(ret, a.$);
			break;
			case 'a:p':
				ret.paragraphs.push(textParagraphParser(null, a, defaultListStyle));
			break;
			default:
			//console.log(JSON.stringify(a, null, 2))
			break;
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
			ret = Object.assign(ret, style['level'+(l+1)+'ParagraphProperty']);
		} else {
			let l = 0;
			ret.lvl = l;
			ret = Object.assign(ret, style['level'+(l+1)+'ParagraphProperty']);
		}
	});
	if(!!obj.$$ && obj.$$.length > 0) ret.runs = [];
	obj.$$.forEach(a => {
		switch(a['#name']) {
			case 'a:r':
				ret.runs.push(textRunParser(ret.defRPr, a));
				break;
			case 'a:br':
				ret.runs.push(lineBreakParser(a));
				break;
			case 'a:fld':
				ret.runs.push(textFieldParser(ret.defRPr, a));
				break;
			case 'a:endParaRPr':
				ret.runs.push({type: 'end'});
		}
	});
	return ret;
}

function textRunParser(def, obj) {
	let ret = {type: 'r'};
	if(!!def) ret = Object.assign(ret, def);
	if(!!obj.$$ && obj.$$.length > 0) {
		obj.$$.forEach(a => {
			switch(a['#name']) {
				case 'a:rPr':
					//console.log(JSON.stringify(a, null, 2))
					ret = Object.assign(ret, a.$);
					break;
				case 'a:t':
					ret.text = a._;
					break;
			}
		});
	}
	return ret;
}

function lineBreakParser(obj) {
	let ret = {type: 'br'};
	return ret;
}

function textFieldParser(def, obj) {
	let ret = {type: 'fld'};
	return ret;
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
		};
	} else {
		//def = deepCopy(def);
		def = Object.assign({}, def);
		if(def.eaLnBrk !== null && typeof def.eaLnBrk !== 'undefined' && typeof def.eaLnBrk !== 'boolean') {
			def.eaLnBrk = !!(parseInt(def.eaLnBrk, 10));
		}
		if(def.latinLnBrk !== null && typeof def.latinLnBrk !== 'undefined' && typeof def.latinLnBrk !== 'boolean') {
			def.latinLnBrk = !!(parseInt(def.latinLnBrk, 10));
		}
		if(def.rtl !== null && typeof def.rtl !== 'undefined' && typeof def.rtl !== 'boolean') {
			def.rtl = !!(parseInt(def.rtl, 10));
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
	if(!!obj.$) {
		Object.keys(obj.$).forEach(a => {
			switch(a) {
				case 'eaLnBrk':
				case 'latinLnBrk':
				case 'rtl':
					if('undefined' !== typeof obj.$[a] && null !== obj.$[a]) {
						def[a] = !!(parseInt(obj.$[a], 10));
					}
					break;
				default:
					def[a] = obj.$[a];
					break;
			}
		});
	}
	if(!!obj.$$) {
		obj.$$.forEach(a => {
			let key = a['#name'].substr(2);
			if(!!chldParser[a['#name']]) {
				def[key] = chldParser[a['#name']](a);
			}
		});
	}

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
		};
	} else {
		def = Object.assign({}, def);
		if(def.kumimoji !== null && typeof def.kumimoji !== 'undefined' && typeof def.kumimoji === 'boolean') {
			def.kumimoji = def.kumimoji === '1' ? true : false;
		}
		if(def.b !== null && typeof def.b !== 'undefined' && typeof def.b === 'boolean') {
			def.b = !!(parseInt(def.b, 10));
		}
		if(def.i !== null && typeof def.i !== 'undefined' && typeof def.i === 'boolean') {
			def.i = !!(parseInt(def.i, 10));
		}
		if(def.noProof !== null && typeof def.noProof !== 'undefined' && typeof def.noProof === 'boolean') {
			def.noProof = !!(parseInt(def.noProof, 10));
		}
		if(def.normalizeH !== null && typeof def.normalizeH !== 'undefined' && typeof def.normalizeH === 'boolean') {
			def.normalizeH = !!(parseInt(def.normalizeH, 10));
		}
		if(def.dirty !== null && typeof def.dirty !== 'undefined' && typeof def.dirty === 'boolean') {
			def.dirty = !!(parseInt(def.dirty, 10));
		}
		if(def.err !== null && typeof def.err !== 'undefined' && typeof def.err === 'boolean') {
			def.err = !!(parseInt(def.err, 10));
		}
		if(def.smtClean !== null && typeof def.smtClean !== 'undefined' && typeof def.smtClean === 'boolean') {
			def.smtClean = !!(parseInt(def.smtClean, 10));
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

	if(!!obj.$) {
		Object.keys(obj.$).forEach(a => {
			switch(a) {
				case 'kern':
				case 'spc':
				case 'sz':
					if('undefined' !== typeof obj.$[a] && null !== obj.$[a]) {
						def[a] = obj.$[a];
					}
					break;
				case 'kumimoji':
				case 'b':
				case 'i':
				case 'noProof':
				case 'normalizeH':
				case 'dirty':
				case 'err':
				case 'smtClean':
					if('undefined' !== typeof obj.$[a] && null !== obj.$[a]) {
						def[a] = !!(parseInt(obj.$[a], 10));
					}
					break;
				default:
				if('undefined' !== typeof obj.$[a] && null !== obj.$[a]) {
					def[a] = obj.$[a];
				}
				break;
			}
		});
	}

	if(!!obj.$$) {
		obj.$$.forEach(a => {
				let key = a['#name'].substr(2);
				if(!!chldParser[a['#name']]) {
					if(a['#name'] === 'a:solidFill') {
						a.$$.filter(x=>x['#name']==='a:schemeClr').forEach(b => {
							def[key] = b.$.val;
						});
					} else {
						def[key] = chldParser[a['#name']](a);
					}
				}
		});
	}

	return def;
}
