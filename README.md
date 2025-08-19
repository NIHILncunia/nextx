# nextx

`nextx`는 Next.js (App Router) 프로젝트의 초기 파일 구조 생성을 돕는 간단하고 규격화된 CLI 도구입니다.

이 도구는 일관된 프로젝트 구조와 규칙을 따라 페이지, API 라우트, 데이터 엔티티의 보일러플레이트 코드를 빠르게 생성할 수 있도록 도와줍니다.

## 설치

`nextx`를 전역으로 사용하려면 npm 또는 pnpm을 통해 설치하세요:

```bash
npm install -g @NIHILncunia/nextx
# 또는
pnpm add -g @NIHILncunia/nextx
```

**참고**: 이 CLI는 반드시 Next.js 프로젝트의 루트( `next.config.js` 파일이 있는 위치)에서 실행해야 합니다.

---

## 사용법

### `nextx page`

새로운 페이지와 그에 해당하는 컴포넌트를 생성합니다.

**형식**
```
nextx page <그룹> <경로...> [--all]
```

-   `<그룹>`: 페이지의 라우트 그룹 (예: `common`, `user`).
-   `<경로...>`: 생성할 하나 이상의 페이지 경로.
-   `--all`: 모든 상위 디렉토리에도 페이지를 함께 생성합니다.

**주요 기능 및 이름 규칙**
-   **동적 라우트**: `[param]` 구문을 지원하며, `generateMetadata`를 사용하는 특별 템플릿을 사용합니다.
-   **상세 페이지**: `[...Id]` 형태의 동적 파라미터(예: `[postId]`)는 `...Detail` 형태(예: `PostDetail`)로 컴포넌트 이름을 생성합니다.
-   **다중 동적 라우트**: 여러 동적 세그먼트를 가진 경로(예: `archive/[year]/[month]`)는 이름을 조합하여(예: `ArchiveYearMonth`) 생성합니다.
-   **`common` 그룹**: `common` 그룹의 최상위 페이지는 특별히 `Home`으로 취급됩니다.

**예시**
```bash
# (common) 그룹에 dashboard 페이지 생성
$ nextx page common dashboard

# 동적인 사용자 상세 페이지 생성
# 컴포넌트 이름은 `UserDetail`로 생성됩니다
$ nextx page user users/[userId]

# 다중 동적 라우트 페이지 생성
# 컴포넌트 이름은 `ArchiveYearMonth`로 생성됩니다
$ nextx page common archive/[year]/[month]

# 페이지와 모든 상위 페이지를 함께 생성
$ nextx page common settings/user/profile --all
```

### `nextx api`

새로운 API 라우트(`route.ts`)를 생성합니다.

**형식**
```
nextx api <카테고리> <경로...> [--all]
```

-   `<카테고리>`: API의 주 카테고리 (예: `products`, `users`).
-   `<경로...>`: 생성할 하나 이상의 API 경로.
-   `--all`: 모든 상위 디렉토리에도 `route.ts`를 함께 생성합니다.

**예시**
```bash
# products에 대한 검색 API 생성
$ nextx api products search

# 특정 사용자를 위한 동적 API 라우트 생성
$ nextx api users [userId]

# 여러 라우트와 그 상위 라우트를 함께 생성
$ nextx api payments stripe/webhooks --all
```

### `nextx entity`

데이터 엔티티를 위한 보일러플레이트를 생성합니다. 상태 관리(Zustand), 쿼리 키(TanStack Query Key Factory), 타입, 훅 관련 파일을 포함합니다.

**형식**
```
nextx entity <이름>
```

-   `<이름>`: 엔티티의 이름 (예: `post`, `user`).

**주요 기능**
-   **`common` 엔티티**: `nextx entity common`을 실행하여 특별한 `common` 엔티티를 생성할 수 있습니다. 이는 다른 엔티티에서 사용되는 수많은 기반 훅과 타입을 생성합니다.
-   **일반 엔티티**: 다른 모든 이름에 대해서는 범용 템플릿을 기반으로 표준 파일 세트(`<name>.keys.ts`, `<name>.store.ts`, `<name>.types.ts`, `hooks/index.ts`)를 생성합니다.

**예시**
```bash
# 모든 훅과 타입을 포함하는 특별한 common 엔티티 생성
$ nextx entity common

# 새로운 'post' 엔티티 생성
$ nextx entity post
```

---

# nextx (English)

A simple and opinionated CLI for scaffolding Next.js (App Router) projects.

This tool helps you quickly generate boilerplate code for pages, API routes, and data entities, following a consistent project structure and conventions.

## Installation

To use `nextx` globally, install it via npm or pnpm:

```bash
npm install -g @NIHILncunia/nextx
# or
pnpm add -g @NIHILncunia/nextx
```

**Note**: This CLI must be run in the root of a Next.js project (where `next.config.js` is located).

---

## Usage

### `nextx page`

Generates new pages and their corresponding components.

**Syntax**
```
nextx page <group> <paths...> [--all]
```

-   `<group>`: The route group for the page (e.g., `common`, `user`).
-   `<paths...>`: One or more page paths to create.
-   `--all`: Also creates pages for all parent directories.

**Features & Naming Conventions**
-   **Dynamic Routes**: Supports `[param]` syntax and uses a special template with `generateMetadata`.
-   **Detail Pages**: A dynamic route with an `[...Id]` parameter (e.g., `[postId]`) will be named `...Detail` (e.g., `PostDetail`).
-   **Multi-Dynamic Routes**: Paths with multiple dynamic segments (e.g., `archive/[year]/[month]`) will have their names combined (`ArchiveYearMonth`).
-   **`common` Group**: The root page of the `common` group is specially treated as `Home`.

**Examples**
```bash
# Create a dashboard page in the (common) group
$ nextx page common dashboard

# Create a dynamic user detail page
# Component will be named `UserDetail`
$ nextx page user users/[userId]

# Create a multi-dynamic route page
# Component will be named `ArchiveYearMonth`
$ nextx page common archive/[year]/[month]

# Create a page and all its parent pages
$ nextx page common settings/user/profile --all
```

### `nextx api`

Generates new API routes (`route.ts`).

**Syntax**
```
nextx api <category> <paths...> [--all]
```

-   `<category>`: The main category for the API (e.g., `products`, `users`).
-   `<paths...>`: One or more API paths to create.
-   `--all`: Also creates `route.ts` for all parent directories.

**Examples**
```bash
# Create a search API for products
$ nextx api products search

# Create a dynamic API route for a specific user
$ nextx api users [userId]

# Create multiple routes and their parent routes
$ nextx api payments stripe/webhooks --all
```

### `nextx entity`

Generates the boilerplate for a data entity, including files for state management (Zustand), query keys (TanStack Query Key Factory), types, and hooks.

**Syntax**
```
nextx entity <name>
```

-   `<name>`: The name of the entity (e.g., `post`, `user`).

**Features**
-   **`common` Entity**: A special `common` entity can be created by running `nextx entity common`. This generates a large set of foundational hooks and types used by other entities.
-   **Generic Entities**: For any other name, it generates a standard set of files (`<name>.keys.ts`, `<name>.store.ts`, `<name>.types.ts`, `hooks/index.ts`) based on general-purpose templates.

**Examples**
```bash
# Create the special common entity with all its hooks and types
$ nextx entity common

# Create a new 'post' entity
$ nextx entity post
```

---

## License

MIT
