interface HashTable<T> {
	[key: number]: T;
}


//from http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
var Params = (function (a) {
	var b = {};
	for (var i = 0; i < a.length; ++i) {
		var p = a[i].split('=');
		if (p.length !== 2) continue;
		b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
	}
	return b;
})(window.location.search.substr(1).split('&'));

console.log("url:" + window.location.search);
console.log("params:" + JSON.stringify(Params));


var IsExpertMode = Params["expert"] !== undefined;

class Helper {
	public static StringFormat(fmt: string, ...args: any[]): string {
		return Helper.StringFormatArgs(fmt, args);
	}

	public static StringFormatArgs(fmt: string, args: any[]): string {
		for (let i = 0; i < args.length; i++) {
			var regexp = new RegExp('\\{' + i + '\\}', 'gi');
			fmt = fmt.replace(regexp, args[i]);
		}

		return fmt;
	}
}



//Polyfills

// https://github.com/uxitten/polyfill/blob/master/string.polyfill.js
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart
if (!String.prototype.padStart) {
	String.prototype.padStart = function padStart(targetLength: number, padString?: string) {
		targetLength = targetLength >> 0; //truncate if number or convert non-number to 0;
		padString = String((typeof padString !== 'undefined' ? padString : ' '));
		if (this.length > targetLength) {
			return String(this);
		}
		else {
			targetLength = targetLength - this.length;
			if (targetLength > padString.length) {
				padString += padString.repeat(targetLength / padString.length); //append to original to ensure we are longer than needed
			}
			return padString.slice(0, targetLength) + String(this);
		}
	};
}

// https://github.com/uxitten/polyfill/blob/master/string.polyfill.js
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padEnd
if (!String.prototype.padEnd) {
	String.prototype.padEnd = function padEnd(targetLength: number, padString?: string) {
		targetLength = targetLength >> 0; //floor if number or convert non-number to 0;
		padString = String((typeof padString !== 'undefined' ? padString : ' '));
		if (this.length > targetLength) {
			return String(this);
		}
		else {
			targetLength = targetLength - this.length;
			if (targetLength > padString.length) {
				padString += padString.repeat(targetLength / padString.length); //append to original to ensure we are longer than needed
			}
			return String(this) + padString.slice(0, targetLength);
		}
	};
}


// https://tc39.github.io/ecma262/#sec-array.prototype.find
if (!Array.prototype.find) {
	Object.defineProperty(Array.prototype, 'find', {
	  value: function(predicate: () => any) {
	   // 1. Let O be ? ToObject(this value).
		if (this == null) {
		  throw new TypeError('"this" is null or not defined');
		}
  
		var o = Object(this);
  
		// 2. Let len be ? ToLength(? Get(O, "length")).
		var len = o.length >>> 0;
  
		// 3. If IsCallable(predicate) is false, throw a TypeError exception.
		if (typeof predicate !== 'function') {
		  throw new TypeError('predicate must be a function');
		}
  
		// 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
		var thisArg = arguments[1];
  
		// 5. Let k be 0.
		var k = 0;
  
		// 6. Repeat, while k < len
		while (k < len) {
		  // a. Let Pk be ! ToString(k).
		  // b. Let kValue be ? Get(O, Pk).
		  // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
		  // d. If testResult is true, return kValue.
		  var kValue = o[k];
		  if (predicate.call(thisArg, kValue, k, o)) {
			return kValue;
		  }
		  // e. Increase k by 1.
		  k++;
		}
  
		// 7. Return undefined.
		return undefined;
	  }
	});
  }