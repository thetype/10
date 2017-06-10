(function() { 'use strict';

if (document.querySelector('.home')) {
	let hero = new TIB.Slideshow({
		el:    '.slideshow',
		list:  '.slideshow-list',
		prev:  '.slideshow-pager--prev',
		next:  '.slideshow-pager--next'
	});
	hero.init();
}

})();
