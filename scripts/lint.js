#!/usr/bin/env node

const fs = require("fs");
const prettier = require("@prettier/sync");
const path = require("path");

function lintFile(path) {
	const content = fs.readFileSync(path, { encoding: "utf-8" });

	try {
		const formattedContent = prettier.format(content, {
			filepath: "./.prettierrc.json",
		});
		fs.writeFileSync(path, formattedContent);
	} catch {
		console.log(`Skipping invalid file (${path}).`);
	}
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
