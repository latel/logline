(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.logline = factory());
}(this, (function () { 'use strict';

	function howLongUntilLunch() {
	    return 'Hello, Logline!';
	}

	return howLongUntilLunch;

})));
