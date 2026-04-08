(async () => {
    // get locale stuffs
    const locales = await (await fetch('https://prism-noema.vercel.app/locales/locales.json')).json();
    const localeBaseObj = await (await fetch('https://prism-noema.vercel.app/locales/translationBase.json')).json();
    const localeBaseFile = await (await fetch('https://prism-noema.vercel.app/locales/translationBase.js')).text();
    const localeUrlTemplate = "https://prism-noema.vercel.app/locales/{shortBCP}.js"

    // utils
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
    function generateLocaleFile(localeObject) {
        const content =
            localeBaseFile
            .replace(
                /\/\*[\t ]*.*[\t ]*\*\//,
                JSON.stringify(localeObject, null, 4)
            );

        return {
            filename: localeObject.lang + '.js',
            content
        }
    }
    async function constructLocaleObj(
        locale,
        recursing = false
    ) {
        const kvRegex = /\"(.+)\"[:]\s*(\".*\"|false|true|(?:\d+|\d*\.\d+)?e[+-]?\d+|\d+|null)/g;
        // get locale file
        const url = localeUrlTemplate.replace('{shortBCP}', locale);
        let localeFile;
        await fetch(url)
            .then(async r => localeFile = await r.text())
            .catch(async ()=>{
                localeFile = await(
                    await fetch('https://prism-noema.vercel.app/locales/en.js')
                ).text();
            });

        // construct locale object from file
        const localeKVs = [...localeFile.matchAll(kvRegex)].map(v => {
            v.shift();
            v[1] = JSON.parse(v[1]);
            return v;
        });
        const baseLocale =
            recursing
            ? localeBaseObj
            : await constructLocaleObj('en', true);

        const localeObject = Object.fromEntries(localeKVs) ?? baseLocale;
        // recover missing values
        if (!recursing) {
            for (const [key, value] of Object.entries(baseLocale)) {
                if (!(key in localeObject)) {
                    localeObject[key] = value;
                }
            }
        }

        return localeObject;
    }
    globalThis.constructLocaleObj = constructLocaleObj;

    // elements
    const localeDropdown = document.getElementById('lang-select');
    const translationDiv = document.getElementById('translation-div');
    const eraseProgressBtn = document.getElementById('reset-all-progress');
    const stringDiv = document.getElementById('string-div');
    const exportBtn = document.getElementById('export-file');

    // init elements
    for (const [_, locale] of Object.entries(locales)) {
        const option = document.createElement('option');
        option.value = locale.code;
        if (locale.english === locale.native)
            option.textContent = `${locale.native} [${locale.code}]`;
        else
            option.textContent = `${locale.english} - ${locale.native} [${locale.code}]`;
        localeDropdown.appendChild(option);
    }

    eraseProgressBtn.addEventListener('click', ()=>{
        const accepted =
            confirm('Are you sure you want to reset ALL your progress?\nThis action CANNOT be undone!!\n\nYour progress on EVERY translation will be deleted.')
        
        if (accepted) {
            const isSure = confirm('Are you ABSOLUTELY sure?\nAfter you accept, there\'s no going back!');
            if (isSure) {
                localStorage.savedProgress = '{}'
                location.reload();
            };
        };
    })

    async function renderStrings(localeObject) {
        translationDiv.style.display = 'none';
        stringDiv.innerHTML = '';

        const progress = JSON.parse(localStorage?.savedProgress ?? '{}');
        if (progress?.[localeObject.lang] == null)
            progress[localeObject.lang] = {};

        const resetProgressBtn = document.createElement('button');
        resetProgressBtn.textContent = 'Reset translation progress';
        resetProgressBtn.addEventListener('click', ()=>{
            const accepted =
                confirm('Are you sure you want to reset your progress in this translation?\nThis action CANNOT be undone!!')
            
            if (accepted) {
                progress[localeObject.lang] = {};
                localStorage.savedProgress = JSON.stringify(progress);
                renderStrings(localeObject);
                return;
            };
        })
        stringDiv.appendChild(resetProgressBtn);

        for (const [key, value] of Object.entries(localeObject)) {
            if (key === 'lang' || key === 'langTitle') continue;
            const p = document.createElement('p');
            p.textContent = key;
            stringDiv.appendChild(p);

            switch (typeof value) {
                default: case 'string':
                    if ((progress[localeObject.lang]?.[key] ?? value).includes('\n')) {
                        const textInput = document.createElement('textarea');
                        textInput.value = (progress?.[localeObject.lang] ?? {})?.[key] ?? value;
                        textInput.placeholder = localeBaseObj[key];
                        textInput.id = key;
                        textInput.style.width = '25vw';
                        textInput.style.height = '150px';
                        textInput.addEventListener('input', ()=>{
                            progress[localeObject.lang][key] = textInput.value;
                            localStorage.savedProgress = JSON.stringify(progress);
                        });

                        stringDiv.appendChild(textInput);
                    } else {
                        const textInput = document.createElement('input');
                        textInput.type = 'text';
                        textInput.value = (progress?.[localeObject.lang] ?? {})?.[key] ?? value;
                        textInput.placeholder = localeBaseObj[key];
                        textInput.id = key;
                        textInput.size = '50';
                        textInput.addEventListener('input', ()=>{
                            progress[localeObject.lang][key] = textInput.value;
                            localStorage.savedProgress = JSON.stringify(progress);
                        });

                        stringDiv.appendChild(textInput);
                    }
                break;

                case 'boolean':
                    const boolInput = document.createElement('input');
                    boolInput.type = 'checkbox';
                    boolInput.checked = (progress?.[localeObject.lang] ?? {})?.[key] ?? value;
                    boolInput.id = key;
                    boolInput.addEventListener('input', ()=>{
                        progress[localeObject.lang][key] = boolInput.checked;
                        localStorage.savedProgress = JSON.stringify(progress);
                    });

                    stringDiv.appendChild(boolInput);
                    break;

                case 'number':
                    const numInput = document.createElement('input');
                    numInput.type = 'number';
                    numInput.value = (progress?.[localeObject.lang] ?? {})?.[key] ?? value;
                    numInput.placeholder = localeBaseObj[key];
                    numInput.addEventListener('input', ()=>{
                        progress[localeObject.lang][key] = numInput.value;
                        localStorage.savedProgress = JSON.stringify(progress);
                    });
                    stringDiv.appendChild(numInput);
                    break;

                // skip list
                case 'object': case 'undefined':
                    const a = document.createElement('a'); // inline
                    a.textContent = '[unchangeable/unhandled]';
                    stringDiv.appendChild(a);
                    break;
            }
            stringDiv.appendChild(document.createElement('br'));
        }
        translationDiv.style.display = 'revert';
    }

    // element interactions
    localeDropdown.addEventListener('change', async ()=>{
        const selectedLocale = locales.find(v =>
            v.code === document.getElementById('lang-select').value
        )?.code ?? 'unknown';

        const localeObject = await constructLocaleObj(selectedLocale);
        localeObject.lang = selectedLocale;
        localeObject.langTitle = locales.find(v =>
            v.code === document.getElementById('lang-select').value
        )?.native ?? 'unknown';

        const reorder = (obj, keys) => Object.fromEntries(keys.map(key => [key, obj[key]]));
        const renderedLocaleObj = reorder(structuredClone(localeObject), Object.keys(await constructLocaleObj('en')));
        renderStrings(renderedLocaleObj);

        console.log('selected locale: ' + selectedLocale);
        console.log(renderedLocaleObj);
    });

    function getTranslated() {
        const translated = {};
        // there might be a better way to do this
        const validElements = {
            'input:not([type="checkbox"])': 'value',
            'textarea': 'value',
            'input[type="checkbox"]': 'checked'
        }
        for (const [selector, valueProp] of Object.entries(validElements)) {
            const translatedSubset = Object.fromEntries(
                [...document.querySelectorAll(`#string-div ${selector}`)]
                .map(el => [el.id, el[valueProp]])
            );

            for (const [key, value] of Object.entries(translatedSubset)) {
                if (typeof value === 'string') {
                    const newlineRegex = /(\\*)(\\n)/g;
                    translated[key] =
                        value.replace(
                            newlineRegex,
                            (match, backslashes) =>
                                backslashes.length % 2 ? match : backslashes + '\n'
                        );
                } else translated[key] = value;
            };
        }
        translated.lang = localeDropdown.value;
        translated.langTitle = locales.find(v => v.code === localeDropdown.value).native;
        return translated;
    }
    globalThis.getTranslated = getTranslated;
    exportBtn.addEventListener('click', ()=>{
        const translated = getTranslated();
        const generatedFile = generateLocaleFile(translated);
        downloadFileWithContent(generatedFile.filename, generatedFile.content);
    });

    if (location.hash) {
        localeDropdown.value = location.hash.substring(1);
        renderStrings(await constructLocaleObj(localeDropdown.value));
    } else
        localeDropdown.value = 'en';
})();
