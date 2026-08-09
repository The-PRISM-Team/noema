#!/usr/bin/env node

const fs = require("fs");
const prettier = require("@prettier/sync");
const path = require("path");

function canBePrettified(path) {
	return (path.endsWith('.js') || path.endsWith('.ts')) && !path.includes('node_modules');
	
	try {
		const fileInfo = prettier.getFileInfo(path, {
			resolveConfig: true,
			withNodeModules: false,
		});

		return !fileInfo.ignored && fileInfo.inferredParser !== null;
	} catch (error) {
		console.error(`Error checking file ${path}:`, error.message);
		return false;
	}
}
function lintFile(path) {
	const content = fs.readFileSync(path, { encoding: "utf-8" });

	if (!canBePrettified(path)) {
		console.log(`Skipping unprettifiable file (${path}).`);
		return;
	}
	const formattedContent = prettier.format(content, {
		filepath: "./.prettierrc.json",
	});
	fs.writeFileSync(path, formattedContent);
	return formattedContent;
}

function lintFiles() {
	const filepaths = fs
		.readdirSync(".", { recursive: true, withFileTypes: true })
		.filter((dirent) => dirent.isFile())
		.map((dirent) => path.join(dirent.parentPath, dirent.name));
	for (const path of filepaths) {
		lintFile(path);
	}
}
lintFiles();
