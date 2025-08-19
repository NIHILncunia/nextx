export function kebabToPascalCase(str: string): string {
  return str
    .split(/[-_\s/]+|(?=\[)|(?<=\])/)
    .filter(Boolean)
    .map(word => word.replace(/[\[\]]/g, ''))
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}