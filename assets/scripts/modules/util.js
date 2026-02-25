function isDefined(value) {
    return value != null;
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

class AdvDate {
    constructor(timestamp) {
        this.weekNames = [
            "Sunday",
            "Monday",
            "Tuesday", 
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday"
        ];
        
        const getTimestamp = timestamp ? ()=>timestamp : Date.now
        this.times = {
            timestamp: getTimestamp,
            weekDay: ()=>new Date(getTimestamp()).getDay() + 1,
            day: ()=>new Date(getTimestamp()).getDate(),
            dayOfWeek: ()=>new Date(getTimestamp()).getDay(),
            daysInMonth: ()=>(new Date(new Date(getTimestamp()).getFullYear(), new Date(getTimestamp()).getMonth() + 1, 0).getDate()),
            weekName: ()=>(this.weekNames[new Date(getTimestamp()).getDay()]),
            month: ()=>new Date(getTimestamp()).getMonth() + 1,
            year: ()=>new Date(getTimestamp()).getFullYear(),
            hours: ()=>new Date(getTimestamp()).getHours(),
            minutes: ()=>new Date(getTimestamp()).getMinutes(),
            seconds: ()=>new Date(getTimestamp()).getSeconds(),
            milliseconds: ()=>new Date(getTimestamp()).getMilliseconds()
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

    const chargedPercent = (batterySnapshot2.level - batterySnapshot1.level) * 100;
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

    const dischargedPercent = (batterySnapshot2.level - batterySnapshot1.level) * -100;
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