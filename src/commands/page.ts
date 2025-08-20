import { Command } from 'commander';
import path from 'path';
import fs from 'fs-extra';
import ejs from 'ejs';
import { fileURLToPath } from 'url';
import { kebabToPascalCase, generateIntermediatePaths, NextxConfig } from '../utils.js';

// ESM에서 __dirname을 사용하기 위한 설정
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createPageFiles(group: string, routePath: string, config: NextxConfig, projectRoot: string, messages: any) {
  const isGroupRoot = routePath === '';

  if (isGroupRoot && group !== 'common') {
    console.log(messages.page.skipRoot(group));
    return;
  }

  const isDynamic = routePath.includes('[');
  const dynamicMatches = routePath.match(/.*\[(.*?)].*/g) || [];
  const dynamicParamCount = dynamicMatches.length;

  let pascalCaseName: string;

  if (isGroupRoot && group === 'common') {
    pascalCaseName = 'Home';
  } else if (isDynamic && dynamicParamCount === 1 && (dynamicMatches[0].toLowerCase().includes('id'))) {
    const dynamicParam = dynamicMatches[0].replace(/[\\\[\\\]]/g, '');
    const entityName = dynamicParam.toLowerCase().replace('id', '');
    pascalCaseName = kebabToPascalCase(entityName) + 'Detail';
  } else {
    pascalCaseName = kebabToPascalCase(routePath);
  }

  const componentFileName = pascalCaseName;
  const templateDir = path.resolve(__dirname, '..', '..', 'template');
  const outputDir = path.resolve(projectRoot, config.aliases.app, `(${group})`, routePath);

  // Component file creation
  const componentTemplatePath = path.join(templateDir, 'component.ejs');
  const componentTemplate = await fs.readFile(componentTemplatePath, 'utf-8');
  const componentContent = ejs.render(componentTemplate, { pascalCaseName });
  const componentOutputPath = path.join(outputDir, '_components', `${componentFileName}.tsx`);
  await fs.outputFile(componentOutputPath, componentContent);
  console.log(messages.page.createFile(path.basename(componentOutputPath), path.relative(projectRoot, componentOutputPath)));

  // Page file creation
  const pageTemplateData: any = { pascalCaseName, group, routePath };
  let pageTemplatePath: string;

  if (isDynamic) {
    pageTemplatePath = path.join(templateDir, 'page-dynamic.ejs');
    const match = routePath.match(/.*\[(.*?)].*/);
    pageTemplateData.dynamicParam = match ? match[1] : 'id';
  } else {
    pageTemplatePath = path.join(templateDir, 'page.ejs');
  }

  const pageTemplate = await fs.readFile(pageTemplatePath, 'utf-8');
  const pageContent = ejs.render(pageTemplate, pageTemplateData);
  const pageOutputPath = path.join(outputDir, 'page.tsx');
  await fs.outputFile(pageOutputPath, pageContent);
  console.log(messages.page.createFile(path.basename(pageOutputPath), path.relative(projectRoot, pageOutputPath)));
}

export function pageCommand(projectRoot: string, config: NextxConfig, messages: any): Command {
  const command = new Command('page');

  command
    .description('새 페이지 라우트를 생성하고 템플릿으로 파일을 채웁니다')
    .argument('<group>', '라우트 그룹 (예: \'common\')')
    .argument('<paths...>', '하나 이상의 페이지 경로 (예: \'posts/new\')')
    .option('-a, --all', '모든 상위 경로에 페이지를 함께 생성합니다')
    .action(async (group, paths, options) => {
      console.log(messages.page.start);
      console.log(messages.common.projectPath(projectRoot));
      console.log(messages.page.group(group));
      console.log(messages.page.path(paths.join(', ')));
      console.log(messages.page.appDir(config.aliases.app));

      try {
        const createdPaths = new Set(paths);

        for (const routePath of paths) {
          await createPageFiles(group, routePath, config, projectRoot, messages);
        }

        if (options.all) {
          console.log(messages.common.allOptionDetected);
          const intermediatePaths = generateIntermediatePaths(paths);

          for (const intermediatePath of intermediatePaths) {
            if (!createdPaths.has(intermediatePath)) {
              await createPageFiles(group, intermediatePath, config, projectRoot, messages);
              createdPaths.add(intermediatePath);
            }
          }
        }

        console.log(messages.common.success);

      } catch (error) {
        console.error(messages.common.error, error);
      }
    });

  return command;
}