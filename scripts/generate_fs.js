const fs = require('fs');
const path = require('path');

function constructTree(paths) {
	const fs = {};
	for (const path of paths) {
		const parts = path.split('/').slice(1);
		const dirs = parts.slice(0, parts.length);
		const filename = parts[parts.length - 1];
		if (parts.length === 1) {
			fs[filename] ??= {};
			continue;
		}

		fs[dirs[0]] ??= {};
		let reference = fs[dirs[0]];
		for (const [index, dir] of dirs.slice(1, dirs.length - 1).entries()) {
			reference[dir] ??= {};
			reference = reference[dir];
		}
	}
	return fs;
}

function writeToFile() {
	const filepaths = fs
		.readdirSync('.', { recursive: true, withFileTypes: true })
		.filter(dirent => dirent.isFile())
		.map(dirent => path.join(dirent.parentPath, dirent.name));
	filepaths.sort((a, b) => Math.max(-1, Math.min(1, b.length - a.length)));
	const tree = constructTree(filepaths);
	fs.writeFileSync('./misc/filesystem.json', JSON.stringify(tree));
}
writeToFile();
