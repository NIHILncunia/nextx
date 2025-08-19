import { Command } from 'commander';
import path from 'path';
import fs from 'fs-extra';
import ejs from 'ejs';
import { kebabToPascalCase } from '../utils.js';
import { glob } from 'glob';

async function createCommonEntity() {
  const templateDir = path.resolve(process.cwd(), 'template', 'entity', 'common');
  const outputDir = path.resolve(process.cwd(), 'app', '_entities', 'common');

  const templateFiles = await glob('**/*.ejs', { cwd: templateDir });

  for (const templateFile of templateFiles) {
    const templatePath = path.join(templateDir, templateFile);
    const templateContent = await fs.readFile(templatePath, 'utf-8');
    const renderedContent = ejs.render(templateContent, {}); // No variables needed for common
    
    let outputFile = templateFile.replace(/\.ejs$/, '');
    if (!outputFile.endsWith('.ts')) {
      outputFile += '.ts';
    }
    const outputPath = path.join(outputDir, outputFile);

    await fs.outputFile(outputPath, renderedContent);
    console.log(`${path.basename(outputPath)} 생성 완료. (${path.relative(process.cwd(), outputPath)})`);
  }
}

async function createGenericEntity(entityName: string) {
  const pascalCaseName = kebabToPascalCase(entityName);
  const templateDir = path.resolve(process.cwd(), 'template', 'entity');
  const outputDir = path.resolve(process.cwd(), 'app', '_entities', entityName);

  const typesPath = path.join(outputDir, `${entityName}.types.ts`);
  await fs.outputFile(typesPath, '');
  console.log(`${path.basename(typesPath)} 생성 완료. (${path.relative(process.cwd(), typesPath)})`);
  
  const hooksIndexPath = path.join(outputDir, 'hooks', 'index.ts');
  await fs.outputFile(hooksIndexPath, '');
  console.log(`hooks/index.ts 생성 완료. (${path.relative(process.cwd(), hooksIndexPath)})`);

  // 2. Create keys.ts from template
  const keysTemplate = await fs.readFile(path.join(templateDir, 'keys.ejs'), 'utf-8');
  const keysContent = ejs.render(keysTemplate, { entityName });
  const keysPath = path.join(outputDir, `${entityName}.keys.ts`);
  await fs.outputFile(keysPath, keysContent);
  console.log(`${path.basename(keysPath)} 생성 완료. (${path.relative(process.cwd(), keysPath)})`);

  // 3. Create store.ts from template
  const storeTemplate = await fs.readFile(path.join(templateDir, 'store.ejs'), 'utf-8');
  const storeContent = ejs.render(storeTemplate, { entityName, pascalCaseName });
  const storePath = path.join(outputDir, `${entityName}.store.ts`);
  await fs.outputFile(storePath, storeContent);
  console.log(`${path.basename(storePath)} 생성 완료. (${path.relative(process.cwd(), storePath)})`);
}

export const entityCommand = new Command()
  .name('entity')
  .description('새 엔티티와 관련 파일들을 생성합니다')
  .argument('<name>', '엔티티 이름 (예: post)')
  .action(async (name: string) => {
    console.log(`\n🚀 새 엔티티 '${name}' 생성을 시작합니다...`);

    try {
      if (name.toLowerCase() === 'common') {
        await createCommonEntity();
      } else {
        await createGenericEntity(name);
      }
      console.log('\n🎉 모든 작업이 성공적으로 완료되었습니다!');
    } catch (error) {
      console.error('\n❌ 오류가 발생했습니다:', error);
    }
  });
