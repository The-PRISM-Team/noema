function isDefined(value) {
	return value != null;
}

function delay(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

class AdvDate {
	constructor({
		timestampFn = Date.now,
		is24hour = null,
		am = 'AM',
		pm = 'PM'
	} = {}) {
		this.weekNames = [
			"Sunday",
			"Monday",
			"Tuesday",
			"Wednesday",
			"Thursday",
			"Friday",
			"Saturday"
		];

		const getTimestamp = timestampFn ? timestampFn : Date.now
		const getHour = ()=>{
			switch (is24hour) {
				case true:
					return parseInt(
						new Date(getTimestamp()).toLocaleTimeString('en-US', {
							hour12: false,
							hour: '2-digit'
						})
					);
				
				case false:
					return parseInt(
						new Date(getTimestamp()).toLocaleTimeString('en-US', {
							hour12: true,
							hour: '2-digit'
						})
					);
				
				default:
					return parseInt(
						new Date(getTimestamp()).toLocaleTimeString(undefined, {
							hour: '2-digit'
						})
					);
			}
		};
		this.times = {
			timestamp: getTimestamp,
			weekDay: ()=>new Date(getTimestamp()).getDay() + 1,
			day: ()=>new Date(getTimestamp()).getDate(),
			dayOfWeek: ()=>new Date(getTimestamp()).getDay(),
			daysInMonth: ()=>(new Date(new Date(getTimestamp()).getFullYear(), new Date(getTimestamp()).getMonth() + 1, 0).getDate()),
			weekName: ()=>(this.weekNames[new Date(getTimestamp()).getDay()]),
			month: ()=>new Date(getTimestamp()).getMonth() + 1,
			year: ()=>new Date(getTimestamp()).getFullYear(),
			hours: getHour,
			minutes: ()=>new Date(getTimestamp()).getMinutes(),
			seconds: ()=>new Date(getTimestamp()).getSeconds(),
			milliseconds: ()=>new Date(getTimestamp()).getMilliseconds(),
			meridiem: ()=>{
				if (isDefined(is24hour) && !is24hour) {
					return new Date().toLocaleTimeString('en-US', {
						hour: 'numeric',
						minute: 'numeric',
						hour12: true
					}).split(' ')[1] === 'AM' ? am:pm;
				} else return '';
			}
		};

		Object.keys(this.times).forEach(k => this[k] = this.times[k]);
	}

	getDateString({
		trimWeek = false,
		showWeek = true,
		monthFirst = true,
		timeFirst = false,
		showMs = false,
		dateSeparator = '/',
		timeSeparator = ':',
		msSeparator = '.',
		dateOnly = false,
		timeOnly = false
	} = {}) {
		const week =
		showWeek ?
			(`${
				trimWeek ?
					this.times.weekName().substring(0, 3)
				:
					this.times.weekName()
			} `)
		: '';
		const time = [
			this.times.hours().toString().padStart(2, '0'),
			this.times.minutes().toString().padStart(2, '0'),
			this.times.seconds().toString().padStart(2, '0')
		].join(timeSeparator)
			+ (showMs ? `${msSeparator}${this.times.milliseconds().toString().padStart(3, '0')}` : '');

		const date = [
			(monthFirst ? this.times.month() : this.times.day()).toString().padStart(2, '0'),
			(monthFirst ? this.times.day() : this.times.month()).toString().padStart(2, '0'),
			this.times.year().toString().padStart(4, '0')
		].join(dateSeparator);

		if (timeOnly && dateOnly) throw new Error('You cannot only get the time while also only getting the date.');

		if (timeOnly) return time;
		if (dateOnly) return date;

		if (timeFirst)
			return week + time + ' ' + date;
		else
			return week + date + ' ' + time;
	}
}

async function chargingTest(seconds = 60) {
	console.log(`Testing battery charging rate (${seconds} seconds)...`)
	const batterySnapshot1 = await navigator.getBattery();
	if (!batterySnapshot1.charging) {
		const msg = "Cannot test charging rate if battery isn't being charged!"
		console.error(msg);
		throw new Error(msg);
	}
	await delay(seconds * 1e3);
	const batterySnapshot2 = await navigator.getBattery();

	const chargedPercent = decimalToPercentage(batterySnapshot2.level - batterySnapshot1.level);
	console.log(`Battery ${chargedPercent >= 0 ? 'charged': 'discharged'} by ${chargedPercent}% in ${seconds} seconds.`);

	console.log('Test complete');
	return chargedPercent;
}
async function dischargingTest(seconds = 60) {
	console.log(`Testing battery discharging rate (${seconds} seconds)...`)
	const batterySnapshot1 = await navigator.getBattery();
	if (batterySnapshot1.charging) {
		const msg = "Cannot test discharging rate if battery is being charged!"
		console.error(msg);
		throw new Error(msg);
	}
	await delay(seconds * 1e3);
	const batterySnapshot2 = await navigator.getBattery();

	const dischargedPercent = decimalToPercentage(batterySnapshot1.level - batterySnapshot2.level);
	console.log(`Battery discharged by ${dischargedPercent}% in ${seconds} seconds.`);

	console.log('Test complete')

	return dischargedPercent;
}

async function fetchJson(url) {
	return (await fetch(url)).json();
}
async function fetchText(url) {
	return (await fetch(url)).text();
}
async function fetchCustom(url, method = 'text') {
	const res = await fetch(url);

	if (!res.ok) {
		throw new Error(`HTTP ${res.status}`);
	}

	if (typeof res[method] !== 'function') {
		throw new Error(`Invalid method "${method}"`)
	}

	return res[method]();
}

function setCursor(cursor = 'auto') {
	document.body.style.cursor = cursor;
}
function resetCursor() {
	document.body.style.cursor = 'auto';
}
function isTrue(value) { // for localStorage
	return value === true || value === 'true';
}

function decimalToPercentage(num) {
	return num * 100;
}
function percentageToDecimal(num) {
	return num / 100;
}
function ratioToPercentage(part, total) {
	return decimalToPercentage(part / total);
}
function decimalStrToPercentage(str) {
	return parseInt(decimalToPercentage(parseFloat(str)));
}
function percentageStrToDecimal(str) {
	return percentageToDecimal(parseFloat(str));
}
function decimalToTruncPercentage(num) {
	return Math.trunc(decimalToPercentage(num));
}
function virtuallyFixFloat(num, fractionDigits) {
	// "virtually" because the number's *true* represtentation in memory
	// still doesn't change, but the *typed* representation has
	// N fractional digits.

	return parseFloat(num.toFixed(fractionDigits));
}

function randomIntFromRange(min, max) {
	if (min > max) [min, max] = [max, min];
	[min, max] = [Math.floor(min), Math.floor(max)];
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randomFloatFromRange(min, max) {
	if (min > max) [min, max] = [max, min];
	return Math.random() * (max - min) + min;
}
