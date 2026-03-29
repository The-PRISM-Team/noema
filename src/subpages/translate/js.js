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

    // elements
    const localeDropdown = document.getElementById('lang-select');
    const translationDiv = document.getElementById('translation-div');
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
    
    function renderStrings(localeObject) {
        translationDiv.style.display = 'none';
        stringDiv.innerHTML = '';
        for (const [key, value] of Object.entries(localeObject)) {
            const p = document.createElement('p');
            p.textContent = key;
            stringDiv.appendChild(p);

            switch (typeof value) {
                default: case 'string':
                    if (value.includes('\n')) {
                        const textInput = document.createElement('textarea');
                        textInput.value = value;
                        textInput.placeholder = localeBaseObj[key];
                        textInput.id = key;
                        textInput.style.width = '25vw';
                        textInput.style.height = '150px';
                        
                        stringDiv.appendChild(textInput);
                    } else {
                        const textInput = document.createElement('input');
                        textInput.type = 'text';
                        textInput.value = value;
                        textInput.placeholder = localeBaseObj[key];
                        textInput.id = key;
                        textInput.size = '50';
                        
                        stringDiv.appendChild(textInput);
                    }
                break;

                case 'boolean':
                    const boolInput = document.createElement('input');
                    boolInput.type = 'checkbox';
                    boolInput.checked = value;
                    boolInput.id = key;
                    
                    stringDiv.appendChild(boolInput);
                    break;

                case 'number':
                    const numInput = document.createElement('input');
                    numInput.type = 'number';
                    numInput.value = value;
                    numInput.placeholder = localeBaseObj[key];
                    break;

                // skip list
                case 'object': case 'undefined':
                    const a = document.createElement('a'); // inline
                    a.textContent = '[unchangeable]';
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

        // helpers
        const kvRegex = /\"(.+)\"[:]\s*(\".*\"|false|true|(?:\d+|\d*\.\d+)?e[+-]?\d+|\d+|null)/g;
        const localeUrl = localeUrlTemplate.replace('{shortBCP}', selectedLocale);
        console.log('selected locale: ' + selectedLocale);
        console.log('locale url: ' + localeUrl);
        
        // get locale file
        let localeFile;
        try {
            localeFile = await(await fetch(localeUrl)).text();
        }
        catch {
            localeFile = await(await fetch('https://prism-noema.vercel.app/locales/enUS.js')).text();
        }

        // construct locale object from file
        const localeKVs = [...localeFile.matchAll(kvRegex)].map(v => {
            v.shift();
            v[1] = JSON.parse(v[1]);
            return v;
        });
        const localeObject = Object.fromEntries(localeKVs) ?? localeBaseObj;
        localeObject.lang = selectedLocale;
        localeObject.langTitle = locales.find(v => 
            v.code === document.getElementById('lang-select').value
        )?.native ?? 'unknown';

        const renderedLocaleObj = structuredClone(localeObject);
        delete renderedLocaleObj.lang;
        delete renderedLocaleObj.langTitle;
        renderStrings(renderedLocaleObj);
    });

    exportBtn.addEventListener('click', ()=>{
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

            for (const [key, value] of Object.entries(translatedSubset)) translated[key] = value;
        }
        translated.lang = localeDropdown.value;
        translated.langTitle =
            [...localeDropdown.children].find(el => el.value === localeDropdown.value).textContent;
        const generatedFile = generateLocaleFile(translated);
        downloadFileWithContent(generatedFile.filename, generatedFile.content);
    });

    if (location.hash && location.hash.substring(1) === locale.code) {
        localeDropdown.value = option.value;
        const change = new Event('change');
        localeDropdown.dispatchEvent(change);
    }
})();
