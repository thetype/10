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
