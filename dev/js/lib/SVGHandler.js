/** *
 * SVG Handler
 *
 * A javascript class for creating and controlling an SVG Element.  Basically
 * just an encapsulated group of helpers for DOM manipulation within the SVG
 * xml namespace.
 *
 * @param {number} width - offers getter and setter
 * @param {number} height - offers getter and setter
 *
 * @method {void} updateViewBox(x,y,w,h) - update the viewBox attribute on the element
 *   @param {number} x
 *   @param {number} y
 *   @param {number} width
 *   @param {number} height
 * @method {void} appendTo(el) - append the SVG element to the passed element
 *   @param {DOMElement} el
 * @method {void} addElement(el) - add an element to main stage of svg
 *   @param {SVG*Element} el
 */
// requirements

// settings
var SVG_NS = "http://www.w3.org/2000/svg";

// main class
var SVGHandler = function (width, height) {
  // create the element
	this.element = document.createElementNS(SVG_NS, 'svg');

	this.element.setAttribute('width', width || 300);
	this.element.setAttribute('height', height || 300);
	this.updateViewBox();
};
SVGHandler.prototype = {
  // getters/setters
	get width() {
		return this.element.getAttribute('width');
	},
	set width(w) {
		if (!isNaN(w))
			this.element.setAttribute('width', w);
	},
	get height() {
		return this.element.getAttribute('height');
	},
	set height(h) {
		if (!isNaN(h))
			this.element.setAttribute('height', h);
	},

  // methods
	updateViewBox: function (x, y, w, h) {
		this.element.setAttribute('viewBox', [
			x || 0,
			y || 0,
			w || this.width,
			h || this.height
		].join(' '));
	},
	appendTo: function (el) {
		el.appendChild(this.element);
	},
	addElement: function (el) {
		this.element.appendChild(el);
	},
	createCircle: function (cx, cy, r) {
		var el = SVGHandler.createCircle(cx, cy, r);
		this.addElement(el);
		return el;
	},
	createRadialGradient: function () {
		var g = SVGHandler.createRadialGradient.apply(this, arguments);
		this.addElement(g);
		return g;
	},
	createEllipse: function () {
		var el = SVGHandler.createEllipse.apply(this, arguments);
		this.addElement(el);
		return el;
	}
};

// statics
SVGHandler.namespace = SVG_NS;
SVGHandler.createCircle = function (cx, cy, r) {
	var c = document.createElementNS(SVG_NS, 'circle');
	c.setAttribute('cx', cx || 0);
	c.setAttribute('cy', cy || 0);
	c.setAttribute('r', r || 0);
	return c;
};
SVGHandler.createEllipse = function (cx, cy, rx, ry) {
	var c = document.createElementNS(SVG_NS, 'ellipse');
	c.setAttribute('cx', cx || 0);
	c.setAttribute('cy', cy || 0);
	c.setAttribute('rx', rx || 0);
	c.setAttribute('ry', ry || 0);
	return c;
};
SVGHandler.createRadialGradient = function (id, stops, cx, cy, r, fx, fy) {
	var g = document.createElementNS(SVG_NS, 'radialGradient');
	g.setAttribute('id', id);
	g.setAttribute('cx', cx !== undefined ? cx : .5);
	g.setAttribute('cy', cy !== undefined ? cy : .5);
	g.setAttribute('r', r !== undefined ? r : .5);
	if (fx)
		g.setAttribute('fx', fx);
	if (fy)
		g.setAttribute('fx', fx);

	for (var i = 0, len = stops.length; i < len; i++) {
		var stop = document.createElementNS(SVG_NS, 'stop');
		var stopValues = stops[i].split(/\s/);
		stop.setAttribute('offset', stopValues[1] || (i / (len - 1) * 100) + '%');
		stop.setAttribute('stop-color', stopValues[0]);
		g.appendChild(stop);
	}

	return g;
};

module.exports = SVGHandler;
