//valid format: numbers
function isNatural(word) {
	return /^\d+$/.test(word);
}

//valid format: numbers.numbers
function isPositiveFloat(word) {
	return /^\d+(\.\d+)?$/.test(word);
}

//valid format: positive integer or positive float
function isNumber(word) {
	return isNatural(word) || isPositiveFloat(word);
}

//checks if element is in array
if(Array.prototype.has) console.warn("Overriding existing Array.prototype.has at utils.js");
Array.prototype.has = function(e) {
	return this.indexOf(e) !== -1;
}

//turns array into an empty one
if(Array.prototype.clear) console.warn("Overriding existing Array.prototype.clear at utils.js");
Array.prototype.clear = function() {
	this.length = 0;
	return this;
}

//all letters to lower case, except the first one
if(String.prototype.capitalize) console.warn("Overriding existing String.prototype.capitalize at utils.js");
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
}