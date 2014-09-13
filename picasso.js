function Picassojs() {
	
	var height = window.innerHeight;
	var width = window.innerWidth;

	function recolorEverything(elem, lumRatio) {
		var style = window.getComputedStyle(elem);
		var color = style.color;
		var backgroundColor = style.backgroundColor;

		elem.style.color = calculateLuminance(rgbToHex(color), lumRatio);	
		// elem.style.backgroundColor = calculateLuminance(rgbToHex(backgroundColor), (-1) * lumRatio);	

		for (var i = elem.children.length - 1; i >= 0; i--) {
			var child =	elem.children[i];
			recolorEverything(child, lumRatio);
		}
	}

	function rgbToHex(rgbString) {
		var a = rgbString.split("(")[1].split(")")[0];
		a = a.split(",");

		var b = a.map(function(x){             //For each array element
	    	x = parseInt(x).toString(16);      //Convert to a base16 string
	    	return (x.length==1) ? "0"+x : x;  //Add zero if we get only one character
		});
	
		return "#" + b.join("");
	}

	/**
	 * http://www.sitepoint.com/javascript-generate-lighter-darker-color/
	 */
	function calculateLuminance(hex, lum) {

		// validate hex string
		hex = String(hex).replace(/[^0-9a-f]/gi, '');
		if (hex.length < 6) {
			hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
		}
		lum = lum || 0;

		// convert to decimal and change luminosity
		var rgb = "#", c, i;
		for (i = 0; i < 3; i++) {
			c = parseInt(hex.substr(i*2,2), 16);
			c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
			rgb += ("00"+c).substr(c.length);
		}

		return rgb;
	}

	function calculateLuminanceRatio(newHeight, newWidth) {
		return ( newHeight / height + newWidth / width ) / 2 - 1;
	}

	function picasso(newHeight, newWidth) {
		var lumRatio = calculateLuminanceRatio(newHeight, newWidth);

		// brute force: iterate over all elements.
		var body = document.getElementsByTagName('body')[0];
		recolorEverything(body, lumRatio);

		// reset the global variables
		height = newHeight;
		width = newWidth;
	}

	this.control = function () {
		console.log("This view is now controlled by Picasso.");
		window.addEventListener("resize", function(event) {
			var newHeight = event.srcElement.innerHeight;
			var newWidth = event.srcElement.innerWidth;

			picasso(newHeight, newWidth);
		});
	}
}

picasso = new Picassojs();
picasso.control();
