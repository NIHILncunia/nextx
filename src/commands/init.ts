import { Command } from 'commander';
import path from 'path';
import fs from 'fs-extra';
import { NextxConfig, getMessages } from '../utils.js';
import { entityCommand } from './entity.js';
import { spawn } from 'child_process';

// 타입 정의가 필요하므로 ko.ts에서 가져옵니다.
import { ko } from '../lang/ko.js';
type Messages = typeof ko;

export function initCommand(projectRoot: string, config: NextxConfig, messages: Messages): Command {
  const command = new Command('init');

  command
    .description('nextx 프로젝트 초기화')
    .option('-f, --force', '기존 설정 파일을 덮어씁니다')
    .action(async (options) => {
      try {
        let configCreated = false;

        // 1. nextx.config.json 생성 (이미 있으면 건너뛰기)
        try {
          await createConfigFile(projectRoot, options.force);
          configCreated = true;
          console.log('📝 nextx.config.json 파일이 생성되었습니다.');
        } catch (error) {
          if (error instanceof Error && error.message.includes('이미 존재합니다')) {
            console.log('📝 nextx.config.json 파일이 이미 존재합니다. 다른 작업을 진행합니다.');
          } else {
            throw error;
          }
        }

        // 2. 유틸리티 함수들 생성
        await createCnFunction(projectRoot, config);
        await createAxiosTools(projectRoot, config);

        // 3. entity common 생성
        await createEntityCommon(projectRoot, config, messages);

        // 4. 의존성 패키지 설치
        await installDependencies(projectRoot);

        console.log('✅ nextx 초기화가 완료되었습니다!');
        if (!configCreated) {
          console.log('📝 nextx.config.json 파일은 이미 존재했습니다.');
        }
        console.log('🔧 필요한 유틸리티 함수들이 추가되었습니다.');
        console.log('📦 entity common 파일들이 생성되었습니다.');
        console.log('📦 필수 의존성 패키지들이 설치되었습니다.');

      } catch (error) {
        console.error('❌ 초기화 중 오류가 발생했습니다:', error);
        process.exit(1);
      }
    });

  return command;
}

async function createConfigFile(projectRoot: string, force: boolean = false): Promise<void> {
  const configPath = path.join(projectRoot, 'nextx.config.json');

  if (fs.existsSync(configPath) && !force) {
    throw new Error('nextx.config.json 파일이 이미 존재합니다. --force 옵션을 사용하여 덮어쓰세요.');
  }

  const defaultConfig = {
    "lang": "ko",
    "useSrc": true,
    "componentInRoute": false,
    "componentCategory": true,
    "useSetMeta": false,
    "aliases": {
      "app": "app",
      "entities": "app/_entities",
      "components": "app/_components",
      "libs": "app/_libs"
    }
  };

  await fs.writeJson(configPath, defaultConfig, { spaces: 2 });
}

async function createCnFunction(projectRoot: string, config: NextxConfig): Promise<void> {
  const libsPath = config.aliases.libs || 'app/_libs';
  const fullLibsPath = path.join(projectRoot, libsPath);

  // 디렉토리 생성
  await fs.ensureDir(fullLibsPath);

  // 템플릿 파일 읽기
  const templatePath = path.join(path.dirname(new URL(import.meta.url).pathname), '..', '..', 'template', 'lib', 'cn.ejs');
  const cnContent = await fs.readFile(templatePath, 'utf8');

  const cnPath = path.join(fullLibsPath, 'cn.ts');
  await fs.writeFile(cnPath, cnContent);

  // index.ts 파일 생성 또는 업데이트
  const indexPath = path.join(fullLibsPath, 'index.ts');
  let indexContent = '';

  if (fs.existsSync(indexPath)) {
    indexContent = await fs.readFile(indexPath, 'utf8');
    if (!indexContent.includes("export { cn }")) {
      indexContent += '\nexport { cn } from \'./cn\';\n';
    }
  } else {
    indexContent = 'export { cn } from \'./cn\';\n';
  }

  await fs.writeFile(indexPath, indexContent);
}



async function createAxiosTools(projectRoot: string, config: NextxConfig): Promise<void> {
  const libsPath = config.aliases.libs || 'app/_libs';
  const toolsPath = path.join(projectRoot, libsPath, 'tools');

  // 디렉토리 생성
  await fs.ensureDir(toolsPath);

  // 템플릿 파일 읽기
  const templatePath = path.join(path.dirname(new URL(import.meta.url).pathname), '..', '..', 'template', 'lib', 'tools', 'axios.tools.ejs');
  const axiosToolsContent = await fs.readFile(templatePath, 'utf8');

  const axiosToolsPath = path.join(toolsPath, 'axios.tools.ts');
  await fs.writeFile(axiosToolsPath, axiosToolsContent);

  // index.ts 파일 업데이트
  const indexPath = path.join(projectRoot, libsPath, 'index.ts');
  let indexContent = '';

  if (fs.existsSync(indexPath)) {
    indexContent = await fs.readFile(indexPath, 'utf8');
    if (!indexContent.includes("export { Api }")) {
      indexContent += '\nexport { Api } from \'./tools/axios.tools\';\n';
    }
  } else {
    indexContent = 'export { Api } from \'./tools/axios.tools\';\n';
  }

  await fs.writeFile(indexPath, indexContent);
}

