const locales = Object.fromEntries(globalThis.localesArray.map(v => [v.lang, v]));
const getLocaleStr = (key, fallbackLocale = 'enUS', fallbackStr) => locale[key] ?? locales[fallbackLocale]?.[key] ?? (fallbackStr || `Missing locale entry (k:${key};l:${localStorage.locale};f:${fallbackLocale})! This is a bug, please report it!`);
const getLocaleTempStr = (key, fallbackLocale = 'enUS', vars = {}, fallbackStr) => {
	let str = getLocaleStr(key, fallbackLocale, fallbackStr);
	Object.entries(vars).forEach(([name, value]) => {
		str = str.replaceAll(`{${name}}`, value);
	});
	return str;
};
function getLocaleTimeStr(type) {
    const localeStr = `time.format.${type}`
    if (Object.keys(locale).includes(localeStr)) {
        const date = new AdvDate();
        return getLocaleTempStr(localeStr, 'enUS', {
            yy: date.year().toString().slice(-2),
            yyyy: date.year(),
            MM: date.month(),
            dd: date.day(),
            hh: date.hours(),
            mm: date.minutes(),
            ss: date.seconds(),
            ms: date.milliseconds(),
        });
    } else {
        throw new Error(`Unknown locale time string "${type}"`);
    }
}
let locale = locales[localStorage.locale] ?? {};
