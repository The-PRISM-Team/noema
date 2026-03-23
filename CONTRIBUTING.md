# Contributing to Project Noema

Thanks for your interest in contributing to Project Noema! This guide will help you get started with contributing to the browser-based game console platform.

## Quick Start

1. **Fork the repository** if you don't have write access
2. **Clone your fork** locally
3. **Open `src/index.html`** in a modern browser to test
4. **Make your changes** following the guidelines below
5. **Test thoroughly** in your browser
6. **Submit a pull request** with a clear description

## Code Style

The project uses a consistent code style enforced by an automatic linter:

- **Indentation**: Tabs (not spaces)
- **Naming**: camelCase for variables and functions
- **Formatting**: A pre-commit linter auto-fixes whitespace and indentation
- **Comments**: Add comments only when logic is non-obvious
- **No build step**: Write code that runs directly in modern browsers (ES6+)

The linter runs automatically on commit, so don't worry too much about formatting - it will be fixed for you.

## Development Workflow

### For External Contributors
1. Fork the repository on GitHub
2. Create a feature branch: `feature/your-feature-name` or `fix/bug-description`
3. Make your changes
4. Test in multiple browsers if possible
5. Open a pull request against `main`

### For Core Team Members
You may work directly on `main` for small fixes, but feature branches are encouraged for larger work.

## What to Work On

### Good First Issues
- Documentation improvements
- UI polish and visual refinements
- Sound effect additions
- Color theme additions (see `src/scripts/bg.js`)
- Bug fixes with clear reproduction steps
- Translation & localization
- Performance optimization on older and/or low-end devices

### Larger Features
For significant features (game loading, new APIs, architectural changes):
1. Open an issue first to discuss the approach
2. Get feedback from maintainers
3. Break work into smaller, reviewable PRs when possible

## Testing

There are no automated tests currently. Manual testing is expected:

### Manual Testing Checklist
- Test with keyboard navigation (WASD/Arrows)
- Test with gamepad if available
- Check that settings persist after page reload
- Test with effects disabled (`noShaders` and `noTransitions`)
- Verify audio works correctly
- Test on different screen sizes
- Check browser console for errors
- Test in LTR and RTL UI layouts

### Testing on Different Configurations
The app should work:
- Via `file://` protocol (open HTML directly)
- Via HTTP server (e.g., `npx serve`)
- Via Electron (Using the official `electron-start.js` provided in the repo)
- With effects enabled and disabled
- With animations enabled and disabled
- On high-end, low-end, and older devices (IE support is completely disregarded.)

## Code Organization

```
src/
├── index.html              # Main entry point
├── css.css                 # All styles
└── scripts/
    ├── preloader.js        # Script loading
    ├── preinit.js          # Core pre-initialization
    ├── base.js             # Core initialization
    ├── bg.js               # Background rendering
    ├── ui.js               # Menu system
    ├── sounds.js           # Audio system
    ...
    └── modules/            # Utility modules
        ├── util.js         # Helper functions
        ├── protoplus.js    # Prototype extensions
        └── ...
```

### Adding New Files
- Core features: `src/scripts/`
- Utilities and helpers: `src/scripts/modules/`
- Sounds: `src/assets/sounds/`
- Icons: `src/assets/icons/`
- Documentation: `misc/markdowns/`

## Pull Request Guidelines

### PR Description Should Include
- What problem does this solve?
- What changes were made?
- How to test the changes
- Screenshots/videos for UI changes
- Any breaking changes or migration notes

### PR Best Practices
- Keep PRs focused (one feature/fix per PR)
- Small PRs get reviewed faster
- Update documentation if needed
- Include manual testing notes
- Respond promptly to review feedback

### Example PR Template
```markdown
## Description
Adds a new color theme "Ocean Breeze"

## Changes
- Added theme to `bgColors` in `bg.js`
- Added theme selection in UI
- Created VS Code theme variant

## Testing
- Verified theme switches correctly
- Checked localStorage persistence
- Tested in Chrome and Firefox

## Screenshots
[Include screenshots showing the new theme]
```

## Common Contributions

### Adding a Color Theme
1. Add to `bgColors` object in `src/scripts/bg.js`
2. Add UI option in `src/scripts/ui.js` (`themeTab` section)
3. Optionally create VS Code theme in `vscode-extension/themes/`

### Adding UI Sounds
1. Place `.flac` file in `src/assets/sounds/menu/`
2. Add filename to `sounds` array in `src/scripts/sounds.js`
3. Use `playSound('name')` to play

### Adding Preferences
1. Set default in `src/scripts/preinit.js`
2. Create UI option in `src/scripts/ui.js`
3. Store in `localStorage`
4. Apply setting where needed

## Documentation

### When to Update Docs
- `README.md`: User-facing features or setup changes
- `CHANGELOG.md`: All changes (features, fixes, improvements)
- `AGENTS.md`: Developer guidelines or architectural changes
- Code comments: Complex algorithms or non-obvious logic

### Documentation Style
- Be concise and clear
- Use examples when helpful
- Keep technical jargon minimal in user docs
- Update version info when relevant

## Communication

### GitHub Issues
- Check existing issues before creating new ones
- Use clear, descriptive titles
- Include reproduction steps for bugs
- Add screenshots/videos when relevant

### Pull Request Discussions
- Be respectful and constructive
- Ask questions if requirements are unclear
- Explain your approach when requested
- Be open to feedback and iteration

### Getting Help
- Check `COLLABORATION.md` for review process details
- Ask questions in issue comments
- Email maintainer for urgent matters: `sophb.code@proton.me`
- Keep discussions in the repository when possible

## Code Review Process

### What Reviewers Look For
- Does it work as described?
- Does it follow project style?
- Is it properly tested?
- Are there any security concerns?
- Is documentation updated?

### After Review
- Address feedback promptly
- Ask for clarification if needed
- Push updates to the same PR branch
- Request re-review when ready

## Release Process

Releases follow semantic versioning (see `misc/markdowns/VERSIONING.md`):
- Major updates: Significant changes to look/feel/functionality
- Minor updates: New features or significant fixes
- Patch updates: Bug fixes and small improvements

Maintainers handle versioning and releases - contributors don't need to worry about this.

## License

By contributing, you agree that your contributions will be licensed under the project's GNU AGPL v3 license (see `LICENSE` file).

## Recognition

All contributors will be recognized in the project. Significant contributions may be highlighted in release notes.

## Questions?

If you have questions not covered here:
- Open a discussion issue
- Check `COLLABORATION.md` for more details
- Reach out to maintainers

Thank you for contributing to Project Noema!