async function createEntityCommon(projectRoot: string, config: NextxConfig, messages: Messages): Promise<void> {
  // entity common 명령어를 시뮬레이션
  const entityPath = config.aliases.entities || 'app/_entities';
  const fullEntityPath = path.join(projectRoot, entityPath);

  // 디렉토리 생성
  await fs.ensureDir(fullEntityPath);

  // common 디렉토리 생성
  const commonPath = path.join(fullEntityPath, 'common');
  await fs.ensureDir(commonPath);

  // 템플릿 파일들을 복사
  const templateFiles = [
    'common.types.ejs',
    'common.keys.ejs',
    'common.store.ejs',
    'process.d.ejs',
    'react-query.d.ejs'
  ];

  for (const file of templateFiles) {
    const templatePath = path.join(path.dirname(new URL(import.meta.url).pathname), '..', '..', 'template', 'entity', 'common', file);
    const content = await fs.readFile(templatePath, 'utf8');
    const outputPath = path.join(commonPath, file.replace('.ejs', '.ts'));
    await fs.writeFile(outputPath, content);
  }

  // hooks 디렉토리 생성
  const hooksPath = path.join(commonPath, 'hooks');
  await fs.ensureDir(hooksPath);

  // hooks 파일들 복사
  const hooksFiles = [
    'index.ejs',
    'use-done.ejs',
    'use-loading.ejs'
  ];

  for (const file of hooksFiles) {
    const templatePath = path.join(path.dirname(new URL(import.meta.url).pathname), '..', '..', 'template', 'entity', 'common', 'hooks', file);
    const content = await fs.readFile(templatePath, 'utf8');
    const outputPath = path.join(hooksPath, file.replace('.ejs', '.ts'));
    await fs.writeFile(outputPath, content);
  }

  // hooks/api 디렉토리 생성
  const apiHooksPath = path.join(hooksPath, 'api');
  await fs.ensureDir(apiHooksPath);

  // api hooks 파일들 복사
  const apiHooksFiles = [
    'use-get.ejs',
    'use-post.ejs',
    'use-patch.ejs',
    'use-put.ejs',
    'use-delete.ejs'
  ];

  for (const file of apiHooksFiles) {
    const templatePath = path.join(path.dirname(new URL(import.meta.url).pathname), '..', '..', 'template', 'entity', 'common', 'hooks', 'api', file);
    const content = await fs.readFile(templatePath, 'utf8');
    const outputPath = path.join(apiHooksPath, file.replace('.ejs', '.ts'));
    await fs.writeFile(outputPath, content);
  }
}

async function installDependencies(projectRoot: string): Promise<void> {
  console.log('📦 필수 의존성 패키지들을 설치합니다...');

  // package.json 확인
  const packageJsonPath = path.join(projectRoot, 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    console.log('⚠️ package.json 파일이 없습니다. 패키지 설치를 건너뜁니다.');
    return;
  }

  // package manager 확인
  const packageManager = await detectPackageManager(projectRoot);

  // 의존성 패키지들
  const dependencies = [
    '@tanstack/react-query',
    '@lukemorales/query-key-factory',
    'axios',
    'class-variance-authority',
    'clsx',
    'tailwind-merge'
  ];

  const devDependencies = [
    '@tanstack/react-query-devtools'
  ];

  try {
    // dependencies 설치
    console.log('📦 프로덕션 의존성을 설치합니다...');
    await installPackages(dependencies, packageManager, projectRoot, false);

    // devDependencies 설치
    console.log('📦 개발 의존성을 설치합니다...');
    await installPackages(devDependencies, packageManager, projectRoot, true);

    console.log('✅ 모든 의존성 패키지 설치가 완료되었습니다!');
  } catch (error) {
    console.error('❌ 패키지 설치 중 오류가 발생했습니다:', error);
    console.log('💡 수동으로 다음 명령어를 실행하세요:');
    console.log(`   ${packageManager} add ${dependencies.join(' ')}`);
    console.log(`   ${packageManager} add -D ${devDependencies.join(' ')}`);
  }
}

async function detectPackageManager(projectRoot: string): Promise<string> {
  // package-lock.json, yarn.lock, pnpm-lock.yaml 확인
  if (fs.existsSync(path.join(projectRoot, 'pnpm-lock.yaml'))) {
    return 'pnpm';
  } else if (fs.existsSync(path.join(projectRoot, 'yarn.lock'))) {
    return 'yarn';
  } else if (fs.existsSync(path.join(projectRoot, 'package-lock.json'))) {
    return 'npm';
  } else {
    // 기본값으로 npm 사용
    return 'npm';
  }
}

async function installPackages(
  packages: string[],
  packageManager: string,
  projectRoot: string,
  isDev: boolean = false
): Promise<void> {
  return new Promise((resolve, reject) => {
    const args = isDev ? [ 'add', '-D', ...packages ] : [ 'add', ...packages ];

    const child = spawn(packageManager, args, {
      cwd: projectRoot,
      stdio: 'inherit',
      shell: true
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${packageManager} install failed with code ${code}`));
      }
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
}