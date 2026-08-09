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
const webPretty = synchronizedPrettier.format("// code", {
	parser: "babel",
	...prettierRules,
});
*/
console.log("Linter TBD");
