(function(self) {
  'use strict';

  if (self.fetch) {
    return
  }

  var support = {
    searchParams: 'URLSearchParams' in self,
    iterable: 'Symbol' in self && 'iterator' in Symbol,
    blob: 'FileReader' in self && 'Blob' in self && (function() {
      try {
        new Blob()
        return true
      } catch(e) {
        return false
      }
    })(),
    formData: 'FormData' in self,
    arrayBuffer: 'ArrayBuffer' in self
  }

  function normalizeName(name) {
    if (typeof name !== 'string') {
      name = String(name)
    }
    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
      throw new TypeError('Invalid character in header field name')
    }
    return name.toLowerCase()
  }

  function normalizeValue(value) {
    if (typeof value !== 'string') {
      value = String(value)
    }
    return value
  }

  // Build a destructive iterator for the value list
  function iteratorFor(items) {
    var iterator = {
      next: function() {
        var value = items.shift()
        return {done: value === undefined, value: value}
      }
    }

    if (support.iterable) {
      iterator[Symbol.iterator] = function() {
        return iterator
      }
    }

    return iterator
  }

  function Headers(headers) {
    this.map = {}

    if (headers instanceof Headers) {
      headers.forEach(function(value, name) {
        this.append(name, value)
      }, this)

    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function(name) {
        this.append(name, headers[name])
      }, this)
    }
  }

  Headers.prototype.append = function(name, value) {
    name = normalizeName(name)
    value = normalizeValue(value)
    var list = this.map[name]
    if (!list) {
      list = []
      this.map[name] = list
    }
    list.push(value)
  }

  Headers.prototype['delete'] = function(name) {
    delete this.map[normalizeName(name)]
  }

  Headers.prototype.get = function(name) {
    var values = this.map[normalizeName(name)]
    return values ? values[0] : null
  }

  Headers.prototype.getAll = function(name) {
    return this.map[normalizeName(name)] || []
  }

  Headers.prototype.has = function(name) {
    return this.map.hasOwnProperty(normalizeName(name))
  }

  Headers.prototype.set = function(name, value) {
    this.map[normalizeName(name)] = [normalizeValue(value)]
  }

  Headers.prototype.forEach = function(callback, thisArg) {
    Object.getOwnPropertyNames(this.map).forEach(function(name) {
      this.map[name].forEach(function(value) {
        callback.call(thisArg, value, name, this)
      }, this)
    }, this)
  }

  Headers.prototype.keys = function() {
    var items = []
    this.forEach(function(value, name) { items.push(name) })
    return iteratorFor(items)
  }

  Headers.prototype.values = function() {
    var items = []
    this.forEach(function(value) { items.push(value) })
    return iteratorFor(items)
  }

  Headers.prototype.entries = function() {
    var items = []
    this.forEach(function(value, name) { items.push([name, value]) })
    return iteratorFor(items)
  }

  if (support.iterable) {
    Headers.prototype[Symbol.iterator] = Headers.prototype.entries
  }

  function consumed(body) {
    if (body.bodyUsed) {
      return Promise.reject(new TypeError('Already read'))
    }
    body.bodyUsed = true
  }

  function fileReaderReady(reader) {
    return new Promise(function(resolve, reject) {
      reader.onload = function() {
        resolve(reader.result)
      }
      reader.onerror = function() {
        reject(reader.error)
      }
    })
  }

  function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader()
    reader.readAsArrayBuffer(blob)
    return fileReaderReady(reader)
  }

  function readBlobAsText(blob) {
    var reader = new FileReader()
    reader.readAsText(blob)
    return fileReaderReady(reader)
  }

  function Body() {
    this.bodyUsed = false

    this._initBody = function(body) {
      this._bodyInit = body
      if (typeof body === 'string') {
        this._bodyText = body
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
        this._bodyFormData = body
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this._bodyText = body.toString()
      } else if (!body) {
        this._bodyText = ''
      } else if (support.arrayBuffer && ArrayBuffer.prototype.isPrototypeOf(body)) {
        // Only support ArrayBuffers for POST method.
        // Receiving ArrayBuffers happens via Blobs, instead.
      } else {
        throw new Error('unsupported BodyInit type')
      }

      if (!this.headers.get('content-type')) {
        if (typeof body === 'string') {
          this.headers.set('content-type', 'text/plain;charset=UTF-8')
        } else if (this._bodyBlob && this._bodyBlob.type) {
          this.headers.set('content-type', this._bodyBlob.type)
        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8')
        }
      }
    }

    if (support.blob) {
      this.blob = function() {
        var rejected = consumed(this)
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return Promise.resolve(this._bodyBlob)
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as blob')
        } else {
          return Promise.resolve(new Blob([this._bodyText]))
        }
      }

      this.arrayBuffer = function() {
        return this.blob().then(readBlobAsArrayBuffer)
      }

      this.text = function() {
        var rejected = consumed(this)
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return readBlobAsText(this._bodyBlob)
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as text')
        } else {
          return Promise.resolve(this._bodyText)
        }
      }
    } else {
      this.text = function() {
        var rejected = consumed(this)
        return rejected ? rejected : Promise.resolve(this._bodyText)
      }
    }

    if (support.formData) {
      this.formData = function() {
        return this.text().then(decode)
      }
    }

    this.json = function() {
      return this.text().then(JSON.parse)
    }

    return this
  }

  // HTTP methods whose capitalization should be normalized
  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']

  function normalizeMethod(method) {
    var upcased = method.toUpperCase()
    return (methods.indexOf(upcased) > -1) ? upcased : method
  }

  function Request(input, options) {
    options = options || {}
    var body = options.body
    if (Request.prototype.isPrototypeOf(input)) {
      if (input.bodyUsed) {
        throw new TypeError('Already read')
      }
      this.url = input.url
      this.credentials = input.credentials
      if (!options.headers) {
        this.headers = new Headers(input.headers)
      }
      this.method = input.method
      this.mode = input.mode
      if (!body) {
        body = input._bodyInit
        input.bodyUsed = true
      }
    } else {
      this.url = input
    }

    this.credentials = options.credentials || this.credentials || 'omit'
    if (options.headers || !this.headers) {
      this.headers = new Headers(options.headers)
    }
    this.method = normalizeMethod(options.method || this.method || 'GET')
    this.mode = options.mode || this.mode || null
    this.referrer = null

    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
      throw new TypeError('Body not allowed for GET or HEAD requests')
    }
    this._initBody(body)
  }

  Request.prototype.clone = function() {
    return new Request(this)
  }

  function decode(body) {
    var form = new FormData()
    body.trim().split('&').forEach(function(bytes) {
      if (bytes) {
        var split = bytes.split('=')
        var name = split.shift().replace(/\+/g, ' ')
        var value = split.join('=').replace(/\+/g, ' ')
        form.append(decodeURIComponent(name), decodeURIComponent(value))
      }
    })
    return form
  }

  function headers(xhr) {
    var head = new Headers()
    var pairs = (xhr.getAllResponseHeaders() || '').trim().split('\n')
    pairs.forEach(function(header) {
      var split = header.trim().split(':')
      var key = split.shift().trim()
      var value = split.join(':').trim()
      head.append(key, value)
    })
    return head
  }

  Body.call(Request.prototype)

  function Response(bodyInit, options) {
    if (!options) {
      options = {}
    }

    this.type = 'default'
    this.status = options.status
    this.ok = this.status >= 200 && this.status < 300
    this.statusText = options.statusText
    this.headers = options.headers instanceof Headers ? options.headers : new Headers(options.headers)
    this.url = options.url || ''
    this._initBody(bodyInit)
  }

  Body.call(Response.prototype)

  Response.prototype.clone = function() {
    return new Response(this._bodyInit, {
      status: this.status,
      statusText: this.statusText,
      headers: new Headers(this.headers),
      url: this.url
    })
  }

  Response.error = function() {
    var response = new Response(null, {status: 0, statusText: ''})
    response.type = 'error'
    return response
  }

  var redirectStatuses = [301, 302, 303, 307, 308]

  Response.redirect = function(url, status) {
    if (redirectStatuses.indexOf(status) === -1) {
      throw new RangeError('Invalid status code')
    }

    return new Response(null, {status: status, headers: {location: url}})
  }

  self.Headers = Headers
  self.Request = Request
  self.Response = Response

  self.fetch = function(input, init) {
    return new Promise(function(resolve, reject) {
      var request
      if (Request.prototype.isPrototypeOf(input) && !init) {
        request = input
      } else {
        request = new Request(input, init)
      }

      var xhr = new XMLHttpRequest()

      function responseURL() {
        if ('responseURL' in xhr) {
          return xhr.responseURL
        }

        // Avoid security warnings on getResponseHeader when not allowed by CORS
        if (/^X-Request-URL:/mi.test(xhr.getAllResponseHeaders())) {
          return xhr.getResponseHeader('X-Request-URL')
        }

        return
      }

      xhr.onload = function() {
        var options = {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: headers(xhr),
          url: responseURL()
        }
        var body = 'response' in xhr ? xhr.response : xhr.responseText
        resolve(new Response(body, options))
      }

      xhr.onerror = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.ontimeout = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.open(request.method, request.url, true)

      if (request.credentials === 'include') {
        xhr.withCredentials = true
      }

      if ('responseType' in xhr && support.blob) {
        xhr.responseType = 'blob'
      }

      request.headers.forEach(function(value, name) {
        xhr.setRequestHeader(name, value)
      })

      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
    })
  }
  self.fetch.polyfill = true
})(typeof self !== 'undefined' ? self : this);


