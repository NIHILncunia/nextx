# nextx CLI 추가 기능 제안

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
