# nextx

`nextx`는 Next.js (App Router) 프로젝트의 초기 파일 구조 생성을 돕는 간단하고 규격화된 CLI 도구입니다.

이 도구는 일관된 프로젝트 구조와 규칙을 따라 페이지, API 라우트, 데이터 엔티티의 보일러플레이트 코드를 빠르게 생성할 수 있도록 도와줍니다. 파일 덮어쓰기 보호, 커스텀 컴포넌트 이름 지정, 유연한 경로 생성 옵션 등 다양한 기능을 제공합니다.

## 설치

`nextx`를 전역으로 사용하려면 npm 또는 pnpm을 통해 설치하세요:

```bash
npm install -g @NIHILncunia/nextx
# 또는
pnpm add -g @NIHILncunia/nextx
```

**참고**: `nextx`는 현재 디렉토리, 상위 디렉토리, 또는 pnpm 모노레포 작업 공간 내에서 Next.js 프로젝트(`next.config.js`가 있는 위치)를 자동으로 찾습니다. 특정 경로를 지정하고 싶다면 설정 파일을 사용할 수 있습니다.

---

## 설정 (Configuration)

`nextx`는 별도의 설정 없이도 바로 사용할 수 있지만, 설정 파일을 통해 프로젝트 구조에 맞게 기본 동작을 상세하게 설정할 수 있습니다.

### 설정 파일

프로젝트 루트에 `nextx.config.ts`, `nextx.config.js`, 또는 `nextx.config.json` 파일을 생성하여 각 생성물의 기본 경로를 재정의할 수 있습니다. CLI는 `.ts`, `.js`, `.json` 순서로 파일을 탐색합니다.

**`nextx.config.ts` 예시 (권장):**

```typescript
// nextx.config.ts
export default {
  lang: "ko", // 'ko' | 'en' | 'jp'
  aliases: {
    app: "src/app",
    entities: "src/core/entities",
  },
};
```

**`nextx.config.json` 예시:**

```json
{
  "lang": "ko",
  "aliases": {
    "app": "src/app",
    "entities": "src/core/entities"
  }
}
```

**옵션:**

- `lang`: CLI 메시지 언어를 설정합니다. (`ko`, `en`, `jp` 지원) 기본값은 `"ko"` 입니다.
- `aliases.app`: Next.js의 `app` 디렉토리 경로를 지정합니다. 기본값은 `"app"` 입니다.
- `aliases.entities`: `entity` 명령어로 생성되는 파일들의 루트 경로를 지정합니다. 기본값은 `"app/_entities"` 입니다.

### 모노레포(Monorepo) 지원

- **자동 감지**: 설정 파일이 없는 경우, `nextx`는 `pnpm-workspace.yaml` 파일의 존재 여부를 확인하여 자동으로 pnpm 모노레포 구조를 감지합니다.
- **자동 경로 탐색**: 모노레포 환경이 감지되면, `pnpm-workspace.yaml`에 정의된 패키지 경로(`apps/*`, `packages/*` 등)를 순회하며 `next.config.js`가 있는 Next.js 프로젝트를 자동으로 찾아냅니다.
- 따라서, 모노레포의 루트 디렉토리나 하위 패키지 디렉토리 등 어디에서 `nextx` 명령어를 실행하더라도, CLI는 올바른 Next.js 프로젝트에 파일을 생성합니다.

---

## 사용법

### `nextx page`

새로운 페이지 라우트와 관련 컴포넌트를 생성합니다.

**형식**

```bash
nextx page <group> <paths...> [options]
```

