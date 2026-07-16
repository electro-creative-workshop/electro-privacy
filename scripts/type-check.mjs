import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const roots = ['src', 'test'];
const explicitFiles = ['webpack.config.js', 'vitest.config.js', 'eslint.config.mjs'];
const extensions = new Set(['.js', '.mjs', '.cjs']);

function collectFiles(dir) {
    const entries = readdirSync(dir, { withFileTypes: true });
    const files = [];

    for (const entry of entries) {
        const fullPath = join(dir, entry.name);

        if (entry.isDirectory()) {
            files.push(...collectFiles(fullPath));
            continue;
        }

        if (!entry.isFile()) {
            continue;
        }

        const ext = fullPath.slice(fullPath.lastIndexOf('.'));
        if (extensions.has(ext)) {
            files.push(fullPath);
        }
    }

    return files;
}

const filesToCheck = [];
for (const root of roots) {
    try {
        if (statSync(root).isDirectory()) {
            filesToCheck.push(...collectFiles(root));
        }
    } catch {
        // Ignore missing roots.
    }
}

for (const file of explicitFiles) {
    try {
        if (statSync(file).isFile()) {
            filesToCheck.push(file);
        }
    } catch {
        // Ignore missing files.
    }
}

let failed = false;
for (const file of filesToCheck) {
    const result = spawnSync(process.execPath, ['--check', file], {
        stdio: 'inherit',
    });

    if (result.status !== 0) {
        failed = true;
    }
}

if (failed) {
    process.exit(1);
}

console.log(`Syntax check passed for ${filesToCheck.length} files.`);
