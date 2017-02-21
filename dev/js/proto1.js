// some ground rules for the sake of this prototype
//   anything that animates can't have a transform already on it (the animation will do that)
//   animation measurements are by top of element's position on screen, by percentage
//     sorry if that's a confusing way to word that
//   colorized images are turned into canvases
//   as a prototype, it is not cross-browser

// settings
var ACCENT_COLOR = "#fdb827";
var BOX_IN_DIVISIONS = 5;
var BOX_IN_TIME = 3000;
var BOX_EACH_TIME = 500;

// helper
function offsetFrom (element, offsetElement) {
  offsetElement = offsetElement || document.getElementsByTagName('html')[0];

  var elementRect = element.getClientRects()[0],
      offsetElementRect = offsetElement.getClientRects()[0];

  if (elementRect && offsetElementRect) {
    return {
      top: elementRect.top - offsetElementRect.top,
      right: offsetElementRect.right - elementRect.right,
      bottom: offsetElementRect.bottom - elementRect.bottom,
      left: elementRect.left - offsetElementRect.left
    }
  }
  else {
    return {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    }
  }
}

// replace any img.tinted element with a canvas that tints it to the color defined above
function TintedImage (img) {
  this.image = img;
  this.canvas = document.createElement('canvas');
  this.canvas.setAttribute('class',this.image.getAttribute('class'));
  this.canvas.setAttribute('id',this.image.getAttribute('id'));
  this.image.setAttribute('id',this.image.getAttribute('id') + 'Orig');
  this.canvas.width = this.image.width;
  this.canvas.height = this.image.height;
  this.ctx = this.canvas.getContext('2d');
  this.image.parentNode.insertBefore(this.canvas, this.image);
  this.image.remove(); // not cross-browser...
  this.draw();
}
TintedImage.prototype = {
  draw: function () {
    if (!this.image.complete) {
      this.image.addEventListener('load', this.draw.bind(this));
      return false;
    }
    this.canvas.width = this.image.width;
    this.canvas.height = this.image.height;
    this.ctx.drawImage(this.image,0,0);
    this.ctx.globalCompositeOperation = "color";
    this.ctx.fillStyle = ACCENT_COLOR;
    this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);

    this.canvas.classList.add('is-drawn');
    allScrollControllers.forEach(function (sc) { sc.measure(); });
    if (this.readyFns) {
      this.readyFns.forEach(function (fn) { fn(); });
    }
  },
  onReady: function (fn) {
    if (!this.readyFns)
      this.readyFns = [fn];
    else
      this.readyFns.push(fn);
  }
}