- `<group>`: 페이지가 속할 라우트 그룹입니다. `app/(<group>)/...` 형태로 디렉토리가 생성됩니다.
- `<paths...>`: 생성할 페이지의 경로입니다. 여러 경로를 동시에 지정할 수 있으며, `posts/[id]`와 같은 동적 라우트도 지원합니다.
- `[options]`:
  - `-a, --all`: 입력된 경로의 모든 중간 경로에 페이지를 함께 생성합니다 (그룹 루트 제외)
  - `-r, --root`: 그룹의 최상위 경로에도 페이지를 생성합니다
  - `-f, --force`: 파일이 이미 있어도 강제로 덮어씁니다
  - `-c, --component <names...>`: 생성될 경로에 순서대로 적용할 컴포넌트 이름을 지정합니다

**예시**

```bash
# posts 그룹에 동적 상세 페이지 생성
$ nextx page posts posts/[id]

# 중간 경로들에만 페이지 생성 (그룹 루트 제외)
$ nextx page common test/new --all

# 그룹 루트와 명시된 경로에 페이지 생성
$ nextx page common test/new --root

# 모든 경로에 페이지 생성 (기존 --all 동작)
$ nextx page common test/new --all --root

# 커스텀 컴포넌트 이름 지정
$ nextx page posts list detail --component PostList PostDetail

# 강제 덮어쓰기
$ nextx page posts list --force
```

**결과**

```
app/
└── (posts)/
    └── posts/
        └── [id]/
            ├── _components/
            │   └── PostsDetail.tsx
            └── page.tsx
```

**옵션 동작 비교**

`nextx page common test/new` 명령어를 기준으로 옵션에 따른 동작:

| 명령어                      | 생성되는 경로                        |
| :-------------------------- | :----------------------------------- |
| `... test/new`              | `test/new`                           |
| `... test/new --all`        | `test`, `test/new`                   |
| `... test/new --root`       | `''` (그룹 루트), `test/new`         |
| `... test/new --all --root` | `''` (그룹 루트), `test`, `test/new` |

**파일 덮어쓰기 보호**

기본적으로 생성하려는 위치에 파일이 이미 존재하면, CLI는 사용자에게 덮어쓰기 여부를 확인합니다:

```bash
$ nextx page posts list
# 파일이 이미 존재하는 경우:
'app/(posts)/list/page.tsx' 파일이 이미 존재합니다. 덮어쓰시겠습니까? (y/N)
```

- `y`를 입력하면 파일이 덮어써집니다
- `N` 또는 Enter를 누르면 파일 생성을 건너뜁니다
- `--force` 옵션을 사용하면 확인 없이 강제로 덮어씁니다

**CLI 출력 형식**

모든 명령어는 일관된 출력 형식을 따릅니다:

```bash
🚀 새 페이지 생성을 시작합니다...

  - 프로젝트 경로: /path/to/project
  - 앱 디렉토리: app
  - 그룹: posts
  - 경로: list, detail

✅ PostList.tsx 생성 완료. (app/(posts)/list/_components/PostList.tsx)
✅ page.tsx 생성 완료. (app/(posts)/list/page.tsx)
✅ PostDetail.tsx 생성 완료. (app/(posts)/detail/_components/PostDetail.tsx)
✅ page.tsx 생성 완료. (app/(posts)/detail/page.tsx)

🎉 모든 작업이 성공적으로 완료되었습니다!
```

### `nextx api`

새로운 API 라우트 핸들러(`route.ts`)를 생성합니다.

**형식**

```bash
nextx api <category> [paths...] [options]
```

- `<category>`: API의 논리적 분류입니다. `app/api/<category>/...` 형태로 디렉토리가 생성됩니다.
- `[paths...]`: 생성할 API 엔드포인트 경로입니다. 생략 시 카테고리 최상위에 생성됩니다.
- `[options]`:
  - `-a, --all`: 경로의 모든 부모 디렉토리에도 API 라우트를 함께 생성합니다.

**예시**

```bash
# 'auth' 카테고리에 로그인 API 생성
$ nextx api auth login
```

**결과**

```
app/
└── api/
    └── auth/
        └── login/
            └── route.ts
```

### `nextx entity`

데이터 상태 관리를 위한 파일들(Query 키, Zustand 스토어, 타입 등)을 생성합니다.

