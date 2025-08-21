export const en = {
  common: {
    error: '\n❌ An error occurred:',
    allOptionDetected: '\nℹ️  --all option detected. Creating pages for all parent paths.',
    success: '\n🎉 All tasks completed successfully!',
    projectPath: (path: string) => `  - Project path: ${path}`,
  },
  errors: {
    projectNotFound: '\n❌ Could not find a Next.js project.',
    projectNotFoundHint: '   Please make sure a Next.js project exists in the current directory or in the monorepo workspace.',
    pnpmWorkspaceError: '❌ Error processing pnpm-workspace.yaml:',
    configParseError: (fileName: string) => `❌ Error reading or processing ${fileName}:`,
  },
  page: {
    start: '\n🚀 Starting to create a new page...', 
    group: (group: string) => `  - Group: ${group}`,
    path: (path: string) => `  - Path: ${path}`,
    appDir: (path: string) => `  - App directory: ${path}`,
    srcDirectory: (enabled: boolean) => `  - Using src directory: ${enabled ? 'Yes' : 'No'}`,
    componentLocation: (location: string) => `  - Component location: ${location}`,
    componentCategory: (enabled: boolean) => `  - Component categorization: ${enabled ? 'Yes' : 'No'}`,
    skipRoot: (group: string) => `\nℹ️  Skipping page creation at the root of the '${group}' group.`,
    createFile: (fileName: string, path: string) => `✅ ${fileName} created successfully. (${path})`,
    componentNameCountMismatch: (expected: number, actual: number) => `\n❌ The number of component names does not match the number of paths to be created. (Expected: ${expected}, Provided: ${actual})`,
    overwritePrompt: (filePath: string) => `The file '${filePath}' already exists. Do you want to overwrite it? (y/N) `,
    skipFile: (fileName: string) => `⏭️  Skipping file creation: ${fileName}`,
  },
  api: {
    start: '\n🚀 Starting to create a new API route...', 
    category: (category: string) => `  - Category: ${category}`,
    path: (path: string) => `  - Path: ${path}`,
    appDir: (path: string) => `  - App directory: ${path}`,
    createFile: (fileName: string, path: string) => `✅ ${fileName} created successfully. (${path})`,
  },
  entity: {
    start: (name: string) => `\n🚀 Starting to create new entity '${name}'...`,
    entityPath: (path: string) => `  - Entity path: ${path}`,
    createFile: (fileName: string, path: string) => `✅ ${fileName} created successfully. (${path})`,
  },
  config: {
    description: 'Check or modify nextx configuration.',
    get: {
      description: 'Check a configuration value. (currently only `lang` is supported)',
    },
    set: {
      description: 'Change a configuration value. (currently only `lang` is supported)',
      success: (key: string, value: string) => `✅ Configuration changed successfully: ${key} = ${value}`,
      error: 'An error occurred while modifying the configuration file:',
    },
    common: {
      unknownKey: (key: string) => `Unknown configuration key: ${key}`,
      manualEdit: 'Error: `nextx.config.ts` or `.js` files must be edited manually.',
    },
  },
};