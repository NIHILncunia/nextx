# nextx

## 🇰🇷 한국어

`nextx`는 Next.js (App Router) 프로젝트의 초기 파일 구조 생성을 돕는 간단하고 규격화된 CLI 도구입니다.

이 도구는 일관된 프로젝트 구조와 규칙을 따라 페이지, API 라우트, 데이터 엔티티의 보일러플레이트 코드를 빠르게 생성할 수 있도록 도와줍니다. 파일 덮어쓰기 보호, 커스텀 컴포넌트 이름 지정, 유연한 경로 생성 옵션 등 다양한 기능을 제공합니다.

### 주의

이 라이브러리는 개발자가 본인이 편하려고 만든 것으로, 다른 사람이 사용했을 때 생성되는 파일에 듣도보도 못한 패키지, 라이브러리가 포함되어있을 수 있습니다. 이 부분들은 천천히 개선할 예정입니다.

### 📦 필수 의존성

nextx CLI는 다음 라이브러리들이 프로젝트에 설치되어 있어야 정상적으로 작동합니다:

```bash
# 필수 라이브러리 (dependencies)
npm install @tanstack/react-query
npm install @lukemorales/query-key-factory
npm install axios
npm install class-variance-authority clsx tailwind-merge

# 개발 도구 (devDependencies)
npm install -D @tanstack/react-query-devtools

# 또는 pnpm 사용 시
pnpm add @tanstack/react-query
pnpm add @lukemorales/query-key-factory
pnpm add axios
pnpm add class-variance-authority clsx tailwind-merge

pnpm add -D @tanstack/react-query-devtools
```

**참고:** `cn` 함수나 `Api` 유틸리티 등은 `nextx init` 명령어를 통해 프로젝트에 자동으로 생성됩니다. 또한 `nextx init` 명령어는 필요한 의존성 패키지들을 자동으로 설치합니다.

### 🚀 빠른 시작

#### 설치

```bash
npm install -g @NIHILncunia/nextx
# 또는
pnpm add -g @NIHILncunia/nextx
```

#### 기본 사용법

```bash
# 프로젝트 초기화 (필수)
nextx init

# 페이지 생성
nextx page posts list detail

# API 라우트 생성
nextx api auth login

# 엔티티 생성
nextx entity user-profile
```

### 📚 문서

- **[한국어 문서](./docs/README.ko.md)** - 상세한 사용법과 설정 가이드

### ✨ 주요 기능

- **🚀 프로젝트 초기화**: `nextx init` 명령어로 필수 의존성 설치, 설정 파일, 기본 유틸리티(`cn`, `Api` 등)를 한번에 생성합니다.
- **📄 페이지 생성**: Next.js App Router 페이지 및 컴포넌트 자동 생성
- **🔌 API 라우트**: RESTful API 엔드포인트 핸들러 생성
- **🗃️ 엔티티 관리**: 데이터 상태 관리 파일들 (Query 키, Zustand 스토어, 타입 등)
- **⚙️ 유연한 설정**: 프로젝트 구조에 맞는 커스터마이징
- **🌐 다국어 지원**: 한국어, 영어, 일본어
- **🏗️ 모노레포 지원**: pnpm workspace 자동 감지
- **🛡️ 안전성**: 파일 덮어쓰기 보호 및 에러 처리

### 🎯 명령어 개요

| 명령어         | 설명                           | 예시                           |
| -------------- | ------------------------------ | ------------------------------ |
| `nextx init`   | 프로젝트 초기화 및 설정        | `nextx init`                   |
| `nextx page`   | 페이지 라우트 및 컴포넌트 생성 | `nextx page posts list detail` |
| `nextx api`    | API 라우트 핸들러 생성         | `nextx api auth login`         |
| `nextx entity` | 데이터 엔티티 파일들 생성      | `nextx entity user-profile`    |
| `nextx config` | 설정 확인 및 변경              | `nextx config get lang`        |

---

## 🇺🇸 English

`nextx` is a simple and opinionated CLI tool for scaffolding Next.js (App Router) projects.

This tool helps you quickly generate boilerplate code for pages, API routes, and data entities, following a consistent project structure and conventions. It provides various features including file overwrite protection, custom component name specification, and flexible path generation options.

### Warning

This library was created by a developer for their own convenience. When others use it, the generated files may contain packages and libraries you've never heard of. These parts will be improved gradually.

### 📦 Required Dependencies

nextx CLI requires the following libraries to be installed in your project:

```bash
# Required libraries (dependencies)
npm install @tanstack/react-query
npm install @lukemorales/query-key-factory
npm install axios
npm install class-variance-authority clsx tailwind-merge

# Development tools (devDependencies)
npm install -D @tanstack/react-query-devtools

# Or with pnpm
pnpm add @tanstack/react-query
pnpm add @lukemorales/query-key-factory
pnpm add axios
pnpm add class-variance-authority clsx tailwind-merge

pnpm add -D @tanstack/react-query-devtools
```

**Note:** Utilities like the `cn` function or the `Api` class are automatically generated in your project via the `nextx init` command. The `nextx init` command also automatically installs required dependency packages.

### 🚀 Quick Start

#### Installation

```bash
npm install -g @NIHILncunia/nextx
# or
pnpm add -g @NIHILncunia/nextx
```

#### Basic Usage

