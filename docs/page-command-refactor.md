# `page` 명령어 개선 및 테스트 계획

## 1. 개요

기존 `page` 명령어의 `--all` 옵션은 사용 의도와 다르게 그룹 최상위(`''`) 경로까지 항상 포함하여 직관적이지 않은 문제가 있었습니다. 또한, 파일이 이미 존재할 경우 사용자 확인 없이 덮어쓰는 위험성도 내포했습니다.

이번 개선은 `--all`의 동작을 더 명확하게 정의하고, `--root`와 `--force` 옵션을 새로 추가하여 CLI의 예측 가능성과 사용성을 높이는 것을 목표로 합니다.

---

## 2. 주요 변경 사항

1.  **`--all` 옵션 동작 변경**
    -   **(기존)**: 명시된 경로와 그 상위의 모든 경로(그룹 루트 포함)에 페이지 생성
    -   **(변경)**: 명시된 경로의 중간 경로들에만 페이지 생성 (그룹 루트 제외)

2.  **`--root` 옵션 추가**
    -   명령어 실행 시, 명시된 경로와 함께 해당 그룹의 최상위 루트에도 페이지를 생성하는 옵션입니다.

3.  **`--force` 옵션 및 덮어쓰기 방지 기능 추가**
    -   기본적으로 생성하려는 위치에 파일이 이미 존재하면, 사용자에게 **덮어쓰기 여부를 묻는 프롬프트**가 표시됩니다.
    -   `--force` 옵션을 사용하면 이 확인 절차를 건너뛰고 강제로 덮어쓸 수 있습니다.

---

## 3. 동작 비교

`nextx page common test/new` 명령어를 기준으로 옵션에 따른 동작 변화는 다음과 같습니다.

| 명령어 | 이전 동작 (생성 경로) | 개선된 동작 (생성 경로) |
| :--- | :--- | :--- |
| `... test/new` | `test/new` | `test/new` (변경 없음) |
| `... test/new --all` | `''`, `test`, `test/new` | `test`, `test/new` |
| `... test/new --root` | (없음) | `''`, `test/new` |
| `... test/new --all --root` | (없음) | `''`, `test`, `test/new` |

---

## 4. 개선 후 테스트 계획

> **사전 준비:** 모든 테스트 전에 `test/app` 디렉토리를 `rm -rf test/app && mkdir -p test/app` 명령어로 초기화합니다.

### 테스트 1: `--all` 옵션의 새로운 동작 확인

1.  **명령어 실행:** `cd test && node ../dist/index.js page common test/new --all`
2.  **예상 결과:** `app/(common)/test` 와 `app/(common)/test/new` 두 경로에만 페이지와 컴포넌트가 생성되어야 합니다. 그룹 루트(`app/(common)/page.tsx`)는 생성되지 않아야 합니다.
3.  **확인 방법:** `ls -R app` 명령어로 폴더 구조를 확인합니다.

### 테스트 2: `--root` 옵션 동작 확인

1.  **명령어 실행:** `cd test && node ../dist/index.js page common test/new --root`
2.  **예상 결과:** `app/(common)/test/new` 와 그룹 루트인 `app/(common)` 두 경로에 페이지와 컴포넌트가 생성되어야 합니다.
3.  **확인 방법:** `ls -R app` 명령어로 폴더 구조를 확인합니다.

### 테스트 3: `--all`과 `--root` 조합 동작 확인

1.  **명령어 실행:** `cd test && node ../dist/index.js page common test/new --all --root`
2.  **예상 결과:** `app/(common)`, `app/(common)/test`, `app/(common)/test/new` 세 경로 모두에 페이지와 컴포넌트가 생성되어야 합니다. (기존 `--all` 옵션의 동작과 동일)
3.  **확인 방법:** `ls -R app` 명령어로 폴더 구조를 확인합니다.

### 테스트 4: 덮어쓰기 방지 및 프롬프트 기능 확인

1.  **파일 생성:** `cd test && node ../dist/index.js page common test`
2.  **동일 명령어 재실행:** `cd test && node ../dist/index.js page common test`
3.  **예상 결과:**
    -   CLI가 `파일이 이미 존재합니다. 덮어쓰시겠습니까? (y/N)` 와 같은 메시지를 출력하며 사용자 입력을 기다립니다.
    -   `y`를 입력하면 파일이 덮어써지고, `N` 또는 그냥 Enter를 누르면 "파일 생성을 건너뜁니다" 메시지가 출력됩니다.
4.  **확인 방법:** CLI의 출력을 직접 확인합니다.

### 테스트 5: `--force` 옵션을 이용한 강제 덮어쓰기 확인

1.  **파일 생성:** `cd test && node ../dist/index.js page common test`
2.  **`--force` 옵션으로 재실행:** `cd test && node ../dist/index.js page common test --force`
3.  **예상 결과:** 사용자에게 확인을 묻지 않고 즉시 파일이 덮어써집니다.
4.  **확인 방법:** CLI 출력에 프롬프트 메시지가 없는 것을 확인합니다.
