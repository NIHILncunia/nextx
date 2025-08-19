import path from 'path';

export function generateIntermediatePaths(paths: string[]): Set<string> {
  const intermediatePaths = new Set<string>();
  for (const p of paths) {
    intermediatePaths.add(''); // Add root
    const pathSegments = p.split('/').filter((p): p is string => !!p);
    let currentPath = '';
    for (let i = 0; i < pathSegments.length - 1; i++) {
      const segment = pathSegments[i];
      if (segment) {
        currentPath = path.join(currentPath, segment);
        intermediatePaths.add(currentPath);
      }
    }
  }
  return intermediatePaths;
}

export function kebabToPascalCase(str: string): string {
  return str
    .split(/[-_\s/]+|(?=\[)|(?<=\])/)
    .filter(Boolean)
    .map(word => word.replace(/[\[\]]/g, ''))
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}