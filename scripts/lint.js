#!/usr/bin/env node

const fs = require("fs");
const prettier = require("@prettier/sync");
const path = require("path");

function canBePrettified(path) {
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
function prettifyFile(path) {
	// read content
	const content = fs.readFileSync(path, { encoding: "utf-8" });

	// check prettifiability
	if (!canBePrettified(path)) {
		console.log(`Skipping unprettifiable file (${path}).`);
		return;
	}

	// remove shebang from the content if there is one
	const lines = content.split(/\r?\n/);
	if (lines[0].startsWith("#!")) lines.shift();
	const contentWithoutShebang = lines.join("\n");

	// get formatted content
	const formattedContent = prettier.format(contentWithoutShebang, {
		filepath: "./.prettierrc.json",
		parser: "babel",
	});
	// write formatted content to file path being formatted
	fs.writeFileSync(path, formattedContent);

	return formattedContent;
}

function prettifyFiles() {
	// get file paths (recursively, ignoring directories)
	const filepaths = fs
		.readdirSync(".", { recursive: true, withFileTypes: true })
		.filter((dirent) => dirent.isFile())
		.map((dirent) => path.join(dirent.parentPath, dirent.name));

	// loop through every path and prettify it
	for (const path of filepaths) {
		prettifyFile(path);
	}
}
prettifyFiles();