// make a canvas and do some crazy animation in it
// but instead of putting it on the page, assign it as a background
function BoxIn (element) {
  this.element = element;
  this.canvas = document.createElement('canvas');
  this.ctx = this.canvas.getContext('2d');
  this.prepAnimation();

  // should debounce this
  window.addEventListener('resize',this.prepAnimation.bind(this));
}
BoxIn.prototype = {
  prepAnimation: function () {
    this.canvas.width = Math.max(this.element.offsetWidth, this.element.offsetHeight / 2);
    this.canvas.height = Math.max(this.element.offsetWidth / 2, this.element.offsetHeight);

    var startTime = new Date().getTime();
    // make the underBoxes in a semi-random way
    // each "box" is an array of [x, y, width, height]
    var underBoxes = [[0,0,this.canvas.width,this.canvas.height]];
    for (var d = 0; d < BOX_IN_DIVISIONS; d++) {
      // count down, so as we add underBoxes our index doesn't get lost
      for (var box = underBoxes.length - 1; box >= 0; box--) {
        // cut vertically if d % 2
        // or horizontally otherwise,
        // thus alternating as we get smaller

        // pick a cut point somewhere between .25 and .75
        var cutPoint = Math.random() * .5 + .25;

        // make new underBoxes
        if (d % 2) {
          var newBox1 = [underBoxes[box][0], underBoxes[box][1], underBoxes[box][2] * cutPoint, underBoxes[box][3]];
          var newBox2 = [newBox1[0] + newBox1[2], underBoxes[box][1], underBoxes[box][2] - newBox1[2], underBoxes[box][3]];
        }
        else {
          var newBox1 = [underBoxes[box][0], underBoxes[box][1], underBoxes[box][2], underBoxes[box][3] * cutPoint];
          var newBox2 = [underBoxes[box][0], newBox1[1] + newBox1[3], underBoxes[box][2], underBoxes[box][3] - newBox1[3]];
        }
        underBoxes.splice(box, 1, newBox1, newBox2);
      }
    }
    // give each box a time offset based on x position then adding a random value
    underBoxes.forEach((function (box) {
      box[4] = box[0] / this.canvas.width * BOX_IN_TIME * .66 + (Math.random() * BOX_IN_TIME * .1 - (BOX_IN_TIME * .05));
    }).bind(this));

    // clone then mirror for apparent variation without as much maths
    // vertical mirror so that the time offsets are fine
    var overBoxes = underBoxes.map((function (box) {
      return [box[0], this.canvas.height - box[1] - box[3], box[2], box[3], box[4]]
    }).bind(this));

    this.overBoxesColor = getComputedStyle(this.element).color;

    this.underBoxes = underBoxes;
    this.overBoxes = overBoxes;
  },
  setToPercentage: function (percentage) {
    this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
    var deltaTime = BOX_IN_TIME * percentage;
    // deal with accent first
    this.ctx.fillStyle = ACCENT_COLOR;
    this.underBoxes.forEach((function (box) {
      if (deltaTime > box[4]) {
        var boxTime = deltaTime - box[4];
        var boxPerc = boxTime / BOX_EACH_TIME;
        this.ctx.fillRect(
          box[0] + .5 * box[2] * (1 - boxPerc),
          box[1] + .5 * box[3] * (1 - boxPerc),
          box[2] * boxPerc,
          box[3] * boxPerc
        )
      }
    }).bind(this));
    this.ctx.fillStyle = this.overBoxesColor;
    this.overBoxes.forEach((function (box) {
      if (deltaTime > box[4] + BOX_IN_TIME * .33) {
        var boxTime = deltaTime - (box[4] + BOX_IN_TIME * .33);
        var boxPerc = boxTime / BOX_EACH_TIME;
        this.ctx.fillRect(
          box[0] + .5 * box[2] * (1 - boxPerc),
          box[1] + .5 * box[3] * (1 - boxPerc),
          box[2] * boxPerc,
          box[3] * boxPerc
        )
      }
    }).bind(this));

    // ouchies...
    this.element.style.backgroundImage = 'url("' + this.canvas.toDataURL() + '")';
    this.animationPercentage = percentage;
  }
}


///////////////////
// scroll based animations
///////////////////
// scroll loop
var scrollFns = [];
function addScrollFunction (fn) {
  if (scrollFns.indexOf(fn) === -1)
    scrollFns.push(fn);
}
var lastScroll = 0;
(function scrollLoop () {
  var currentScrollPos = window.scrollY;
  if (currentScrollPos !== lastScroll) {
    scrollFns.forEach(function (fn) { fn(); });
    lastScroll = currentScrollPos;
  }
  requestAnimationFrame(scrollLoop.bind(this));
}).call(this);

var allScrollControllers = [];
var ScrollController = function ScrollController (element, onScroll) {
  if (!this instanceof ScrollController)
    return new ScrollController(element);

  this.element = element;

  // get measurements immediately
  this.measure();
  if (onScroll)
    onScroll(this.getPercentage());

  // listeners
  if (onScroll) {
    this.onScroll = (function scrollScrollController () {
      onScroll.apply(this, [this.getPercentage(), this.getPixels()]);
    }).bind(this)
  }

  // should debounce this
  window.addEventListener('resize',this.measure.bind(this));
  if (this.onScroll)
    addScrollFunction(this.onScroll.bind(this));

  allScrollControllers.push(this);
}
ScrollController.prototype = {
  measure: function () {
    var po = offsetFrom(this.element);
    this.top = po.top - window.innerHeight;
    this.bottom = po.top + this.element.offsetHeight;
    this.height = this.bottom - this.top;
  },
  getPercentage: function () {
    var scrollY = lastScroll;
    var perc = (scrollY - this.top) / (this.height);
    return perc;
  },
  getPixels: function () {
    return lastScroll - this.top;
  }
}

