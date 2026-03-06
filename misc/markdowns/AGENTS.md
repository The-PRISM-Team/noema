# Agent Instructions

This document provides guidelines for AI coding agents working on Project Noema.

## General Principles

- Follow existing code style and conventions
- Maintain backward compatibility unless explicitly updating version
- Test changes manually before committing
- Keep changes focused and atomic

## Code Quality Standards

### JavaScript Style
- Use tabs for indentation (project uses tabs, not spaces)
- Follow existing naming conventions (camelCase for variables/functions)
- Add comments only when logic is non-obvious
- Avoid global state unless necessary
- Prefer functional patterns where appropriate

### File Organization
- Keep files focused on single responsibilities
- Use proper imports/exports between modules
- Place utility functions in `src/assets/scripts/modules/`
- Main application logic goes in `src/assets/scripts/`

### Browser Compatibility
- Code must work in modern browsers (ES6+)
- No transpilation or build steps
- Support both `file://` and HTTP(S) serving
- Test in multiple browsers when possible

## Common Tasks

### Adding New UI Options
1. Use `createOption()` for main tabs
2. Use `createSuboption()` for menu items
3. Register actions with proper error handling
4. Update localStorage for persistent settings
5. Test keyboard and gamepad navigation

### Modifying Preferences
- Always provide defaults in preinit.js
- Validate user input before storing
- Update UI immediately when settings change
- Consider performance impact of visual changes

### Working with Sounds
- Add sound files to `/src/assets/sounds/`
- Register in sounds array if UI sound
- Use `playSound()` API for UI feedback
- Respect user volume settings

## Git Workflow

### Committing Changes
- Write clear, descriptive commit messages
- Keep commits focused on single features/fixes
- Stage related files together
- Avoid committing debug code or console.logs

### Post-Implementation
After completing a task:
1. Review changes for quality and style
2. Test functionality manually
3. Commit with descriptive message
4. Note: Git operations are handled automatically

## Testing Guidelines

### Manual Testing Checklist
- Test with keyboard navigation
- Test with gamepad if applicable
- Verify localStorage persistence
- Check visual effects (if effects enabled)
- Test with animations disabled
- Verify audio playback
- Test on different screen sizes

### Common Edge Cases
- Fast key repeat rates
- Rapid setting changes
- Browser refresh during operation
- Missing localStorage values
- Disabled features (shaders, transitions)

## Performance Considerations

- Be mindful of `requestAnimationFrame` usage
- Avoid excessive DOM queries in loops
- Use event delegation where appropriate
- Cache DOM references when possible
- Consider deviceMemory for feature detection

## Security Guidelines

- Never commit API keys or secrets
- Validate all user input
- Sanitize data before localStorage
- Be careful with eval and dynamic code
- Use textContent instead of innerHTML for user data

## Documentation

- Update README.md for user-facing changes
- Update CHANGELOG.md for all changes
- Add comments for complex algorithms
- Document breaking changes clearly

## Common Pitfalls to Avoid

- Don't mix tabs and spaces
- Don't add dependencies without discussion
- Don't break existing localStorage format
- Don't remove features without deprecation
- Don't ignore browser console errors
- Don't commit commented-out code blocks
