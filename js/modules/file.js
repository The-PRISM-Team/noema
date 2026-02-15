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