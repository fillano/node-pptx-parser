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
    		assert.lengthOf(pptx.presentation.slideIdList, 4);
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
});

describe('ppt/slides/*.xml parsing test', () => {
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
		let rids = ['rId2', 'rId3', 'rId4', 'rId5'];
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
			slides = parser(d).slides;
			done();
		});
	});
	describe('check ppt/slideMasters/slideMaster1.xml parsing into slide1.xml', () => {
		it('check shapes', done => {
			let slide = slides['rId2'];
			let shapes = slide.shapes;
			assert.equal(shapes.length, 2);
			assert.equal(shapes[0].id, '7');
			assert.equal(shapes[1].id, '8');
			done();
		});
	});
});
