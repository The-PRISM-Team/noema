# AGENTS.md

## Useful commands
- Remove comments in all JSON files: `git grep -lP '(\/\/|\/\*)' -- '*.json' | xargs perl -0777 -pi -e 's/[[:space:]]*\/\/.*//g; s/\/\*.*?\*\///gs'`