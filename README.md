# Project Noema

**Project Noema** is a web-based game console that runs entirely in your browser, featuring a user interface inspired by the PlayStation 3. It provides a retro-futuristic gaming experience with support for custom games packaged in the NGP (Noema Game Package) format.

This is the **Open Developer Beta** (currently version `v0.16.0`), actively developed and evolving toward feature-complete releases. The project works both locally and when hosted, requiring no build tools or compilation.

**Key Features:**
- PS3-inspired UI with smooth animations and visual effects
- Customizable themes and color palettes (18+ built-in themes)
- Full keyboard and gamepad support
- Persistent settings and save file management
- Audio system with independent volume controls
- Performance optimization for various device capabilities
- No external dependencies for core functionality

Future releases will continue to follow the versioning rules laid out in [`/misc/markdowns/VERSIONING.md`](/misc/markdowns/VERSIONING.md).

---

## Quick Start

### Running Locally
1. Clone this repository
2. Open `/src/index.html` in a modern web browser
3. The console will start automatically

No installation, no build process, no npm packages needed. It just works.

### For Development
1. Clone the repository and open it in VS Code
2. Edit files under [`/src/scripts`](/src/scripts) or [`/src/css.css`](/src/css.css)
3. Refresh the browser to see changes
4. Use browser DevTools for debugging

> **Note:** The project works both via `file://` protocol (opening HTML directly) and when served via HTTP (e.g., `npx serve`).

---

## Repository Structure

```
/
├── README.md
├── LICENSE
├── CONTRIBUTING.md
├── COLLABORATION.md
├── src/
│   ├── index.html              # Entry point
│   ├── css.css                 # All styles
│   └── scripts/
│       ├── preinit.js          # System pre-initialization
│       ├── preloader.js        # Script pre-loading
│       ├── base.js             # Core initialization
│       ├── ui.js               # Menu system
│       ├── bg.js               # Background rendering
│       ├── sounds.js           # Audio system
│       ├── power.js            # Startup/shutdown
│       ├── game.js             # Game loading
        ...
│       └── modules/            # Utility modules
│           ├── util.js
│           ├── protoplus.js
│           └── ...
├── subpages/
│   └── convertsave/            # Save file converter
└── misc/markdowns/             # Documentation
    ├── TODO.md
    ├── VERSIONING.md
    ├── AGENTS.md
    └── CMDS.md
```

### Key Directories

* **[`/src/scripts`](/src/scripts)** - Core JavaScript codebase. Modules are loaded dynamically via `preinit.js`.
* **[`/src/scripts/modules`](/src/scripts/modules)** - Reusable utility modules and third-party libraries.
* **[`/src/assets`](/src/assets)** - Fonts, icons, sounds, and other static resources.
* **[`/src/subpages`](/src/subpages)** - Standalone mini-apps that integrate with the console.
* **[`/misc/markdowns`](/misc/markdowns)** - Project documentation, TODOs, and specifications.
* **[`/vscode-extension`](/vscode-extension)** - Custom VS Code color themes based on Noema palettes.

---

## Development Guide

### Code Style
- **No build tools** - Write ES6+ JavaScript that runs directly in browsers
- **Tabs for indentation** - The linter auto-fixes formatting on commit
- **camelCase naming** - For variables and functions
- **Minimal comments** - Code should be self-documenting; comment only complex logic

### Common Tasks

#### Adding a Theme
1. Add to `bgColors` object in [`/src/scripts/bg.js`](/src/scripts/bg.js):
```javascript
"mytheme": {
    "top": "#color1",
    "bottom": "#color2",
    "accentColor": "#color3"
}
```
2. Add UI option in [`/src/scripts/ui.js`](/src/scripts/ui.js) (`themeTab` section)
3. Optional: Create matching VS Code theme in [`/vscode-extension/themes`](/vscode-extension/themes)

#### Adding a Preference
1. Set default in [`/src/scripts/preinit.js`](/src/scripts/preinit.js)
2. Create UI option in [`/src/scripts/ui.js`](/src/scripts/ui.js)
3. Store value in `localStorage`
4. Apply setting where needed