```bash
# Initialize project (required)
nextx init

# Generate pages
nextx page posts list detail

# Generate API routes
nextx api auth login

# Generate entities
nextx entity user-profile
```

### 📚 Documentation

- **[English Documentation](./docs/README.en.md)** - Detailed usage and configuration guide

### ✨ Key Features

- **🚀 Project Initialization**: The `nextx init` command installs essential dependencies, creates a configuration file, and generates basic utilities (`cn`, `Api`, etc.) all at once.
- **📄 Page Generation**: Automatic Next.js App Router page and component generation
- **🔌 API Routes**: RESTful API endpoint handler generation
- **🗃️ Entity Management**: Data state management files (Query keys, Zustand store, types, etc.)
- **⚙️ Flexible Configuration**: Customization for your project structure
- **🌐 Multi-language Support**: Korean, English, Japanese
- **🏗️ Monorepo Support**: Automatic pnpm workspace detection
- **🛡️ Safety**: File overwrite protection and error handling

### 🎯 Command Overview

| Command        | Description                         | Example                        |
| -------------- | ----------------------------------- | ------------------------------ |
| `nextx init`   | Initialize project and setup        | `nextx init`                   |
| `nextx page`   | Generate page routes and components | `nextx page posts list detail` |
| `nextx api`    | Generate API route handlers         | `nextx api auth login`         |
| `nextx entity` | Generate data entity files          | `nextx entity user-profile`    |
| `nextx config` | Check and modify settings           | `nextx config get lang`        |

---

## 🇯🇵 日本語

`nextx`は、Next.js (App Router) プロジェクトの初期ファイル構造生成を支援するシンプルで規格化された CLI ツールです。

このツールは、一貫したプロジェクト構造とルールに従って、ページ、API ルート、データエンティティのボイラープレートコードを素早く生成できるよう支援します。ファイル上書き保護、カスタムコンポーネント名指定、柔軟なパス生成オプションなど、様々な機能を提供します。

### 注意

このライブラリは開発者が自分が便利になるように作ったもので、他の人が使用した時に生成されるファイルに聞いたことも見たこともないパッケージやライブラリが含まれている可能性があります。これらの部分は徐々に改善する予定です。

### 📦 必須依存関係

nextx CLI は、プロジェクトに以下のライブラリがインストールされている必要があります：

```bash
# 必須ライブラリ (dependencies)
npm install @tanstack/react-query
npm install @lukemorales/query-key-factory
npm install axios
npm install class-variance-authority clsx tailwind-merge

# 開発ツール (devDependencies)
npm install -D @tanstack/react-query-devtools

# またはpnpm使用時
pnpm add @tanstack/react-query
pnpm add @lukemorales/query-key-factory
pnpm add axios
pnpm add class-variance-authority clsx tailwind-merge

pnpm add -D @tanstack/react-query-devtools
```

**注意:** `cn`関数や`Api`ユーティリティなどは、`nextx init`コマンドを通じてプロジェクトに自動生成されます。また、`nextx init`コマンドは必要な依存関係パッケージを自動的にインストールします。

### 🚀 クイックスタート

#### インストール

```b`sh`
npm install -g @NIHILncunia/nextx

# または

pnpm add -g @NIHILncunia/nextx

````

#### 基本的な使用方法

```bash
# プロジェクト初期化（必須）
nextx init

# ページ生成
nextx page posts list detail

# APIルート生成
nextx api auth login

# エンティティ生成
nextx entity user-profile
````

### 📚 ドキュメント

- **[日本語ドキュメント](./docs/README.jp.md)** - 詳細な使用方法と設定ガイド

### ✨ 主な機能

- **🚀 プロジェクトの初期化**: `nextx init` コマンドで、必須依存関係のインストール、設定ファイル、および基本的なユーティリティ（`cn`、`Api`など）を一度に生成します。
- **📄 ページ生成**: Next.js App Router ページとコンポーネントの自動生成
- **🔌 API ルート**: RESTful API エンドポイントハンドラーの生成
- **🗃️ エンティティ管理**: データ状態管理ファイル（Query キー、Zustand ストア、タイプなど）
- **⚙️ 柔軟な設定**: プロジェクト構造に合わせたカスタマイズ
- **🌐 多言語サポート**: 韓国語、英語、日本語
- **🏗️ モノレ포サポート**: pnpm ワークスペースの自動検出
- **🛡️ 安全性**: ファイル上書き保護とエラーハンドリング

### 🎯 コマンド概要

| コマンド       | 説明                             | 例                             |
| -------------- | -------------------------------- | ------------------------------ |
| `nextx init`   | プロジェクト初期化と設定         | `nextx init`                   |
| `nextx page`   | ページルートとコンポーネント生成 | `nextx page posts list detail` |
| `nextx api`    | API ルートハンドラー生成         | `nextx api auth login`         |
| `nextx entity` | データエンティティファイル生成   | `nextx entity user-profile`    |
| `nextx config` | 設定確認と変更                   | `nextx config get lang`        |

---

## 📖 더 자세한 정보

자세한 사용법, 설정 옵션, 예시는 다음 문서를 참조하세요:

- **[한국어 문서](./docs/README.ko.md)**
- **[English Documentation](./docs/README.en.md)**
- **[日本語ドキュメント](./docs/README.jp.md)**

## 📄 라이선스

MIT
