const localeNameRegex = /^\/src\/locales\/(\w+)\.json/;
const langs = loadedScripts.map(
    el => localeNameRegex.exec(el.src)[1]
)
.filter(v => v);