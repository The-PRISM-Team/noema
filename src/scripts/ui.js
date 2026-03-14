const ui = document.getElementById('ui');

let transitioning = false;
async function transition() {
	if (transitioning) throw new Error("Transition already in progress!");
	transitioning = true; // congrats!! :kekw:
	ui.style.width = "0px";
	ui.style.height = "50vh";
	setTimeout(() => {
		ui.style.width = "";
		ui.style.height = "";
		transitioning = false;
	}, 1.5e3);
}

function focusUIOption(id) {
	const optionDiv = document.getElementById('ui-options');

	requestAnimationFrame(() => {
		// alignment
		const target = document.getElementById(`ui-option${id}`);
		const targetRect = target.getBoundingClientRect();

		const uiRect = document.getElementById('ui').getBoundingClientRect();

		const targetCenter = targetRect.left + targetRect.width / 2;
		const desiredCenter = uiRect.left + uiRect.width / 2;

		const delta = desiredCenter - targetCenter;

		optionDiv.style.left = `${optionDiv.offsetLeft + delta}px`;

		// more-arrow shit
		const optionDivRect = optionDiv.getBoundingClientRect();

		const leftArrow = document.getElementById('more-left');
		const rightArrow = document.getElementById('more-right');

		if (optionDivRect.left < uiRect.left)
			leftArrow.style.opacity = "100%";
		else
			leftArrow.style.opacity = "0%";

		if (optionDivRect.right > uiRect.right)
			rightArrow.style.opacity = "100%";
		else
			rightArrow.style.opacity = "0%";
	});
}

let selectedOption = 0,
	selectedSuboption = 0,
	selectedSuboptions = {},
	uiSuboptionActions = {};
let locale = {};
function normalizeActionId(value = '') {
	return value
		.toString()
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '') || 'action';
}
function registerUISuboptionAction(action, actionIdBase = 'action') {
	if (!isDefined(action)) return null;
	let handler = action;
	if (typeof handler === 'string') {
		// Backward-compatible path for existing string actions.
		handler = new Function(handler);
	}
	if (typeof handler !== 'function') {
		throw new TypeError('Suboption action must be a function or string.');
	}
	const base = normalizeActionId(actionIdBase);
	let actionId = base;
	let suffix = 1;
	while (isDefined(uiSuboptionActions[actionId])) {
		suffix++;
		actionId = `${base}-${suffix}`;
	}
	uiSuboptionActions[actionId] = handler;
	return actionId;
}
function selectUIOption(id) {
	const optionDiv = document.getElementById('ui-options');
	const options = optionDiv.querySelectorAll('a');
	const contents = document.getElementById('ui-contents').querySelectorAll('div');

	document.getElementById('more-left').style.opacity = "0%";
	document.getElementById('more-right').style.opacity = "0%";
	requestAnimationFrame(() => {
		options.forEach(option => option.classList.remove('selected'));
		contents.forEach(content => content.classList.remove('selected'));

		if (id === 0)
			document.getElementById('more-left').style.opacity = "0%";
		if (id === options.length - 1)
			document.getElementById('more-right').style.opacity = "0%";

		document.getElementById(`ui-content${id}`).style.display = 'revert';
		requestAnimationFrame(() => {
			document.getElementById(`ui-content${id}`).classList.add('selected');
		});
		document.getElementById(`ui-option${id}`).classList.add('selected');
		if (isNaN(selectedSuboptions[id]) || !selectedSuboptions[id]) {
			selectedSuboptions[id] = 0;
		}
		focusUIOption(id);
		if (prismflakesStarted) {
		}
	});

	selectedOption = id;
	selectUISuboption(selectedSuboptions[id]);
}
function selectUISuboption(id) {
	requestAnimationFrame(() => {
		selectedSuboption = id;
		let suboptions = document.body.querySelectorAll(`#ui-content${selectedOption} .ui-suboption`);
		selectedSuboptions[selectedOption] = id;
		suboptions.forEach((suboption, i) => {
			suboption.style.top = `${20 + (-31 * (id - 3))}px`;
			const icon = suboption.querySelector('.ui-suboption-icon');
			if (i === id) {
				suboption.classList.add('selected');
				suboption.querySelector('.ui-suboption-text').style.display = '';
			} else {
				suboption.classList.remove('selected');
				suboption.querySelector('.ui-suboption-text').style.display = 'none';
				if (isDefined(icon))
					icon.classList.remove('selected');
			}
			traverseDOM(suboption, (el) => {
				if (suboption.classList.contains('selected'))
					el.classList.add('selected');
				else
					el.classList.remove('selected');
			});
		});
	});
}
function executeUISuboption() {
	const suboption = document.body.querySelector(`#ui-content${selectedOption} #ui-suboption${selectedSuboption}`);
	const actionId = suboption.dataset.action;
	if (isDefined(actionId) && isDefined(uiSuboptionActions[actionId])) {
		uiSuboptionActions[actionId]();
		if (isDefined(suboption.dataset.sound))
			playSound(suboption.dataset.sound);
		else
			playSound('confirm');
	}
}


