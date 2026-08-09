#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

function constructTree(paths) {
	const fs = {};
	for (const path of paths) {
		const parts = path.split("/").slice(1); // .slice(1) because '.' is included for some reason and this is stupid and dumb and retarded and javascript is ass and javascript should've >
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
		.readdirSync(".", { recursive: true, withFileTypes: true })
		.filter((dirent) => dirent.isFile())
		.map((dirent) => path.join(dirent.parentPath, dirent.name)); // why in the name of fuck do i need to do this long ass bullshit, can't this just be another option??
	filepaths.sort((a, b) => Math.max(-1, Math.min(1, b.length - a.length)));
	const tree = constructTree(filepaths);
	fs.writeFileSync("./misc/filesystem.json", JSON.stringify(tree));
}
writeToFile();
