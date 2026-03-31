# Project Noema TODO List

Tasks are listed in priority order (highest priority first).

## Completed

* Update README and create CONTRIBUTING.md
* Polish documentation files (AGENTS.md, CONTRIBUTING.md, README.md)
* Differentiate between local and hosted (Vercel) modes
* Move PRISM-specific code to separate organization repository

## In Progress

### Game Loading System
- Basic loader implemented in [`/src/scripts/loadGame.js`](/src/scripts/loadGame.js)
- Needs improvements:
  - Better sandboxing for security
  - NGP format decompression
  - Error handling and fallbacks
  - Loading progress indicators

### Performance Optimization
- Profile application to find bottlenecks
- Optimize spaghetti wave rendering
- Reduce DOM queries in hot paths
- Consider caching for frequently accessed elements
- Investigate frame drops on lower-end devices

## High Priority

### User Profiles
- Save/load user profile system
- Profile switching UI
- Export/import profiles
- Profile-specific settings and preferences

### Save File Management
- Drag and drop support for save files
- Visual save file browser in UI
- Save file metadata display
- Backup and restore functionality

## Medium Priority

### Platform Detection
- Environment-specific features and warnings
- Optimize for each deployment type (Vercel and `file://` protocol)

### Dynamic Updates
- Allow pointing to local Noema directory
- GitHub-based update checking
- Optional auto-update for development builds

### Game Library UI
- Visual game selection interface
- Game metadata display
- Search and filtering
- Favorites/collections

## General Bugs
- Fix shift key multiplier issue with fast key repeat rates


## Low Priority

### Code Organization
- Modularize large files for better maintainability
- Create proper module boundaries
- Document internal APIs

### Additional Features
- Screenshot capability
- Video recording of gameplay
- Social features (sharing, leaderboards)
- Cloud save sync (optional)

## Future Considerations

### Multiplayer Support
- Peer-to-peer networking
- Lobby system
- Matchmaking

### Developer Tools
- NGP creation toolkit
- Game debugging utilities
- Performance profiling for games

### Accessibility
- Screen reader support
- High contrast modes
- Keyboard-only navigation improvements
- Customizable controls

## Notes

- Keep tasks focused and achievable
- Update this file when starting/completing tasks
- Open issues for tasks that need discussion
- Break large features into smaller milestones

## How to Contribute

See a task you want to work on? Check [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines, then:
1. Open an issue to discuss approach (for larger features)
2. Create a feature branch
3. Implement and test
4. Submit a pull request

For questions about priorities or implementation details, open a discussion issue.