// mommy pls fix
function createOption(name) {
	const uiOptions = document.getElementById('ui-options');
	const uiSuboptions = document.getElementById('ui-contents');
	const tab = document.createElement('a');
	tab.id = 'ui-option' + uiOptions.children.length;
	tab.className = 'ui-option';
	tab.innerText = name;
	uiOptions.appendChild(tab);
	const suboptions = document.createElement('div');
	suboptions.id = 'ui-content' + uiSuboptions.children.length;
	suboptions.className = 'ui-content';
	uiSuboptions.appendChild(suboptions);
	if (localStorage.noTransitions === 'true') {
		tab.style.transition = 'none';
		suboptions.style.transition = 'none';
	}
	return uiOptions.children.length - 1;
}
function createSuboption(optionId, title, desc = '', exec = null, icon, sound = "confirm") {
	if ((!optionId && optionId !== 0) || !title) throw new Error('Please specify a valid option ID and title.');
	const suboptions = document.getElementById(`ui-content${optionId}`);
	const suboption = document.createElement('div');
	suboption.id = 'ui-suboption' + suboptions.children.length;
	suboption.className = 'ui-suboption';
	if (isDefined(exec)) {
		const actionId = registerUISuboptionAction(exec, `${optionId}-${title}`);
		suboption.dataset.action = actionId;
	}
	if (isDefined(sound)) suboption.dataset.sound = sound;
	suboption.style.top = `${20 + (-31 * (selectedSuboptions[optionId] - 3))}px`;

	const suboptionTitle = document.createElement('a');
	suboptionTitle.className = 'ui-suboption-title';
	suboptionTitle.innerText = title;
	suboption.append(suboptionTitle);
	suboption.appendChild(document.createElement('br'));
	const suboptionDesc = document.createElement('a');
	suboptionDesc.className = 'ui-suboption-text';
	suboptionDesc.innerText = desc;
	suboptionDesc.style.display = 'none';
	suboption.append(suboptionDesc);
	if (isDefined(icon)) {
		const suboptionIcon = document.createElement('img');
		if (urlRegex.test(icon)) {
			suboptionIcon.src = icon;
		} else {
			suboptionIcon.src = `/assets/icons/${icon}.png`;
		}
		suboptionIcon.className = 'ui-suboption-icon';
		suboption.prepend(suboptionIcon);
	}
	if (localStorage.noTransitions === 'true') {
		suboption.style.transition = 'none';
	}

	suboptions.appendChild(suboption);
	return suboptions.children.length - 1;
}

function removeOption(optionId) {
	document.getElementById(`ui-option${optionId}`).remove();
	document.getElementById(`ui-content${optionId}`).remove();
	document.getElementById('ui-options').querySelectorAll('.ui-option').forEach((el, id) => {
		el.id = `ui-option${id}`;
	});
	document.getElementById('ui-contents').querySelectorAll('.ui-content').forEach((el, id) => {
		el.id = `ui-content${id}`;
	});
}
function removeSuboption(optionId, suboptionId) {
	document.getElementById(`ui-content${optionId}`).querySelector(`#ui-suboption${suboptionId}`).remove();

	document.getElementById(`ui-content${optionId}`).querySelectorAll('.ui-suboption').forEach((el, id) => {
		el.id = `ui-suboption${id}`;
	});
}

function setOption(optionId, text) {
	document.getElementById(`ui-option${optionId}`).innerText = text;
}
function setSuboption(optionId, suboptionId, title, desc, icon, exec, sound) {
	const suboption = document.querySelector(`#ui-content${optionId} #ui-suboption${suboptionId}`);
	if (isDefined(title)) suboption.querySelector('.ui-suboption-title').innerText = title;
	if (isDefined(desc)) suboption.querySelector('.ui-suboption-text').innerText = desc;
	if (isDefined(icon)) suboption.querySelector('.ui-suboption-icon').src = `/assets/icons/${icon}.png`;
	if (isDefined(exec)) {
		const actionId = registerUISuboptionAction(exec, `${optionId}-${title ?? suboption.querySelector('.ui-suboption-title')?.innerText ?? suboptionId}`);
		suboption.dataset.action = actionId;
	}
	if (isDefined(sound)) suboption.dataset.sound = sound;
}

