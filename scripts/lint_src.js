#!/usr/bin/env node
// Lint/fix rules for files under /src:
//  * indentation must use tabs or spaces in multiples of 4
//  * no mixed tabs and spaces at line start
//  * trailing whitespace is forbidden
// When run with "--fix" the script will remove trailing spaces and
// convert leading groups of 4 spaces into tabs; fixed files are staged.
// Third-party code in any "modules" directory is ignored.

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = path.resolve(__dirname, '../src');
// codex debugging stub and failsafe
let codexCalls = 0;
const MAX_CODEX_CALLS = 3;
function attemptCodexFix(filePath, lineNum, message) {
    if (codexCalls >= MAX_CODEX_CALLS) {
        console.log(`Codex limit reached (${MAX_CODEX_CALLS}), skipping fix for ${filePath}:${lineNum}`);
        return;
    }
    codexCalls++;
    console.log(`(codex) would attempt to fix ${filePath}:${lineNum} - ${message}`);
}

let hasError = false;          // set when unfixable problems occur
let fixedFiles = new Set();
const fix = true; // always auto-fix formatting issues
let fixableCount = 0;  // number of formatting corrections made

function lintFile(filePath) {
    // skip modules folder
    if (filePath.includes(path.sep + 'modules' + path.sep)) return;
    const rel = path.relative(root, filePath);
    const content = fs.readFileSync(filePath, 'utf8').split('\n');
    let changed = false;

    content.forEach((line, idx) => {
        const lineNum = idx + 1;
        // trailing whitespace
        if (/\s$/.test(line)) {
            if (fix) {
                content[idx] = line.replace(/\s+$/, '');
                changed = true;
                fixableCount++;
            } else {
                console.error(`${rel}:${lineNum}: trailing whitespace`);
                // formatting issue only, mark fixable but not fatal
                fixableCount++;
            }
        }

        // indentation check (skip CSS files since they use 2-space style)
        if (!filePath.endsWith('.css')) {
            const m = line.match(/^[ \t]*/);
            if (m) {
                const indent = m[0];
                if (indent.includes(' ') && indent.includes('\t')) {
                    console.error(`${rel}:${lineNum}: mixed tabs and spaces in indentation`);
                    // unfixable, fatal
                    hasError = true;
                    attemptCodexFix(filePath, lineNum, 'mixed tabs/spaces');
                }
                if (indent.includes(' ')) {
                    const count = indent.length;
                    if (count % 4 !== 0) {
                        if (fix) {
                            const tabs = '\t'.repeat(Math.floor(count / 4));
                            const remainder = count % 4;
                            content[idx] = tabs + ' '.repeat(remainder) + line.slice(count);
                            changed = true;
                            fixableCount++;
                        } else {
                            console.error(`${rel}:${lineNum}: indentation spaces not multiple of 4`);
                            fixableCount++;
                        }
                    }
                }
            }
        }
    });

    if (changed) {
        fs.writeFileSync(filePath, content.join('\n'));
        fixedFiles.add(filePath);
    }
}

function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const ent of entries) {
        if (ent.name.startsWith('.')) continue;
        const full = path.join(dir, ent.name);
        if (ent.isDirectory()) {
            if (ent.name === 'modules') continue;
            walk(full);
        } else if (/\.(js|html|css|json)$/.test(ent.name)) {
            lintFile(full);
        }
    }
}

walk(root);

if (fixedFiles.size > 0) {
    console.log('Auto-fixed formatting in:');
    fixedFiles.forEach(f => console.log('  ' + f));
    fixedFiles.forEach(f => {
        try { execSync(`git add "${f}"`); } catch (e) { /* ignore */ }
    });
}
if (fixableCount > 0) {
    console.log(`Auto-fixed ${fixableCount} formatting issue(s)`);
}
// exit non-zero only if an unfixable error occurred
if (hasError) {
    console.error('Lint failed due to unfixable issues.');
    if (codexCalls > 0) {
        console.log(`Codex was invoked ${codexCalls} time(s) this run.`);
    }
    process.exit(1);
}
