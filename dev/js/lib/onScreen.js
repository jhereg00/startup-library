/**
 * onScreen
 *
 * Determines if element is on screen and within the bounds of the offsets.
 *
 * @param {DOMElement} el
 * @param {number, 0-1, optional} on offset
 *   multiplier of screen height to determine for when an object is truly "on
 *   screen". Example, passing `.5` would mean the element isn't on screen until
 *   its top is above the midpoint of the screen.
 * @param {number, 0-1, optional} off offset
 *   multiplier of screen height to determine for when an object is truly "off
 *   screen". Example, passing `.1` would mean the element isn't off screen (passed)
 *   until its bottom is above the 10% point of the screen.
 *
 * @returns {boolean}
 *
 * js:
 *   var onScreen = require('lib/onScreen');
 *   var el = document.querySelector('#my-div');
 *   onScreen(el); // returns true or false
 */
// requirements
var windowSize = require('lib/windowSize');

var onScreen = function (el, onOffset, offOffset) {
	var clientRect = el.getBoundingClientRect();
	if (isNaN(onOffset))
		onOffset = 1;
	if (isNaN(offOffset))
		offOffset = 0;
	return (clientRect.top < windowSize.height() * onOffset &&
          clientRect.bottom > windowSize.height() * offOffset);
};

module.exports = onScreen;
