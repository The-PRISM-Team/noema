const game = {
	screen: document.getElementById('game-screen'),
	document: document.getElementById('game-screen').contentDocument,
	loaded: undefined
}
const loadedModules = {};
function loadLibrary(url, ...attrib) {
	if (!isDefined(url)) throw new Error('The URL parameter is empty. Please provide a URL.');
	if (!isURL(url)) throw new Error('This URL is invalid.');
	const script = document.createElement('script');
	const name = getFilenameFromURL(url);
	if (loadedModules[name]) throw new Error('Module already loaded!');
	script.src = url;
	script.id = `lib-${name}`;
	if (isDefined(attrib)) {
		attrib.forEach((item)=>{
			if (isDefined(JSON.isJSON)) {
				script[item.name] = item.name;
			}
		});
	}
	loadedModules[name] = script;
	document.body.appendChild(script);
}

function unloadLibrary(url) {
	if (!isDefined(url))
		throw new Error('The URL parameter is empty. Please provide a URL.');
	const name = getFilenameFromURL(url);
	if (!loadedModules[name])
		throw new Error("This module hasn't been loaded.");
	document.body.removeChild(loadedModules[name]);
	delete loadedModules[name];
}

function relPath(rel, root = '') {
	// i feel like there's a better way but this is the shortest and quickest way i could do it
	// pls change if you find a better way
	// i also think this might create compatibility issues, but idk
	const dummyURL = 'dummy://dummy.dumdum/';
	const url = new URL(dummyURL + root);
	url.pathname += rel;
	const href = url.toString();
	const absolutePath = href.replace(dummyURL, '');
	return absolutePath;
}
const resources = [];
async function resolveRelativePaths(content, package) {
	if (typeof content !== 'string')
		throw new TypeError('Content must be a string.');
	package ??= game.loaded;

	// match content
	const matches = [...content.matchAll(relPathRegex)];
	// use custon pkg:// format, otherwise parsing would be tricky
	const relPathRegex = /pkg:\/\/((?:\/|(?:\.\.?\/)*)?(?:[^\/\0.]+\/)*[^\/\0.]*\.[a-zA-Z0-9]+)/;

	// resolve content, .replace() and .replaceAll() are not enough
	let resolvedContent = '';
	for (const [index, match] of matches.entries()) {
		if (index > 0)
			resolvedContent += content.slice(
				matches[index - 1].index + matches[index - 1][0].length,
				match.index,
			);
		else resolvedContent += content.slice(0, match.index);

		const targetFile = await package.file(relPath(match[1], ''));
		const fullPath = targetFile.name;
	    const lastSlashIndex = fullPath.lastIndexOf('/');
		const fileRootPath = lastSlashIndex !== -1 ? fullPath.substring(0, lastSlashIndex + 1) : '';
		const resolvedFile = await resolveRelativePaths(await targetFile.async('string'), fileRootPath);
		const resolvedFileContent = resolvedFileContent.resolvedContent;
		const blob = new Blob([resolvedFileContent], { type: "text/plain" });
		const blobURL = URL.createObjectURL(blob);
		resources.push(blobURL);
		resolvedContent += blobURL;

		if (index === matches.length - 1)
			resolvedContent += content.slice(match.index + match[0].length, content.length);
	}
	return {
		resources, 
		resolvedContent
	};
}
async function loadPackage(arrayBuf) {
    const package = await JSZip.loadAsync(arrayBuf);
	const indexHTML = await package.file('index.html').async('string');
	const resolvedContent = await resolveRelativePaths(indexHTML, package);
	game.loaded = package;
	game.document.documentElement.innerHTML = indexHTML;
    return package;
}
