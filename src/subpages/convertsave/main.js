function downloadFileWithContent(filename = `Untitled file - ${Date.now()}`, content = '') {
    let blob = new Blob([content], { type: 'text/plain' });
    let url = URL.createObjectURL(blob);

    let a = document.createElement('a');
    a.href = url;
    a.download = filename;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    return content;
}
window.onkeyup = (event) => {
    const key = event.key.toLowerCase();
    console.log(key);
    if (key === 'escape' && document.activeElement === document.body) {
        window.close();
    }
};

let saveFile = {};
let saveFileName = '';
const safeFormats = ['NSF2.0', 'NSF2.1'];
const fileInput = document.getElementById('file');
const convertSection = document.getElementById('convert');
const statusElement = document.getElementById('status');
const convertToElement = document.getElementById('convert-to');
const convertButton = document.getElementById('convert-btn');
fileInput.addEventListener('change', (event) => {
    convertSection.style.display = 'none';
    statusElement.style.display = 'revert';
    const file = event.target.files[0];

    if (file) {
        saveFileName = file.name;

        statusElement.textContent = "Initializing file reader...";
        const reader = new FileReader();
        reader.onload = function (e) {
            let content = e.target.result;
            try {
                content = JSON.parse(content);
            } catch {
                statusElement.textContent = "Invalid file format.";
                return;
            }

            const convertableFormats = ['NSF1.0', 'NSF2.0'];
            if (convertableFormats.includes(content?.format)) {
                statusElement.textContent = "File loaded successfully!";
                convertSection.style.display = 'revert';
                saveFile = content;
            } else {
                statusElement.textContent = "Unsupported, invalid or absent save file format! Please use a valid preferences file.";
            }
            setTimeout(() => {
                statusElement.style.display = 'none';
            }, 5e3);
        };

        statusElement.textContent = "Reading file...";
        reader.readAsText(file);
    } else {
        statusElement.textContent = "File not found.";
        setTimeout(() => {
            statusElement.style.display = 'none';
        }, 3e3);
    }
});
convertToElement.innerHTML = '';
safeFormats.forEach(format => {
    let option = document.createElement('option');
    option.value = format;
    option.textContent = format;
    convertToElement.appendChild(option);
});

convertButton.onclick = () => {
    const targetFormat = convertToElement.value;
    if (saveFile.format === targetFormat) {
        statusElement.textContent = "Cannot convert to own format!";
        return;
    }

    statusElement.style.display = 'revert';
    statusElement.textContent = "Starting conversion...";
    setTimeout(() => {
        if (targetFormat === 'NSF2.0') {
            if (saveFile.format === 'NSF1.0') {
                let saveFileCopy = structuredClone(saveFile);
                saveFile = {};
                for (const [key, value] of Object.entries(saveFileCopy)) {
                    statusElement.textContent = `Converting "${key}"...`;
                    if (key === 'defaultScripts') {
                        continue;
                    }
                    saveFile[key] = value;
                }
                statusElement.textContent = 'Finishing up...';
                saveFile.format = "NSF2.0";
                downloadFileWithContent(
                    `${saveFileName.replaceAll('.nsf', '')} (Converted).nsf`,
                    JSON.stringify(saveFile)
                );

                statusElement.textContent = 'Done!';
                convertButton.textContent = 'Close window';
                convertButton.onclick = () => window.close();
                setTimeout(() => {
                    statusElement.style.display = 'none';
                }, 6e3);
            } else {
                statusElement.textContent = 'Unsupported!';
            }
        }

        if (targetFormat === 'NSF2.1') {
            if (saveFile.format === 'NSF1.0') {
                let saveFileCopy = structuredClone(saveFile);
                saveFile = {};
                for (const [key, value] of Object.entries(saveFileCopy)) {
                    statusElement.textContent = `Converting "${key}"...`;
                    if (key === 'defaultScripts') {
                        continue;
                    }
                    saveFile[key] = value;
                }
                statusElement.textContent = 'Finishing up...';
                saveFile.format = "NSF2.0";
                downloadFileWithContent(
                    `${saveFileName.replaceAll('.nsf', '')} (Converted).nsf`,
                    JSON.stringify(saveFile)
                );

                statusElement.textContent = 'Done!';
                convertButton.textContent = 'Close window';
                convertButton.onclick = () => window.close();
                setTimeout(() => {
                    statusElement.style.display = 'none';
                }, 6e3);
            } else if (saveFile.format === 'NSF2.0') {
                statusElement.textContent = 'Converting...';

                delete saveFile.lastVersion;
                delete saveFile.lastChangelogHash;

                statusElement.textContent = 'Finishing up...';
                saveFile.format = "NSF2.1";
                downloadFileWithContent(
                    `${saveFileName.replace(/\.nsf$/g, '')} (Converted).nsf`,
                    JSON.stringify(saveFile)
                );

                statusElement.textContent = 'Done!';
                convertButton.textContent = 'Close window';
                convertButton.onclick = () => window.close();
                setTimeout(() => {
                    statusElement.style.display = 'none';
                }, 6e3);
            }
        }
    }, 1.5e3);
};
