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
document.getElementById('file').addEventListener('change', (event) => {
    document.getElementById('convert').style.display = 'none';
    document.getElementById('status').style.display = 'revert';
    const file = event.target.files[0];

    if (file) {
        saveFileName = file.name;

        document.getElementById('status').textContent = "Initializing file reader...";
        const reader = new FileReader();
        reader.onload = function (e) {
            let content = e.target.result;
            try {
                content = JSON.parse(content);
            } catch {
                document.getElementById('status').textContent = "Invalid file format.";
                return;
            }

            const convertableFormats = ['NSF1.0', 'NSF2.0'];
            if (convertableFormats.includes(content?.format)) {
                document.getElementById('status').textContent = "File loaded successfully!";
                document.getElementById('convert').style.display = 'revert';
                saveFile = content;
            } else {
                document.getElementById('status').textContent = "Unsupported, invalid or absent save file format! Please use a valid preferences file.";
            }
            setTimeout(() => {
                document.getElementById('status').style.display = 'none';
            }, 5e3);
        };

        document.getElementById('status').textContent = "Reading file...";
        reader.readAsText(file);
    } else {
        document.getElementById('status').textContent = "File not found.";
        setTimeout(() => {
            document.getElementById('status').style.display = 'none';
        }, 3e3);
    }
});
document.getElementById('convert-to').innerHTML = '';
safeFormats.forEach(format => {
    let option = document.createElement('option');
    option.value = format;
    option.textContent = format;
    document.getElementById('convert-to').appendChild(option);
});

document.getElementById('convert-btn').onclick = () => {
    const targetFormat = document.getElementById('convert-to').value;
    if (saveFile.format === targetFormat) {
        document.getElementById('status').textContent = "Cannot convert to own format!";
        return;
    }

    document.getElementById('status').style.display = 'revert';
    document.getElementById('status').textContent = "Starting conversion...";
    setTimeout(() => {
        if (document.getElementById('convert-to').value === 'NSF2.0') {
            if (saveFile.format === 'NSF1.0') {
                let saveFileCopy = structuredClone(saveFile);
                saveFile = {};
                for (let i = 0; i < Object.keys(saveFileCopy).length; i++) {
                    let key = Object.keys(saveFileCopy)[i];
                    let value = Object.values(saveFileCopy)[i];
                    document.getElementById('status').textContent = `Converting "${key}"...`;
                    if (key === 'defaultScripts') {
                        continue;
                    }
                    saveFile[key] = value;
                }
                document.getElementById('status').textContent = 'Finishing up...';
                saveFile.format = "NSF2.0";
                downloadFileWithContent(
                    `${saveFileName.replaceAll('.nsf', '')} (Converted).nsf`,
                    JSON.stringify(saveFile)
                );

                document.getElementById('status').textContent = 'Done!';
                document.getElementById('convert-btn').textContent = 'Close window';
                document.getElementById('convert-btn').onclick = () => window.close();
                setTimeout(() => {
                    document.getElementById('status').style.display = 'none';
                }, 6e3);
            } else {
                document.getElementById('status').textContent = 'Unsupported!';
            }
        }

        if (document.getElementById('convert-to').value === 'NSF2.1') {
            if (saveFile.format === 'NSF1.0') {
                let saveFileCopy = structuredClone(saveFile);
                saveFile = {};
                for (let i = 0; i < Object.keys(saveFileCopy).length; i++) {
                    let key = Object.keys(saveFileCopy)[i];
                    let value = Object.values(saveFileCopy)[i];
                    document.getElementById('status').textContent = `Converting "${key}"...`;
                    if (key === 'defaultScripts') {
                        continue;
                    }
                    saveFile[key] = value;
                }
                document.getElementById('status').textContent = 'Finishing up...';
                saveFile.format = "NSF2.0";
                downloadFileWithContent(
                    `${saveFileName.replaceAll('.nsf', '')} (Converted).nsf`,
                    JSON.stringify(saveFile)
                );

                document.getElementById('status').textContent = 'Done!';
                document.getElementById('convert-btn').textContent = 'Close window';
                document.getElementById('convert-btn').onclick = () => window.close();
                setTimeout(() => {
                    document.getElementById('status').style.display = 'none';
                }, 6e3);
            } else if (saveFile.format === 'NSF2.0') {
                document.getElementById('status').textContent = 'Converting...';

                delete saveFile.lastVersion;
                delete saveFile.lastChangelogHash;

                document.getElementById('status').textContent = 'Finishing up...';
                saveFile.format = "NSF2.1";
                downloadFileWithContent(
                    `${saveFileName.replace(/\.nsf$/g, '')} (Converted).nsf`,
                    JSON.stringify(saveFile)
                );

                document.getElementById('status').textContent = 'Done!';
                document.getElementById('convert-btn').textContent = 'Close window';
                document.getElementById('convert-btn').onclick = () => window.close();
                setTimeout(() => {
                    document.getElementById('status').style.display = 'none';
                }, 6e3);
            }
        }
    }, 1.5e3);
};
