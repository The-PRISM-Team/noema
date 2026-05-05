const now =
  typeof globalThis.performance?.now === "function"
    ? ()=>Math.trunc(performance.now()) // use performance.now when available
    : Date.now;

const protoplus = {
    snapshots: {},
    global: {
        JSON: {
            isJSON: function (obj) {
                return obj !== null && typeof obj === 'object' && !Array.isArray(obj);
            },
            iterate: function (obj, callback) {
                if (!JSON.isJSON(obj)) throw new TypeError('Argument "obj" has to be of type "JSON" ("object").');
                if (typeof callback !== 'function') throw new TypeError('Argument "callback" has to be of type "function".');
                for (let i = 0; i < Object.keys(obj).length; i++) {
                    callback(Object.keys(obj)[i], Object.values(obj)[i], i);
                }
            }
        },

        RegExp: {
            escape: (str) => String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        },

        Array: {
            shuffle: (arr) => {
                if (!Array.isArray(arr)) return;
                // Durstenfield shuffle script not made by me
                // Code from https://stackoverflow.com/a/12646864
                // Credit where it's due!
                // Thanks @Laurens Holst and @mwsundberg

                for (let i = arr.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [arr[i], arr[j]] = [arr[j], arr[i]];
                }
                return arr
            },
            genericType: (array) => {
                if (array.length === 0) return undefined;

                const baseType = Object.typeOf(array[0]);
                for (let i = 1; i < array.length; i++) {
                    if (Object.typeOf(array[i]) !== baseType)
                        return undefined;
                }

                return baseType;
            }
        },

        Math: {
            clamp: (num, min, max) => Math.max(min, Math.min(max, num)),
            TAU: 2 * Math.PI,
            angle: {
                clampDeg: (deg) => deg % 360,
                clampRad: (rad) => rad % Math.TAU,
                radToDeg: (rad) => rad * 180 / Math.PI,
                degToRad: (deg) => deg * Math.PI / 180
            }
        },

        Number: {
            testFloatPrecision: () => {
                for (let i = 0; i < 5e2; i++) {
                    const baseNumber = 1;
                    const testNumber = parseFloat(`0.${'9'.repeat(i)}`);
                    if (testNumber === baseNumber) {
                        Number.floatPrecision = i;
                        return i;
                    }
                }
            },
            testIntPrecision: () => Number.intPrecision = Number.MAX_SAFE_INTEGER
        },

        Object: {
            isPlain: function() {
                return this !== null && typeof this === 'object' && !Array.isArray(this);
            },

            typeOf: (thing) => {
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

                } else if (typeof thing === 'function') {

                    function isClass(value) {
                        if (typeof value !== 'function') return;
 
                        // do many tests to prove class status
                        const tests = [
                            Function.prototype.toString.call(value).startsWith("class "),
                            (()=>{
                                try {
                                    Reflect.construct(String, [], value);
                                    return false;
                                } catch (err) {
                                    return /class constructor/i.test(err?.message ?? err);
                                }
                            })(),
                            (()=>{
                                if (!value.prototype) return false;
                                return !Object.prototype.propertyIsEnumerable.call(value, 'prototype');
                            })(),
                            (() => {
                                if (!value.prototype) return false;
                                return Object.prototype.hasOwnProperty.call(value.prototype, 'constructor');
                            })(),
                            (() => {
                                return value[Symbol.toStringTag] === 'Function';
                            })()
                        ]

                        return tests.some(Boolean);
                    }
                    if (isClass(thing))
                        return 'class';
                    else
                        return 'function';

                } else
                    return typeof thing;
            },
            types: Object.freeze( // made it a string so it's easier to add more
                'number,string,boolean,function,class,symbol,bigint,undefined,null,array,object,nan,infinity'
                .split(',')
            )
        }
    },

    proto: {
        Audio: {
            resume: function () {
                if (this.paused) {
                    this.play();
                    return true;
                } else {
                    return false;
                }
            }
        },

        Array: {
            last: function () {
                return this[this.length - 1];
            },
            shuffle: function () {
                const shuffled = Array.shuffle(this);
                shuffled.forEach((item, i) => {
                    this[i] = item;
                })
                return shuffled;
            },
            toShuffled: function () {
                return Array.shuffle([...this]);
            },
            genericType: function () {
                return Array.genericType(this);
            },
            advSort: function (compareFn) {
                const arrType = this.genericType();

                if (compareFn !== undefined) {
                    if (typeof compareFn === 'function') {
                        this.sort(compareFn);
                    } else {
                        throw new TypeError(`The comparison function should not be of type '${typeof compareFn}', only 'function' or 'undefined'`);
                    }
                } else {
                    if (arrType === 'number')
                        this.sort((a, b) => a - b);
                    else
                        this.sort();
                }
                return this;
            }
        },

        HTMLCollection: {
            last: function () {
                return this[this.length - 1];
            }
        },

        Boolean: {
            formatTypes: {
                affirm: ['no', 'yes'],
                binary: ['0', '1'],
                onoff: ['off', 'on'],
                enable: ['disabled', 'enabled'],
                literal: ['false', 'true']
            },
            format: function ({ type = 'literal' }) {
                const bool = this.valueOf();
                const types = Boolean.formatTypes;

                const pair = types[type] ?? ['false', 'true'];
                return pair[+bool]; // transform bool to num by adding with 0
            }
        },
        String: {
            last: function () {
                return this[this.length - 1];
            },
            escapeRegex: function () {
                return RegExp.escape(String(this));
            },
            trimLeft: function (...strings) {
                if (strings.length < 1) {
                    strings = [' ', '\t', '\n', '\r'];
                }
                let finalStr = this.valueOf();
                strings.forEach(string => {
                    if (typeof string !== 'string') return;
                    finalStr = finalStr.replace(new RegExp(`^${string.escapeRegex()}+`), "");
                })
                return strings;
            },
            trimStart: String.prototype.trimLeft,
            trimRight: function (...strings) {
                if (strings.length < 1) {
                    strings = [' ', '\t', '\n', '\r'];
                }
                let finalStr = this.valueOf();
                strings.forEach(string => {
                    if (typeof string !== 'string') return;
                    finalStr = finalStr.replace(new RegExp(`${string.escapeRegex()}+$`), "");
                })
                return finalStr;
            },
            trimEnd: String.prototype.trimRight,
            trim: function (...strings) {
                return this.trimStart(...strings).trimEnd(...strings);
            },
            reverse: function () {
                return this.
                    split('')
                    .reverse()
                    .join('');
            },
            erase: function(...strings) {
                let finalStr = this.valueOf();
                strings.some(str => {
                    finalStr = finalStr.replace(str, '');
                })
                return finalStr;
            },
            eraseAll: function(...strings) {
                let finalStr = this.valueOf();
                strings.some(str => {
                    finalStr = finalStr.replaceAll(str, '');
                })
                return finalStr;
            },
            chars: function() { return this.split(''); },
            words: function() { return this.split(' '); },
            lines: function() { return this.split('\n'); },
            compactPunct: function() {
                const puncts = {
                    '...': '…',
                    '---': '—',
                    '--': '–',
                    '-': '‑',
                    '<<': '«',
                    '>>': '»',
                    '!!': '‼',
                    '⁇': '⁇',
                    '!?': '⁉',
                    '?!': '⁉'
                }
                let finalStr = this.valueOf();
                finalStr = finalStr.replace(
                    new RegExp(`(${
                        Object.keys(puncts).map(RegExp.escape).join('|')
                    })`, 'g'),
                    punct => puncts[punct]
                );
                return finalStr;
            },
            forEach: function (callback, separator = '') {
                const separated = this.split(separator)
                for (let i = 0; i < separated.length; i++) {
                    callback(separated[i], i, this);
                }
                return;
            },
            toTitleCase: function (separator = ' ') {
                const str = String(this),
                    finalStr = [];

                str.split(separator).forEach((arg) => {
                    finalStr.push(arg[0].toUpperCase() + arg.substring(1));
                })

                return finalStr.join(separator);
            },
            startsWithAmount: function (char) {
                for (let i = 0; i < this.length; i++) {
                    if (this[i] !== char)
                        return i;
                }
                return this.length;
            },
            endsWithAmount: function (char) {
                let iterations = 0;
                for (let i = this.length - 1; i >= 0; i--) {
                    if (this[i] !== char)
                        return iterations;

                    iterations++
                }
                return this.length;
            },
            amountOf: function (substring) {
                let matches = 0;
                for (let i = 0; i < this.length; i++) {
                    const searchStr = this.substring(i, i + substring.length);
                    if (searchStr === substring) matches++
                }
                return matches;
            },
            cleanup: function() {
                return this.valueOf()
                    .normalize("NFKD")
                    .replace(/\p{M}/gu, "");
            }
        },

        Number: {
            evenize: function () {
                // snaps to nearest even number
                return Math.round(this / 2) * 2;
            },
            oddize: function () {
                // snaps to nearest odd number
                return Math.round((this - 1) / 2) * 2 + 1;
            },
            fix: function (digits) {
                return parseFloat(this.toFixed(digits));
            },
            floor: function () {
                return Math.floor(this);
            },
            ceil: function () {
                return Math.ceil(this);
            },
            round: function () {
                return Math.round(this);
            },
            clamp: function (min, max) {
                return Math.max(min, Math.min(max, this));
            }
        }
    },
    classes: {
        AdvDate: class {
            // a more human friendly date API (made by ccjt)

            #timestamp; // define timestamp
            constructor(timestamp) {
                this.#timestamp = ()=>timestamp || Date.now() // init timestamp
                this.weekNames = [
                    "Sunday",
                    "Monday",
                    "Tuesday", 
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday"
                ];
                this.times = {
                    timestamp: ()=>this.#timestamp(),
                    weekDay: ()=>new Date(this.#timestamp()).getDay() + 1,
                    day: ()=>new Date(this.#timestamp()).getDate(),
                    week: ()=>(new Date(new Date(this.#timestamp()).getFullYear(this.#timestamp()), new Date(this.#timestamp()).getMonth() + 1, 0).getDate()),
                    weekName: ()=>(this.weekNames[new Date(this.#timestamp()).getDay()]),
                    month: ()=>new Date(this.#timestamp()).getMonth() + 1,
                    year: ()=>new Date(this.#timestamp()).getFullYear(),
                    hours: ()=>new Date(this.#timestamp()).getHours() + 1,
                    minutes: ()=>new Date(this.#timestamp()).getMinutes(),
                    seconds: ()=>new Date(this.#timestamp()).getSeconds(),
                    milliseconds: ()=>new Date(this.#timestamp()).getMilliseconds()
                }
                for (let i = 0; i < Object.keys(this.times).length; i++) {
                    const key = Object.keys(this.times)[i]
                    const value = Object.values(this.times)[i]
                    this[key] = value
                }
            }

            getDateString(trimWeek = false, showWeek = true, monthFirst = true, timeFirst = false, showMs = false, dateSeparator = '/', timeSeparator = ':', msSeparator = '.') {
                // this code could most likely be compressed into 1 or 2 strings. please do once you figure out how, i beg of you

                if (monthFirst)
                    if (timeFirst)
                        return `${showWeek ? (`${trimWeek ? this.times.weekName().substring(0, 3) : this.times.weekName()} `) : ''}${[this.times.hours().toString().padStart(2, '0'), this.times.minutes().toString().padStart(2, '0'), this.times.seconds().toString().padStart(2, '0')].join(timeSeparator)}${showMs ? `${msSeparator}${this.times.milliseconds().toString().padStart(3, '0')}` : ''} ${[this.times.month().toString().padStart(2, '0'), this.times.day().toString().padStart(2, '0'), this.times.year().toString().padStart(4, '0')].join(dateSeparator)}`
                    else
                        return `${showWeek ? (`${trimWeek ? this.times.weekName().substring(0, 3) : this.times.weekName()} `) : ''}${[this.times.month().toString().padStart(2, '0'), this.times.day().toString().padStart(2, '0'), this.times.year().toString().padStart(4, '0')].join(dateSeparator)} ${[this.times.hours().toString().padStart(2, '0'), this.times.minutes().toString().padStart(2, '0'), this.times.seconds().toString().padStart(2, '0')].join(timeSeparator)}${showMs ? `${msSeparator}${this.times.milliseconds().toString().padStart(3, '0')}` : ''}`
                else
                    if (timeFirst)
                        return `${showWeek ? (`${trimWeek ? this.times.weekName().substring(0, 3) : this.times.weekName()} `) : ''}${[this.times.hours().toString().padStart(2, '0'), this.times.minutes().toString().padStart(2, '0'), this.times.seconds().toString().padStart(2, '0')].join(timeSeparator)}${showMs ? `${msSeparator}${this.times.milliseconds().toString().padStart(3, '0')}` : ''} ${[this.times.day().toString().padStart(2, '0'), this.times.month().toString().padStart(2, '0'), this.times.year().toString().padStart(4, '0')].join(dateSeparator)}`
                    else
                        return `${showWeek ? (`${trimWeek ? this.times.weekName().substring(0, 3) : this.times.weekName()} `) : ''}${[this.times.day().toString().padStart(2, '0'), this.times.month().toString().padStart(2, '0'), this.times.year().toString().padStart(4, '0')].join(dateSeparator)} ${[this.times.hours().toString().padStart(2, '0'), this.times.minutes().toString().padStart(2, '0'), this.times.seconds().toString().padStart(2, '0')].join(timeSeparator)}${showMs ? `${msSeparator}${this.times.milliseconds().toString().padStart(3, '0')}` : ''}`
            }
        }
    },
    expand: ({override = true, skipProtos = false, skipGlobals = false, skipClasses = false} = {}) => {
        const globals = protoplus.global
        const prototypes = protoplus.proto
        const classes = protoplus.classes

        const startTime = now()

        // iter globals
        for (let i = 0; i < Object.keys(globals).length; i++) {
            if (skipGlobals) break; // skip expansion if told to

            const key = Object.keys(globals)[i]
            const defs = Object.values(globals)[i]

            if (!globalThis[key]) continue // skip if the parent doesn't exist in this environment

            // def funcs
            for (let i = 0; i < Object.keys(defs).length; i++) {
                const name = Object.keys(defs)[i]
                const def = Object.values(defs)[i]

                if (globalThis[key][name] === def) continue; // skip definition if it's the same

                // store snapshot if definition already exists
                if (name in globalThis[key]) {
                    protoplus.snapshots[`global.${key}.${name}`] = globalThis[key][name]
                    if (!override) continue; // skip definition if override is false
                }

                globalThis[key][name] = def
            }
        }

        // iter protos
        for (let i = 0; i < Object.keys(prototypes).length; i++) {
            if (skipProtos) break; // skip expansion if told to

            const key = Object.keys(prototypes)[i]
            const defs = Object.values(prototypes)[i]

            if (!globalThis[key]) continue // skip if the parent doesn't exist in this environment

            // def funcs
            for (let i = 0; i < Object.keys(defs).length; i++) {
                const name = Object.keys(defs)[i]
                const def = Object.values(defs)[i]

                if (globalThis[key].prototype[name] === def) continue; // skip definition if it's the same

                // store snapshot if definition already exists
                if (name in globalThis[key].prototype) {
                    protoplus.snapshots[`prototype.${key}.${name}`] = globalThis[key].prototype[name]
                    if (!override) continue; // skip definition if override is false
                }

                globalThis[key].prototype[name] = def
            }
        }
        
        // def classes
        for (let i = 0; i < Object.keys(classes).length; i++) {
            if (skipClasses) break; // skip expansion if told to

            const className = Object.keys(classes)[i]
            const classDef = Object.values(classes)[i]

            if (className in globalThis) {
                // add to snapshots and skip definition if it already exists,
                // regardless of override

                protoplus.snapshots[`value.${className}`] = true // use true for existence
                continue;
            }

            globalThis[className] = classDef
        }
        const endTime = now()
        console.log(`expanded methods in ${endTime - startTime}ms`)
    },
    contract: ({forceErase = false, skipProtos = false, skipGlobals = false, skipClasses = false} = {}) => {
        const globals = protoplus.global
        const prototypes = protoplus.proto
        const classes = protoplus.classes

        const startTime = now()

        // iter globals
        for (let i = 0; i < Object.keys(globals).length; i++) {
            if (skipGlobals) break; // skip contraction if told to
            const key = Object.keys(globals)[i]
            const defs = Object.values(globals)[i]

            if (!globalThis[key]) continue // skip if the parent doesn't exist in this environment
           
            // def funcs
            for (let i = 0; i < Object.keys(defs).length; i++) {
                const name = Object.keys(defs)[i]
                const def = Object.values(defs)[i]

                // delete definition if erasing is forced or there is no snapshot
                if (forceErase || !protoplus.snapshots[`global.${key}.${name}`])
                    delete globalThis[key][name]
                else
                    globalThis[key][name] = protoplus.snapshots[`global.${key}.${name}`]
            }
        }

        // iter protos
        for (let i = 0; i < Object.keys(prototypes).length; i++) {
            if (skipProtos) break; // skip contraction if told to
            
            const key = Object.keys(prototypes)[i]
            const defs = Object.values(prototypes)[i]

            if (!globalThis[key]) continue // skip if the parent doesn't exist in this environment

            // def funcs
            for (let i = 0; i < Object.keys(defs).length; i++) {
                const name = Object.keys(defs)[i]
                const def = Object.values(defs)[i]

                // delete definition if erasing is forced or there is no snapshot
                if (forceErase || !protoplus.snapshots[`prototype.${key}.${name}`])
                    delete globalThis[key].prototype[name]
                else
                    globalThis[key].prototype[name] = protoplus.snapshots[`prototype.${key}.${name}`]
            }
        }
        
        // def classes
        for (let i = 0; i < Object.keys(classes).length; i++) {
            if (skipClasses) break; // skip contraction if told to
            
            const className = Object.keys(classes)[i]

            // skip deletion if there's a snapshot of it set to `true`,
            // regardless if deletion is forced
            if (`value.${className}` in protoplus.snapshots && protoplus.snapshots[`value.${className}`] === true) continue

            delete globalThis[className]
        }
        const endTime = now()
        console.log(`contracted methods in ${endTime - startTime}ms`)
    },
    version: '1.1.1'
}

globalThis.protoplus = protoplus;

console.log(`proto+ v${protoplus.version} loaded!`);