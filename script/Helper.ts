interface HashTable<T>
{
	[key: number]: T;
}


//from http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
var Params = (function (a)
{
	var b = {};
	for (var i = 0; i < a.length; ++i)
	{
		var p = a[i].split('=');
		if (p.length !== 2) continue;
		b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
	}
	return b;
})(window.location.search.substr(1).split('&'));

console.log("url:"+ window.location.search);
console.log("params:" + JSON.stringify(Params));


var  IsExpertMode = Params["expert"] !== undefined;

class Helper
{
	public static StringFormat(fmt: string, ...args: any[]): string
	{
		return Helper.StringFormatArgs(fmt, args);
	}

	public static StringFormatArgs(fmt: string, args: any[]): string
	{
		for (let i = 0; i < args.length; i++)
		{
			var regexp = new RegExp('\\{' + i + '\\}', 'gi');
			fmt = fmt.replace(regexp, args[i]);
		}

		return fmt;
	}
}


