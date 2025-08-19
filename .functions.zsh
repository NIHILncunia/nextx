##### Utils #####
_log() { echo "$@" }
_err() { echo "❌ $@" >&2 }

# Next.js(App Router) 루트 확인
_is_next_root() { [[ -d "./app" ]] }

# 안전 파일 생성(상위 디렉토리 보장)
_touch_safe() { mkdir -p "$(dirname "$1")" && : > "$1" }

# --all|-all|-a 플래그 파싱
_parse_all_flag() {
  local arg
  for arg in "$@"; do
    if [[ "$arg" == "--all" || "$arg" == "-all" || "$arg" == "-a" ]]; then
      echo "true"
      return
    fi
  done
  echo "false"
}

# 인자에서 --all 제거
_strip_all_flag() {
  local out=() a
  for a in "$@"; do
    [[ "$a" == "--all" || "$a" == "-all" || "$a" == "-a" ]] || out+=("$a")
  done
  echo "${out[@]}"
}

##### Generic #####
shadcn-update() {
  # --turbo 옵션이 있으면 apps/web 으로 이동 후에 실행하도록.
  if [[ "$1" == "--turbo" ]]; then
    cd apps/web;
    pnpm dlx shadcn@latest add accordion alert-dialog aspect-ratio avatar badge breadcrumb button calendar card carousel checkbox collapsible command context-menu dialog drawer dropdown-menu form hover-card input label menubar navigation-menu pagination popover progress radio-group resizable scroll-area select separator sheet skeleton slider sonner switch table tabs textarea toggle toggle-group tooltip;
    cd ../../;
  else
    pnpm dlx shadcn@latest add accordion alert-dialog aspect-ratio avatar badge breadcrumb button calendar card carousel checkbox collapsible command context-menu dialog drawer dropdown-menu form hover-card input label menubar navigation-menu pagination popover progress radio-group resizable scroll-area select separator sheet skeleton slider sonner switch table tabs textarea toggle toggle-group tooltip
  fi
}

folder() {
  explorer.exe "$1"
}

npm-update() {
  ncu -u && pnpm install
}

edit-functions() {
  cursor ~/.functions.zsh
}

# 디렉토리 이동 후 파일 목록 표시
cl() {
  cd "$1" && ls -al
}

# coding 디렉토리로 이동
coding() {
  cl ~/coding
}

# 디렉토리 생성 후 이동
mkcd() {
  mkdir -p "$1" && cl "$1"
}

##### Git / GitHub #####
gitnew() {
  git init -b master || return 1
}

newrepo() {
  if [[ -z "$1" ]]; then
    _err "Usage: newrepo <owner/repo> [--private]"
    return 1
  fi

  local repo="$1"
  local vis="--public"
  [[ "$2" == "--private" ]] && vis="--private"

  gitnew || return 1

  # 변경사항이 있을 경우에만 초기 커밋
  if [[ -n "$(git status --porcelain)" ]]; then
    git add . && git commit -m "Initial commit"
  fi

  gh repo create "$repo" $vis --source=. --remote=origin --push || return 1
  _log "✅ '$repo' 원격 생성 및 origin/master로 푸시 완료"
}

##### Next.js Scaffolders (App Router) #####

# 홈페이지 생성: app/(common)/page.tsx
next-homepage() {
  setopt localoptions noglob
  _is_next_root || { _err "여기는 Next.js 프로젝트 루트가 아닙니다(./app 없음)."; return 1; }
  _log "🏠 Next.js 홈페이지 생성 중..."
  mkdir -p "./app/(common)"
  _touch_safe "./app/(common)/page.tsx"
  _log "✅ 홈페이지 생성 완료"
  _log "🌐 웹 접근: /"
}