/* global doT, wx */

const ENV = 'production';

// Baidu statistics
let _hmt = _hmt || [];

// Global namespace for the New Money Selected app
const NME = NME || {};

/*
NME.API_DOMAIN =
	typeof gon === 'object' && gon.env === 'production'
	? ''
	: 'http://test.xinqian.me';
*/
NME.API_DOMAIN =
	ENV === 'production'
	? 'http://xinqian.me'
	: 'http://test.xinqian.me';


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


NME.Ajax = class _NMAjax {
	static GET(URL, param) {
		let query = '';
		if (param) {
			query = '?';
			for (let key in param) {
				query += key + '=' + param[key] + '&';
			}
			query = query.slice(0, -1);
		}
		
		let url = NME.API_DOMAIN + URL + query;
		
		return fetch(url, {
			method: 'GET'
		}).then(function(res) {
			// if (res.ok) {
			if (res.status >= 200 && res.status < 300) {
				return res.json();
			} else {
				let error = new Error(res.statusText);
				error.res = res;
				throw error;
			}
		});
	}
	
	static POST(URL, param, credentials) {
		let url = NME.API_DOMAIN + URL;
		let bodyData = JSON.stringify(param);
		
		return fetch(url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			credentials: credentials ? credentials : 'omit',
			body: bodyData
		}).then(function(res) {
			// if (res.ok) {
			if (res.status >= 200 && res.status < 300) {
				return res.json();
			} else {
				let error = new Error(res.statusText);
				error.res = res;
				throw error;
			}
		});
	}
	
	static PUT(URL, param, credentials) {
		let url = NME.API_DOMAIN + URL;
		let bodyData = JSON.stringify(param);
		
		return fetch(url, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			credentials: credentials ? credentials : 'omit',
			body: bodyData
		}).then(function(res) {
			// if (res.ok) {
			if (res.status >= 200 && res.status < 300) {
				return res.json();
			} else {
				let error = new Error(res.statusText);
				error.res = res;
				throw error;
			}
		});
	}
};


NME.Util = class _NMUtil {
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
			
			url = NME.API_DOMAIN + url + query;
			
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


/**
 * Prepend list:
 * - _define.js
 * - _misc.js
 * - class/*.js
 * 
 * Append list:
 * - view/*.js
 */


