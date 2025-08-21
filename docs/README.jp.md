# nextx - 日本語ドキュメント

`nextx`は、Next.js (App Router) プロジェクトの初期ファイル構造生成を支援するシンプルで規格化された CLI ツールです。

このツールは、一貫したプロジェクト構造とルールに従って、ページ、API ルート、データエンティティのボイラープレートコードを素早く生成できるよう支援します。ファイル上書き保護、カスタムコンポーネント名指定、柔軟なパス生成オプションなど、様々な機能を提供します。

## インストール

`nextx`をグローバルで使用するには、npm または pnpm を通じてインストールしてください：

```bash
npm install -g @NIHILncunia/nextx
# または
pnpm add -g @NIHILncunia/nextx
```

**注意**: `nextx`は、現在のディレクトリ、親ディレクトリ、または pnpm モノレポワークスペース内で Next.js プロジェクト（`next.config.js`がある場所）を自動的に見つけます。特定のパスを指定したい場合は、設定ファイルを使用できます。

### プロジェクト初期化

`nextx`を使用する前に、まずプロジェクトを初期化する必要があります：

```bash
nextx init
```

このコマンドは以下の作業を実行します：

- `nextx.config.json`設定ファイルの作成
- 必要なユーティリティ関数（`cn`、`Api`クラスなど）の生成
- 共通エンティティファイルの作成
- 必須依存関係パッケージの自動インストール

---

## 設定 (Configuration)

`nextx`は設定なしでもすぐに使用できますが、設定ファイルを通じてプロジェクト構造に合わせて基本動作を詳細に設定できます。

### 設定ファイル

プロジェクトルートに`nextx.config.ts`、`nextx.config.js`、または`nextx.config.json`ファイルを作成して、各生成物の基本パスを上書きできます。CLI は`.ts`、`.js`、`.json`の順序でファイルを探索します。

**`nextx.config.ts`例（推奨）:**

```typescript
// nextx.config.ts
export default {
  lang: "jp", // 'ko' | 'en' | 'jp'
  useSrc: false, // srcディレクトリ使用有無
  componentInRoute: true, // コンポーネントをルート内部に生成
  componentCategory: false, // 共有コンポーネントをグループ別に分類
  aliases: {
    app: "app",
    entities: "app/_entities",
    components: "components", // 共有コンポーネントパス
    libs: "app/_libs",
  },
};
```

**`nextx.config.json`例:**

```json
{
  "lang": "jp",
  "useSrc": false,
  "componentInRoute": true,
  "componentCategory": false,
  "aliases": {
    "app": "app",
    "entities": "app/_entities",
    "components": "app/_components",
    "libs": "app/_libs"
  }
}
```

**オプション:**

- `lang`: CLI メッセージ言語を設定します。（`ko`、`en`、`jp`対応）デフォルト: `"ko"`。
- `useSrc`: `src`ディレクトリ使用有無を設定します。デフォルト: `false`。
- `componentInRoute`: コンポーネントをルートパス内（`_components`）に生成するかどうかを設定します。デフォルト: `true`。
- `componentCategory`: `componentInRoute`が`false`の場合、共有コンポーネントをグループ別に分類するかどうかを設定します。デフォルト: `false`。
- `aliases.app`: Next.js の`app`ディレクトリパスを指定します。デフォルト: `"app"`。
- `aliases.entities`: `entity`コマンドで生成されるファイルのルートパスを指定します。デフォルト: `"app/_entities"`。
- `aliases.components`: 共有コンポーネントディレクトリパスを指定します。デフォルト: `"app/_components"`。
- `aliases.libs`: ライブラリファイルのパスを指定します。デフォルト: `"app/_libs"`。

### モノレポ(Monorepo) サポート

