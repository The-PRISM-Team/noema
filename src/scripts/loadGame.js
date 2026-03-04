let onGame = false;

// Barebones game loader utilities. These are minimal helpers used by
// the UI while a richer game-loading pipeline is developed.

function loadGameFromURL(url) {
	try {
		console.log('loadGameFromURL:', url);
		unloadGame();
		const container = document.getElementById('game-container') || createGameContainer();
		// naive approach: create an iframe sandboxed for now
		const iframe = document.createElement('iframe');
		iframe.src = url;
		iframe.width = '100%';
		iframe.height = '100%';
		iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin');
		iframe.id = 'noema-game-iframe';
		container.appendChild(iframe);
		onGame = true;
		return iframe;
	} catch (e) {
		console.error('Failed to load URL game', e);
		return null;
	}
}

function loadGameFromBlob(blob) {
	// Accepts a Blob (e.g. a dropped file). Creates an object URL and loads it.
	const url = URL.createObjectURL(blob);
	const iframe = loadGameFromURL(url);
	// store for cleanup
	iframe && (iframe.dataset.objectUrl = url);
	return iframe;
}

function unloadGame() {
	const old = document.getElementById('noema-game-iframe');
	if (old) {
		// revoke object URL if present
		if (old.dataset && old.dataset.objectUrl) URL.revokeObjectURL(old.dataset.objectUrl);
		old.remove();
	}
	onGame = false;
}

function createGameContainer() {
	let container = document.getElementById('game-container');
	if (!container) {
		container = document.createElement('div');
		container.id = 'game-container';
		container.style.position = 'absolute';
		container.style.left = '0';
		container.style.top = '0';
		container.style.right = '0';
		container.style.bottom = '0';
		container.style.zIndex = '1000';
		document.body.appendChild(container);
	}
	return container;
}

// Backwards-compatible default
function loadGame() {
	console.warn('loadGame() is a placeholder - use loadGameFromURL or loadGameFromBlob');
}

// export to global so UI can call these directly
window.loadGameFromURL = loadGameFromURL;
window.loadGameFromBlob = loadGameFromBlob;
window.unloadGame = unloadGame;