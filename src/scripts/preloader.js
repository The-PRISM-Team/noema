async function loadScripts(cb) {
	const scripts = [
		{
			src: '/scripts/modules/util.js'
		},
		{
			src: '/scripts/modules/color.global.js'
		},
		{
			src: '/scripts/modules/jquery-3.7.1.js'
		},
		{
			src: '/scripts/modules/gamecontroller.js'
		},
		{
			src: '/scripts/modules/gapless5.js',
			language: 'JavaScript',
			type: 'text/javascript'
		},
		{
			src: '/scripts/modules/md5.min.js'
		},
		{
			src: '/scripts/modules/controller_input.js'
		},
		{
			src: '/scripts/modules/protoplus.js'
		},
		{
			src: '/scripts/modules/bgFormat.js'
		},
		{
			src: '/scripts/modules/URLutil.js'
		},
		{
			src: '/scripts/modules/file.js'
		},
		{
			src: '/scripts/modules/version.js'
		},
		{
			src: '/scripts/error.js'
		},
		{
			src: '/scripts/power.js'
		},
		{
			src: '/scripts/game.js'
		},
		{
			src: '/scripts/controller.js'
		},
		{
			src: '/scripts/changelog.js'
		},
		{
			src: '/scripts/bg.js'
		},
		{
			src: '/scripts/ui.js'
		},
		{
			src: '/scripts/user.js'
		},
		{
			src: '/scripts/info.js'
		},
		{
			src: '/scripts/sounds.js'
		},
		{
			src: '/scripts/base.js'
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
				cb(i, scripts.length, script);
				resolve();
			};
			script.onerror = reject;
			for (const [property, value] of Object.entries(scriptObj)) {
				script[property] = value;
			}

			document.body.appendChild(script);
		});
	}
}
