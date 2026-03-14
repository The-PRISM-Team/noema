const localeNameRegex = /^\/src\/locales\/(\w+)\.json/;
const langs = loadedScripts.map(el => {
    const exec = localeNameRegex.exec(el.src);
    if (exec) return exec[1];
    else return;
}).filter(v => v); // remove nullish values