**형식**

```bash
nextx entity <name>
```

- `<name>`: 생성할 엔티티의 이름입니다. (`user-profile`, `post` 등)
- `common`을 이름으로 사용하면, 여러 엔티티에서 공용으로 사용할 데이터 관리 로직(커스텀 훅 등)이 생성됩니다.

**예시 1: `user-profile` 엔티티 생성**

```bash
$ nextx entity user-profile
```

**결과** (`nextx.config.ts`의 `aliases.entities` 경로에 생성)

```
src/core/entities/
└── user-profile/
    ├── hooks/
    │   └── index.ts
    ├── user-profile.keys.ts
    ├── user-profile.store.ts
    └── user-profile.types.ts
```

**예시 2: 공용 엔티티 파일 생성**

```bash
$ nextx entity common
```

**결과**

```
src/core/entities/
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

`nextx`의 설정을 확인하거나 변경합니다.

**형식**

```bash
nextx config <get|set> <key> [value]
```

- `get <key>`: 현재 설정 값을 확인합니다.
- `set <key> <value>`: 설정 값을 변경합니다. 이 명령어는 `nextx.config.json` 파일만 수정할 수 있습니다.

현재 지원되는 `<key>`는 `lang` 뿐입니다.

**예시**

```bash
# 현재 설정된 언어 확인
$ nextx config get lang
lang: ko

# 언어를 영어로 변경
$ nextx config set lang en
✅ Configuration changed successfully: lang = en
```

---

# nextx (English)

A simple and opinionated CLI for scaffolding Next.js (App Router) projects.

This tool helps you quickly generate boilerplate code for pages, API routes, and data entities, following a consistent project structure and conventions. It provides various features including file overwrite protection, custom component name specification, and flexible path generation options.

## Installation

(Omitted for brevity)

---

## Configuration

While `nextx` works out-of-the-box with no configuration, you can create a configuration file to customize its behavior for your project structure.

### Configuration File

You can override the default paths for generated files by creating a `nextx.config.ts`, `nextx.config.js`, or `nextx.config.json` file in your project root. The CLI will search for them in that order.

**`nextx.config.ts` Example (Recommended):**

```typescript
// nextx.config.ts
export default {
  lang: "en", // 'ko' | 'en' | 'jp'
  aliases: {
    app: "src/app",
    entities: "src/core/entities",
  },
};
```

**`nextx.config.json` Example:**

```json
{
  "lang": "en",
  "aliases": {
    "app": "src/app",
    "entities": "src/core/entities"
  }
}
```

**Options:**

- `lang`: Sets the CLI message language. (Supports `ko`, `en`, `jp`) Default: `"ko"`.
- `aliases.app`: Specifies the path to the Next.js `app` directory. Default: `"app"`.
- `aliases.entities`: Specifies the root path for files generated by the `entity` command. Default: `"app/_entities"`.

### Monorepo Support

(Omitted for brevity)

---

## Usage

### `nextx page`

Generates a new page route and its related components.

**Syntax**

```bash
nextx page <group> <paths...> [options]
```

- `<group>`: The route group for the page. A directory will be created as `app/(<group>)/...`.
- `<paths...>`: The path(s) for the page to be created. You can specify multiple paths, and dynamic routes like `posts/[id]` are supported.
- `[options]`:
  - `-a, --all`: Creates pages for all intermediate paths in the specified route (excluding group root)
  - `-r, --root`: Also creates a page at the group's root path
  - `-f, --force`: Forces overwriting of existing files without confirmation
  - `-c, --component <names...>`: Specifies custom component names to be applied to the generated paths in order

**Example**

```bash
# Create a dynamic detail page in the 'posts' group
$ nextx page posts posts/[id]

# Create pages for intermediate paths only (excluding group root)
$ nextx page common test/new --all

# Create pages at group root and specified path
$ nextx page common test/new --root

