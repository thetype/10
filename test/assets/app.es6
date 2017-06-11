/* global doT, wx */

// const ENV = ENV || 'production';

// Global namespace for the New Money Selected app
const TIB = TIB || {};

/*
TIB.API_DOMAIN =
	ENV === 'production'
	? 'http://thetype.com'
	: 'http://test.thetype.com';
*/


(function() {
	'use strict';
	
	let doc = document;
	
	// UA marking
	const UA_LIST = ['iPhone', 'iPad', 'MQQBrowser', 'Android', 'MicroMessenger'];
	let ua = navigator.userAgent;
	let $html = doc.getElementsByTagName('html')[0];
	for (let i = 0; i < UA_LIST.length; i++) {
		var uaRegExp = new RegExp(UA_LIST[i]);
		
		if (ua.match(uaRegExp)) {
			$html.classList.add('ua-' + UA_LIST[i]);
		}
	}
	if (ua.indexOf('Safari') !== -1 && ua.indexOf('Chrome') === -1) {
		$html.classList.add('ua-Safari');
	}
	if (!('ontouchstart' in window)) {
		$html.classList.add('ua-Pointer');
	}
	
	// Enable the CSS `:active` interactions
	doc.getElementsByTagName('main')[0].addEventListener('touchstart', function(){});
	
	// Twist HTML language
	doc.getElementsByTagName('html')[0].setAttribute('lang', 'en');
	
	// Add statistics
	setTimeout(function() {
		
	}, 0);

})();


