let loadedModules = {}
function loadLibrary(url, ...attrib) {
    if (!isDefined(url)) throw new Error('url parameter is empty. pls enter a url dummy')
    if (!isURL(url)) throw new Error('url is formatted incorrectly. pls enter a valid url buddy :3')
    let script = document.createElement('script')
    let name = getFilenameFromURL(url)
    if (loadedModules[name]) throw new Error('module is already loaded!')
    script.src = url
    script.id = `lib-${name}`
    if (isDefined(attrib)) {
        attrib.forEach((item)=>{
            if (isDefined(JSON.isJSON)) {
                script[item.name] = item.name
            }
        })
    }
    loadedModules[name] = script
    document.body.appendChild(script)
}

function unloadLibrary(url) {
    if (!isDefined(url))
        throw new Error('the url parameter is empty, i thought i told you about this')
    let name = getFilenameFromURL(url)
    if (!loadedModules[name])
        throw new Error("hmm, this url doesn't seem like it has been loaded.")
    document.body.removeChild(loadedModules[name])
    delete loadedModules[name]
}