function clearUI() {
	const uiOptions = document.getElementById('ui-options');
	const uiContents = document.getElementById('ui-contents');
	if (isDefined(uiOptions)) uiOptions.innerHTML = '';
	if (isDefined(uiContents)) uiContents.innerHTML = '';

	selectedOption = 0;
	selectedSuboption = 0;
	selectedSuboptions = {};

	Object.keys(uiSuboptionActions).forEach((key) => {
		delete uiSuboptionActions[key];
	});
}
function initUI() {
	clearUI();

	// init default options
	locale = locales[localStorage.locale] ?? {};
	const powerTab = createOption(t('menu.power.option.title', 'Power Options'));
	const prefTab = createOption(t('menu.preferences.option.title', 'Preferences'));
	const audioTab = createOption(t('menu.audio.option.title', 'Audio'));
	const graphTab = createOption(t('menu.graphics.option.title', 'Graphics'));
	const themeTab = createOption(t('menu.themes.option.title', 'Themes'));
	const waveTab = createOption(t('menu.wave.option.title', 'Wave Amount'));
	const helpTab = createOption(t('menu.help.option.title', 'Help'));
	const debugTab = createOption(t('menu.debug.option.title', 'Debug'));
	const uiOptionCount = document.getElementById('ui-options').querySelectorAll('a').length;
	for (let i = 0; i < uiOptionCount; i++) {
		selectedSuboptions[i] = 0;
	}

	// init suboptions
	createSuboption(powerTab, t('menu.power.powerOff.title', 'Power Off'), t('menu.power.powerOff.desc', 'Shuts down the system and closes the tab (if possible).'), () => {
		confirmDialog(shutdown);
	}, 'power', 'power');
	createSuboption(powerTab, t('menu.power.reboot.title', 'Reboot'), t('menu.power.reboot.desc', 'Restarts the system with the latest version of the system files.'), () => {
		confirmDialog(reboot);
	}, 'power', 'power');
	createSuboption(powerTab, t('menu.power.fastReboot.title', 'Fast Reboot'), t('menu.power.fastReboot.desc', 'Restarts and skips startup animation once on the next boot.'), () => {
		confirmDialog(fastReboot);
	}, 'power', 'power');
	selectedSuboptions[0] = 1;

	createSuboption(prefTab, t('menu.preferences.setUsername.title', 'Set Username'), t('menu.preferences.setUsername.desc', 'Username currently set to "{username}".', { username }), () => {
		promptDialog((name) => {
			if (!isDefined(name)) name = _defaultUsername;
			setUsername(name);
			updateLabel();
			setSuboption(selectedOption, selectedSuboption, null, t('menu.preferences.setUsername.desc', 'Username currently set to "{username}".', { username }));
		}, t('menu.preferences.setUsername.promptTitle', 'Enter a username...'), t('menu.preferences.setUsername.placeholder', 'default username is {defaultUsername}', { defaultUsername: _defaultUsername }));
	}, 'user');
	createSuboption(prefTab, t('menu.preferences.toggleMonochromeFavicon.title', 'Toggle monochrome favicon'),
		localStorage.coloredFavicon === 'true'
			? t('menu.preferences.toggleMonochromeFavicon.enabledDesc', 'Favicon is currently colored.\nSelect to switch to a monochromatic favicon.')
			: t('menu.preferences.toggleMonochromeFavicon.disabledDesc', 'Favicon is currently monochromatic.\nSelect to switch to a colored favicon.'),
		() => {
			localStorage.coloredFavicon = localStorage.coloredFavicon === 'true' ? 'false' : 'true';
			icon();
			if (localStorage.coloredFavicon === 'true') {
				setSuboption(selectedOption, selectedSuboption, t('menu.preferences.toggleMonochromeFavicon.title', 'Toggle monochrome favicon'), t('menu.preferences.toggleMonochromeFavicon.enabledDesc', 'Favicon is currently colored.\nSelect to switch to a monochromatic favicon.'));
			} else {
				setSuboption(selectedOption, selectedSuboption, t('menu.preferences.toggleMonochromeFavicon.title', 'Toggle monochrome favicon'), t('menu.preferences.toggleMonochromeFavicon.disabledDesc', 'Favicon is currently monochromatic.\nSelect to switch to a colored favicon.'));
			}
		}, 'image');
	createSuboption(prefTab, t('menu.preferences.toggleOpenUi.title', 'Toggle open UI'),
		localStorage.openUI === 'true' ? t('menu.preferences.toggleOpenUi.enabledDesc', 'UI is currently open.\nSelect to close it.') : t('menu.preferences.toggleOpenUi.disabledDesc', 'UI is currently closed.\nSelect to open it.'),
		() => {
			localStorage.openUI = localStorage.openUI === 'true' ? 'false' : 'true';
			if (localStorage.openUI === 'true') {
				ui.classList.add('open');
				setSuboption(selectedOption, selectedSuboption, t('menu.preferences.toggleOpenUi.title', 'Toggle open UI'), t('menu.preferences.toggleOpenUi.enabledDesc', 'UI is currently open.\nSelect to close it.'));
			} else {
				ui.classList.remove('open');
				setSuboption(selectedOption, selectedSuboption, t('menu.preferences.toggleOpenUi.title', 'Toggle open UI'), t('menu.preferences.toggleOpenUi.disabledDesc', 'UI is currently closed.\nSelect to open it.'));
			}
		},
		'wrench'
	);
	createSuboption(prefTab, t('menu.preferences.toggleStartupAnimation.title', 'Toggle startup animation'),
		localStorage.startup === 'true' ? t('menu.preferences.toggleStartupAnimation.enabledDesc', 'Startup animation is currently enabled.\nSelect to disable it.') : t('menu.preferences.toggleStartupAnimation.disabledDesc', 'Startup animation is currently disabled.\nSelect to enable it.'),
		() => {
			localStorage.startup = localStorage.startup === 'true' ? 'false' : 'true';
			if (localStorage.startup === 'true') {
				setSuboption(selectedOption, selectedSuboption, t('menu.preferences.toggleStartupAnimation.title', 'Toggle startup animation'), t('menu.preferences.toggleStartupAnimation.enabledDesc', 'Startup animation is currently enabled.\nSelect to disable it.'));
			} else {
				setSuboption(selectedOption, selectedSuboption, t('menu.preferences.toggleStartupAnimation.title', 'Toggle startup animation'), t('menu.preferences.toggleStartupAnimation.disabledDesc', 'Startup animation is currently disabled.\nSelect to enable it.'));
			}
		},
		'wrench'
	);
	createSuboption(prefTab, t('menu.preferences.fastBootDefault.title', 'Fast boot by default'),
		localStorage.fastBootDefault === 'true'
			? t('menu.preferences.fastBootDefault.enabledDesc', 'Fast boot is currently enabled by default.\nStartup animation only plays when Reboot is used.\nSelect to disable this.')
			: t('menu.preferences.fastBootDefault.disabledDesc', 'Fast boot is currently disabled by default.\nSelect to enable this and only show startup animation on Reboot.'),
		() => {
			localStorage.fastBootDefault = localStorage.fastBootDefault === 'true' ? 'false' : 'true';
			if (localStorage.fastBootDefault === 'true') {
				setSuboption(selectedOption, selectedSuboption, t('menu.preferences.fastBootDefault.title', 'Fast boot by default'), t('menu.preferences.fastBootDefault.enabledDesc', 'Fast boot is currently enabled by default.\nStartup animation only plays when Reboot is used.\nSelect to disable this.'));
			} else {
				setSuboption(selectedOption, selectedSuboption, t('menu.preferences.fastBootDefault.title', 'Fast boot by default'), t('menu.preferences.fastBootDefault.disabledDesc', 'Fast boot is currently disabled by default.\nSelect to enable this and only show startup animation on Reboot.'));
			}
		},
		'wrench'
	);

	createSuboption(prefTab, t('menu.preferences.savePreferences.title', 'Save preferences'), t('menu.preferences.savePreferences.desc', 'Select to download a file with your preferences to load them later.'), () => {
		confirmDialog(() => {
			downloadFileWithContent(
				`Noema Preferences Backup -- ${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}-${new Date().getDate().toString().padStart(2, '0')} ${new Date().getHours()}-${new Date().getMinutes().toString().padStart(2, '0')}-${new Date().getSeconds().toString().padStart(2, '0')}.nsf`,
				(() => {
					const settings = JSON.parse(JSON.stringify(localStorage));
					settings.exportDate = Date.now();
					settings.format = 'NSF2.1';
					delete settings.lastChangelogHash;
					delete settings.lastVersion;
					delete settings.defaultScripts;
					return JSON.stringify(settings);
				})()
			);
		}, t('dialog.confirm.title', 'Are you sure?'), t('dialog.confirm.subtitle.accidental', "Just making sure this wasn't pressed by accident."));
	}, 'wrench');
	createSuboption(prefTab, t('menu.preferences.loadPreferences.title', 'Load preferences'), t('menu.preferences.loadPreferences.desc', 'Select to load a file with your saved preferences.'), () => {
		const importbtn = document.createElement('input');
		importbtn.type = 'file';
		importbtn.multiple = 'false';
		importbtn.style.display = 'none';
		importbtn.addEventListener('change', (event) => {
			const file = event.target.files[0];

			if (isDefined(file)) {
				const reader = new FileReader();

				reader.onload = function (e) {
					let content = e.target.result;
					content = JSON.parse(content);
					const formats = ['NSF1.0', 'NSF2.0', 'NSF2.1'];

					if (formats.includes(content?.format)) {
						if (content.format === 'NSF1.0') {
							notify(
								'That save file might be unsafe.',
								"We didn't load it because the format of that save file has a known security issue.",
								'warning'
							);
							setTimeout(() => {
								notify(
									'Still want to recover your data?',
									'We have a site that can safely convert the file and remove potentially unsafe data.\nFind it in the "Help" tab.'
								);
							}, 2.5e3);
							return;
						}
						if (content.format === 'NSF2.0') {
							localStorage.clear();

							for (let i = 0; i < Object.keys(content).length; i++) {
								const key = Object.keys(content)[i];
								const value = Object.values(content)[i];
								if (key === 'format' || key === 'exportDate' || key === 'lastVersion') continue;
								localStorage.setItem(key, value);
							}
						}
						if (content.format === 'NSF2.1') {
							localStorage.clear();

							for (let i = 0; i < Object.keys(content).length; i++) {
								const key = Object.keys(content)[i];
								const value = Object.values(content)[i];
								if (key === 'format' || key === 'exportDate' || key === 'lastChangelogHash') continue;
								localStorage.setItem(key, value);
							}

							localStorage.lastChangelogHash = '0';
						}
						notify('Preferences file loaded successfully!');
						setTimeout(() => {
							notify('The system will reboot in 3 seconds to properly apply every setting.', '(to set absent settings to their defaults and to apply settings that need a reboot to fully apply)');
							setTimeout(() => {
								reboot();
							}, 3e3);
						}, 2e3);
					} else {
						throw new TypeError('Unsupported, invalid or absent format! Please use a valid preferences file.');
					}
					importbtn.remove();
				};
				reader.readAsText(file);
			}
		});
		document.body.appendChild(importbtn);
		importbtn.click();
	}, 'wrench');
	createSuboption(prefTab, t('menu.preferences.bgBrightness.title', 'Background Brightness'), t('menu.preferences.bgBrightness.desc', 'Background brightness currently set to {value}%.', { value: decimalStrToPercentage(localStorage.bgBrightness) }), () => {
		inputDialog(t('menu.preferences.bgBrightness.dialogTitle', 'Set Background Brightness'), t('menu.preferences.bgBrightness.dialogSubtitle', 'Adjust how bright the background appears. This affects the gradient and canvas drawing brightness.'), decimalStrToPercentage(localStorage.bgBrightness), 25, 100, 1, '{value}%', (value) => {
			localStorage.bgBrightness = percentageToDecimal(value);
			changeBGColor({ colorName: localStorage.bgColor, brightness: parseFloat(localStorage.bgBrightness) });
			setSuboption(selectedOption, selectedSuboption, t('menu.preferences.bgBrightness.title', 'Background Brightness'), t('menu.preferences.bgBrightness.desc', 'Background brightness currently set to {value}%.', { value: decimalStrToPercentage(localStorage.bgBrightness) }));
		});
	}, 'wrench');

	createSuboption(prefTab, t('menu.preferences.resetPreferences.title', 'Reset preferences'), t('menu.preferences.resetPreferences.desc', 'This wipes EVERY preference (Background color, username, spaghetti density, etc).\nDo not use this unless you know what you\'re doing and haven\'t saved your preferences.\nOnce you reset your preferences, this process is IRREVERSIBLE.'),
		() => {
			confirmDialog(() => {
				setTimeout(() => {
					confirmDialog(() => {
						localStorage.clear();
						reboot();
					}, t('dialog.confirm.title.strong', 'Are you absolutely sure?'), '');
				}, .5e3);
			},
				t('dialog.confirm.title', 'Are you sure?'),
				t('menu.preferences.resetPreferences.dialogSubtitle', 'Do not accept unless you know what you\'re doing.\nOnce you reset your preferences, this process is IRREVERSIBLE, so make sure to save your preferences before resetting.\n\nThe system will restart after resetting to apply the default settings.'));
		},
		'bin'
	);

	createSuboption(audioTab, t('menu.audio.togglePauseOnUnfocus.title', 'Toggle pausing background music on unfocus'),
		localStorage.pauseMusic === 'true' ? t('menu.audio.togglePauseOnUnfocus.enabledDesc', 'Background music currently gets paused on unfocus.\nSelect to not mute it on unfocus.') : t('menu.audio.togglePauseOnUnfocus.disabledDesc', 'Background music currently doesn\'t get muted on unfocus.\nSelect to mute it on unfocus.'),
		() => {
			localStorage.pauseMusic = localStorage.pauseMusic === 'true' ? 'false' : 'true';
			if (localStorage.pauseMusic === 'true') {
				setSuboption(selectedOption, selectedSuboption, t('menu.audio.togglePauseOnUnfocus.title', 'Toggle pausing background music on unfocus'), t('menu.audio.togglePauseOnUnfocus.enabledDesc', 'Background music currently gets paused on unfocus.\nSelect to not mute it on unfocus.'));
			} else {
				bgMusic.play();
				setSuboption(selectedOption, selectedSuboption, 'Toggle pausing background music on unfocus', 'Background music currently doesn\\\'t get muted on unfocus.\nSelect to enable that.');
			}
		},
		'wrench'
	);
	createSuboption(audioTab, t('menu.audio.setMasterVolume.title', 'Set master volume'), t('menu.audio.setMasterVolume.desc', 'Master volume is currently at {value}% volume.', { value: decimalStrToPercentage(localStorage.masterVolume) }), () => {
		inputDialog(t('menu.audio.setMasterVolume.title', 'Set master volume'), null, decimalStrToPercentage(localStorage.masterVolume), 0, 100, 1, '{value}%', (volume) => {
			setMasterVolume(percentageToDecimal(volume));
			setSuboption(selectedOption, selectedSuboption, t('menu.audio.setMasterVolume.title', 'Set master volume'), t('menu.audio.setMasterVolume.desc', 'Master volume is currently at {value}% volume.', { value: decimalStrToPercentage(localStorage.masterVolume) }));
		});
	}, 'wrench');
	createSuboption(audioTab, t('menu.audio.setBackgroundMusicVolume.title', 'Set background music volume'), t('menu.audio.setBackgroundMusicVolume.desc', 'Background music is currently at {value}% volume.', { value: decimalStrToPercentage(localStorage.musicVolume) }), () => {
		inputDialog(t('menu.audio.setBackgroundMusicVolume.title', 'Set background music volume'), null, decimalStrToPercentage(localStorage.musicVolume), 0, 100, 1, '{value}%', (volume) => {
			localStorage.musicVolume = percentageToDecimal(volume);
			bgMusic.volume = parseFloat(localStorage.musicVolume).clamp(0, 1) * masterVolume;
			setSuboption(selectedOption, selectedSuboption, t('menu.audio.setBackgroundMusicVolume.title', 'Set background music volume'), t('menu.audio.setBackgroundMusicVolume.desc', 'Background music is currently at {value}% volume.', { value: decimalStrToPercentage(localStorage.musicVolume) }));
		});
	}, 'wrench');
	createSuboption(audioTab, t('menu.audio.setUiSoundVolume.title', 'Set UI sound volume'), t('menu.audio.setUiSoundVolume.desc', 'UI sounds are currently at {value}% volume.', { value: decimalStrToPercentage(localStorage.uiSoundVolume) }), () => {
		inputDialog(t('menu.audio.setUiSoundVolume.title', 'Set UI sound volume'), null, decimalStrToPercentage(localStorage.uiSoundVolume), 0, 100, 1, '{value}%', (volume) => {
			localStorage.uiSoundVolume = percentageToDecimal(volume);
			setSuboption(selectedOption, selectedSuboption, t('menu.audio.setUiSoundVolume.title', 'Set UI sound volume'), t('menu.audio.setUiSoundVolume.desc', 'UI sounds are currently at {value}% volume.', { value: decimalStrToPercentage(localStorage.uiSoundVolume) }));
		});
	}, 'wrench');

	createSuboption(graphTab, t('menu.graphics.toggleEffects.title', 'Toggle effects'),
		localStorage.noShaders === 'true' ? t('menu.graphics.toggleEffects.disabledDesc', 'Effects are currently disabled.\nSelect to turn them on.') : t('menu.graphics.toggleEffects.enabledDesc', 'Effects are currently enabled.\nSelect to turn them off.'),
		() => {
			localStorage.noShaders = localStorage.noShaders === 'true' ? 'false' : 'true';
			if (localStorage.noShaders === 'true') {
				setSuboption(selectedOption, selectedSuboption, t('menu.graphics.toggleEffects.title', 'Toggle effects'), t('menu.graphics.toggleEffects.disabledDesc', 'Effects are currently disabled.\nSelect to turn them on.'));
				traverseDOM(document.body, (element) => {
					element.style.backdropFilter = 'none';
				});
			} else {
				setSuboption(selectedOption, selectedSuboption, t('menu.graphics.toggleEffects.title', 'Toggle effects'), t('menu.graphics.toggleEffects.enabledDesc', 'Effects are currently enabled.\nSelect to turn them off.'));
				traverseDOM(document.body, (element) => {
					element.style.backdropFilter = '';
				});
			}
		},
		'wrench'
	);
	createSuboption(graphTab, t('menu.graphics.toggleAnimations.title', 'Toggle animations'),
		localStorage.noTransitions === 'true' ? t('menu.graphics.toggleAnimations.disabledDesc', 'Animations are currently disabled.\nSelect to turn them on.') : t('menu.graphics.toggleAnimations.enabledDesc', 'Animations are currently enabled.\nSelect to turn them off.'),
		() => {
			localStorage.noTransitions = localStorage.noTransitions === 'true' ? 'false' : 'true';
			if (localStorage.noTransitions === 'true') {
				setSuboption(selectedOption, selectedSuboption, t('menu.graphics.toggleAnimations.title', 'Toggle animations'), t('menu.graphics.toggleAnimations.disabledDesc', 'Animations are currently disabled.\nSelect to turn them on.'));
				traverseDOM(document.body, (element) => {
					element.style.transition = 'none';
					element.style.animation = 'none';
				});
			} else {
				setSuboption(selectedOption, selectedSuboption, t('menu.graphics.toggleAnimations.title', 'Toggle animations'), t('menu.graphics.toggleAnimations.enabledDesc', 'Animations are currently enabled.\nSelect to turn them off.'));
				traverseDOM(document.body, (element) => {
					element.style.transition = '';
					element.style.animation = '';
				});
			}
		},
		'wrench'
	);

	Object.keys(bgColors).forEach((color, i) => {
		createSuboption(themeTab, color.toTitleCase(), `Select to set the theme to "${color.toTitleCase()}".`, () => {
			changeBGColor({ colorName: color });
		}, 'image');
		if (color === localStorage.bgColor) selectedSuboptions[themeTab] = i;
	});

	for (const [label, data] of Object.entries(densities)) {
		createSuboption(
			waveTab,
			label.toTitleCase(),
			data.desc,
			() => {
				localStorage.spaghettiDensity = density = data.value;
			},
			'wrench'
		);
	}

	createSuboption(helpTab, t('menu.help.convertSaveFile.title', 'Convert Save File'), null, () => {
		const width = window.innerWidth / 2;
		const height = window.innerHeight / 2;
		const left = window.screenX + (window.outerWidth - width) / 2;
		const top = window.screenY + (window.outerHeight - height) / 2;

		const newWindow = window.open(
			'./subpages/convertsave/index.html',
			'convert',
			`width=${width},height=${height},left=${left},top=${top}`
		);

		if (isDefined(newWindow.focus)) newWindow.focus();
	}, 'wrench');
	createSuboption(helpTab, t('menu.help.openGithubRepo.title', "Open Project Noema's GitHub repo"), null, () => {
		window.open('https://github.com/sophb-ccjt/noema', '_blank');
	}, 'open-external');
	createSuboption(helpTab, t('menu.help.reportIssue.title', 'Report an issue on GitHub'), null, () => {
		window.open('https://github.com/sophb-ccjt/noema/issues/new', '_blank');
	}, 'open-external');

	createSuboption(debugTab, t('menu.debug.toggleUi.title', 'Toggle debugging UI'), localStorage.debugUI === 'true' ? t('menu.debug.toggleUi.enabledDesc', 'Debug UI is currently on.\nSelect to turn it off.') : t('menu.debug.toggleUi.disabledDesc', 'Debug UI is currently off.\nSelect to turn it on.'), () => {
		localStorage.debugUI = localStorage.debugUI === 'true' ? 'false' : 'true';
		if (localStorage.debugUI === 'true') {
			document.getElementById('debug-ui').style.display = 'block';
			setSuboption(selectedOption, selectedSuboption, t('menu.debug.toggleUi.title', 'Toggle debugging UI'), t('menu.debug.toggleUi.enabledDesc', 'Debug UI is currently on.\nSelect to turn it off.'));
		} else {
			document.getElementById('debug-ui').style.display = 'none';
			setSuboption(selectedOption, selectedSuboption, t('menu.debug.toggleUi.title', 'Toggle debugging UI'), t('menu.debug.toggleUi.disabledDesc', 'Debug UI is currently off.\nSelect to turn it on.'));
		}
	}, 'star');
	createSuboption(debugTab, t('menu.debug.clearErrors.title', 'Clear Errors'), null, () => {
		errors = 0;
		errorList.length = 0;
		document.getElementById('errors').innerText = `Errors: ${errors}`;
	}, 'star');
	createSuboption(debugTab, t('menu.debug.loadScript.title', 'Load Script'), null, () => {
		promptDialog((url) => {
			if (!url) return;
			if (!isURL(url)) throw new TypeError("Script URL provided isn't even a URL.");
			if (document.getElementById('script-' + url)) throw new Error('Script already loaded!');
			const script = document.createElement('script');
			script.src = url;
			script.id = 'script-' + url;
			document.body.appendChild(script);
		}, t('menu.debug.loadScript.promptTitle', 'Enter a script URL...'));
	}, 'star');

	selectUIOption(1);
}
function getOption(optionId) {
	return {
		label: document.getElementById(`ui-option${optionId}`).textContent,
		element: document.getElementById(`ui-option${optionId}`)
	};
}
function getSuboption(optionId, suboptionId) {
	const suboption = document.getElementById(`ui-content${optionId}`).querySelector(`#ui-suboption${suboptionId}`);
	return {
		title: suboption.querySelector('.ui-suboption-title').textContent,
		description: suboption.querySelector('.ui-suboption-text')?.textContent,
		icon: suboption.querySelector('.ui-suboption-icon').src.trimEnd('.png'),
		element: suboption
	};
}

