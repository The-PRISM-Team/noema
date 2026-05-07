let loadedGame;
const game = {
	screen: document.getElementById('game-screen'),
	document: document.getElementById('game-screen').contentDocument
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

async function loadPackage(arrayBuf) {
    const package = await JSZip.loadAsync(arrayBuf);
	loadedGame = package;
    return package;
}
