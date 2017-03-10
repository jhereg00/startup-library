/**
 * animateStyle function
 *
 * Sets up a requestAnimationFrame loop to animate an element's style.
 *
 * @param {DOMElement} element
 * @param {string} property
 * @param {AnimatedValue} value - an instance of AnimatedValue to draw from, using ms as the frame
 * @param {optional, object} fns
 *   @param {optional, function} valueFn - a function that is passed a value and returns it properly formatted for the property
 *   @param {optional, function} callback
 *   @param {optional, function} tick - function to call on every requestAnimationFrame
 * @param {optional, number} delay
 */
// requirements
var AnimatedValue = require('lib/AnimatedValue');
var eases = require('lib/eases');
var setPrefixedStyle = require('lib/setPrefixedStyle');

var buildFormatFn = function (defaultFormat) {
	if (defaultFormat)
		return function (v) {
			return defaultFormat.replace(/[\d\.\-]+/, v);
		};
	else
return function (v) {
	return v.toString(); 
};
};

var animateStyle = function (element, property, value, fns, delay) {
	fns = fns || {};
	fns.valueFn = fns.valueFn || buildFormatFn(getComputedStyle(element)[property]);
	var startTime = new Date().getTime() + (delay !== undefined ? delay : 0);
	(function loop () {
		var deltaTime = new Date().getTime() - startTime;
		if (property === 'transform')
			setPrefixedStyle(element, 'transform', fns.valueFn(value.get(deltaTime)));
		else
      element.style[property] = fns.valueFn(value.get(deltaTime));

		if (fns.tick)
			fns.tick();

		if (deltaTime < value.lastFrame) {
			requestAnimationFrame(loop);
		}
		else if (fns.callback)
			fns.callback(element);
	})();
};

/**
 * animateStyle.to
 *
 * Shortcut function to animate a single style to a new value.  This doesn't really
 * work with more complicated styles like 'transform'.
 *
 * @param {DOMElement} element
 * @param {string} property
 * @param {number} endValue
 * @param {number} duration
 * @param {optional, function} ease
 * @param {optional, function} valueFn
 * @param {optional, number} delay
 */
animateStyle.to = function (element, property, endValue, duration, ease, valueFn, delay) {
	var value = AnimatedValue.make(parseFloat(getComputedStyle(element)[property], 10), endValue, duration, ease || eases.linear);
	animateStyle(element, property, value, {
		valueFn: valueFn
	}, delay);
};

/**
 * common value helpers
 */
animateStyle.valueFns = {
	translateY: function (v) {
		return "translateY(" + v + "px)";
	},
	scale: function (v) {
		return "scale(" + v + ")";
	},
	scaleY: function (v) {
		return "scaleY(" + v + ")";
	}
};

module.exports = animateStyle;