# 라우트 그룹 생성: (group)/_components, layout.tsx
next-route-group() {
  setopt localoptions noglob
  [[ -n "$1" ]] || { _err "사용법: next-route-group <그룹명>"; return 1; }
  _is_next_root || { _err "여기는 Next.js 프로젝트 루트가 아닙니다(./app 없음)."; return 1; }

  local group="$1"
  _log "📁 라우트 그룹 '($group)' 생성 중..."
  mkdir -p "./app/($group)/_components"
  _touch_safe "./app/($group)/layout.tsx"
  _log "✅ 라우트 그룹 '($group)' 생성 완료"
}

# 단일 페이지: [--all|-all|-a] <group> <path>
# --all 시 상위 (group)에만 page.tsx/_components 추가 생성.
# 하위는 '리프' 경로에만 page.tsx/_components 생성.
next-page() {
  setopt localoptions noglob
  _is_next_root || { _err "여기는 Next.js 프로젝트 루트가 아닙니다(./app 없음)."; return 1; }

  local create_parent; create_parent="$(_parse_all_flag "$@")"
  local -a clean; clean=($(_strip_all_flag "$@"))
  [[ ${#clean[@]} -ge 2 ]] || { _err "사용법: next-page [--all|-all|-a] <그룹> <경로>"; return 1; }

  local group="${clean[1]}"
  local subpath="${clean[2]}"

  mkdir -p "./app/($group)"
  if [[ "$create_parent" == "true" ]]; then
    mkdir -p "./app/($group)/_components"
    _touch_safe "./app/($group)/page.tsx"
    _touch_safe "./app/($group)/_components/index.ts"
    _log "🌐 상위 페이지: /"
  fi

  mkdir -p "./app/($group)/$subpath/_components"
  _touch_safe "./app/($group)/$subpath/page.tsx"
  _touch_safe "./app/($group)/$subpath/_components/index.ts"

  if [[ "$create_parent" == "true" ]]; then
    _log "✅ 페이지 생성 완료 (상위 폴더 및 페이지 포함)"
  else
    _log "✅ 페이지 생성 완료"
  fi
  _log "🌐 웹 접근: /$subpath"
}

# 다중 페이지: [--all|-all|-a] <group> <p1> [p2] ...
# 각 항목은 리프만 생성, --all이면 상위(group)만 추가 생성.
next-pages() {
  setopt localoptions noglob
  _is_next_root || { _err "여기는 Next.js 프로젝트 루트가 아닙니다(./app 없음)."; return 1; }

  local create_parent; create_parent="$(_parse_all_flag "$@")"
  local -a clean; clean=($(_strip_all_flag "$@"))
  [[ ${#clean[@]} -ge 2 ]] || { _err "사용법: next-pages [--all|-all|-a] <그룹> <경로1> [경로2] ..."; return 1; }

  local group="${clean[1]}"
  local -a pages=()
  
  # 두 번째 인자부터 공백으로 분할하여 배열에 추가
  local arg
  for arg in "${(@)clean[2,-1]}"; do
    pages+=( ${(z)arg} )
  done

  mkdir -p "./app/($group)"
  if [[ "$create_parent" == "true" ]]; then
    mkdir -p "./app/($group)/_components"
    _touch_safe "./app/($group)/page.tsx"
    _touch_safe "./app/($group)/_components/index.ts"
    _log "🌐 상위 페이지: /"
  fi

  local p
  local count=0
  for p in "${pages[@]}"; do
    mkdir -p "./app/($group)/$p/_components"
    _touch_safe "./app/($group)/$p/page.tsx"
    _touch_safe "./app/($group)/$p/_components/index.ts"
    ((count++))
    _log "🌐 웹 접근: /$p"
  done

  if [[ "$create_parent" == "true" ]]; then
    _log "✅ 총 ${count}개 페이지 생성 완료 (상위 폴더 및 페이지 포함)"
  else
    _log "✅ 총 ${count}개 페이지 생성 완료"
  fi
}

# 단일 API: [--all|-all|-a] <category> [sub]
# --all 시 상위(category)에만 route.ts 추가 생성.
# sub가 있으면 리프(sub)에만 route.ts 생성.
next-api() {
  setopt localoptions noglob
  _is_next_root || { _err "여기는 Next.js 프로젝트 루트가 아닙니다(./app 없음)."; return 1; }

  local create_parent; create_parent="$(_parse_all_flag "$@")"
  local -a clean; clean=($(_strip_all_flag "$@"))
  [[ ${#clean[@]} -ge 1 ]] || { _err "사용법: next-api [--all|-all|-a] <대분류> [하위]"; return 1; }

  local category="${clean[1]}"
  local sub="${clean[2]}"

  mkdir -p "./app/api/$category"
  if [[ "$create_parent" == "true" ]]; then
    _touch_safe "./app/api/$category/route.ts"
    _log "🔗 상위 API: /api/$category"
  fi

  if [[ -n "$sub" ]]; then
    _touch_safe "./app/api/$category/$sub/route.ts"
    if [[ "$create_parent" == "true" ]]; then
      _log "✅ API 생성 완료 (상위 폴더 및 API 포함)"
    else
      _log "✅ API 생성 완료"
    fi
    _log "🔗 API 엔드포인트: /api/$category/$sub"
  elif [[ "$create_parent" != "true" ]]; then
    _touch_safe "./app/api/$category/route.ts"
    _log "✅ API 생성 완료"
    _log "🔗 API 엔드포인트: /api/$category"
  else
    _log "✅ API 생성 완료"
  fi
}

# 다중 API: [--all|-all|-a] <category> <sub1> [sub2] ...
# 각 항목은 리프만 생성, --all이면 상위(category)만 추가 생성.
next-apis() {
  setopt localoptions noglob
  _is_next_root || { _err "여기는 Next.js 프로젝트 루트가 아닙니다(./app 없음)."; return 1; }

  local create_parent; create_parent="$(_parse_all_flag "$@")"
  local -a clean; clean=($(_strip_all_flag "$@"))
  [[ ${#clean[@]} -ge 2 ]] || { _err "사용법: next-apis [--all|-all|-a] <대분류> <하위1> [하위2] ..."; return 1; }

  local category="${clean[1]}"
  local -a subs=()
  
  # 두 번째 인자부터 공백으로 분할하여 배열에 추가
  local arg
  for arg in "${(@)clean[2,-1]}"; do
    subs+=( ${(z)arg} )
  done

  mkdir -p "./app/api/$category"
  if [[ "$create_parent" == "true" ]]; then
    _touch_safe "./app/api/$category/route.ts"
    _log "🔗 상위 API: /api/$category"
  fi

  local s
  local count=0
  for s in "${subs[@]}"; do
    _touch_safe "./app/api/$category/$s/route.ts"
    ((count++))
    _log "🔗 API 엔드포인트: /api/$category/$s"
  done

  if [[ "$create_parent" == "true" ]]; then
    _log "✅ 총 ${count}개 API 생성 완료 (상위 폴더 및 API 포함)"
  else
    _log "✅ 총 ${count}개 API 생성 완료"
  fi
}

# 엔티티 골격
next-entity() {
  setopt localoptions noglob
  _is_next_root || { _err "여기는 Next.js 프로젝트 루트가 아닙니다(./app 없음)."; return 1; }
  [[ -n "$1" ]] || { _err "사용법: next-entity <엔티티명>"; return 1; }

  local name="$1"
  _log "📄 엔티티 '$name' 생성 중..."
  # 엔티티 바로 아래 파일들 먼저 생성
  _touch_safe "./app/_entities/$name/$name.models.ts"
  _touch_safe "./app/_entities/$name/$name.types.ts"
  _touch_safe "./app/_entities/$name/$name.keys.ts"
  _touch_safe "./app/_entities/$name/$name.store.ts"
  _touch_safe "./app/_entities/$name/$name.api.ts"

  # hooks 폴더 및 하위 파일(필요시)
  mkdir -p "./app/_entities/$name/hooks"
  _touch_safe "./app/_entities/$name/hooks/index.ts"

  _log "✅ 엔티티 '$name' 생성 완료"
}
