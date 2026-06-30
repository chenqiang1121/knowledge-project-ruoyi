const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const pagesDir = path.join(root, 'src', 'pages');
const outputFile = path.join(root, 'src', 'services', 'pageLoaders.generated.ts');

function toPosix(value) {
  return value.replace(/\\/g, '/');
}

function walk(dir) {
  if (!fs.existsSync(dir)) {
    return [];
  }

  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === '.umi' || entry.name === '.umi-production') {
        return [];
      }
      return walk(fullPath);
    }
    if (entry.isFile() && entry.name.endsWith('.tsx')) {
      return [fullPath];
    }
    return [];
  });
}

const pageFiles = walk(pagesDir).sort();
const loaderLines = pageFiles.map((file) => {
  const relativePath = toPosix(path.relative(pagesDir, file));
  const importPath = `@/pages/${relativePath.replace(/\.tsx$/, '')}`;
  return `  '${relativePath}': () => import('${importPath}'),`;
});

const content = `import React from 'react';

export type PageLoader = () => Promise<{ default: React.ComponentType<any> }>;

export const pageLoaders: Record<string, PageLoader> = {
${loaderLines.join('\n')}
};
`;

fs.writeFileSync(outputFile, content, 'utf8');
console.log(`Generated ${toPosix(path.relative(root, outputFile))} with ${loaderLines.length} pages.`);
