const assert = require('chai').assert;
const fs = require('fs');
const parser = require('../index');

describe('ppt/presentation.xml parsing test', () => {
	let data = '';
	before(done => {
		fs.readFile('./test/main.json', {encoding: 'utf-8'}, (err, d) => {
			if(!!err) throw err;
			data = d;
			done();
		});
	});
    describe('test slide size setting', () => {
        it('type, cx, cy should matched.', done => {
	    	let pptx = parser(data);
            assert.equal(pptx.presentation.slideSize.type, 'screen4x3');
            assert.equal(pptx.presentation.slideSize.cx, '9144000');
            assert.equal(pptx.presentation.slideSize.cy, '6858000');
            done();
        });
    });
    describe('test slideMasterIdList', () => {
		it('only one slideMaster in the list.', done => {
			let pptx = parser(data);
    		assert.lengthOf(pptx.presentation.slideMasterIdList, 1);
    		done();
		});
    	it('id, rid, target should matched.', done => {
			let pptx = parser(data);
    		assert.equal(pptx.presentation.slideMasterIdList[0].id, '2147483660');
    		assert.equal(pptx.presentation.slideMasterIdList[0].rid, 'rId1');
    		assert.equal(pptx.presentation.slideMasterIdList[0].target, 'ppt/slideMasters/slideMaster1.xml');
    		done();
    	});
    });
    describe('test slideIdList', () => {
    	it('four slides in the list.', done => {
    		let pptx = parser(data);
    		assert.lengthOf(pptx.presentation.slideIdList, 6);
    		done();
    	});
    	it('id, rid target should matched for each.', done => {
    		let pptx = parser(data);
    		let slide1 = pptx.presentation.slideIdList[0];
    		assert.equal(slide1.id, '256');
    		assert.equal(slide1.rid, 'rId2');
    		assert.equal(slide1.target, 'ppt/slides/slide1.xml');
    		let slide2 = pptx.presentation.slideIdList[1];
    		assert.equal(slide2.id, '257');
    		assert.equal(slide2.rid, 'rId3');
    		assert.equal(slide2.target, 'ppt/slides/slide2.xml');
    		let slide3 = pptx.presentation.slideIdList[2];
    		assert.equal(slide3.id, '258');
    		assert.equal(slide3.rid, 'rId4');
    		assert.equal(slide3.target, 'ppt/slides/slide3.xml');
    		let slide4 = pptx.presentation.slideIdList[3];
    		assert.equal(slide4.id, '259');
    		assert.equal(slide4.rid, 'rId5');
    		assert.equal(slide4.target, 'ppt/slides/slide4.xml');
    		done();
    	});
    });
	describe('test defaultTextStyle', () => {
		it('test defPPr', done => {
			let pptx = parser(data);
			let presentation = pptx['presentation'];
			assert.equal(presentation.defaultTextStyle.defaultParagraphStyle.defRPr.lang, 'zh-TW');
			done();
		});
		it('test lvl1pPr', done => {
			let pptx = parser(data);
			let lvlpPr = pptx.presentation.defaultTextStyle.level1ParagraphProperty;
			assert.equal(lvlpPr.defRPr.kern, '1200');
			assert.equal(lvlpPr.defRPr.sz, '1800');
			assert.equal(lvlpPr.defRPr.solidFill, 'tx1');
			assert.equal(lvlpPr.algn, 'l');
			assert.equal(lvlpPr.defTabSz, '457200');
			assert.equal(lvlpPr.marL, '0');
			done();
		});
		it('test lvl2pPr', done => {
			let pptx = parser(data);
			let lvlpPr = pptx.presentation.defaultTextStyle.level2ParagraphProperty;
			assert.equal(lvlpPr.defRPr.kern, '1200');
			assert.equal(lvlpPr.defRPr.sz, '1800');
			assert.equal(lvlpPr.defRPr.solidFill, 'tx1');
			assert.equal(lvlpPr.algn, 'l');
			assert.equal(lvlpPr.defTabSz, '457200');
			assert.equal(lvlpPr.marL, '457200');
			done();
		});
		it('test lvl3pPr', done => {
			let pptx = parser(data);
			let lvlpPr = pptx.presentation.defaultTextStyle.level3ParagraphProperty;
			assert.equal(lvlpPr.defRPr.kern, '1200');
			assert.equal(lvlpPr.defRPr.sz, '1800');
			assert.equal(lvlpPr.defRPr.solidFill, 'tx1');
			assert.equal(lvlpPr.algn, 'l');
			assert.equal(lvlpPr.defTabSz, '457200');
			assert.equal(lvlpPr.marL, '914400');
			done();
		});
		it('test lvl4pPr', done => {
			let pptx = parser(data);
			let lvlpPr = pptx.presentation.defaultTextStyle.level4ParagraphProperty;
			assert.equal(lvlpPr.defRPr.kern, '1200');
			assert.equal(lvlpPr.defRPr.sz, '1800');
			assert.equal(lvlpPr.defRPr.solidFill, 'tx1');
			assert.equal(lvlpPr.algn, 'l');
			assert.equal(lvlpPr.defTabSz, '457200');
			assert.equal(lvlpPr.marL, '1371600');
			done();
		});
		it('test lvl5pPr', done => {
			let pptx = parser(data);
			let lvlpPr = pptx.presentation.defaultTextStyle.level5ParagraphProperty;
			assert.equal(lvlpPr.defRPr.kern, '1200');
			assert.equal(lvlpPr.defRPr.sz, '1800');
			assert.equal(lvlpPr.defRPr.solidFill, 'tx1');
			assert.equal(lvlpPr.algn, 'l');
			assert.equal(lvlpPr.defTabSz, '457200');
			assert.equal(lvlpPr.marL, '1828800');
			done();
		});
		it('test lvl6pPr', done => {
			let pptx = parser(data);
			let lvlpPr = pptx.presentation.defaultTextStyle.level6ParagraphProperty;
			assert.equal(lvlpPr.defRPr.kern, '1200');
			assert.equal(lvlpPr.defRPr.sz, '1800');
			assert.equal(lvlpPr.defRPr.solidFill, 'tx1');
			assert.equal(lvlpPr.algn, 'l');
			assert.equal(lvlpPr.defTabSz, '457200');
			assert.equal(lvlpPr.marL, '2286000');
			done();
		});
		it('test lvl7pPr', done => {
			let pptx = parser(data);
			let lvlpPr = pptx.presentation.defaultTextStyle.level7ParagraphProperty;
			assert.equal(lvlpPr.defRPr.kern, '1200');
			assert.equal(lvlpPr.defRPr.sz, '1800');
			assert.equal(lvlpPr.defRPr.solidFill, 'tx1');
			assert.equal(lvlpPr.algn, 'l');
			assert.equal(lvlpPr.defTabSz, '457200');
			assert.equal(lvlpPr.marL, '2743200');
			done();
		});
		it('test lvl8pPr', done => {
			let pptx = parser(data);
			let lvlpPr = pptx.presentation.defaultTextStyle.level8ParagraphProperty;
			assert.equal(lvlpPr.defRPr.kern, '1200');
			assert.equal(lvlpPr.defRPr.sz, '1800');
			assert.equal(lvlpPr.defRPr.solidFill, 'tx1');
			assert.equal(lvlpPr.algn, 'l');
			assert.equal(lvlpPr.defTabSz, '457200');
			assert.equal(lvlpPr.marL, '3200400');
			done();
		});
		it('test lvl9pPr', done => {
			let pptx = parser(data);
			let lvlpPr = pptx.presentation.defaultTextStyle.level9ParagraphProperty;
			assert.equal(lvlpPr.defRPr.kern, '1200');
			assert.equal(lvlpPr.defRPr.sz, '1800');
			assert.equal(lvlpPr.defRPr.solidFill, 'tx1');
			assert.equal(lvlpPr.algn, 'l');
			assert.equal(lvlpPr.defTabSz, '457200');
			assert.equal(lvlpPr.marL, '3657600');
			done();
		});
	});
});

