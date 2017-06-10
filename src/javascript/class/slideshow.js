(function() { 'use strict';

TIB.Slideshow = class _Slideshow {
	constructor(selector) {
		// let doc = document;
		this.$el    = document.querySelector(selector.el);
		this.$list  = this.$el.querySelector(selector.list);
		this.$prev  = this.$el.querySelector(selector.prev);
		this.$next  = this.$el.querySelector(selector.next);
		
		this.index = 0;
	}
	
	
	
	/**
	 * @private
	 * Inits
	 */
	
	_initList() {
		let $allSlides = this.$list.children;
		let slideNum = $allSlides.length;
		
		let currIndex =  this.index      % slideNum;
		let prevIndex = (this.index - 1) % slideNum;
		let nextIndex = (this.index + 1) % slideNum;
		currIndex = currIndex < 0 ? currIndex + slideNum : currIndex;
		prevIndex = prevIndex < 0 ? prevIndex + slideNum : prevIndex;
		nextIndex = nextIndex < 0 ? nextIndex + slideNum : nextIndex;
		
		console.log(prevIndex, nextIndex);
		
		$allSlides[currIndex].classList.add('is-center');
		$allSlides[prevIndex].classList.add('is-left');
		$allSlides[nextIndex].classList.add('is-right');
	}
	
	_initPager() {
		this._listenPrevClick();
		this._listenNextClick();
	}
	
	
	
	/**
	 * @private
	 * Listeners
	 */
	
	_listenPrevClick() {
		this.$prev.addEventListener('click', this._navPrev.bind(this));
	}
	
	_listenNextClick() {
		this.$next.addEventListener('click', this._navNext.bind(this));
	}
	
	
	/**
	 * @private
	 * Actions
	 */
	
	_navPrev() {
		let $el    = this.$el;
		let $items = this.$list.children;
		$el.classList.remove('is-next');
		$el.classList.add('is-prev');
		
		let slidesLen = $items.length;
		let currIdx =  this.index      % slidesLen;
		let nextIdx = (this.index + 1) % slidesLen;
		let prevIdx = (this.index - 1) % slidesLen;
		let newPrev = (this.index - 2) % slidesLen;
		currIdx = currIdx < 0 ? currIdx + slidesLen : currIdx;
		nextIdx = nextIdx < 0 ? nextIdx + slidesLen : nextIdx;
		prevIdx = prevIdx < 0 ? prevIdx + slidesLen : prevIdx;
		newPrev = newPrev < 0 ? newPrev + slidesLen : newPrev;
		
		this.index--;
		console.log('curr:' + currIdx, 'prev:' + prevIdx, 'newPrev:' + newPrev);
		
		$items[nextIdx].classList.remove('is-left', 'is-right');
		$items[currIdx].classList.remove('is-center');
		$items[currIdx].classList.add('is-right');
		$items[prevIdx].classList.remove('is-left');
		$items[prevIdx].classList.add('is-center');
		$items[newPrev].classList.remove('is-right', 'is-center');
		$items[newPrev].classList.add('is-left');
	}
	
	_navNext() {
		let $el    = this.$el;
		let $items = this.$list.children;
		
		$el.classList.remove('is-prev');
		$el.classList.add('is-next');
		
		let len     = $items.length;
		let currIdx =  this.index      % len;
		let prevIdx = (this.index - 1) % len;
		let nextIdx = (this.index + 1) % len;
		let newNext = (this.index + 2) % len;
		currIdx = currIdx < 0 ? currIdx + len : currIdx;
		prevIdx = prevIdx < 0 ? prevIdx + len : prevIdx;
		nextIdx = nextIdx < 0 ? nextIdx + len : nextIdx;
		newNext = newNext < 0 ? newNext + len : newNext;
		
		this.index++;
		console.log('curr:' + currIdx, 'next:' + nextIdx, 'newNext:' + newNext);
		
		$items[prevIdx].classList.remove('is-left', 'is-right');
		$items[currIdx].classList.remove('is-center');
		$items[currIdx].classList.add('is-left');
		$items[nextIdx].classList.remove('is-right');
		$items[nextIdx].classList.add('is-center');
		$items[newNext].classList.remove('is-left', 'is-center');
		$items[newNext].classList.add('is-right');
	}
	
	
	/**
	 * @public
	 */
	
	init() {
		this._initList();
		this._initPager();
	}

};

})();


// Testing
(function() { 'use strict';
	let hero = new TIB.Slideshow({
		el:    '.slideshow',
		list:  '.slideshow-list',
		prev:  '.slideshow-pager--prev',
		next:  '.slideshow-pager--next'
	});
	hero.init();
})();
