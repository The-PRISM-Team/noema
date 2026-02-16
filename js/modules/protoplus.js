// prototypes.js

// ==== STRING ====

/**
 * Returns an array of characters.
 * @this {string}
 * @returns {string[]}
 */
String.prototype.chars = function () {
    return this.split('');
};

/**
 * Returns an array of words separated by whitespace.
 * @this {string}
 * @returns {string[]}
 */
String.prototype.words = function () {
    return this.trim().split(/\s+/);
};

/**
 * Returns an array of lines.
 * @this {string}
 * @returns {string[]}
 */
String.prototype.lines = function () {
    return this.split(/\r?\n/);
};

/**
 * Counts how many times the string starts with a given substring.
 * @this {string}
 * @param {string} substr
 * @returns {number}
 */
String.prototype.startsWithAmount = function (substr) {
    let count = 0;
    let str = this.toString();
    while (str.startsWith(substr)) {
        count++;
        str = str.slice(substr.length);
    }
    return count;
};

/**
 * Counts how many times the string ends with a given substring.
 * @this {string}
 * @param {string} substr
 * @returns {number}
 */
String.prototype.endsWithAmount = function (substr) {
    let count = 0;
    let str = this.toString();
    while (str.endsWith(substr)) {
        count++;
        str = str.slice(0, -substr.length);
    }
    return count;
};

/**
 * Escapes regex-reserved characters in the string.
 * @this {string}
 * @returns {string}
 */
String.prototype.escapeRegex = function () {
    return this.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * Iterates over each character.
 * @this {string}
 * @param {(char: string, index: number) => void} callback
 * @returns {void}
 */
String.prototype.forEach = function (callback) {
    for (let i = 0; i < this.length; i++) {
        callback(this[i], i);
    }
};


// ==== ARRAY ====

/**
 * Returns a shuffled copy of the array.
 * @this {Array<any>}
 * @returns {Array<any>}
 */
Array.prototype.toShuffled = function () {
    const arr = [...this];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
};

/**
 * Shuffles an array in-place.
 * @param {any[]} arr
 * @returns {any[] | undefined}
 */
Array.shuffle = function (arr) {
    if (!Array.isArray(arr)) return undefined;
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
};


// ==== NUMBER ====

/**
 * Clamps the number between min and max.
 * @this {number}
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
Number.prototype.clamp = function (min, max) {
    return Math.min(Math.max(this.valueOf(), min), max);
};


// ==== OBJECT ====

/**
 * Maps over object entries.
 * @param {Record<string, any>} obj
 * @param {(key: string, value: any, index: number) => void} callback
 * @returns {void}
 */
Object.iterate = function (obj, callback) {
    let i = 0;
    for (const [key, value] of Object.entries(obj)) {
        callback(key, value, i++);
    }
};


// ==== JSON ====

/**
 * Iterates over JSON object entries.
 * @param {Record<string, any>} obj
 * @param {(key: string, value: any, index: number) => void} callback
 * @returns {void}
 */
JSON.iterate = function (obj, callback) {
    let i = 0;
    for (const [key, value] of Object.entries(obj)) {
        callback(key, value, i++);
    }
};


// ==== HTMLCollection ====

/**
 * Converts HTMLCollection to array.
 * @this {HTMLCollection}
 * @returns {Element[]}
 */
HTMLCollection.prototype.toArray = function () {
    return Array.from(this);
};