- **自動検出**: 設定ファイルがない場合、`nextx`は`pnpm-workspace.yaml`ファイルの存在を確認して自動的に pnpm モノレポ構造を検出します。
- **自動パス探索**: モノレポ環境が検出されると、`pnpm-workspace.yaml`で定義されたパッケージパス（`apps/*`、`packages/*`など）を巡回して`next.config.js`がある Next.js プロジェクトを自動的に見つけ出します。
- したがって、モノレポのルートディレクトリやサブパッケージディレクトリなど、どこで`nextx`コマンドを実行しても、CLI は正しい Next.js プロジェクトにファイルを生成します。

---

## 使用方法

### `nextx init`

プロジェクトを初期化し、必要な設定ファイルとユーティリティ関数を生成します。

**形式**

```bash
nextx init [options]
```

- `[options]`:
  - `-f, --force`: 既存の設定ファイルを上書きします

**例**

```bash
# プロジェクト初期化
$ nextx init

# 既存の設定ファイル上書き
$ nextx init --force
```

**生成されるファイル**

```
app/
├── _libs/
│   ├── cn.ts
│   ├── tools/
│   │   └── axios.tools.ts
│   └── index.ts
└── _entities/
    └── common/
        ├── common.types.ts
        ├── common.keys.ts
        ├── common.store.ts
        ├── process.d.ts
        ├── react-query.d.ts
        └── hooks/
            ├── index.ts
            ├── use-done.ts
            ├── use-loading.ts
            └── api/
                ├── use-get.ts
                ├── use-post.ts
                ├── use-patch.ts
                ├── use-put.ts
                └── use-delete.ts
```

**自動インストールされるパッケージ**

- `@tanstack/react-query`
- `@lukemorales/query-key-factory`
- `axios`
- `class-variance-authority`
- `clsx`
- `tailwind-merge`
- `@tanstack/react-query-devtools` (devDependencies)

### `nextx page`

新しいページルートと関連コンポーネントを生成します。

**形式**

```bash
nextx page <group> <paths...> [options]
```

- `<group>`: ページが属するルートグループです。`app/(<group>)/...`の形でディレクトリが作成されます。
- `<paths...>`: 生成するページのパスです。複数のパスを同時に指定でき、`posts/[id]`のような動的ルートもサポートします。
- `[options]`:
  - `-a, --all`: 指定されたパスのすべての親パスにページを一緒に生成します。
  - `-r, --root`: グループの最上位パスにもページを生成します。
  - `-f, --force`: ファイルが既に存在しても強制的に上書きします。
  - `-c, --component <names...>`: 生成されるパスに順番に適用するコンポーネント名を指定します。

**例**

```bash
# postsグループに動的詳細ページ生成
$ nextx page posts posts/[id]

# 中間パスのみにページ生成（グループルート除く）
$ nextx page common test/new --all

# グループルートと指定されたパスにページ生成
$ nextx page common test/new --root

# すべてのパスにページ生成（既存の--all動作）
$ nextx page common test/new --all --root

# カスタムコンポーネント名指定
$ nextx page posts list detail --component PostList PostDetail

# 強制上書き
$ nextx page posts list --force
```

**結果**

```
app/
└── (posts)/
    └── posts/
        └── [id]/
            ├── _components/
            │   └── PostsDetail.tsx
            └── page.tsx
```

**設定による異なる結果例:**

```typescript
// nextx.config.ts
export default {
  useSrc: true,
  componentInRoute: false,
  componentCategory: true,
  aliases: {
    app: "app",
    components: "components",
  },
};
```

上記設定で`nextx page posts list`実行時：

```
src/
├── app/
│   └── (posts)/
│       └── list/
│           └── page.tsx
└── components/
    └── posts/
        └── PostList.tsx
```

**オプション動作比較**

`nextx page common test/new`コマンドを基準としたオプションによる動作：

| コマンド                    | 生成されるパス                            |
| :-------------------------- | :---------------------------------------- |
| `... test/new`              | `test/new`                                |
| `... test/new --all`        | `test`, `test/new`                        |
| `... test/new --root`       | `''` (グループルート), `test/new`         |
| `... test/new --all --root` | `''` (グループルート), `test`, `test/new` |

