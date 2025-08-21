import { Command } from 'commander';
import path from 'path';
import fs from 'fs-extra';
import ejs from 'ejs';
import { fileURLToPath } from 'url';
import { generateIntermediatePaths, NextxConfig, getAppPath } from '../utils.js';

// ESM에서 __dirname을 사용하기 위한 설정
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createApiRouteFile(category: string, apiPath: string, config: NextxConfig, projectRoot: string, messages: any) {
  const templateDir = path.resolve(__dirname, '..', '..', 'template');
  const appPath = getAppPath(config);
  const outputDir = path.resolve(projectRoot, appPath, 'api', category, apiPath);

  const isDynamic = apiPath.includes('[');
  const templateData: any = {};
  let templatePath: string;

  if (isDynamic) {
    templatePath = path.join(templateDir, 'api-dynamic.ejs');
    const match = apiPath.match(/.*[[]([^]]*[])].*/);
    templateData.dynamicParam = match ? match[1] : 'id';
  } else {
    templatePath = path.join(templateDir, 'route.ejs');
  }

  const templateContent = await fs.readFile(templatePath, 'utf-8');
  const finalContent = ejs.render(templateContent, templateData);
  const outputPath = path.join(outputDir, 'route.ts');
  await fs.outputFile(outputPath, finalContent);
  console.log(messages.api.createFile(path.basename(outputPath), path.relative(projectRoot, outputPath)));
}

export function apiCommand(projectRoot: string, config: NextxConfig, messages: any): Command {
  const command = new Command('api');

  command
    .description('새 API 라우트를 생성하고 route.ts 파일을 채웁니다')
    .argument('<category>', 'API 카테고리 (예: \'users\')')
    .argument('[paths...]', '하나 이상의 API 경로 (생략 시 카테고리 루트에 생성)')
    .option('-a, --all', '모든 상위 경로에 API 라우트를 함께 생성합니다')
    .action(async (category, paths, options) => {
      if (paths.length === 0) {
        paths.push('');
      }

      console.log(messages.api.start);
      console.log(messages.common.projectPath(projectRoot));
      console.log(messages.api.category(category));
      console.log(messages.api.path(paths.map((p: string) => p === '' ? '/' : p).join(', ')));
      console.log(messages.api.appDir(getAppPath(config)));

      try {
        const createdPaths = new Set(paths);

        for (const apiPath of paths) {
          await createApiRouteFile(category, apiPath, config, projectRoot, messages);
        }

        if (options.all) {
          console.log(messages.common.allOptionDetected);
          const intermediatePaths = generateIntermediatePaths(paths);

          for (const intermediatePath of intermediatePaths) {
            if (!createdPaths.has(intermediatePath)) {
              await createApiRouteFile(category, intermediatePath, config, projectRoot, messages);
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