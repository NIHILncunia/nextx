export const ko = {
  common: {
    error: '\n❌ 오류가 발생했습니다:',
    allOptionDetected: '\nℹ️  --all 옵션 감지. 모든 상위 경로에 페이지를 생성합니다.',
    success: '\n🎉 모든 작업이 성공적으로 완료되었습니다!',
    projectPath: (path: string) => `  - 프로젝트 경로: ${path}`,
  },
  errors: {
    projectNotFound: '\n❌ Next.js 프로젝트를 찾을 수 없습니다.',
    projectNotFoundHint: '   현재 디렉토리 또는 모노레포 작업 공간에 Next.js 프로젝트가 있는지 확인해주세요.',
    pnpmWorkspaceError: '❌ pnpm-workspace.yaml 처리 중 오류가 발생했습니다:',
    configParseError: (fileName: string) => `❌ ${fileName} 파일을 읽거나 처리하는 중 오류가 발생했습니다:`,
  },
  page: {
    start: '\n🚀 새 페이지 생성을 시작합니다...', 
    group: (group: string) => `  - 그룹: ${group}`,
    path: (path: string) => `  - 경로: ${path}`,
    appDir: (path: string) => `  - 앱 디렉토리: ${path}`,
    skipRoot: (group: string) => `\nℹ️  '${group}' 그룹 최상위에는 페이지를 생성하지 않으므로 건너뜁니다.`,
    createFile: (fileName: string, path: string) => `✅ ${fileName} 생성 완료. (${path})`,
  },
  api: {
    start: '\n🚀 새 API 라우트 생성을 시작합니다...', 
    category: (category: string) => `  - 카테고리: ${category}`,
    path: (path: string) => `  - 경로: ${path}`,
    appDir: (path: string) => `  - 앱 디렉토리: ${path}`,
    createFile: (fileName: string, path: string) => `✅ ${fileName} 생성 완료. (${path})`,
  },
  entity: {
    start: (name: string) => `\n🚀 새 엔티티 '${name}' 생성을 시작합니다...`,
    entityPath: (path: string) => `  - 엔티티 경로: ${path}`,
    createFile: (fileName: string, path: string) => `✅ ${fileName} 생성 완료. (${path})`,
  },
  config: {
    description: 'nextx 설정을 확인하거나 변경합니다.',
    get: {
      description: '설정 값을 확인합니다. (현재 `lang`만 지원)',
    },
    set: {
      description: '설정 값을 변경합니다. (현재 `lang`만 지원)',
      success: (key: string, value: string) => `✅ 설정이 성공적으로 변경되었습니다: ${key} = ${value}`,
      error: '설정 파일 수정 중 오류가 발생했습니다:',
    },
    common: {
      unknownKey: (key: string) => `알 수 없는 설정 키입니다: ${key}`,
      manualEdit: '오류: `nextx.config.ts` 또는 `.js` 파일은 직접 수정해야 합니다.',
    },
  },
};