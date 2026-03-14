const locales = Object.fromEntries(globalThis.localesArray.map(v => [v.lang, v]));
const getLocaleStr = (key, fallbackLocale = 'enUS') => locale[key] ?? locales[fallbackLocale]?.[key] ?? `Missing locale entry (k:${key};l:${localStorage.locale};f:${fallbackLocale})! This is a bug, please report it!`;
const getLocaleTempStr = (key, fallbackLocale = 'enUS', vars = {}) => {
	let str = getLocaleStr(key, fallbackLocale);
	Object.entries(vars).forEach(([name, value]) => {
		str = str.replaceAll(`{${name}}`, value);
	});
	return str;
};
let locale = locales[localStorage.locale] ?? {};