function bandDialog(title = '', subtitle = '', setupFunc, confirmFunc, usesEnterKey = true) {
	document.getElementById('custom-title').textContent = title;
	document.getElementById('custom-items').innerHTML = '';
	document.getElementById('custom-items').style.cssText = '';

	if (!isDefined(setupFunc)) {
		document.getElementById('custom-items').style.display = 'none';
	} else {
		document.getElementById('custom-items').style.display = 'revert';
		setupFunc(document.getElementById('custom-items'));
	}
	if (!isDefined(confirmFunc)) confirmFunc = () => { };
	document.getElementById('custom-subtitle').style.display = 'none';

	if (isDefined(subtitle)) {
		if (subtitle.replace(/\s/g, '').length > 0) {
			document.getElementById('custom-subtitle').style.display = 'revert';
			document.getElementById('custom-subtitle-text').textContent = subtitle;
		}
	}
	let hasInput = false;
	traverseDOM(document.getElementById('custom-dialog'), (el) => {
		if (el.tagName === 'INPUT') {
			if (
				el.type === 'text' ||
				el.type === 'email' ||
				el.type === 'password' ||
				el.type === 'search' ||
				el.type === 'tel' ||
				el.type === 'url'
			) {
				hasInput = true;
			} else if (el.type === 'checkbox') {
				usesEnterKey = false;
			}
		} else if (el.tagName === 'TEXTAREA') {
			hasInput = true;
		}
	});
	if (lastInput === 'gamepad') {
		if (usesEnterKey) {
			document.getElementById('custom-controls').textContent = t('dialog.controls.gamepad.confirm', 'Press ✕/Ⓐ to confirm, and ⭘/Ⓑ to cancel.');
		} else {
			document.getElementById('custom-controls').textContent = t('dialog.controls.gamepad.exit', 'Press ⭘/Ⓑ to exit.');
		}
	} else {
		if (usesEnterKey) {
			if (hasInput) {
				document.getElementById('custom-controls').textContent = t('dialog.controls.keyboard.confirmInput', 'Press Enter to confirm, and Escape to cancel.');
			} else {
				document.getElementById('custom-controls').textContent = t('dialog.controls.keyboard.confirm', 'Press Enter or Space to confirm, and Escape to cancel.');
			}
		} else {
			document.getElementById('custom-controls').textContent = t('dialog.controls.keyboard.exit', 'Press Escape to exit.');
		}
	}

	const handler = (event) => {
		const key = event.key.toLowerCase();
		function blur() {
			traverseDOM(document.getElementById('custom-dialog'), (el) => {
				if (document.activeElement === el) {
					el.onblur = null;
					requestAnimationFrame(() => {
						el.blur();
					});
				}
			});
		}
		if ((key === 'enter' || (key === ' ' && !hasInput)) && usesEnterKey) {
			if (usesEnterKey) {
				confirmFunc();
				playSound('confirm');
			}
			blur();
			document.getElementById('custom-dialog').style.opacity = '0';
			document.removeEventListener('keyup', handler);
		} else if (key === 'escape') {
			playSound('back');
			blur();
			document.getElementById('custom-dialog').style.opacity = '0';
			document.removeEventListener('keyup', handler);
		}
	};
	document.getElementById('custom-dialog').style.opacity = '100%';
	document.addEventListener('keyup', handler);
}
function inputDialog(title = t('dialog.input.defaultTitle', 'Select a value...'), subtitle, startingValue, min, max, step = 1, formatStr, updFunc = () => { }) {
	if (!formatStr && typeof formatStr !== 'string') console.warn('formatStr (7th argument): Every instance of the substring "{value}" will be replaced with the slider\'s current value.\nSet this parameter to an empty string to avoid this warning.');
	bandDialog(title, subtitle, (dialog) => {
		const slider = document.createElement('input');
		slider.type = 'range';
		slider.min = min.toString();
		slider.max = max.toString();
		slider.step = step.toString();
		slider.value = startingValue.toString();
		dialog.appendChild(slider);

		const slidertext = document.createElement('a');
		slidertext.textContent = ` ${formatStr.replaceAll("{value}", slider.value.toString())}`;
		slidertext.style.color = '#fff';
		slidertext.style.fontFamily = "'Manrope', monospace";
		dialog.appendChild(slidertext);

		const handler = () => {
			updFunc(slider.value);
			slidertext.textContent = ` ${formatStr.replaceAll("{value}", slider.value.toString())}`;
		};
		slider.addEventListener('input', handler);
		slider.onblur = () => slider.removeEventListener('input', handler);

		dialog.appendChild(document.createElement('br'));
		slider.focus();
		slider.onblur = slider.focus;
		slider.style.outline = '0';
	}, null, false);
}
function confirmDialog(func = () => { }, title = t('dialog.confirm.title', 'Are you sure?'), subtitle = '') {
	bandDialog(title, subtitle, null, func, true);
}
function promptDialog(func = (() => { }), title = t('dialog.prompt.defaultTitle', 'Enter some text...'), placeholder = '') {
	bandDialog(title, '', (dialog) => {
		const input = document.createElement('input');
		input.type = 'text';
		input.placeholder = placeholder;
		input.id = 'custom-input';
		input.onblur = () => input.focus();

		dialog.appendChild(input);
		input.focus();
		input.style.outline = `solid 1px ${accentColor}`;
		input.style.boxShadow = `0px 0px 7px ${accentColor}`;
		input.style.borderRadius = `10px`;
	}, () => {
		func(document.getElementById('custom-input').value);
	}, true);
}
function checkboxDialog(title, subtitle, label, toggleFunc = () => { }) {
	bandDialog(title, subtitle, (dialog) => {
		const text = document.createElement('a');
		text.textContent = `${label} `;
		text.style.cssText = "color: #fff; font-family: 'Manrope', monospace";

		const checkbox = document.createElement('input');
		checkbox.type = 'checkbox';
		checkbox.onblur = () => checkbox.focus();
		checkbox.addEventListener('input', () => {
			toggleFunc(checkbox.checked);
		});

		dialog.appendChild(text);
		dialog.appendChild(checkbox);
		dialog.appendChild(document.createElement('br'));
		dialog.appendChild(document.createElement('br'));

		checkbox.focus();
	}, null, true);
}
const notifElements = {};
const queuedNotifs = [];
let notifCount = 0;
function notify(title, text, icon) {
	const notifDiv = document.createElement('span');
	notifDiv.className = 'notif';
	notifDiv.id = `notif-${Math.random()}`;
	function notifHandler() {
		if (localStorage.noShaders === 'true') notifDiv.style.backdropFilter = 'none';
		if (localStorage.noTransitions === 'true') notifDiv.style.transition = 'none';
		document.getElementById('notif-div').appendChild(notifDiv);

		const notifContent = document.createElement('span');
		notifContent.style.padding = '5px';
		notifDiv.appendChild(notifContent);

		const notifTitle = document.createElement('a');
		notifTitle.textContent = title;
		notifTitle.className = 'notif-title';
		notifContent.appendChild(notifTitle);

		if (isDefined(text)) {
			notifContent.appendChild(document.createElement('br'));
			const notifText = document.createElement('a');
			notifText.textContent = text;
			notifText.className = "notif-text";
			notifContent.appendChild(notifText);
		}

		if (isDefined(icon)) {
			const notifIcon = document.createElement('img');
			notifIcon.src = `/assets/icons/${icon}.png`;
			notifIcon.className = "notif-icon";
			notifDiv.appendChild(notifIcon);
		}

		const snd = playSound('notif', null, {
			preservesPitch: false,
			playbackRate: 1 + notifCount / 25
		});

		notifElements[notifDiv.id] = notifDiv;
		notifCount++;
		requestAnimationFrame(() => {
			notifDiv.style.transform = 'translateX(1px)';
			notifDiv.style.opacity = '100%';
		});
		setTimeout(() => {
			notifDiv.style.transform = 'translateX(100%)';
			notifDiv.style.opacity = '0';
			if (notifElements[notifDiv.id]) {
				delete notifElements[notifDiv.id];
				notifCount--;
			}
			setTimeout(() => { notifDiv.remove(); }, .25e3);
		}, 10e3);
	}
	if (notifCount >= 6 || !started || !document.hasFocus()) {
		if (queuedNotifs.length < 24) {
			queuedNotifs.push({ id: notifDiv.id, when: Date.now() });
			const checkInterval = setInterval(() => {
				if (notifCount < 6 && started && document.hasFocus()) {
					if (queuedNotifs[0]?.id === notifDiv.id) {
						if (Date.now() - queuedNotifs[0]?.when <= 60e3) notifHandler();
						queuedNotifs.shift();
						clearInterval(checkInterval);
					}
				}
			}, 100);
		} else {
			console.error("Too many notifications are queued up!");
			return;
		}
	} else {
		notifHandler();
	}

}

