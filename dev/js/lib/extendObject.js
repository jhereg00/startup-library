/**
 * extendObject
 *
 * @param target
 * @param ...sources (rewritten to be ES5 friendly)
 */
var extendObject = function (target) {
	var sources = [];
	for (var i = 1; i < arguments.length; i++) {
		sources.push(arguments[i]);
	}
	for (var i = 0; i < sources.length; i++) {
		var s = sources[i];
		if (!s || (typeof s !== 'object' && typeof s !== 'function'))
			continue;
		for (var key in s) {
			if (s.hasOwnProperty(key)) {
				if (s[key] !== target[key]) {
          // if array, make a copy of it
					if (s[key] instanceof Array) {
						target[key] = s[key].slice();
					}
          // not a native Object (so, either a primitive or instance of something where the programmer probably wants that instance to stick around)
          // or not the same type of object as target (maybe target is undefined or null or something)
					else if (s[key].constructor !== Object || typeof target[key] !== typeof s[key]) {
						target[key] = s[key];
					}
          // if object of same class as target, recursive this with these objects
					else if (s[key].constructor === Object && target[key].constructor === Object) {
						target[key] = extendObject({}, target[key], s[key]);
					}
				}
			}
			else break; // hasOwnProperty === false, meaning we're through the non-prototype stuff
		}
	}
	return target;
};

module.exports = extendObject;
