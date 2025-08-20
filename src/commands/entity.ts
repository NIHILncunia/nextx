import { Command } from 'commander';
import path from 'path';
import fs from 'fs-extra';
import ejs from 'ejs';
import { fileURLToPath } from 'url';
import { kebabToPascalCase, NextxConfig } from '../utils.js';
import { glob } from 'glob';

// ESM에서 __dirname을 사용하기 위한 설정
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createCommonEntity(config: NextxConfig, projectRoot: string, messages: any) {
  const templateDir = path.resolve(__dirname, '..', '..', 'template', 'entity', 'common');
  const outputDir = path.resolve(projectRoot, config.aliases.entities, 'common');

  const templateFiles = await glob('**/*.ejs', { cwd: templateDir });

  for (const templateFile of templateFiles) {
    const templatePath = path.join(templateDir, templateFile);
    const templateContent = await fs.readFile(templatePath, 'utf-8');
    const renderedContent = ejs.render(templateContent, {});

    let outputFile = templateFile.replace(/\.ejs$/, '');
    if (!outputFile.endsWith('.ts')) {
      outputFile += '.ts';
    }
    const outputPath = path.join(outputDir, outputFile);

    await fs.outputFile(outputPath, renderedContent);
    console.log(messages.entity.createFile(path.basename(outputPath), path.relative(projectRoot, outputPath)));
  }
}

async function createGenericEntity(entityName: string, config: NextxConfig, projectRoot: string, messages: any) {
  const pascalCaseName = kebabToPascalCase(entityName);
  const templateDir = path.resolve(__dirname, '..', '..', 'template', 'entity');
  const outputDir = path.resolve(projectRoot, config.aliases.entities, entityName);

  const typesPath = path.join(outputDir, `${entityName}.types.ts`);
  await fs.outputFile(typesPath, '');
  console.log(messages.entity.createFile(path.basename(typesPath), path.relative(projectRoot, typesPath)));

  const hooksIndexPath = path.join(outputDir, 'hooks', 'index.ts');
  await fs.outputFile(hooksIndexPath, '');
  console.log(messages.entity.createFile('hooks/index.ts', path.relative(projectRoot, hooksIndexPath)));

  const keysTemplate = await fs.readFile(path.join(templateDir, 'keys.ejs'), 'utf-8');
  const keysContent = ejs.render(keysTemplate, { entityName });
  const keysPath = path.join(outputDir, `${entityName}.keys.ts`);
  await fs.outputFile(keysPath, keysContent);
  console.log(messages.entity.createFile(path.basename(keysPath), path.relative(projectRoot, keysPath)));

  const storeTemplate = await fs.readFile(path.join(templateDir, 'store.ejs'), 'utf-8');
  const storeContent = ejs.render(storeTemplate, { entityName, pascalCaseName });
  const storePath = path.join(outputDir, `${entityName}.store.ts`);
  await fs.outputFile(storePath, storeContent);
  console.log(messages.entity.createFile(path.basename(storePath), path.relative(projectRoot, storePath)));
}

export function entityCommand(projectRoot: string, config: NextxConfig, messages: any): Command {
  const command = new Command('entity');

  command
    .description('새 엔티티와 관련 파일들을 생성합니다')
    .argument('<name>', '엔티티 이름 (예: post)')
    .action(async (name: string) => {
      console.log(messages.entity.start(name));
      console.log(messages.common.projectPath(projectRoot));
      console.log(messages.entity.entityPath(config.aliases.entities));

      try {
        if (name.toLowerCase() === 'common') {
          await createCommonEntity(config, projectRoot, messages);
        } else {
          await createGenericEntity(name, config, projectRoot, messages);
        }
        console.log(messages.common.success);
      } catch (error) {
        console.error(messages.common.error, error);
      }
    });

  return command;
}