**ファイル上書き保護**

デフォルトでは、生成しようとする場所にファイルが既に存在する場合、CLI はユーザーに上書き確認を求めます：

```bash
$ nextx page posts list
# ファイルが既に存在する場合：
'app/(posts)/list/page.tsx'ファイルは既に存在します。上書きしますか？ (y/N)
```

- `y`を入力するとファイルが上書きされます。
- `N`または Enter を押すとファイル生成をスキップします。
- `--force`オプションを使用すると確認なしで強制的に上書きします。

**CLI 出力形式**

すべてのコマンドは一貫した出力形式に従います：

```bash
🚀 新しいページ生成を開始します...

  - プロジェクトパス: /path/to/project
  - アプリディレクトリ: app
  - グループ: posts
  - パス: list, detail

✅ PostList.tsx生成完了. (app/(posts)/list/_components/PostList.tsx)
✅ page.tsx生成完了. (app/(posts)/list/page.tsx)
✅ PostDetail.tsx生成完了. (app/(posts)/detail/_components/PostDetail.tsx)
✅ page.tsx生成完了. (app/(posts)/detail/page.tsx)

🎉 すべての作業が正常に完了しました！
```

### `nextx api`

新しい API ルートハンドラー（`route.ts`）を生成します。

**形式**

```bash
nextx api <category> [paths...] [options]
```

- `<category>`: API の論理的分類です。`app/api/<category>/...`の形でディレクトリが作成されます。
- `[paths...]`: 生成する API エンドポイントパスです。省略時はカテゴリ最上位に生成されます。
- `[options]`:
  - `-a, --all`: パスのすべての親ディレクトリにも API ルートを一緒に生成します。

**例**

```bash
# 'auth'カテゴリにログインAPI生成
$ nextx api auth login
```

**結果**

```
app/
└── api/
    └── auth/
        └── login/
            └── route.ts
```

### `nextx entity`

データ状態管理のためのファイル（Query キー、Zustand ストア、タイプなど）を生成します。

**形式**

```bash
nextx entity <name>
```

- `<name>`: 生成するエンティティの名前です。（`user-profile`、`post`など）
- `common`を名前として使用すると、複数のエンティティで共有使用するデータ管理ロジック（カスタムフックなど）が生成されます。

**例 1: `user-profile`エンティティ生成**

```bash
$ nextx entity user-profile
```

**結果**（`nextx.config.json`の`aliases.entities`パスに生成）

```
app/_entities/
└── user-profile/
    ├── hooks/
    │   └── index.ts
    ├── user-profile.keys.ts
    ├── user-profile.store.ts
    └── user-profile.types.ts
```

**例 2: 共有エンティティファイル生成**

```bash
$ nextx entity common
```

**結果**

```
app/_entities/
└── common/
    ├── common.keys.ts
    ├── common.store.ts
    ├── common.types.ts
    ├── process.d.ts
    ├── react-query.d.ts
    └── hooks/
        ├── index.ts
        ├── use-done.ts
        ├── use-loading.ts
        └── api/
            ├── use-delete.ts
            ├── use-get.ts
            ├── use-patch.ts
            ├── use-post.ts
            └── use-put.ts
```

### `nextx config`

`nextx`の設定を確認または変更します。

**形式**

```bash
nextx config <get|set> <key> [value]
```

- `get <key>`: 現在の設定値を確認します。
- `set <key> <value>`: 設定値を変更します。このコマンドは`nextx.config.json`ファイルのみ修正できます。

現在サポートされている`<key>`は`lang`のみです。

**例**

```bash
# 現在設定されている言語確認
$ nextx config get lang
lang: jp

# 言語を英語に変更
$ nextx config set lang en
✅ 設定が正常に変更されました: lang = en
```

---

## ライセンス

MIT
