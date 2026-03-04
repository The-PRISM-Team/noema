const infoLabel = document.getElementById('info');
const labels = [
	'Open Developer Beta. Expect bugs.',
	'TASM UI v1.0'
];

let lastLabel;
function updateLabel() {
	/*const varRegex = /\{(\w+)\}/g;
	labels.forEach((label, i)=>{
		if (varRegex.test(label)) {
			label.match(varRegex).forEach(match => {
				try {
					labels[i].replace(match, eval(match.trim('{', '}')))
				} catch {
				}
			})
		}
	})*/
	const finalText = labels.join(' | ');
	if (finalText !== lastLabel) infoLabel.textContent = finalText;
	lastLabel = finalText;
	requestAnimationFrame(updateLabel);
}
updateLabel();
