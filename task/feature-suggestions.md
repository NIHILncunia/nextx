# nextx CLI 추가 기능 제안

## 페이지 생성 로직 및 경로 설정 고도화 (최우선 사항)

`page` 명령어의 동작을 사용자가 자신의 프로젝트 구조에 맞게 세밀하게 제어할 수 있도록 설정 옵션을 추가합니다.

-   **`src` 디렉토리 사용 여부 설정 (`useSrc`):**
    `nextx.config.ts`에 `useSrc: <boolean>` 옵션을 추가하여, `app`, `components` 등의 주요 폴더를 `src` 디렉토리 내에 생성할지(기본값), 또는 프로젝트 루트에 생성할지를 결정할 수 있습니다.

-   **컴포넌트 생성 위치 제어 (`componentInRoute`):**
    `componentInRoute: <boolean>` 옵션을 통해 페이지와 함께 생성되는 컴포넌트의 위치를 제어합니다.
    -   `true` (기본값): 현재처럼 페이지 라우트 폴더 내의 `_components` 폴더에 생성합니다.
    -   `false`: 아래 `aliases.components`로 지정된 공용 폴더에 컴포넌트를 생성합니다.

-   **공용 컴포넌트 자동 분류 (`componentCategory`):**
    `componentInRoute`가 `false`일 때, `componentCategory: <boolean>` 옵션을 활성화할 수 있습니다.
    -   `true`: 공용 컴포넌트 폴더 내에 페이지의 라우트 그룹명과 동일한 하위 폴더를 자동으로 생성하고 그 안에 컴포넌트를 위치시켜, 파일들이 논리적으로 정리되도록 합니다. (예: `src/components/users/UserProfile.tsx`)

---

## 1. 생성(Scaffolding) 기능 확장

-   **독립적인 컴포넌트 생성 (`nextx component`):**
    현재는 `page` 명령어에 종속되어 `_components` 안에만 컴포넌트를 생성할 수 있습니다. `src/components`와 같이 공용으로 사용될 컴포넌트를 생성하는 `nextx component <name> [path]` 명령어를 추가하면 활용도가 매우 높아질 것입니다. 예를 들어, `nextx component common/Button` 명령어로 `src/components/common/Button.tsx` 파일을 생성할 수 있습니다.

-   **레이아웃 파일 생성 (`nextx layout`):**
    앱 라우터의 핵심 요소인 `layout.tsx` 파일을 생성하는 기능을 추가할 수 있습니다. `nextx layout <group> [path]` 명령어를 통해 특정 경로에 레이아웃 파일을 손쉽게 추가하고, 페이지와 동일한 그룹 규칙을 적용할 수 있습니다.

## 2. 기존 명령어 기능 강화

-   **`entity` 명령어 개선:**
    -   **필드(Field) 기반 타입 자동 생성:** `nextx entity post --fields name:string,content:string`과 같이 인자를 받아서, 생성되는 `.types.ts` 파일에 기본적인 인터페이스를 자동으로 채워줄 수 있습니다.
    -   **CRUD 훅 자동 생성:** `entity` 생성 시, `common` 템플릿을 기반으로 `useGetPosts`, `useCreatePost` 등 기본적인 CRUD React Query 훅을 `hooks/api/` 디렉토리에 자동으로 생성해주면 매우 편리할 것입니다.

## 3. 편의 기능

-   **생성된 파일 삭제 기능 (`nextx remove`):**
    `page`, `api` 등으로 생성했던 파일들을 역으로 삭제하는 `remove` 또는 `delete` 명령어를 추가하면 잘못 생성했거나 더 이상 필요 없는 구조를 깔끔하게 정리하는 데 도움이 됩니다. `nextx remove page posts posts/[id]`와 같이 사용할 수 있습니다.

-   **사용자 정의 템플릿 지원:**
    `nextx init` 같은 명령어를 통해 프로젝트 내에 `nextx`의 기본 `template`들을 복사해올 수 있게 하고, 사용자가 이 템플릿을 수정하면 `nextx`가 수정된 템플릿을 기반으로 코드를 생성하도록 하는 기능입니다. 이를 통해 프로젝트의 특정 컨벤션에 완벽하게 맞는 코드를 생성할 수 있습니다.

## 4. 프로젝트 설정 및 통합

-   **테스트 파일 자동 생성:**
    `page`, `component`, `api` 생성 시 `--with-test` 같은 옵션을 주면, 해당 기능에 대한 기본적인 테스트 파일(`*.test.ts` 또는 `*.spec.ts`)을 함께 생성해주는 기능입니다. TDD(테스트 주도 개발)를 지향하는 프로젝트에 큰 도움이 됩니다.
