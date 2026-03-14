const locales = Object.fromEntries(globalThis.localesArray.map(v => [v.lang, v]));
const getLocaleStr = (key, fallback) => locale[key] ?? fallback;
const getLocaleTempStr = (key, fallback, vars = {}) => {
	let str = t(key, fallback);
	Object.entries(vars).forEach(([name, value]) => {
		str = str.replaceAll(`{${name}}`, value);
	});
	return str;
};
let locale = locales[localStorage.locale] ?? {};