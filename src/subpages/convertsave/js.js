/*
== VSCode utils ==
when adding a new conversion,
replace all text matching the regex:
(\[`(NSF\d+\.\d+)\$\{to\}(NSF\d+\.\d+)`\]:[\t ]*)$
with this:
$1 // convert $2 to $3
*/

// /*
function downloadFileWithContent(filename = `Untitled file [${Date.now()}]`, content = '') {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    return content;
}
// */

// elements
const fileInput = document.getElementById('file');
const convertSection = document.getElementById('convert');
const statusElement = document.getElementById('status');
const convertToElement = document.getElementById('convert-to');
const convertButton = document.getElementById('convert-btn');

// utils
let statusTimeouts = [];
function setStatus(statusText, clearAfterMs = 3e3) {
	function clearTimeouts() {
		statusTimeouts.forEach((timeoutId, index)=>{
			clearTimeout(timeoutId);
			statusTimeouts[index] = null;
		});
		statusTimeouts = statusTimeouts.filter(t=>t);
	}
	// clear status
	if (isNaN(clearAfterMs)) return;

	// clear status
	clearTimeouts();
	statusElement.style.display = 'none';
	if (clearAfterMs === -Infinity) return;

	// set status
	statusElement.textContent = statusText;
	statusElement.style.display = 'revert';
	if (clearAfterMs === Infinity) return; // don't clear status
	
	// hide status
	const timeout = setTimeout(() => {
		clearTimeouts(); // just in case
		statusElement.style.display = 'none';
	}, clearAfterMs);
	statusTimeouts.push(timeout);
}

// save file metadata
let saveFile = {};
let saveFileName = '';
const safeFormats = ['NSF2.0', 'NSF2.1'];

// read file
fileInput.addEventListener('change', (event) => {
	convertSection.style.display = 'none';
	const file = event.target.files[0];

	if (file != null) {
		saveFileName = file.name;

		setStatus('Initializing file reader...', Infinity);
		statusElement.textContent = "Initializing file reader...";
		const reader = new FileReader();
		reader.onload = function (e) {
			let content = e.target.result;
			try {
				content = JSON.parse(content);
			} catch {
				setStatus('Invalid file format.', 5e3);
				return;
			}

			// check file type (safe, convertible or invalid)
			const convertibleFormats = ['NSF1.0', 'NSF2.0'];
			if (convertibleFormats.includes(content?.format)) {
				saveFile = content;
				convertSection.style.display = 'revert';
				populateFormatDropdown();
				setStatus('File loaded successfully!', 5e3);
			} else if (safeFormats.includes(content?.format)) {
				setStatus('That save file is already safe!', 5e3);
			} else {
				setStatus('Invalid save file! Please use a valid save file.', 5e3);
			}
		};

		setStatus('Reading file...', Infinity);
		reader.readAsText(file);
	} else {
		setStatus('File not found.');
	}
});
function populateFormatDropdown() {
	convertToElement.innerHTML = '';
	safeFormats.forEach(format => {
		if (format === saveFile.format) return;
		let option = document.createElement('option');
		option.value = format;
		option.textContent = format;
		convertToElement.appendChild(option);
	});
}
populateFormatDropdown();

const convertButtonCb = convertButton.onclick = () => {
	setStatus('Starting conversion...', Infinity);
	const targetFormat = convertToElement.value;
	if (saveFile.format === targetFormat) {
		setStatus('Cannot convert to own format!', 5e3);
		return;
	}

	// convert file
	const to = '~'; // conversion symbol
	// conversion operation list
	const conversions = {
		[`NSF1.0${to}NSF2.0`]:
		()=>{
			delete saveFile.defaultScripts;
			saveFile.lastVersion = null;
			saveFile.format = "NSF2.0";
		},

		[`NSF1.0${to}NSF2.1`]:
		()=>{
			delete saveFile.defaultScripts;
			saveFile.lastChangelogHash = '';
			saveFile.format = "NSF2.1";
		},

		[`NSF2.0${to}NSF2.1`]:
		()=>{
			delete saveFile.lastVersion;
			saveFile.lastChangelogHash = '';
			saveFile.format = "NSF2.1";
		}
	}

	const convert = conversions?.[`${saveFile.format}${to}${targetFormat}`]
	if (convert != null) {
		setStatus('Converting...', Infinity);
		try {
			convert();
			// finalize
			saveFile.exportDate = Date.now();
			downloadFileWithContent(
				`${saveFileName.replace(/\.nsf$/g, '')} (Converted to ${targetFormat}).nsf`,
				JSON.stringify(saveFile)
			);
			setStatus('Done!', 6e3);
			convertButton.textContent = 'Convert another';
			convertButton.onclick = () => {
				fileInput.click()
				convertButton.onclick = convertButtonCb;
			};
		} catch (err) {
			setStatus(`
There was an error while converting.
Error: ${
	err?.message
	? `[${err.type}] ${err.message}`
	: `[RawThrow] ${JSON.stringify(err)}`
}
Please try again.
`.trim())
		}
	} else {
		setStatus(`The conversion from ${saveFile.format} to ${targetFormat} is not supported.`, 5e3)
	}
};