TIB.Util = class _Util {
	static delegate(event, targSelector, wrapSelector, callback) {
		let $wrap = document.querySelector(wrapSelector);
		
		$wrap.addEventListener(event, function(e) {
			let $target = e.target;
			
			while ( $target && !$target.matches(targSelector + ',' + wrapSelector) ) {
				$target = $target.parentNode;
			}
			if ($target && $target.matches(targSelector)) {
				callback(e, $target);
			}
		});
	}
	
	
	/**
	 * Ref: https://gist.github.com/gf3/132080/110d1b68d7328d7bfe7e36617f7df85679a08968
	 */
	static fetchJSONP(url, param) {
		let unique = 0;
		
		return new Promise(rs => {
			const script = document.createElement('script');
			const name = `_jsonp_${unique++}`;
			
			let query = '';
			if (param) {
				query = '?';
				for (let key in param) {
					query += key + '=' + param[key] + '&';
				}
				query = query.slice(0, -1);
			}
			
			url = TIB.API_DOMAIN + url + query;
			
			if (url.match(/\?/)) {
				url += `&callback=${name}`;
			} else {
				url += `?callback=${name}`;
			}
			
			script.src = url;
			window[name] = json => {
				rs(new Response(JSON.stringify(json)));
				script.remove();
				delete window[name];
			};
			
			document.body.appendChild(script);
		}).then(function(res) {
			return res.json();
		});
	}
	
	static fixSafariFlexBasis() {
		let doc = document;
		
		let $html = doc.getElementsByTagName('html')[0];
		if (!$html.classList.contains('ua-Safari') &&
			!$html.classList.contains('ua-iPhone') &&
			!$html.classList.contains('ua-iPad')) {
			return;
		}
		
		let options = doc.querySelectorAll('.nmf-option');
		if (!options.length) return;
		
		let lineHeight = parseInt(getComputedStyle(options[0], null).getPropertyValue('line-height'));
		for (let i = 0; i < options.length; i++) {
			if (options[i].clientHeight > lineHeight) {
				options[i].style.flexBasis = '100%';
				options[i].style.webkitFlexBais = '100%';
			}
		}
	}
	
	/**
	 * Smoothy scrolling
	 * Ref: https://coderwall.com/p/hujlhg/smooth-scrolling-without-jquery
	 * @param {Object} element - The scrolled element
	 * @param {Number} target - Target `scrollTop` value
	 * @param {Number} duration - Scrolling duration
	 * @returns {Promise} A Promise object after scroll ending
	 */
	static scroll(element, target, duration) {
		target = Math.round(target);
		duration = Math.round(duration);
		/*if (duration < 0) {
			return Promise.reject("bad duration");
		}*/
		if (duration === 0) {
			element.scrollTop = target;
			return Promise.resolve();
		}
		
		var start_time = Date.now();
		var end_time = start_time + duration;
		
		var start_top = element.scrollTop;
		var distance = target - start_top;
		
		// based on http://en.wikipedia.org/wiki/Smoothstep
		var smooth_step = function (start, end, point) {
			if (point <= start) { return 0; }
			if (point >= end) { return 1; }
			var x = (point - start) / (end - start); // interpolation
			return x * x * (3 - 2 * x);
		}
		
		return new Promise(function (resolve/*, reject*/) {
			// This is to keep track of where the element's scrollTop is
			// supposed to be, based on what we're doing
			var previous_top = element.scrollTop;
			
			// This is like a think function from a game loop
			var scroll_frame = function () {
				/*if (element.scrollTop != previous_top) {
					reject("interrupted");
					return;
				}*/
				
				// set the scrollTop for this frame
				var now = Date.now();
				var point = smooth_step(start_time, end_time, now);
				var frameTop = Math.round(start_top + (distance * point));
				element.scrollTop = frameTop;
				
				// check if we're done!
				if (now >= end_time) {
					resolve();
					return;
				}
				
				// If we were supposed to scroll but didn't, then we
				// probably hit the limit, so consider it done; not
				// interrupted.
				if (element.scrollTop === previous_top
					&& element.scrollTop !== frameTop) {
					resolve();
					return;
				}
				previous_top = element.scrollTop;
				
				// schedule next frame for execution
				setTimeout(scroll_frame, 0);
			}
			
			// boostrap the animation process
			setTimeout(scroll_frame, 0);
		});
	}
	
	static template(tmplId, tmplData) {
		let tmplText = document.getElementById(tmplId).text;
		let tmplFunc = doT.template(tmplText);
		return tmplFunc(tmplData);
	}
	
	
	/**
	 * Configure WeChat JS-SDK
	 * Ref: http://qydev.weixin.qq.com/wiki/index.php?title=%E5%BE%AE%E4%BF%A1JS%E6%8E%A5%E5%8F%A3
	 * @param {Object}  options
	 * @param {boolean} options.debug     - 开启调试模式，调用的所有api的返回值会在客户端alert出来
	 * @param {string}  options.appId     - 必填，企业号的唯一标识，此处填写企业号corpid
	 * @param {string}  options.timestamp - 必填，生成签名的时间戳
	 * @param {string}  options.nonceStr  - 必填，生成签名的随机串
	 * @param {string}  options.signature - 必填，签名，见附录1
	 * @param {Array}   options.jsApiList - 必填，需要使用的JS接口列表，所有JS接口列表见附录2
	 */
	static wxConfig(options) {
		wx.config({
			debug:     options.debug,
			appId:     options.appId,
			timestamp: options.timestamp,
			nonceStr:  options.nonceStr,
			signature: options.signature,
			jsApiList: options.jsApiList
		});
	}
	
	static wxOnMenuShare(options) {
		wx.onMenuShareTimeline({
			title:   options.title,
			link:    options.link,
			imgUrl:  options.imgUrl,
			success: options.successCallback || function(){},
			cancel:  options.cancelCallback  || function(){}
		});
		wx.onMenuShareAppMessage({
			title:   options.title,
			desc:    options.desc,
			link:    options.link,
			imgUrl:  options.imgUrl,
			type:    options.type || 'link',
			dataUrl: options.dataUrl || '',
			success: options.successCallback || function(){},
			cancel:  options.cancelCallback  || function(){}
		});
		wx.onMenuShareQQ({
			title:   options.title,
			desc:    options.desc,
			link:    options.link,
			imgUrl:  options.imgUrl,
			success: options.successCallback || function(){},
			cancel:  options.cancelCallback  || function(){}
		});
		wx.onMenuShareWeibo({
			title:   options.title,
			desc:    options.desc,
			link:    options.link,
			imgUrl:  options.imgUrl,
			success: options.successCallback || function(){},
			cancel:  options.cancelCallback  || function(){}
		});
		wx.onMenuShareQZone({
			title:   options.title,
			desc:    options.desc,
			link:    options.link,
			imgUrl:  options.imgUrl,
			success: options.successCallback || function(){},
			cancel:  options.cancelCallback  || function(){}
		});
	}
};


/*=== Prepend ===*/

/*--- Polyfill ---*/
// @	codekit-prepend "polyfill/fetch.js";

/*--- Define ---*/
// @codekit-prepend "_define.js";

/*--- Misc ---*/
// @codekit-prepend "_misc.js";

/*--- Class ---*/
// @	codekit-prepend "class/ajax.js";
// @	codekit-prepend "class/slideshow.js";
// @codekit-prepend "class/util.js";



/*=== Append  ===*/

/*--- View ---*/
// @codekit-append "view/home.js";


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


