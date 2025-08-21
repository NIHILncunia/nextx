import { Command } from 'commander';
import path from 'path';
import fs from 'fs-extra';
import ejs from 'ejs';
import { fileURLToPath } from 'url';
import readline from 'readline';
import { 
  kebabToPascalCase, 
  NextxConfig, 
  getAppPath, 
  determineComponentPath, 
  getComponentImportPath,
  shouldComponentInRoute,
  shouldUseSrc,
  shouldComponentCategory
} from '../utils.js';

// ESM에서 __dirname을 사용하기 위한 설정
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 사용자에게 파일 덮어쓰기 여부를 묻는 함수
async function promptOverwrite(filePath: string, messages: any): Promise<boolean> {
  // TTY 환경이 아니면(즉, 파이프나 파일 리디렉션 등) 안전하게 false를 반환
  if (!process.stdin.isTTY) {
    return false;
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(messages.page.overwritePrompt(filePath), (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase() === 'y');
    });
  });
}

async function createPageFiles(group: string, routePath: string, config: NextxConfig, projectRoot: string, messages: any, customComponentName?: string, force: boolean = false) {
  const isGroupRoot = routePath === '';

  if (isGroupRoot && group !== 'common') {
    console.log(messages.page.skipRoot(group));
    return;
  }

  const isDynamic = routePath.includes('[');
  const dynamicMatches = routePath.match(/.*[[](.*?)]/g) || [];
  const dynamicParamCount = dynamicMatches.length;

  let pascalCaseName: string;

  if (customComponentName) {
    pascalCaseName = kebabToPascalCase(customComponentName);
  } else if (isGroupRoot && group === 'common') {
    pascalCaseName = 'Home';
  } else if (isDynamic && dynamicParamCount === 1 && (dynamicMatches[0].toLowerCase().includes('id'))) {
    const dynamicParam = dynamicMatches[0].replace(/[\\\[\\\\]]/g, '');
    const entityName = dynamicParam.toLowerCase().replace('id', '');
    pascalCaseName = kebabToPascalCase(entityName) + 'Detail';
  } else {
    pascalCaseName = kebabToPascalCase(routePath);
  }

  const componentFileName = pascalCaseName;
  const templateDir = path.resolve(__dirname, '..', '..', 'template');
  
  // 새로운 경로 결정 로직
  const appPath = getAppPath(config);
  const outputDir = path.resolve(projectRoot, appPath, `(${group})`, routePath);
  
  // 컴포넌트 경로 결정
  const componentOutputPath = determineComponentPath(config, group, routePath, componentFileName);
  const fullComponentPath = path.resolve(projectRoot, componentOutputPath);
  const pageOutputPath = path.join(outputDir, 'page.tsx');

  // 컴포넌트 import 경로 결정
  const componentImportPath = getComponentImportPath(config, group, routePath, componentFileName);

  const filesToCreate = [
    {
      path: fullComponentPath,
      template: 'component.ejs',
      data: { pascalCaseName },
      name: `${componentFileName}.tsx`
    },
    {
      path: pageOutputPath,
      template: isDynamic ? 'page-dynamic.ejs' : 'page.ejs',
      data: {
        pascalCaseName,
        group,
        routePath,
        componentImportPath,
        dynamicParam: isDynamic ? (routePath.match(/.*[[](.*?)]/)?.[1] ?? 'id') : undefined
      },
      name: 'page.tsx'
    }
  ];

  for (const file of filesToCreate) {
    const fileExists = await fs.pathExists(file.path);
    let shouldWrite = true;

    if (fileExists && !force) {
      shouldWrite = await promptOverwrite(path.relative(projectRoot, file.path), messages);
    }

    if (shouldWrite) {
      const templatePath = path.join(templateDir, file.template);
      const templateContent = await fs.readFile(templatePath, 'utf-8');
      const finalContent = ejs.render(templateContent, file.data);
      await fs.outputFile(file.path, finalContent);
      console.log(messages.page.createFile(file.name, path.relative(projectRoot, file.path)));
    } else {
      console.log(messages.page.skipFile(file.name, path.relative(projectRoot, file.path)));
    }
  }
}

export function pageCommand(projectRoot: string, config: NextxConfig, messages: any): Command {
  const command = new Command('page');

  command
    .description('새 페이지 라우트를 생성하고 템플릿으로 파일을 채웁니다')
    .argument('<group>', '라우트 그룹 (예: \'common\')')
    .argument('<paths...>', '하나 이상의 페이지 경로 (예: \'posts/new\')')
    .option('-a, --all', '입력된 경로의 모든 중간 경로에 페이지를 함께 생성합니다')
    .option('-r, --root', '그룹의 최상위 경로에도 페이지를 생성합니다')
    .option('-f, --force', '파일이 이미 있어도 강제로 덮어씁니다')
    .option('-c, --component <names...>', '생성될 경로에 순서대로 적용할 컴포넌트 이름을 지정합니다.')
    .action(async (group, paths, options) => {
      console.log(messages.page.start);
      console.log('');
      console.log(messages.common.projectPath(projectRoot));
      console.log(messages.page.appDir(getAppPath(config)));
      console.log(messages.page.group(group));
      console.log(messages.page.path(paths.join(', ')));
      console.log(messages.page.srcDirectory(shouldUseSrc(config)));
      console.log(messages.page.componentLocation(shouldComponentInRoute(config) ? '라우트 내부' : '공용 폴더'));
      if (!shouldComponentInRoute(config)) {
        console.log(messages.page.componentCategory(shouldComponentCategory(config)));
      }
      console.log('');

      try {
        let pathsToCreate: Set<string>;

        if (options.all) {
          const allSegmentPaths = new Set<string>();
          for (const p of paths) {
            const pathSegments = p.split('/').filter(Boolean);
            let currentPath = '';
            for (const segment of pathSegments) {
              currentPath = path.join(currentPath, segment);
              allSegmentPaths.add(currentPath);
            }
          }
          pathsToCreate = allSegmentPaths;
        } else {
          pathsToCreate = new Set<string>(paths);
        }

        if (options.root) {
          pathsToCreate.add('');
        }

        const sortedPaths = [...pathsToCreate].sort();

        const componentNames = options.component as string[] | undefined;

        if (componentNames && componentNames.length !== sortedPaths.length) {
          console.error(messages.page.componentNameCountMismatch(sortedPaths.length, componentNames.length));
          process.exit(1);
        }

        const componentNameMap = new Map<string, string>();
        if (componentNames) {
          sortedPaths.forEach((path, index) => {
            const componentName = componentNames[index];
            if (componentName) {
              componentNameMap.set(path, componentName);
            }
          });
        }

        for (const routePath of sortedPaths) {
          const customComponentName = componentNameMap.get(routePath);
          await createPageFiles(group, routePath, config, projectRoot, messages, customComponentName, options.force);
        }

        console.log(messages.common.success);

      } catch (error) {
        console.error(messages.common.error, error);
      }    });

  return command;
}