//////////////////////////////
// intro section
//////////////////////////////
function IntroSection (element) {
  this.element = element;
  this.title = element.querySelector('h1');
  this.titleBoxIn = new BoxIn (this.title);

  this.tintedImage = new TintedImage(element.querySelector('img.tinted'));
  this.image = element.querySelector('.intro__image');
  this.percentage = 0;

  this.scrollController = new ScrollController (this.element, this.setToPercentage.bind(this));
  this.tintedImage.onReady(this.scrollController.measure.bind(this.scrollController));

  // animate in if needed
  var sPerc = this.scrollController.getPercentage();
  if (sPerc >= 0) {
    this.animateToPercentage(sPerc, sPerc * 1500, 0);
  }
}
IntroSection.prototype = {
  animateToPercentage: function (endPercentage, duration, startPercentage) {
    var startTime = new Date().getTime();
    startPercentage = isNaN(startPercentage) ? this.percentage : startPercentage;
    (function loop () {
      var deltaTime = new Date().getTime() - startTime;
      if (deltaTime < duration) {
        this.setToPercentage(startPercentage + (endPercentage - startPercentage) * (deltaTime / duration));
        requestAnimationFrame(loop.bind(this));
      }
      else {
        this.setToPercentage(endPercentage);
      }
    }).call(this);
  },
  setToPercentage: function (percentage) {
    // first, do the boxIn
    var boxInPerc = percentage < .5 ? Math.min(percentage / .25, 1) : Math.min(Math.max((.8 - percentage) / .25, 0),1);
    this.titleBoxIn.setToPercentage(boxInPerc);
    var tX = 5 + (-10 * percentage);
    var tY = 10 * percentage;
    this.title.style.transform = "translate(" + tX + "vw," + tY + "vh)";

    tX = -5 + (10 * percentage);
    tY = 0;
    this.image.style.transform = "translate(" + tX + "vw," + tY + "vh)";

    this.percentage = percentage;
  }
}

//////////////////////////////
// text section
//////////////////////////////
function TextSection (element) {
  this.element = element;
  this.boxIns = [];
  this.boxInScrollControllers = [];
  var boxInEls = document.querySelectorAll('.box-in-text');
  for (var i = 0, len = boxInEls.length; i < len; i++) {
    this.boxIns.push(new BoxIn(boxInEls[i]));
    this.boxInScrollControllers.push(new ScrollController(boxInEls[i]));
  }

  this.imageBg = element.querySelector('.text__bg-image');
  this.scrollController = new ScrollController(element);
  this.percentage = 0;

  addScrollFunction(this.animateByScroll.bind(this));
}
TextSection.prototype = {
  animateByScroll: function () {
    for (var i = 0, len = this.boxIns.length; i < len; i++) {
      var percentage = this.boxInScrollControllers[i].getPercentage();
      var boxInPerc = percentage < .5 ? Math.min((percentage - .1) / .33, 1) : Math.min(Math.max((1 - percentage) / .25, 0),1);
      this.boxIns[i].setToPercentage(boxInPerc);
      var tX = 5 + (-10 * percentage);
      var tY = 0;
      this.boxIns[i].element.style.transform = "translate(" + tX + "vw," + tY + "vh)";
    }

    if (this.imageBg) {
      var inPerc = (this.scrollController.getPixels() - window.innerHeight) / (.8 * window.innerHeight);
      var s = 1 + (.5 * (inPerc + .2));
      var o = inPerc < .25 ? (inPerc + .1) / .25 : 1 + (-1 * ((inPerc - .5) / .5));
      this.imageBg.style.transform = "scale(" + s + ")";
      this.imageBg.style.opacity = o;
    }

    this.percentage = percentage;
  }
}

//////////////////////////////
// init things
//////////////////////////////

// binding to window for debugging

window.intro = new IntroSection (document.querySelector('.intro'));
window.textSections = [];
var textSectionEls = document.querySelectorAll('.text');
for(var i = 0, len = textSectionEls.length; i < len; i++) {
  textSections.push(new TextSection (textSectionEls[i]));
}
