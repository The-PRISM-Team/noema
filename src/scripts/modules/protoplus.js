JSON.isJSON = function (obj) {
	return obj !== null && typeof obj === 'object' && !Array.isArray(obj);
};

JSON.iterate = function (obj, callback) {
	if (!JSON.isJSON(obj)) throw new Error('Argument "obj" has to be of type "JSON" ("object").');
	if (typeof callback !== 'function') throw new Error('Argument "callback" has to be of type "function".');
	for (let i = 0; i < Object.keys(obj).length; i++) {
		callback(Object.keys(obj)[i], Object.values(obj)[i], i);
	}
};

Audio.prototype.resume = function () {
	if (this.paused) {
		this.play();
		return true;
	} else {
		return false;
	}
};
Audio.prototype.stop = function () {
	this.pause();
	this.currentTime = 0;
};

Array.prototype.last =
HTMLCollection.prototype.last =
String.prototype.last = function () {
	return this[this.length - 1];
};

Array.shuffle = (arr) => {
	if (!Array.isArray(arr)) return;
	// Durstenfield shuffle script not made by me
	// Code from https://stackoverflow.com/a/12646864
	// Credit where it's due!
	// Thanks @Laurens Holst and @mwsundberg

	for (let i = arr.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}
	return arr;
};
Array.prototype.shuffle = function () {
	let shuffled = Array.shuffle(this);
	shuffled.forEach((item, i) => {
		this[i] = item;
	});
	return shuffled;
};
Array.prototype.toShuffled = function () {
	return Array.shuffle([...this]);
};

String.prototype.escapeRegex = function () {
	return RegExp.escape(String(this));
};

String.prototype.trimLeft = String.prototype.trimStart = function (...chars) {
	if (chars.length < 1) {
		return this.trimStart(' ', '\t', '\n', '\r');
	} else {
		let finalStr = String(this);
		chars.forEach(char => {
			if (typeof char !== 'string') return;
			finalStr = finalStr.replace(new RegExp(`^${char.escapeRegex()}+`), "");
		});
		return finalStr;
	}
};
String.prototype.trimRight = String.prototype.trimEnd = function (...chars) {
	if (chars.length < 1) {
		return this.trimEnd(' ', '\t', '\n', '\r');
	} else {
		let finalStr = String(this);
		chars.forEach(char => {
			if (typeof char !== 'string') return;
			finalStr = finalStr.replace(new RegExp(`${char.escapeRegex()}+$`), "");
		});
		return finalStr;
	}
};
String.prototype.trim = function (...chars) {
	return this.trimStart(...chars).trimEnd(...chars);
};
String.prototype.reverse = function () {
	return this.split('').reverse().join('');
};

String.prototype.chars = function () { return this.split(''); };
String.prototype.words = function () { return this.split(' '); };
String.prototype.lines = function () { return this.split('\n'); };

String.prototype.forEach = function (callback, separator = '') {
	const separated = this.split(separator);
	for (let i = 0; i < separated.length; i++) {
		callback(separated[i], i, this);
	}
	return;
};

String.prototype.toTitleCase = function (separator = ' ') {
	const str = this.valueOf(),
		finalStr = [];

	str.split(separator).forEach((arg) => {
		finalStr.push(arg[0].toUpperCase() + arg.substring(1));
	});

	return finalStr.join(separator);
};

String.prototype.startsWithAmount = function (char) {
	for (let i = 0; i < this.length; i++) {
		if (this[i] !== char)
			return i;
	}
};
String.prototype.endsWithAmount = function (char) {
	let iterations = 0;
	for (let i = this.length - 1; i > 0; i--) {
		if (this[i] !== char)
			return iterations;

		iterations++;
	}
};

Number.prototype.evenize = function () {
	// snaps to nearest even number
	return Math.round(this / 2) * 2;
};
Number.prototype.oddize = function () {
	// snaps to nearest odd number
	return Math.round((this - 1) / 2) * 2 + 1;
};

Number.prototype.fix = function (digits) {
	return parseFloat(this.toFixed(digits));
};
Number.prototype.floor = function () {
	return Math.floor(this);
};
Number.prototype.ceil = function () {
	return Math.ceil(this);
};
Number.prototype.round = function () {
	return Math.round(this);
};
Number.prototype.clamp = function (min, max) {
	return Math.max(min, Math.min(max, this));
};
Math.clamp = (num, min, max) => {
	return Math.max(min, Math.min(max, num));
};

Math.TAU = 2*Math.PI;
Math.angle = {
	clampDeg: (deg)=>deg % 360,
	clampRad: (rad)=>rad % Math.TAU,
	radToDeg: (rad)=>rad * 180 / Math.PI,
	degToRad: (deg)=>deg * Math.PI / 180
};


Number.floatPrecision = null;
Number.testFloatPrecision = () => {
	for (let i = 0; i < 5e2; i++) {
		const baseNumber = 1;
		const testNumber = parseFloat(`0.${'9'.repeat(i)}`);
		if (testNumber === baseNumber) {
			Number.floatPrecision = i;
			return i;
		}
	}
};
Number.testFloatPrecision();

Number.intPrecision = Number.MAX_SAFE_INTEGER;
Number.testIntPrecision = () => Number.intPrecision = Number.MAX_SAFE_INTEGER;

Object.typeOf = (thing) => {
	if (typeof thing === 'object')
		if (thing === null)
			return 'null';
		else if (Array.isArray(thing))
			return 'array';
		else
			return 'object';
	else if (typeof thing === 'number') {
		if (Number.isNaN(thing))
			return 'nan';
		else if (!Number.isFinite(thing))
			return 'infinity';
	} else if (typeof thing === 'function' && /^class\b/.test(thing.toString())) // unreliable, do better later, right now focus on finishing the damn thing
		return 'class';
	else
		return typeof thing;
};
Object.typeOf.types = Object.freeze( // made it a string so it's easy to add more
	'number,string,boolean,function,symbol,bigint,undefined,null,array,object,nan,infinity,class'
		.split(','));

Array.genericType = (array) => {
	if (array.length === 0) return undefined;

	const baseType = Object.typeOf(array[0]);
	for (let i = 1; i < array.length; i++) {
		if (Object.typeOf(array[i]) !== baseType)
			return undefined;
	}

	return baseType;
};
Array.prototype.genericType = function () {
	return Array.genericType(this);
};
const ___nativeSort = Array.prototype.sort;
Array.prototype.sort = function (compareFn) {
	const arrType = this.genericType();

	if (compareFn !== undefined) {
		if (Object.typeOf(compareFn) === 'function') {
			___nativeSort.call(this, compareFn);
		} else {
			throw new TypeError(`The comparison function should not be of type '${Object.typeOf(compareFn)}', only 'function' or 'undefined'`);
		}
	} else {
		if (arrType === 'number')
			___nativeSort.call(this, (a, b) => a - b);
		else
			___nativeSort.call(this);
	}
	return this;
};