let keyPressed = null;
let pressedTime = null;
let lastActivity = Date.now();
let inputMultiplier = 1;
function handleInput(event) {
	const keyup = event.type === 'keyup';

	if (!started) return;
	if (event.repeat) {
		if (Date.now() - lastActivity < 75) {
			return;
		}
	} else {
		if (Date.now() - lastActivity < 50) {
			return;
		}
		inputMultiplier = event.shiftKey ? 10 : 1;
	}
	lastActivity = Date.now();
	const uiOptions = document.getElementById('ui-options');
	const optionCount = uiOptions.querySelectorAll('.ui-option').length;
	const selectedContent = document.getElementById(`ui-content${selectedOption}`);
	const suboptionCount = selectedContent?.querySelectorAll('.ui-suboption').length ?? 0;

	function left() {
		if (optionCount < 2) return;
		if (keyup) return;
		if (selectedOption <= 0) {
			if (event.repeat) return;
			selectedOption = optionCount - 1;
		}
		else
			selectedOption--;
		selectUIOption(selectedOption);
		playSound('select');
	}
	function right() {
		if (optionCount < 2) return;
		if (keyup) return;
		if (selectedOption >= optionCount - 1) {
			if (event.repeat) return;
			selectedOption = 0;
		}
		else
			selectedOption++;
		selectUIOption(selectedOption);
		playSound('select');
	}
	function up() {
		if (suboptionCount < 2) return;
		if (keyup) return;
		if (selectedSuboption <= 0) {
			if (event.repeat) return;
			else
				selectUISuboption(suboptionCount - 1);

			playSound('select');
			return;
		}

		selectedSuboption--;
		selectUISuboption(selectedSuboption);
		playSound('select');
	}
	function down() {
		if (suboptionCount < 2) return;
		if (keyup) return;
		if (selectedSuboption >= suboptionCount - 1) {
			if (event.repeat) return;
			else
				selectUISuboption(0);

			playSound('select');
			return;
		}

		selectedSuboption++;
		selectUISuboption(selectedSuboption);
		playSound('select');
	}
	function back() {
		if (!keyup) return;

		document.body.querySelectorAll('.band-dialog').forEach(dialog => {
			if (window.getComputedStyle(dialog).opacity !== '0') {
				dialog.style.opacity = "0%";
				playSound('back');
				return true;
			}
		});
		document.activeElement.blur();
		return;
	}


	if (event.isTrusted) {
		lastInput = 'keyboard';
	}
	const key = event.key.toLowerCase();
	// console.log('key press:', key)

	// input handler, make it JSON later?
	// ⤷ idk sis you might need to spend a lot of time
	/*if (key === 'escape') {
		if (!event.repeat)
			back();
	}*/
	const outOfMenu = [...document.body
		.querySelectorAll('.band-dialog')]
		.some(dialog => window.getComputedStyle(dialog).opacity !== '0');

	if (outOfMenu) {
		if ((key === 'a' || key === 'arrowleft') && !keyup) {
			if (document.activeElement.tagName === 'INPUT' && document.activeElement?.type === 'range') {
				event.preventDefault();
				if (parseFloat(document.activeElement.value) > parseFloat(document.activeElement.min)) {
					document.activeElement.value = parseFloat(document.activeElement.value) - parseFloat(document.activeElement.step || '1') * inputMultiplier;

					const evtn = new Event('input', { bubbles: true });
					document.activeElement.dispatchEvent(evtn);
					const evtn2 = new Event('change', { bubbles: true });
					document.activeElement.dispatchEvent(evtn2);
				}
			}
		}
		if ((key === 'd' || key === 'arrowright') && !keyup) {
			if (document.activeElement.tagName === 'INPUT' && document.activeElement?.type === 'range') {
				event.preventDefault();
				if (parseFloat(document.activeElement.value) < parseFloat(document.activeElement.max)) {
					document.activeElement.value = parseFloat(document.activeElement.value) + parseFloat(document.activeElement.step || '1') * inputMultiplier;

					const evtn = new Event('input', { bubbles: true });
					document.activeElement.dispatchEvent(evtn);
					const evtn2 = new Event('change', { bubbles: true });
					document.activeElement.dispatchEvent(evtn2);
				}
			}
		}
		if ((key === 'w' || key === 'arrowup') && !keyup) {
			if (document.activeElement.tagName === 'INPUT' && document.activeElement?.type === 'number') {
				event.preventDefault();
				if (parseFloat(document.activeElement.value) < parseFloat(document.activeElement.max)) {
					document.activeElement.value = parseFloat(document.activeElement.value) + parseFloat(document.activeElement.step || '1') * inputMultiplier;

					const evtn = new Event('input', { bubbles: true });
					document.activeElement.dispatchEvent(evtn);
					const evtn2 = new Event('change', { bubbles: true });
					document.activeElement.dispatchEvent(evtn2);
				}
			}
		}
		if ((key === 'a' || key === 'arrowleft') && !keyup) {
			if (document.activeElement.tagName === 'INPUT' && document.activeElement?.type === 'number') {
				event.preventDefault();
				if (parseFloat(document.activeElement.value) > parseFloat(document.activeElement.min)) {
					document.activeElement.value = parseFloat(document.activeElement.value) - parseFloat(document.activeElement.step || '1') * inputMultiplier;

					const evtn = new Event('input', { bubbles: true });
					document.activeElement.dispatchEvent(evtn);
					const evtn2 = new Event('change', { bubbles: true });
					document.activeElement.dispatchEvent(evtn2);
				}
			}
		}
		if ((key === 'enter' || key === ' ') && !keyup) {
			if (document.activeElement.tagName === 'INPUT' && document.activeElement?.type === 'checkbox') {
				event.preventDefault();
				document.activeElement.checked = !document.activeElement.checked;

				const evtn = new Event('input', { bubbles: true });
				document.activeElement.dispatchEvent(evtn);
				const evtn2 = new Event('change', { bubbles: true });
				document.activeElement.dispatchEvent(evtn2);
			}
		}
	} else {
		if (key === 'a' || key === 'arrowleft') {
			left();
		}
		if (key === 'd' || key === 'arrowright') {
			right();
		}
		if (key === 'w' || key === 'arrowup') {
			up();
		}
		if (key === 's' || key === 'arrowdown') {
			down();
		}
		if (key === 'enter' || key === ' ') {
			if (!event.repeat && keyup)
				executeUISuboption();
		}
		if (key === 'q') {
			if (!keyup && selectedOption !== 0) {
				selectUIOption(0);
				playSound('select');
			}
		}
		if (key === 'e') {
			if (!keyup && selectedOption !== optionCount - 1) {
				selectUIOption(optionCount - 1);
				playSound('select');
			}
		}
	}
}
