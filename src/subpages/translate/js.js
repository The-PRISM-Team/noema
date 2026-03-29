(async () => {
    // get locale stuffs
    const locales = globalThis['locales'] = await (await fetch('https://prism-noema.vercel.app/locales/locales.json')).json();
    const localeBaseObj = globalThis['localeBaseObj'] = await (await fetch('https://prism-noema.vercel.app/locales/translationBase.json')).json();
    const localeBaseFile = globalThis['localeBaseFile'] = await (await fetch('https://prism-noema.vercel.app/locales/translationBase.js')).text();
    const localeUrlTemplate = globalThis['localeUrlTemplate'] = "https://prism-noema.vercel.app/locales/{shortBCP}.js"

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
    const localeDropdown = globalThis['localeDropdown'] = document.getElementById('lang-select');
    const translationDiv = globalThis['translationDiv'] = document.getElementById('translation-div');
    const stringDiv = globalThis['stringDiv'] = document.getElementById('string-div');
    const exportBtn = globalThis['exportBtn'] = document.getElementById('export-file');
    
    // init elements
    for (const [_, locale] of Object.entries(locales)) {
        const option = globalThis['option'] = document.createElement('option');
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


    // element interacions
    localeDropdown.addEventListener('change', async ()=>{
        const selectedLocale = globalThis['selectedLocale'] = locales.find(v => 
            v.code === window['lang-select'].value
        )?.code ?? 'unknown';

        const kvRegex = globalThis['kvRegex'] = /\"(.+)\"[:]\s*(\".*\"|false|true|(?:\d+|\d*\.\d+)?e[+-]?\d+|\d+|null)/g;
        const localeUrl = globalThis['localeUrl'] = localeUrlTemplate.replace('{shortBCP}', selectedLocale);
        console.log('selected locale: ' + selectedLocale);
        console.log('locale url: ' + localeUrl);
        
        // get locale object
        let localeFile;
        try {
            localeFile = globalThis['localeFile'] = await(await fetch(localeUrl)).text();
        }
        catch {
            localeFile = globalThis['localeFile'] = await(await fetch('https://prism-noema.vercel.app/locales/enUS.js')).text();
        }

        const localeKVs = globalThis['localeKVs'] = [...localeFile.matchAll(kvRegex)].map(v => {
            v.shift();
            v[1] = JSON.parse(v[1]);
            return v;
        });
        const localeObject = globalThis['localeObject'] = Object.fromEntries(localeKVs) ?? localeBaseObj;
        localeObject.lang = globalThis['localeObject'].lang = selectedLocale;
        localeObject.langTitle = globalThis['localeObject'].langTitle = locales.find(v => 
            v.code === window['lang-select'].value
        )?.native ?? 'unknown';

        renderStrings(localeObject);
    });

    exportBtn.addEventListener('click', ()=>{
        const translated = Object.fromEntries([...document.querySelectorAll('#string-div input')].map(el => [el.id, el.value]))
        const generatedFile = generateLocaleFile(translated);
        downloadFileWithContent(generatedFile.filename, generatedFile.content);
    })
})()