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
* The codebase has no automated tests, package manager, or linter; please maintain consistent formatting when contributing.

For background information, see the documents under `misc/markdowns`.

---

## Collaboration

See `COLLABORATION.md` for guidelines on how to work with the code, preferred branching/commit practices, and how to get involved.

---

## Additional resources

* [Design notes and TODOs](misc/markdowns/TODO.md)
* [Versioning system](misc/markdowns/VERSIONING.md)
* [Agent instructions](misc/markdowns/AGENTS.md)
* [Useful shell commands](misc/markdowns/CMDS.md)

---

## License

This project is licensed under the terms of the [LICENSE](LICENSE) file.


---

