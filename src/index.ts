#!/usr/bin/env node
import { Command } from 'commander';
import fs from 'fs';
import path from 'path';
import { pageCommand } from './commands/page.js';
import { apiCommand } from './commands/api.js';
import { entityCommand } from './commands/entity.js';

// Check if running in a Next.js project
const projectRoot = process.cwd();
const nextConfigJs = path.join(projectRoot, 'next.config.js');
const nextConfigMjs = path.join(projectRoot, 'next.config.mjs');
const nextConfigTs = path.join(projectRoot, 'next.config.ts');

if (!fs.existsSync(nextConfigJs) && !fs.existsSync(nextConfigMjs) && !fs.existsSync(nextConfigTs)) {
  console.error('\n❌ 여기는 Next.js 프로젝트 루트가 아닙니다.');
  console.error('   (next.config.js, .mjs, .ts 파일을 찾을 수 없습니다.)');
  process.exit(1); // Exit with an error code
}

const program = new Command();

program
  .name('nextx')
  .description('Next.js 앱 라우터 프로젝트를 위한 스캐폴딩 CLI')
  .version('0.1.0');

// 명령어 등록
program.addCommand(pageCommand);
program.addCommand(apiCommand);
program.addCommand(entityCommand);

program.parse(process.argv);