describe('ppt/theme/theme1.xml parsing test', () => {
	let pptx = {};
	before(done => {
		fs.readFile('./test/main.json', {encoding: 'utf-8'}, (err, d) => {
			if(!!err) throw err;
			pptx = parser(d);
			done();
		});
	});
	describe('color scheme', () => {
		it('check color and key name', done => {
			let theme = pptx.themes['ppt/theme/theme1.xml'];
			assert.equal(theme.colorScheme.dk1, '#2F2B20');
			assert.equal(theme.colorScheme.lt1, '#FFFFFF');
			assert.equal(theme.colorScheme.dk2, '#675E47');
			assert.equal(theme.colorScheme.lt2, '#DFDCB7');
			assert.equal(theme.colorScheme.accent1, '#A9A57C');
			assert.equal(theme.colorScheme.accent2, '#9CBEBD');
			assert.equal(theme.colorScheme.accent3, '#D2CB6C');
			assert.equal(theme.colorScheme.accent4, '#95A39D');
			assert.equal(theme.colorScheme.accent5, '#C89F5D');
			assert.equal(theme.colorScheme.accent6, '#B1A089');
			assert.equal(theme.colorScheme.hlink, '#D25814');
			assert.equal(theme.colorScheme.folHlink, '#849A0A');
			done();
		});
	});
	describe('font scheme', () => {
		it('check lang setting', done => {
			done();
		});
	});
});

