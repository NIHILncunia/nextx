import { Command } from 'commander';
import path from 'path';
import fs from 'fs-extra';
import ejs from 'ejs';

import { generateIntermediatePaths } from '../utils.js';

// Helper function to create the route.ts file
async function createApiRouteFile(category: string, apiPath: string) {
  const outputDir = path.resolve(process.cwd(), 'app', 'api', category, apiPath);
  const templateDir = path.resolve(process.cwd(), 'template');

  const isDynamic = apiPath.includes('[');
  const templateData: any = {};
  let templatePath: string;

  if (isDynamic) {
    templatePath = path.join(templateDir, 'api-dynamic.ejs');
    const match = apiPath.match(/\[(.*?)\]/);
    templateData.dynamicParam = match ? match[1] : 'id';
  } else {
    templatePath = path.join(templateDir, 'route.ejs');
  }

  const templateContent = await fs.readFile(templatePath, 'utf-8');
  const finalContent = ejs.render(templateContent, templateData);
  const outputPath = path.join(outputDir, 'route.ts');
  await fs.outputFile(outputPath, finalContent);
  console.log(`${path.basename(outputPath)} 생성 완료. (${path.relative(process.cwd(), outputPath)})`);
}

export const apiCommand = new Command()
  .name('api')
  .description('새 API 라우트를 생성하고 route.ts 파일을 채웁니다')
  .argument('<category>', 'API 카테고리 (예: \'users\')')
  .argument('<paths...>', '하나 이상의 API 경로 (예: \'search\')')
  .option('-a, --all', '모든 상위 경로에 API 라우트를 함께 생성합니다')
  .action(async (category, paths, options) => {
    console.log(`\n🚀 새 API 라우트 생성을 시작합니다...`);
    console.log(`  - 카테고리: ${category}`);
    console.log(`  - 경로: ${paths.join(', ')}`);

    try {
      const createdPaths = new Set(paths);

      for (const apiPath of paths) {
        await createApiRouteFile(category, apiPath);
      }

      if (options.all) {
        console.log('\nℹ️ --all 옵션 감지. 모든 상위 경로에 API 라우트를 생성합니다.');
        const intermediatePaths = generateIntermediatePaths(paths);

        for (const intermediatePath of intermediatePaths) {
          if (!createdPaths.has(intermediatePath)) {
            await createApiRouteFile(category, intermediatePath);
            createdPaths.add(intermediatePath); // Avoid re-creating
          }
        }
      }

      console.log('\n🎉 모든 작업이 성공적으로 완료되었습니다!');

    } catch (error) {
      console.error('\n❌ 오류가 발생했습니다:', error);
    }
  });