/**
 * offsetFrom helper function
 *
 * Get's an element's offset from another element, or the document `<html>` element if
 * the second argument is omitted.  Uses `getClientRects`, so transforms, zooms,
 * or anything else that wouldn't affect `offsetTop` are still taken into account.
 *
 * If one of the elements doesn't have a clientRect (usually because it's
 * `display: none`) returns 0 for both `top` and `left`.
 *
 * @param {DOMElement} element
 * @param {DOMElement, optional} offsetElement - usually, but doesn't have to be, a parent of `element`
 *
 * @returns {object}
 *   @prop {number} top
 *   @prop {number} right
 *   @prop {number} bottom
 *   @prop {number} left
 */

var offsetFrom = function (element, offsetElement) {
	offsetElement = offsetElement || document.getElementsByTagName('html')[0];

	var elementRect = element.getClientRects()[0],
			offsetElementRect = offsetElement.getClientRects()[0];

	if (elementRect && offsetElementRect) {
		return {
			top: elementRect.top - offsetElementRect.top,
			right: offsetElementRect.right - elementRect.right,
			bottom: offsetElementRect.bottom - elementRect.bottom,
			left: elementRect.left - offsetElementRect.left
		};
	}
	else {
		return {
			top: 0,
			right: 0,
			bottom: 0,
			left: 0
		};
	}
};

module.exports = offsetFrom;
