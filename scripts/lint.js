#!/usr/bin/env node

/* TBD
const fs = require("fs");
const synchronizedPrettier = require("@prettier/sync");
const path = require("path");

// format code (using Prettier)
const prettierRules = JSON.parse(
	fs.readFileSync(
		path.join(__dirname, "../scripts/.prettierrc.json"),
		"utf8",
	),
);
const prettyFile = synchronizedPrettier.format("// code", {
	parser: "babel",
	...prettierRules,
});
*/
const fs = require("fs");
const path = require("path");

function lintFile(path) {
	const content = fs.readFileSync(path, { encoding: "utf-8" });
	console.log(content);
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
