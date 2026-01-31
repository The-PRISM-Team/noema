let infoLabel = document.getElementById('info')
let labels = [
    'DO NOT SHARE THIS PROJECT WITH ANYONE UNLESS GIVEN PERMISSION!!',
    'TASM UI v1.0'
]

function updateLabel() {
    let varRegex = /\{(\w+)\}/g
    /*labels.forEach((label, i)=>{
        if (varRegex.test(label)) {
            label.match(varRegex).forEach(match => {
                try {
                    labels[i].replace(match, eval(match.trim('{', '}')))
                } catch {
                }
            })
        }
    })*/
    let finaltext = labels.join(' | ')
    infoLabel.textContent = finaltext
    requestAnimationFrame(updateLabel)
}
updateLabel()