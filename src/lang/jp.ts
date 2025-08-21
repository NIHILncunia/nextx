export const jp = {
  common: {
    error: '\n❌ エラーが発生しました:',
    allOptionDetected: '\nℹ️  --all オプションが検出されました。すべての親パスのページを作成します。',
    success: '\n🎉 すべてのタスクが正常に完了しました！',
    projectPath: (path: string) => `  - プロジェクトパス: ${path}`,
  },
  errors: {
    projectNotFound: '\n❌ Next.js プロジェクトが見つかりませんでした。',
    projectNotFoundHint: '   現在のディレクトリまたはモノレポのワークスペースにNext.jsプロジェクトが存在することを確認してください。',
    pnpmWorkspaceError: '❌ pnpm-workspace.yaml の処理中にエラーが発生しました:',
    configParseError: (fileName: string) => `❌ ${fileName} の読み込みまたは処理中にエラーが発生しました:`,
  },
  page: {
    start: '\n🚀 新しいページの作成を開始します...', 
    group: (group: string) => `  - グループ: ${group}`,
    path: (path: string) => `  - パス: ${path}`,
    appDir: (path: string) => `  - Appディレクトリ: ${path}`,
    skipRoot: (group: string) => `
ℹ️  '${group}' グループのルートにはページを作成しないため、スキップします。`,
    createFile: (fileName: string, path: string) => `✅ ${fileName} の作成が完了しました。(${path})`,
    componentNameCountMismatch: (expected: number, actual: number) => `
❌ コンポーネント名の数が作成されるパスの数と一致しません。 (必要: ${expected}, 提供: ${actual})`,
    overwritePrompt: (filePath: string) => `ファイル '${filePath}' は既に存在します。上書きしますか？ (y/N) `,
    skipFile: (fileName: string) => `⏭️  ファイル作成をスキップします: ${fileName}`,
  },
  api: {
    start: '\n🚀 新しいAPIルートの作成を開始します...', 
    category: (category: string) => `  - カテゴリ: ${category}`,
    path: (path: string) => `  - パス: ${path}`,
    appDir: (path: string) => `  - Appディレクトリ: ${path}`,
    createFile: (fileName: string, path: string) => `✅ ${fileName} の作成が完了しました。(${path})`,
  },
  entity: {
    start: (name: string) => `\n🚀 新しいエンティティ '${name}' の作成を開始します...`,
    entityPath: (path: string) => `  - エンティティパス: ${path}`,
    createFile: (fileName: string, path: string) => `✅ ${fileName} の作成が完了しました。(${path})`,
  },
  config: {
    description: 'nextx の設定を確認または変更します。',
    get: {
      description: '設定値を確認します。（現在 `lang` のみ対応）',
    },
    set: {
      description: '設定値を変更します。（現在 `lang` のみ対応）',
      success: (key: string, value: string) => `✅ 設定が正常に変更されました: ${key} = ${value}`,
      error: '設定ファイルの変更中にエラーが発生しました:',
    },
    common: {
      unknownKey: (key: string) => `不明な設定キーです: ${key}`,
      manualEdit: 'エラー: `nextx.config.ts` または `.js` ファイルは手動で編集する必要があります。',
    },
  },
};