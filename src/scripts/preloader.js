const loadedScripts = [];

function getAbsPath(relPath, basePath = location.href) {
	return new URL(relPath, basePath).href;
}
async function loadScripts(cb = ()=>{}, cacheBusting = true) {
	if (document.body.querySelectorAll('script[origin=preloader]').length > 0) {
		// remove all scripts added by the preloader
		loadedScripts.length = 0;
		[
			...document.body.querySelectorAll('script[origin=preloader]')
		].forEach(el => el.remove());
	}

	const scripts = [
		// locale
		{ src: './locales/arEG.js' },
		{ src: './locales/deDE.js' },
		{ src: './locales/en.js' },
		{ src: './locales/enGB.js' },
		{ src: './locales/es.js' },
		{ src: './locales/jaJP.js' },
		{ src: './locales/ptBR.js' },
		{ src: './locales/😀😀.js' },
		{
			src: './scripts/lang.js'
		},
		// modules
		{
			src: './scripts/modules/util.js'
		},
		{
			src: './scripts/modules/color.global.js'
		},
		{
			src: './scripts/modules/jquery-3.7.1.js'
		},
		{
			src: './scripts/modules/gamecontroller.js'
		},
		{
			src: './scripts/modules/gapless5.js',
			language: 'JavaScript',
			type: 'text/javascript'
		},
		{
			src: './scripts/modules/md5.min.js'
		},
		{
			src: './scripts/modules/controller_input.js'
		},
		{
			src: './scripts/modules/protoplus.js'
		},
		{
			src: './scripts/modules/bgFormat.js'
		},
		{
			src: './scripts/modules/URLutil.js'
		},
		{
			src: './scripts/modules/file.js'
		},
		{
			src: './scripts/modules/version.js'
		},
		{
			src: './scripts/modules/jszip.min.js'
		},
		// scripts
		{
			src: './scripts/error.js'
		},
		{
			src: './scripts/power.js'
		},
		{
			src: './scripts/game.js'
		},
		{
			src: './scripts/controller.js'
		},
		{
			src: './scripts/changelog.js'
		},
		{
			src: './scripts/bg.js'
		},
		{
			src: './scripts/ui.js'
		},
		{
			src: './scripts/user.js'
		},
		{
			src: './scripts/info.js'
		},
		{
			src: './scripts/sounds.js'
		},
		{
			src: './scripts/base.js'
		}
	];

	for (let i = 0; i < scripts.length; i++) {
		const scriptObj = scripts[i];

		if (document.querySelector(`script[src="${scriptObj.src}"]`))
			continue; // skip script if there is a script with the same src

		const script = document.createElement('script');
		if (!isDefined(scriptObj.async)) script.async = false;
		await new Promise((resolve, reject) => {
			script.onload = () => {
				cb(i + 1, scripts.length, script);
				resolve();
			};
			script.onerror = reject;
			script.crossorigin = 'anonymous'; // i hate CORS
			for (let [property, value] of Object.entries(scriptObj)) {
				if (cacheBusting && property === 'src') {
					const src = new URL(getAbsPath(value));
					src.searchParams.set('cacheBusting', Math.random().toString());
					value = src.toString();
				}
				script[property] = value;
			}
			Object.defineProperty(script, "origin", {
				value: "preloader",
				writable: false,
				configurable: false,
				enumerable: true
			});
			/* use if loadedScripts becomes a PO
			const scriptNameRegex = /^\/?(?:\w+\/)*(\w+)(?:\.\w+)?$/;
			loadedScripts[
				scriptNameRegex.exec(script.src)[1]
			] = script;
			*/
			loadedScripts.push(script);

			document.body.appendChild(script);
		});
	}
	return loadedScripts;
}
