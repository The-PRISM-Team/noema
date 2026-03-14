const locales = Object.fromEntries(globalThis.localesArray.map(v => [v.lang, v]));
const getLocaleStr = (key, fallbackLocale = 'enUS') => locale[key] ?? locales[fallbackLocale][key];
const getLocaleTempStr = (key, fallbackLocale = 'enUS', vars = {}) => {
	let str = getLocaleStr(key, fallbackLocale);
	Object.entries(vars).forEach(([name, value]) => {
		str = str.replaceAll(`{${name}}`, value);
	});
	return str;
};
let locale = locales[localStorage.locale] ?? {};
