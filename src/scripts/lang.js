if (!isDefined(localStorage.locale)) localStorage.locale = 'enUS';

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
            // date
            yy: date.year().toString().slice(-2),
            yyyy: date.year(),
            MM: date.month()
                .toString().padStart(2, '0'),
            dd: date.day()
                .toString().padStart(2, '0'),

            // time
            hh: date.hours()
                .toString().padStart(2, '0'),
            mm: date.minutes()
                .toString().padStart(2, '0'),
            ss: date.seconds()
                .toString().padStart(2, '0'),
            ms: date.milliseconds()
                .toString().padStart(2, '0')
        });
    } else {
        throw new Error(`Unknown locale time string "${type}"`);
    }
}
let locale = locales[localStorage.locale] ?? {};
