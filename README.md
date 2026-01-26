# Noema ODB Repo
This is the official repository for Project Noema's Open Developer Beta, used for the development of Noema v0.16.0 and v0.17.0, NGP (Noema Game Package) file format and NGCT (Noema Game Creation Tool).

# What is Noema?
Noema is a web-based game "console", designed to be runnable locally, and to work on mainly web-based devices like Chromebooks.

---

# Plan for 0.16.0
- Add basic support for NGPs (decompression, loading, etc.)
- Add local game storing (folder, localStorage and web links, etc)
- Add APIs to all game-related functions
- Add UI for game selection and others

# Plan for 0.17.0
- Polish game APIs and UI
- Finish support for NGPs

# NGP Architecture
- Packaged using ZIP
- Game assets go to `/assets` folder (images, sounds, animations, etc.)
- Game code goes to `/scripts` folder
- `start.js` file in the root of the ZIP folder
- The `start.js` file adds all scripts and modules of the game by injecting them into the document. 

---

# Deadline
There's no specific deadline, the only requirement is finishing this in 2026.

# Notice
The developer team for 0.16.0 will be handpicked,
the developer team for 0.17.0 will not be handpicked.
