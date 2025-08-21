# nextx

`nextx`는 Next.js (App Router) 프로젝트의 초기 파일 구조 생성을 돕는 간단하고 규격화된 CLI 도구입니다.

이 도구는 일관된 프로젝트 구조와 규칙을 따라 페이지, API 라우트, 데이터 엔티티의 보일러플레이트 코드를 빠르게 생성할 수 있도록 도와줍니다. 파일 덮어쓰기 보호, 커스텀 컴포넌트 이름 지정, 유연한 경로 생성 옵션 등 다양한 기능을 제공합니다.

## 🚀 빠른 시작

### 설치

```bash
npm install -g @NIHILncunia/nextx
# 또는
pnpm add -g @NIHILncunia/nextx
```

### 기본 사용법

```bash
# 페이지 생성
nextx page posts list detail

# API 라우트 생성
nextx api auth login

# 엔티티 생성
nextx entity user-profile
```

## 📚 문서

- **[한국어 문서](./docs/README.ko.md)** - 상세한 사용법과 설정 가이드
- **[English Documentation](./docs/README.en.md)** - Detailed usage and configuration guide
- **[日本語ドキュメント](./docs/README.jp.md)** - 詳細な使用方法と設定ガイド

## ✨ 주요 기능

- **📄 페이지 생성**: Next.js App Router 페이지 및 컴포넌트 자동 생성
- **🔌 API 라우트**: RESTful API 엔드포인트 핸들러 생성
- **🗃️ 엔티티 관리**: 데이터 상태 관리 파일들 (Query 키, Zustand 스토어, 타입 등)
- **⚙️ 유연한 설정**: 프로젝트 구조에 맞는 커스터마이징
- **🌐 다국어 지원**: 한국어, 영어, 일본어
- **🏗️ 모노레포 지원**: pnpm workspace 자동 감지
- **🛡️ 안전성**: 파일 덮어쓰기 보호 및 에러 처리

## 🎯 명령어 개요

| 명령어         | 설명                           | 예시                           |
| -------------- | ------------------------------ | ------------------------------ |
| `nextx page`   | 페이지 라우트 및 컴포넌트 생성 | `nextx page posts list detail` |
| `nextx api`    | API 라우트 핸들러 생성         | `nextx api auth login`         |
| `nextx entity` | 데이터 엔티티 파일들 생성      | `nextx entity user-profile`    |
| `nextx config` | 설정 확인 및 변경              | `nextx config get lang`        |

## 📖 더 자세한 정보

자세한 사용법, 설정 옵션, 예시는 다음 문서를 참조하세요:

- **[한국어 문서](./docs/README.ko.md)**
- **[English Documentation](./docs/README.en.md)**
- **[日本語ドキュメント](./docs/README.jp.md)**

## 📄 라이선스

MIT