#### Adding UI Sounds
1. Place `.flac` file in [`/src/assets/sounds/menu`](/src/assets/sounds/menu)
2. Add filename to `sounds` array in [`/src/scripts/sounds.js`](/src/scripts/sounds.js)
3. Use `playSound('soundname')` to play

### Testing
Manual testing is required. Check:
- Keyboard navigation (WASD/Arrows)
- Gamepad support (if available)
- Settings persistence (Fast Reboot using UI selection)
- Disabled effect modes
- Different browsers
- Console for errors (the system already notifies you of errors via sound and a visual counter)

---

## Contributing

We welcome contributions! Please see [`/CONTRIBUTING.md`](/CONTRIBUTING.md) for detailed guidelines on:
- Code style and conventions
- Development workflow
- Pull request process
- Testing requirements
- Community guidelines

For architectural discussions and team workflows, see [`/COLLABORATION.md`](/COLLABORATION.md).

### Quick Contribution Guide
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly in browser
5. Submit a pull request with clear description

Small, focused PRs are reviewed faster. Open an issue first for major features.

---

## Feature Roadmap

Current priorities (see [`/misc/markdowns/TODO.md`](/misc/markdowns/TODO.md) for details):

**In Progress:**
- Game loading improvements (better sandboxing, NGP format support)
- Performance profiling and optimization

**Planned:**
- Profile management (save/load user profiles)
- Drag & drop support for save files
- Enhanced local vs hosted mode distinction
- Dynamic local updates via GitHub integration

**Future Considerations:**
- PRISM-specific features (separate organization repository)
- Expanded game library management
- Multiplayer/networking features

---

## Archived Roadmap

### Version 0.16.0 Goals
- Add basic NGP support (decompression, loading)
- Implement local game storage (localStorage, web links)
- Create APIs for game-related functions
- Build UI for game selection

### Version 0.17.0 Goals
- Polish game APIs
- Complete NGP format implementation

### NGP Architecture Notes (Proposed)
- Package format: ZIP-based
- Structure: `/assets` for resources, `/scripts` for code
- Entry point: `start.js` at package root

These are design notes from earlier discussions and may not reflect current implementation.

---

## VS Code Themes

The repository includes 18+ custom VS Code themes based on Noema's color palettes, including:
- **Cherry** - Pink/magenta dark theme
- **Frogleaf** - Green-based dark theme
- **Watermelon Sugar** - Pink and green gradient
- **Trans Flag**, **Bisexual Flag**, **Lesbian Flag**, **Gay Flag** - Pride themes
- And many more!

### Installation
1. Open [`/vscode-extension`](/vscode-extension) in VS Code
2. Press `F1` > `Developer: Reload Window`
3. Open Command Palette and select "Color Theme"
4. Choose any theme from the "Noema" category

Or package and install: `vsce package` then install the `.vsix` file.

---

## Resources

* [Contributing Guide](/CONTRIBUTING.md)
* [Collaboration Guidelines](/COLLABORATION.md)
* [TODO List](/misc/markdowns/TODO.md)
* [Versioning Specification](/misc/markdowns/VERSIONING.md)
* [Agent Instructions](/misc/markdowns/AGENTS.md)
* [Useful Commands](/misc/markdowns/CMDS.md)
* [Changelog](/src/assets/misc/CHANGELOG.md)

---

## License

This project is licensed under the **GNU Affero General Public License v3.0** (AGPL-3.0).

See the [LICENSE](/LICENSE) file for full terms.

By contributing to this project, you agree that your contributions will be licensed under the same terms.

---

## Acknowledgments

Project Noema is developed by the PRISM team with contributions from the open-source community.

Special thanks to all contributors who have helped improve the project through code, documentation, bug reports, and feedback.

---

**Questions?** Open an issue or check the documentation in [`/misc/markdowns`](/misc/markdowns).

**Want to contribute?** See [`/CONTRIBUTING.md`](/CONTRIBUTING.md) to get started.
