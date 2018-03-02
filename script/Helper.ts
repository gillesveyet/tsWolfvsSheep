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