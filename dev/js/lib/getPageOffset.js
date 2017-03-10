/********************************
 *	DEPRECATED
 *	use offsetFrom instead
 ********************************
 *
 *  get DOMElement's offset from page
 *
 *  @param DOMElement
 *  @returns {
 *    left: Number
 *    top: Number
 *  }
 */
var getPageOffset = function (element) {
	if (!element) {
		throw 'getPageOffset passed an invalid element';
	}
	var pageOffsetX = element.offsetLeft,
			pageOffsetY = element.offsetTop;

	element = element.offsetParent;
	while (element) {
		pageOffsetX += element.offsetLeft;
		pageOffsetY += element.offsetTop;
		element = element.offsetParent;
	}

	return {
		left: pageOffsetX,
		top: pageOffsetY
	};
};

module.exports = getPageOffset;
