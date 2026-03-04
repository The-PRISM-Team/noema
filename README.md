# Project Noema

This repository contains the source code for **Project Noema** – a web‑based game “console” that runs entirely in the browser, with a user interface inspired by the PlayStation 3. The project is intended to function locally as well as when hosted on Vercel, and it supports loading and running games packaged in the custom NGP (Noema Game Package) format.

The code here powers the Open Developer Beta (ODB) builds such as versions `v0.16.0` and `v0.17.0`. Future releases will continue to follow the versioning rules laid out in `/misc/markdowns/VERSIONING.md`.

---

## Repository layout

```
/                
  README.md      
  LICENSE
  electron-start.js
  jsconfig.json   
  /src            
    index.html
    css.css
    /assets
      /fonts
      /icons
      /logos
      /misc/CHANGELOG.md
      /scripts
        base.js
        bg.js
        …
        /modules    
  /subpages       
    /convertsave
      index.html
      main.js
  /misc/markdowns 
```

### Key areas

* **`src/assets/scripts`** – primary JavaScript codebase. Modules are loaded dynamically via `start.js` and `preinit.js`.
* **`subpages`** – additional mini‑apps that integrate with the main console; currently only a save‑file converter.
* **`misc/markdowns`** – contains project documentation such as TODO lists, commands, and versioning specs.

---

## Getting started

The project does not use a build system; opening `src/index.html` in a browser is sufficient to run the console. To develop:

1. Clone the repository and open the workspace in VS Code.
2. Edit files under `src/assets/scripts` and reload the page in the browser.
3. Use the browser devtools console for debugging.

> **Note:** all game‑related functionality should work both when served via a web server and when opened as a local file (`file://`).

---

## Development notes

* JavaScript is written in plain ES5/ES6; there is no transpilation step.
* Modules in `/src/assets/scripts/modules` are included by `preinit.js` or at runtime by the core scripts.
* The codebase has no automated tests or package manager; formatting is automatically enforced by a pre-commit lint workflow, so just write reasonably consistent code and the tooling will handle the rest.
* A set of **Noema color themes** is provided via a VSCode extension.  All palettes defined in `src/assets/scripts/bg.js` are included, grouped under the "Noema" category. See the `vscode-extension/themes` folder for details.

For background information, see the documents under `misc/markdowns`.

---

## Collaboration

See `COLLABORATION.md` for guidelines on how to work with the code, preferred branching/commit practices, and how to get involved.

---

## Feature Roadmap

This project maintains a lightweight roadmap of planned and in-progress features. These are short, actionable goals rather than strict milestones.

- Improve game loading and sandboxing (better NGP loading, secure execution)
- Profiling and performance optimizations to address frame drops and CPU usage
- Profile management (save/load user profiles, preferences)
- Drag & drop support for importing save files into the UI
- Better distinction between local and hosted (Vercel) modes, with environment-aware behavior
- Dynamic local updates: optionally point the app at a local directory or a GitHub directory for iterative development
- Publish PRISM‑specific assets and move PRISM code to a dedicated organization repository

Roadmap items are tracked in `misc/markdowns/TODO.md`. If you want to work on any of these, open an issue or create a PR describing the intended approach.

---

## Additional resources

* [Design notes and TODOs](misc/markdowns/TODO.md)
* [Versioning system](misc/markdowns/VERSIONING.md)
* [Agent instructions](misc/markdowns/AGENTS.md)
* [Useful shell commands](misc/markdowns/CMDS.md)

## Custom VS Code themes

This repository includes a minimal VS Code extension in `vscode-extension/` that
provides two colour themes:

* **Cherry** — a medium‑contrast dark theme built around pink/magenta tones.
* **Frogleaf** — another dark theme whose palette is derived from Noema's
  "frogleaf" background colour set (`#14881d`, `#42ff2a`, `#52ff4c`).

To use them:

1. Open the `vscode-extension` folder in VS Code (or run `code --install-extension vscode-extension` from the workspace root).
2. Press `F1` > `Developer: Reload Window` (or restart) so the themes are registered.
3. Open the Command Palette and type `Color Theme` to select either Cherry or Frogleaf.

You can also package and publish the extension using [`vsce`](https://code.visualstudio.com/api/working-with-extensions/publishing-extension).

---

## License

This project is licensed under the terms of the [LICENSE](LICENSE) file.


---

