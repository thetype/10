(function() { 'use strict';

TIB.Slideshow = class _Slideshow {
	constructor(selector) {
		this.$el    = document.querySelector(selector.el);
		this.$list  = this.$el.querySelector(selector.list);
		this.$prev  = this.$el.querySelector(selector.prev);
		this.$next  = this.$el.querySelector(selector.next);
		this.index  = 0;
		this.slideW = this.$list.children[0].offsetWidth;
		this.slideH = this.$list.children[0].offsetHeight;
		
		this.startX = -1;
		this.startY = -1;
		this.lastX  = -1;
		this.lastY  = -1;
		this.distX  = 0;
		this.distY  = 0;
		this.isMove   = false;
		this.isSlide  = false;
		this.isScroll = false;
	}
	
	
	
	/**
	 * @private
	 * Inits
	 */
	
	_initList() {
		let indexes = this._getIndexes();
		let currIdx = indexes.currIdx;
		let nextIdx = indexes.nextIdx;
		let prevIdx = indexes.prevIdx;
		
		let $items = this.$list.children;
		$items[currIdx].classList.add('is-center');
		$items[prevIdx].classList.add('is-left');
		$items[nextIdx].classList.add('is-right');
	}
	
	_initPager() {
		this._listenPagerClick();
	}
	
	_initTouch() {
		console.log('touch:', this.slideW, this.slideH);
		this._listenTouchEvent();
	}
	
	
	
	/**
	 * @private
	 * Listeners
	 */
	
	_listenPagerClick() {
		this.$prev.addEventListener('click', this._navPrev.bind(this));
		this.$next.addEventListener('click', this._navNext.bind(this));
	}
	_listenTouchEvent() {
		this.$el.addEventListener('touchstart',  this._handleTouchStart.bind(this));
		this.$el.addEventListener('touchmove',   this._handleTouchMove.bind(this));
		this.$el.addEventListener('touchend',    this._handleTouchEnd.bind(this));
		this.$el.addEventListener('touchcancel', this._handleTouchEnd.bind(this));
	}
	
	
	
	/**
	 * @private
	 * Actions
	 */
	
	_getIndexes() {
		let len = this.$list.children.length;
		let currIdx =  this.index      % len;
		let nextIdx = (this.index + 1) % len;
		let prevIdx = (this.index - 1) % len;
		let newNext = (this.index + 2) % len;
		let newPrev = (this.index - 2) % len;
		
		return {
			currIdx: currIdx < 0 ? currIdx + len : currIdx,
			prevIdx: prevIdx < 0 ? prevIdx + len : prevIdx,
			nextIdx: nextIdx < 0 ? nextIdx + len : nextIdx,
			newPrev: newPrev < 0 ? newPrev + len : newPrev,
			newNext: newNext < 0 ? newNext + len : newNext
		};
	}
	
	_navPrev() {
		let indexes = this._getIndexes();
		let currIdx = indexes.currIdx;
		let nextIdx = indexes.nextIdx;
		let prevIdx = indexes.prevIdx;
		let newPrev = indexes.newPrev;
		
		this.index--;
		console.log('curr:' + currIdx, 'prev:' + prevIdx, 'newPrev:' + newPrev);
		
		let $el    = this.$el;
		let $items = this.$list.children;
		
		$el.classList.remove('is-next');
		$el.classList.add('is-prev');
		
		$items[nextIdx].classList.remove('is-left', 'is-right');
		$items[currIdx].classList.remove('is-center');
		$items[currIdx].classList.add('is-right');
		$items[prevIdx].classList.remove('is-left');
		$items[prevIdx].classList.add('is-center');
		$items[newPrev].classList.remove('is-right', 'is-center');
		$items[newPrev].classList.add('is-left');
	}
	
	_navNext() {
		let indexes = this._getIndexes();
		let currIdx = indexes.currIdx;
		let prevIdx = indexes.prevIdx;
		let nextIdx = indexes.nextIdx;
		let newNext = indexes.newNext;
		
		this.index++;
		console.log('curr:' + currIdx, 'next:' + nextIdx, 'newNext:' + newNext);
		
		let $el    = this.$el;
		let $items = this.$list.children;
		
		$el.classList.remove('is-prev');
		$el.classList.add('is-next');
		
		$items[prevIdx].classList.remove('is-left', 'is-right');
		$items[currIdx].classList.remove('is-center');
		$items[currIdx].classList.add('is-left');
		$items[nextIdx].classList.remove('is-right');
		$items[nextIdx].classList.add('is-center');
		$items[newNext].classList.remove('is-left', 'is-center');
		$items[newNext].classList.add('is-right');
	}
	
	_handleTouchStart(e) {
		this.$el.classList.add('is-move');
		this.$list.style.transition = 'none';
		
		this.lastX  = this.startX = e.touches[0].clientX;
		this.lastY  = this.startY = e.touches[0].clientY;
		this.isMove = true;
	}
	
	_handleTouchMove(e) {
		// e.preventDefault();
		if (this.isScroll) { return; }
		if (this.isSlide) { e.preventDefault(); }
		
		if (this.isMove) {
			this.lastX = e.touches[0].clientX;
			this.distX = this.lastX - this.startX;
			this.lastY = e.touches[0].clientY;
			this.distY = this.lastY - this.startY;
			// console.log(this.distX, this.distY);
			requestAnimationFrame(this._moveSlide.bind(this, e));
		}
	}
	
	_handleTouchEnd(e) {
		this.$el.classList.remove('is-move');
		
		if (this.isMove) {
			requestAnimationFrame(this._endSlide.bind(this));
		}
	}
	
	_moveSlide(e) {
		if (this.isScroll) { return; }
		
		if (this.isSlide) {
			this.$list.style.transform = 'translate3d(' + this.distX + 'px,0,0)';
		} else if (Math.abs(this.distY) < Math.abs(this.distX)) {
			e.preventDefault();
			this.$list.style.transform = 'translate3d(' + this.distX + 'px,0,0)';
			this.isSlide = true;
		} else {
			this.isScroll = true;
		}
	}
	
	_endSlide() {
		this.$list.style.transition = 'transform .75s ease';
		this.$list.style.transform  = 'translate3d(0,0,0)';
		
		if (Math.abs(this.distX) >= 60) {
			if (this.distX < 0) {
				this._navNext();
			} else {
				this._navPrev();
			}
		}
		
		this.isMove = this.isScroll = this.isSlide = false;
		this.distX = this.distY = 0;
	}
	
	
	
	/**
	 * @public
	 */
	
	init() {
		this._initList();
		
		if (document.querySelector('html').classList.contains('ua-Pointer')) {
			this._initPager();
		} else {
			this._initTouch();
		}
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
