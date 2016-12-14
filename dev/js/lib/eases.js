/***
 * Eases
 *
 * A bunch of easing functions for making animations
 * testing is fairly subjective, so not automated
 *
 * Each method accepts the same params.
 *
 * @param {number} starting value - value at the beginning of the ease
 * @param {number} change value - difference between end value and start value
 * @param {number} percentage - decimal between 0-1 representing how far along the ease to get the result for
 *
 * @method {number} easeInOut
 * @method {number} easeInOutCubic
 * @method {number} easeIn
 * @method {number} easeInCubic
 * @method {number} easeOut
 * @method {number} easeOutCubic
 */

var eases = {
  'easeInOut' : function (s,c,p) {
    if (p < .5) {
      return s + c * (2 * p * p);
    }
    else {
      return s + c * (-2 * (p - 1) * (p - 1) + 1);
    }
  },
  'easeInOutCubic' : function (s,c,p) {
    if (p < .5) {
      return s + c * (4 * p * p * p);
    }
    else {
      return s + c * (4 * (p - 1) * (p - 1) * (p - 1) + 1)
    }
  },
  'easeIn' : function (s,c,p) {
    return s + c * p * p;
  },
  'easeInCubic' : function (s,c,p) {
    return s + c * (p * p * p);
  },
  'easeOut' : function (s,c,p) {
    return s + c * (-1 * (p - 1) * (p - 1) + 1);
  },
  'easeOutCubic' : function (s,c,p) {
    return s + c * ((p - 1) * (p - 1) * (p - 1) + 1);
  },
  'easeOutQuartic' : function (s,c,p) {
    return s + c * (-1 * (p - 1) * (p - 1) * (p - 1) * (p - 1) + 1);
  },
  'smooth' : function (s,c,p) {
    return s + (c * cubicBezier(p,.23,.02,.44,1));
  },
  'pulse' : function (s,c,p) {
    return s + (c * cubicBezier(p,.17,.07,.24,1));
  },
  'linear' : function (s,c,p) {
    return s + c * p;
  }
}
module.exports = eases;

/***
 * cubicBezier function
 *
 * Get point on a cubic bezier curve when given the `x` coordinate.  You can omit
 * the starting and ending points by passing just 5 arguments instead of the full 9.
 *
 * Don't pass a curve with 2 possible `y` results for a given `x`.  It makes it angry.
 *
 * @param {number} x
 * @param {number, optional} x0 - defaults to 0
 * @param {number, optional} y0 - defaults to 0
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @param {number, optional} x3 - defaults to 1
 * @param {number, optional} y3 - defaults to 1
 *
 * js:
 *   require('lib/eases').cubicBezier(.5,0,0,.25,.1,.75,.9,1,1);
 */
var cubicBezier = function () {
  var args = Array.from(arguments);
  var x = args.shift();
  var points = [];
  if (args.length === 4)
    points = [0,0].concat(args).concat([1,1]);
  else if (args.length !== 8)
    throw "unexpected number of arguments passed to cubicBezier. Expected 5 or 9, was " + arguments.length;
  else
    points = args;

  // set up vars
  var X0 = points[0];
  var Y0 = points[1];
  var X1 = points[2];
  var Y1 = points[3];
  var X2 = points[4];
  var Y2 = points[5];
  var X3 = points[6];
  var Y3 = points[7];

  var t = 0;

  var possibleResults = [];
  // ok, we have some normalized values to work with
  // let's find `t` where:
  // x = (1-t)^3 * X0 + 3*(1-t)^2 * t * X1 + 3*(1-t) * t^2 * X2 + t^3 * X3
  // thus a series of formulas can be used to derive `t` by solving a cubic equation
  //
  // some of this hurts my brain, but these were derived from:
  //   simplify the cubic equation:
  //     t^3(X0 + 3X1 - 3X2 + X3) + 3*t^2*(X0 - 2X1 + X2) + 3 * t * (X1 - X0) + X0 - x
  //     use the formulas:
  //       t = u - (b / (3a))
  //       u^3 + pu + q = 0
  //       p = (3ac - b^2) / 3a^2
  //       q = (2b^3 - 9abc + 27a^2d) / 27a^3
  //
  //     see: https://en.wikipedia.org/wiki/Cubic_function
  var a = (X0 + 3 * X1 - 3 * X2 + X3); // -0.5
  var b = 3 * (X0 - 2 * X1 + X2); // 0.75
  var c = 3 * (X1 - X0); // 0.75
  var d = X0 - x; // 0
  if (!a) {
    // quadratic
    var discriminant = c*c - 4*b*d;
    if (discriminant >= 0) {
      possibleResults = [
        (-b + Math.sqrt(discriminant)) / (2*b),
        (-b - Math.sqrt(discriminant)) / (2*b)
      ]
    }
  }
  else {
    // cubic
    // normalize the equation
    b /= a;
    c /= a;
    d /= a;

    var p = (3 * c - b * b) / 3;
    var q = (2 * b * b * b - 9 * b * c + 27 * d) / 27;

    if (p === 0) {
      // get real cube root
      possibleResults = [ Math.pow(-q, 1/3) ];
    }
    else if (q === 0) {
      possibleResults = [
        Math.sqrt(-p),
        -Math.sqrt(-p)
      ]
    }
    else {
      var discriminant = Math.pow(q / 2, 2) + Math.pow(p / 3, 3);
      if (discriminant === 0) {
        possibleResults = [Math.pow(q / 2, 1/3) - b/3];
      }
      else if (discriminant > 0) {
        possibleResults = [
          Math.pow(-(q/2) + Math.sqrt(discriminant), 1/3) - Math.pow((q / 2) + Math.sqrt(discriminant), 1/3) - b/3
        ]
      }
      else {
        var r = Math.sqrt( Math.pow(-(p/3), 3) );
        var phi = Math.acos(-(q / (2 * r)));

        var s = 2 * Math.pow(r, 1/3);

        possibleResults = [
          s * Math.cos(phi/3) - b/3,
          s * Math.cos((phi + 2 * Math.PI) / 3) - b/3,
          s * Math.cos((phi + 4 * Math.PI) / 3) - b/3
        ];
      }
    }
  }

  if (possibleResults.length === 1)
    t = possibleResults[0];
  else {
    for (var i = 0, len = possibleResults.length; i < len; i++) {
      if (possibleResults[i] >= 0 && possibleResults[i] <= 1) {
        t = possibleResults[i];
        break;
      }
    }
  }

  // finally get y
  var y = (1-t)*(1-t)*(1-t) * Y0 + 3*(1-t)*(1-t) * t * Y1 + 3*(1-t) * t*t * Y2 + t*t*t * Y3;

  return y;
}

module.exports.cubicBezier = cubicBezier;
