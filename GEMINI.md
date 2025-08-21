# GEMINI.md - nextx 프로젝트 분석

## 중요 참고사항

1. **이 프로젝트에 대한 모든 상호작용 및 답변은 반드시 한글로 작성되어야 합니다.**
2. docs 폴더에는 개선사항이나 테스트 계획등을 넣습니다. md 로 넣습니다.

---

## 1. 프로젝트 개요

이 프로젝트, `nextx`는 **Next.js 앱 라우터 기반 프로젝트의 생산성 향상을 위한 CLI (Command Line Interface) 도구**입니다.

반복적으로 작성해야 하는 페이지, API 라우트, 데이터 관리용 엔티티 등의 보일러플레이트 코드를 명령어 한 줄로 자동 생성하여 개발자가 핵심 비즈니스 로직에 더 집중할 수 있도록 돕습니다.

`ejs` 템플릿 엔진을 사용하여 정해진 구조의 코드를 생성하며, `commander.js`를 통해 `page`, `api`, `entity`와 같은 직관적인 명령어를 제공합니다.

## 2. 주요 기능

- **코드 스캐폴딩(Scaffolding):**

  - `nextx page <group> <path>`: Next.js의 앱 라우터 규칙에 맞는 페이지(`page.tsx`)와 관련 컴포넌트(`_components/*.tsx`)를 생성합니다. 동적/정적 라우트를 모두 지원합니다.
  - `nextx api <category> <path>`: `app/api` 디렉토리 내에 지정된 경로의 API 핸들러(`route.ts`)를 생성합니다.
  - `nextx entity <name>`: 데이터 상태 관리를 위한 파일 셋업을 자동화합니다. `zustand`나 `react-query`와 함께 사용될 것으로 보이는 `store`, `keys`, `types`, `hooks` 관련 파일을 생성합니다.

- **템플릿 기반 코드 생성:**

  - `template/` 디렉토리에 위치한 `.ejs` 파일들을 기반으로 코드를 생성합니다. 이를 통해 프로젝트 전체의 코드 일관성을 유지하고, 필요시 템플릿 수정을 통해 생성되는 코드의 구조를 손쉽게 변경할 수 있습니다.

- **Next.js 프로젝트 감지:**
  - CLI 실행 시, 현재 디렉토리에 `next.config.js` (또는 .mjs, .ts) 파일이 있는지 확인하여 Next.js 프로젝트 내에서만 실행되도록 보장합니다.

## 3. 프로젝트 구조

```
/home/nihilncunia/coding/cli/nextx/
├───package.json        # 프로젝트 의존성 및 스크립트 정의
├───src/                # CLI 애플리케이션의 소스 코드
│   ├───index.ts        # CLI의 메인 진입점. 명령어 등록 및 실행
│   ├───utils.ts        # 보조 함수 (문자열 변환 등)
│   └───commands/       # 실제 명령어가 정의된 파일들
│       ├───api.ts      # 'api' 명령어 로직
│       ├───entity.ts   # 'entity' 명령어 로직
│       └───page.ts     # 'page' 명령어 로직
└───template/           # 코드 생성에 사용되는 EJS 템플릿
    ├───api-dynamic.ejs # 동적 API 라우트 템플릿
    ├───component.ejs   # 페이지 컴포넌트 템플릿
    ├───page.ejs        # 정적 페이지 템플릿
    └───entity/         # 엔티티 관련 템플릿
        └───...
```

- **`src/`**: CLI 도구의 핵심 로직이 담겨있습니다. `index.ts`에서 `commander`를 사용해 명령어를 설정하고, `commands` 디렉토리의 각 파일이 개별 명령어의 상세 동작을 구현합니다.
- **`template/`**: `nextx`의 가장 중요한 부분 중 하나로, 모든 코드 생성의 기반이 되는 템플릿 파일들이 위치합니다. 각 명령어는 이곳의 템플릿을 읽어와 필요한 변수를 주입한 뒤, 최종 결과물을 파일로 저장합니다.

## 4. 주요 기술 스택

- **언어**: TypeScript
- **런타임**: Node.js
- **CLI 프레임워크**: `commander.js`
- **템플릿 엔진**: `ejs`
- **파일 시스템 처리**: `fs-extra`
- **패키지 매니저**: `pnpm`

## 5. 실행 및 개발 방법

1.  **의존성 설치:**

    ```bash
    pnpm install
    ```

2.  **빌드:**

    ```bash
    pnpm build
    ```

3.  **개발 모드 (파일 변경 감지):**

    ```bash
    pnpm dev
    ```

4.  **CLI 실행:**
    - 빌드 후 `dist/index.js`를 직접 실행하거나, `npm link` 또는 `pnpm link --global`을 통해 `nextx` 명령어를 시스템에 등록하여 사용할 수 있습니다.
    ```bash
    node dist/index.js page common new-page
    ```
