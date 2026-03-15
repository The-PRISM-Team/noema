const locales = Object.fromEntries(globalThis.localesArray.map(v => [v.lang, v]));
const getLocaleStr = (key, fallbackLocale = 'enUS', fallbackStr) => locale[key] ?? locales[fallbackLocale]?.[key] ?? (fallbackStr || `Missing locale entry (k:${key};l:${localStorage.locale};f:${fallbackLocale})! This is a bug, please report it!`);
const getLocaleTempStr = (key, fallbackLocale = 'enUS', vars = {}, fallbackStr) => {
	let str = getLocaleStr(key, fallbackLocale, fallbackStr);
	Object.entries(vars).forEach(([name, value]) => {
		str = str.replaceAll(`{${name}}`, value);
	});
	return str;
};
let locale = locales[localStorage.locale] ?? {};
