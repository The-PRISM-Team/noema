(rework README later)
# Noema ODB Repo
This is the official repository for Project Noema's Open Developer Beta, used for the development of Noema v0.16.0 and v0.17.0, NGP (Noema Game Package) file format and NGCT (Noema Game Creation Tool).

# What is Noema?
Noema is a web-based game "console", designed to be runnable locally, and to work on mainly web-based devices like Chromebooks. Its UI is inspired by the PS3.

## Note for readers
You might like to read some of the documents at [`/misc/markdowns`](https://github.com/sophb-ccjt/noema/tree/main/misc/markdowns).

## Note for contributors:
All features should work when the page is opened locally and from the Vercel link.

---

# File System Organization:

`/src`: The files for Noema
`/src/assets`: Assets for Noema
`/src/assets/scripts`: Noema's JavaScript source code
`/src/assets/scripts/modules`: Helper modules for Noema

`/convertsave`: NSF (Noema Save File) converter (accessible through Noema)
`/misc`: Miscellaneous files, not for regular user-facing files.


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
the developer team for 0.17.0 will not be handpicked. (might change)

To join the developer team, email `sophb.code@proton.me` with either your GitHub username, a link to your GitHub profile, or a link to your biography site.