# Create pages for all paths (original --all behavior)
$ nextx page common test/new --all --root

# Specify custom component names
$ nextx page posts list detail --component PostList PostDetail

# Force overwrite existing files
$ nextx page posts list --force
```

**Result**

```
app/
└── (posts)/
    └── posts/
        └── [id]/
            ├── _components/
            │   └── PostsDetail.tsx
            └── page.tsx
```

**Option Behavior Comparison**

Using `nextx page common test/new` as a reference, here's how options affect the behavior:

| Command                     | Generated Paths                       |
| :-------------------------- | :------------------------------------ |
| `... test/new`              | `test/new`                            |
| `... test/new --all`        | `test`, `test/new`                    |
| `... test/new --root`       | `''` (group root), `test/new`         |
| `... test/new --all --root` | `''` (group root), `test`, `test/new` |

**File Overwrite Protection**

By default, if a file already exists at the target location, the CLI will prompt for confirmation before overwriting:

```bash
$ nextx page posts list
# When file already exists:
'app/(posts)/list/page.tsx' 파일이 이미 존재합니다. 덮어쓰시겠습니까? (y/N)
```

- Enter `y` to overwrite the file
- Enter `N` or press Enter to skip file creation
- Use the `--force` option to overwrite without confirmation

**CLI Output Format**

All commands follow a consistent output format:

```bash
🚀 새 페이지 생성을 시작합니다...

  - 프로젝트 경로: /path/to/project
  - 앱 디렉토리: app
  - 그룹: posts
  - 경로: list, detail

✅ PostList.tsx 생성 완료. (app/(posts)/list/_components/PostList.tsx)
✅ page.tsx 생성 완료. (app/(posts)/list/page.tsx)
✅ PostDetail.tsx 생성 완료. (app/(posts)/detail/_components/PostDetail.tsx)
✅ page.tsx 생성 완료. (app/(posts)/detail/page.tsx)

🎉 모든 작업이 성공적으로 완료되었습니다!
```

### `nextx api`

Generates a new API route handler (`route.ts`).

**Syntax**

```bash
nextx api <category> [paths...] [options]
```

- `<category>`: The logical category for the API. A directory will be created as `app/api/<category>/...`.
- `[paths...]`: The API endpoint path(s) to create. If omitted, a route is created at the category root.
- `[options]`:
  - `-a, --all`: Also creates API routes for all parent directories in the path.

**Example**

```bash
# Create a login API in the 'auth' category
$ nextx api auth login
```

**Result**

```
app/
└── api/
    └── auth/
        └── login/
            └── route.ts
```

### `nextx entity`

Generates files for data state management (Query keys, Zustand store, types, etc.).

**Syntax**

```bash
nextx entity <name>
```

- `<name>`: The name of the entity to create (e.g., `user-profile`, `post`).
- Using `common` as the name will generate shared data management logic (custom hooks, etc.) for use across multiple entities.

**Example 1: Create a `user-profile` entity**

```bash
$ nextx entity user-profile
```

**Result** (Created in the `aliases.entities` path from `nextx.config.ts`)

```
src/core/entities/
└── user-profile/
    ├── hooks/
    │   └── index.ts
    ├── user-profile.keys.ts
    ├── user-profile.store.ts
    └── user-profile.types.ts
```

**Example 2: Generate common entity files**

```bash
$ nextx entity common
```

**Result**

```
src/core/entities/
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

Checks or modifies the `nextx` configuration.

**Syntax**

```bash
nextx config <get|set> <key> [value]
```

- `get <key>`: Checks the current value of a setting.
- `set <key> <value>`: Changes the value of a setting. This command can only modify `nextx.config.json` files.

Currently, the only supported `<key>` is `lang`.

**Examples**

```bash
# Check the currently configured language
$ nextx config get lang
lang: ko

# Change the language to English
$ nextx config set lang en
✅ Configuration changed successfully: lang = en
```

---

## License

MIT