/*describe('ppt/slides/*.xml parsing test', () => {
	let slides = {};
	before(done => {
		fs.readFile('./test/main.json', {encoding: 'utf-8'}, (err, d) => {
			if(!!err) throw err;
			slides = parser(d).slides;
			done();
		});
	});
	describe('check slides', () => {
		it('check rids', done => {
		let rids = ['rId2', 'rId3', 'rId4', 'rId5', 'rId6', 'rId7'];
		for(let i in slides) {
			if(slides.hasOwnProperty(i)) {
				assert.include(rids, i);
			}
		}
		done();
		});
	});
	describe('check ppt/slides/slide1.xml (rId2)', () => {
		it('check color settings', done => {
			let slide = slides['rId2'];
			let colorScheme = slide.colorScheme;
			let colorMap = slide.colorMap;
			assert.equal(colorScheme[colorMap['tx1']], '2F2B20');
			assert.equal(colorScheme[colorMap['tx2']], '675E47');
			assert.equal(colorScheme[colorMap['bg1']], 'FFFFFF');
			assert.equal(colorScheme[colorMap['bg2']], 'DFDCB7');
			assert.equal(colorScheme[colorMap['accent1']], 'A9A57C');
			assert.equal(colorScheme[colorMap['accent2']], '9CBEBD');
			assert.equal(colorScheme[colorMap['accent3']], 'D2CB6C');
			assert.equal(colorScheme[colorMap['accent4']], '95A39D');
			assert.equal(colorScheme[colorMap['accent5']], 'C89F5D');
			assert.equal(colorScheme[colorMap['accent6']], 'B1A089');
			assert.equal(colorScheme[colorMap['hlink']], 'D25814');
			assert.equal(colorScheme[colorMap['folHlink']], '849A0A');
			done();
		});
	});
});

describe('ppt/slideMasters/*.xml parsing test', () => {
	let slides = {};
	before(done => {
		fs.readFile('./test/main.json', {encoding: 'utf-8'}, (err, d) => {
			if(!!err) throw err;
			slides = parser(JSON.parse(d)).slides;
			done();
		});
	});
	describe('check ppt/slideMasters/slideMaster1.xml parsing into slide1.xml', () => {
		it('check shapes', done => {
			let slide = slides['rId2'];
			let shapes = slide.shapes;
			assert.equal(shapes.length, 2);
			assert.equal(shapes[0].id, '2');
			assert.equal(shapes[0].type, 'shape');
			assert.equal(shapes[1].id, '3');
			assert.equal(shapes[1].type, 'shape');
			//assert.equal(shapes[2].id, '9');
			//assert.equal(shapes[2].type, 'pic');
			done();
		});
	});
	describe('check ppt/slideMasters/slideMaster1.xml parsed text style.', () => {
		it('check title style', done => {
			let style = slides['rId2'].textStyle.titleStyle.level1ParagraphProperty;
			assert.equal(style.marL, '0');
			assert.equal(style.indent, '0');
			assert.equal(style.align, 'l');
			assert.equal(style.defTabSz, '914400');
			assert.equal(style.rtl, '0');
			assert.equal(style.eaLnBrk, '1');
			assert.equal(style.latinLnBrk, '0');
			assert.equal(style.hangingPunct, '1');
			assert.equal(style.spaceBefore, '0');
			assert.equal(style.size, '4600');
			assert.equal(style.kern, '1200');
			assert.equal(style.color, 'tx2');
			assert.equal(style.cap, 'none');
			assert.equal(style.spc, '-100');
			assert.equal(style.baseline, '0');
			done();
		});
		it('check body style', done => {
			let style = slides['rId2'].textStyle.bodyStyle.level1ParagraphProperty;
			assert.equal(style.marL, '342900');
			assert.equal(style.indent, '-228600');
			assert.equal(style.align, 'l');
			assert.equal(style.defTabSz, '914400');
			assert.equal(style.rtl, '0');
			assert.equal(style.eaLnBrk, '1');
			assert.equal(style.latinLnBrk, '0');
			assert.equal(style.hangingPunct, '1');
			assert.equal(style.spaceBefore, '20000');
			assert.equal(style.size, '2200');
			assert.equal(style.kern, '1200');
			assert.equal(style.color, 'tx1');
			assert.equal(style.cap, 'none');
			assert.equal(style.spc, '0');
			assert.equal(style.baseline, '0');
			done();
		});
		it('check other style', done => {
			let style = slides['rId2'].textStyle.otherStyle.level1ParagraphProperty;
			assert.equal(style.marL, '0');
			assert.equal(style.indent, '0');
			assert.equal(style.align, 'l');
			assert.equal(style.defTabSz, '914400');
			assert.equal(style.rtl, '0');
			assert.equal(style.eaLnBrk, '1');
			assert.equal(style.latinLnBrk, '0');
			assert.equal(style.hangingPunct, '1');
			assert.equal(style.spaceBefore, '0');
			assert.equal(style.size, '1800');
			assert.equal(style.kern, '1200');
			assert.equal(style.color, 'tx1');
			assert.equal(style.cap, 'none');
			assert.equal(style.spc, '0');
			assert.equal(style.baseline, '0');
			done();
		});
	});
});*/
