module.exports = {
	textParagraphPropertiesParser: textParagraphPropertiesParser,
	textCharacterPropertiesParser: textCharacterPropertiesParser,
	listStyleParser: listStyleParser,
	slideMasterParser: slideMasterParser,
	themeParser: themeParser,
	slideLayoutParser: slideLayoutParser,
	slideParser, slideParser
};

const timingParser = require('./timingParser');

function slideMasterParser(obj, entry, relations, defTextStyle, theme) {
	let ret = {};

	obj.$$
	.filter(z => z['#name'] === 'p:clrMap')
	.forEach(a => {
		ret.colorMap = a.$;
	});

	obj.$$
	.filter(z => z['#name'] === 'p:txStyles')
	.forEach(a => {
		ret.txStyles = {};
		a.$$.forEach(b => {
			switch(b['#name']) {
				case 'p:titleStyle':
					ret.txStyles.titleStyle = listStyleParser(b);
				break;
				case 'p:bodyStyle':
					ret.txStyles.bodyStyle = listStyleParser(b);
				break;
				case 'p:otherStyle':
					ret.txStyles.otherStyle = listStyleParser(b);
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
			case 'p:cSld':
				ret.commonSlideData = masterSlideDataParser(a, relations);
			break;
			case 'p:timing':
				ret.timing = timingParser(a);
			break;
			/*case 'p:transition':
			break;
			case 'p:hf':
			break;*/
		}
	});
	return ret;
}

function slideLayoutParser(obj, entry, relations, theme) {
	let ret = {type: obj.$.type};
	obj.$$
	.filter(z => z['#name'] === 'p:clrMapOvr')
	.forEach(a => {
		ret.colorScheme = theme.colorScheme;
		a.$$.forEach(b => {
			if(b['#name'] === 'a:masterClrMapping') ret.colorMapOverride = 'master';
		});
	})
	obj.$$.forEach(a => {
		switch(a['#name']) {
			case 'p:cSld':
				if(!!a.$.name) ret.name = a.$.name;
				ret.commonSlideData = layoutSlideDataParser(a, relations);
			break;
			case 'p:timing':
				ret.timing = timingParser(a);
			break;
			/*case 'p:transition':
			break;
			case 'p:hf':
			break;*/
		}
	});
	return ret;
}

function slideParser(obj, entry, relations, defTextStyle, theme, slideLayout) {
	let ret = {};
	obj.$$
	.filter(z => z['#name'] === 'p:clrMapOvr')
	.forEach(a => {
		ret.colorScheme = theme.colorScheme;
		a.$$.forEach(b => {
			if(b['#name'] === 'a:masterClrMapping') ret.colorMapOverride = 'master';
		});
	})
	obj.$$.forEach(a => {
		switch(a['#name']) {
			case 'p:cSld':
				ret.commonSlideData = slideDataParser(a, relations);
			break;
			case 'p:timing':
				ret.timing = timingParser(entry, a);
			break;
			/*case 'transition':
			break;*/
		}
	});
	return ret;
}

function masterSlideDataParser(obj, relations) {
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
							ret.shapes.push(shapeParser(b));
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

function layoutSlideDataParser(obj, relations) {
	let ret = {};
	ret.shapes = [];
	obj.$$.forEach(a => {
		switch(a['#name']) {
			case 'p:spTree':
				a.$$.forEach(b => {
					switch(b['#name']) {
						case 'p:sp':
						ret.shapes.push(shapeParser(b));
						break;
						case 'p:pic':
						ret.shapes.push(picParser(b, relations));
						break;
						/*case 'p:nvGrpSpPr':
						break;
						case 'p:grpSpPr':
						break;*/
					}
				});
				break;
		}
	});
	return ret;
}

function slideDataParser(obj, relations) {
	let ret = {};
	ret.shapes = [];
	obj.$$.forEach(a => {
		switch(a['#name']) {
			case 'p:spTree':
				a.$$.forEach(b => {
					switch(b['#name']) {
						case 'p:sp':
							ret.shapes.push(shapeParser(b));
						break;
						case 'p:pic':
							//console.log(relations)
							ret.shapes.push(picParser(b, relations));
						break;
					}
				});
				break;
			case 'p:extLst':
			//todo
			break;
		}
	});
	return ret;
}

function shapeParser(obj) {
	let def = {type:'shape'};
	obj.$$.filter(x => x['#name'] === 'p:nvSpPr').forEach(a => {
		!!a.$$ && a.$$.forEach(b => {
			switch(b['#name']) {
				case 'p:cNvPr':
					def.id = b.$.id;
					def.name = b.$.name;
				break;
				case 'p:nvPr':
					def.spType = null;
					def.spIdx = null;
					def.spSize = null;
					def.spVert = null
					if(!!b.$$ && b.$$.length > 0) {
						b.$$.filter(x => x['#name'] === 'p:ph').forEach(y => {
							if(!!y.$) {
								if(!!y.$.type) def.spType = y.$.type;
								if(!!y.$.idx) def.spIdx = y.$.idx;
								if(!!y.$.sz) def.spSize = y.$.sz;
								if(!!y.$.vert) def.spVert = y.$.vert;
							}
						});
					}
				break;
				/*case 'p:cNvSpPr':
				//todo ?
				break;*/
			}
		});
	});
	obj.$$.forEach(a => {
		switch(a['#name']) {
			case 'p:spPr':
				!!a.$$ && a.$$.forEach(b => {
					switch(b['#name']) {
						case 'a:xfrm':
							if(!!b.$) {
								def = Object.assign(def, b.$);
							}
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
							!! b.$$ && b.$$.filter(x=>x['#name']==='a:schemeClr').forEach(c => {
								//def.solidFill = clrScheme[clrMap[c.$.val]];
								def.solidFill = c.$.val;
							});
						break;
					}
				});
			break;
			case 'p:txBody':
				def.textBody = textBodyParser(a);
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
								//console.log(ret.blip.embed)
							} else {
								ret.blip = {};
								ret.blip.embed = relations[b.$['r:embed']];
								//console.log(ret.blip.embed)
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

function textBodyParser(obj) {
	let ret = {};
	ret.paragraphs = [];
	let defaultListStyle = {};
	obj.$$.filter(x => x['#name'] === 'a:lstStyle').forEach(a => {
		defaultListStyle = listStyleParser(a);
	});
	ret.defaultListStyle = defaultListStyle;
	obj.$$.forEach(a => {
		switch(a['#name']) {
			case 'a:bodyPr':
				ret.spAutofit = false;
				if(!!a.$) {
					ret = Object.assign(ret, a.$);
				}
				if(!!a.$$) {
					a.$$.forEach(b => {
						switch(b['#name']) {
							case 'a:spAutoFit':
							ret.spAutofit = true;
							break;
						}
					});
				}
			break;
			case 'a:p':
				ret.paragraphs.push(textParagraphParser(a));
			break;
		}
	});
	return ret;
}

function textParagraphParser(obj) {
	let ret = {};

	if(!!obj.$$ && obj.$$.filter(a => a['#name'] === 'a:pPr').length > 0) {
		obj.$$.filter(a => a['#name'] === 'a:pPr').forEach(b => {
			if(!!b.$.lvl) {
				let l = parseInt(b.$.lvl, 10);
				ret.lvl = l;
			} else {
				let l = 0;
				ret.lvl = l;
			}
		});
	} else {
		let l = 0;
		ret.lvl = l;
	}

	if(!!obj.$$ && obj.$$.length > 0) ret.runs = [];
	obj.$$.forEach(a => {
		switch(a['#name']) {
			case 'a:r':
				ret.runs.push(textRunParser(a));
				break;
			case 'a:br':
				ret.runs.push(lineBreakParser(a));
				break;
			case 'a:fld':
				ret.runs.push(textFieldParser(a));
				break;
			case 'a:endParaRPr':
				ret.runs.push({type: 'end'});
		}
	});
	return ret;
}

function textRunParser(obj) {
	let ret = {type: 'r'};
	if(!!obj.$$ && obj.$$.length > 0) {
		obj.$$.forEach(a => {
			switch(a['#name']) {
				case 'a:rPr':
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

function listStyleParser(obj) {
	let ret = {};
	if(!!obj.$$) {
		obj.$$
		.filter(b => b['#name'] === 'a:defPPr')
		.forEach(c => ret.defaultParagraphStyle = textParagraphPropertiesParser(c));
		obj.$$.forEach(c => {
			for(let i=1; i<10; i++) {
				if(c['#name'] === 'a:lvl' + i + 'pPr') {
					ret['level' + i + 'ParagraphProperty'] = textParagraphPropertiesParser(c);
				}
			}
		});
	}
	return ret;
}

function textParagraphPropertiesParser(obj) {
	let def = {};

	let attr = ['algn', 'defTabSz', 'eaLnBrk', 'fontAlgn', 'hangingPunct', 'indent', 'latinLnBrk', 'lvl', 'marL', 'marR', 'rtl'];
	let chld = ['a:lnSpc', 'a:spcBef', 'a:spcAft', 'a:tabLst', 'a:defRPr', 'a:extLst', 'a:buClr', 'a:buSzPts', 'a:buFont', 'a:buChar'];
	let chldParser = {
		'a:defRPr': o => {
			let local = textCharacterPropertiesParser(o);
			if(typeof local === 'undefined') return {};
			return local;
		},
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
		obj.$$.forEach(function(a) {
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

function textCharacterPropertiesParser(obj) {
	let def = {};
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
					if('undefined' !== typeof obj.$[a] && null !== obj.$[a] && 'boolean' !== typeof obj.$[a]) {
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

function themeParser(obj, presentation) {
	let ret = {};
	obj.$$.forEach(a => {
		switch(a['#name']) {
			case 'a:themeElements':
				a.$$.forEach(b => {
					switch(b['#name']) {
						case 'a:clrScheme':
							ret.colorScheme = {name: b.$.name};
							b.$$.forEach(c => {
								let key = c['#name'].substr(2);
								c.$$.forEach(d => {
									ret.colorScheme[key] = '#' + d.$.val + '';
								});
							});
							break;
						case 'a:fontScheme':
							ret.fontScheme = {name: b.$.name};
							b.$$.forEach(c => {
								switch(c['#name']) {
									case 'a:majorFont':
										ret.fontScheme.majorFont = {fonts: {}};
										c.$$.forEach(d => {
											switch(d['#name']) {
												case 'a:latin':
												case 'a:ea':
												case 'a:cs':
												let key = d['#name'].substr(2);
												ret.fontScheme.majorFont[key] = d.$.typeface;
												break;
												case 'a:font':
												ret.fontScheme.majorFont.fonts[d.$.script] = d.$.typeface;
												break;
											}
										});
										break;
									case 'a:minorFont':
										ret.fontScheme.minorFont = {fonts: {}};
										c.$$.forEach(d => {
											switch(d['#name']) {
												case 'a:latin':
												case 'a:ea':
												case 'a:cs':
												let key = d['#name'].substr(2);
												ret.fontScheme.minorFont[key] = d.$.typeface;
												break;
												case 'a:font':
												ret.fontScheme.minorFont.fonts[d.$.script] = d.$.typeface;
												break;
											}
										});
										break;
								}
							});
							break;
						/*case 'a:fmtScheme':
						ret.fmtScheme = {name: b.$.name};
						b.$$.forEach(c => {
							switch(c['#name']) {
								case 'a:fillStyleLst':
								break;
								case 'a:lnStyleLst':
								break;
								case 'a:effectStyleLst':
								break;
								case 'a:bgFillStyleLst':
								break;
							}
						});
						break;*/
					}
				});
				break;
			/*case 'a:objectDefaults':
			break;*/
			/*case 'a:extraClrSchemeLst':
			break;*/
		}
	});
	return ret;
}