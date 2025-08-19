import { Command } from 'commander';
import path from 'path';
import fs from 'fs-extra';
import ejs from 'ejs';
import { kebabToPascalCase, generateIntermediatePaths } from '../utils.js';

async function createPageFiles(group: string, routePath: string) {
  const isGroupRoot = routePath === '';

  if (isGroupRoot && group !== 'common') {
    console.log(`
ℹ️ '${group}' 그룹 최상위에는 페이지를 생성하지 않으므로 건너뜁니다.`);
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
  const templateDir = path.resolve(process.cwd(), 'template');
  const outputDir = path.resolve(process.cwd(), 'app', `(${group})`, routePath);

  // 1. Component file creation
  const componentTemplatePath = path.join(templateDir, 'component.ejs');
  const componentTemplate = await fs.readFile(componentTemplatePath, 'utf-8');
  const componentContent = ejs.render(componentTemplate, { pascalCaseName });
  const componentOutputPath = path.join(outputDir, '_components', `${componentFileName}.tsx`);
  await fs.outputFile(componentOutputPath, componentContent);
  console.log(`${path.basename(componentOutputPath)} 생성 완료. (${path.relative(process.cwd(), componentOutputPath)})`);

  // 2. Page file creation
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
  console.log(`${path.basename(pageOutputPath)} 생성 완료. (${path.relative(process.cwd(), pageOutputPath)})`);
}

export const pageCommand = new Command()
  .name('page')
  .description('새 페이지 라우트를 생성하고 템플릿으로 파일을 채웁니다')
  .argument('<group>', '라우트 그룹 (예: \'common\')')
  .argument('<paths...>', '하나 이상의 페이지 경로 (예: \'posts/new\')')
  .option('-a, --all', '모든 상위 경로에 페이지를 함께 생성합니다')
  .action(async (group, paths, options) => {
    console.log(`
🚀 새 페이지 생성을 시작합니다...`);
    console.log(`  - 그룹: ${group}`);
    console.log(`  - 경로: ${paths.join(', ')}`);

    try {
      const createdPaths = new Set(paths);

      for (const routePath of paths) {
        await createPageFiles(group, routePath);
      }

      if (options.all) {
        console.log('ℹ️ --all 옵션 감지. 모든 상위 경로에 페이지를 생성합니다.');
        const intermediatePaths = generateIntermediatePaths(paths);

        for (const intermediatePath of intermediatePaths) {
          if (!createdPaths.has(intermediatePath)) {
            await createPageFiles(group, intermediatePath);
            createdPaths.add(intermediatePath); // Avoid re-creating
          }
        }
      }

      console.log('🎉 모든 작업이 성공적으로 완료되었습니다!');

    } catch (error) {
      console.error('❌ 오류가 발생했습니다:', error);
    }
  });