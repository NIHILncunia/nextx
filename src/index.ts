#!/usr/bin/env node
import { Command } from 'commander';
import { pageCommand } from './commands/page.js';
import { apiCommand } from './commands/api.js';
import { entityCommand } from './commands/entity.js';
import { configCommand } from './commands/config.js'; // configCommand import
import { initCommand } from './commands/init.js'; // initCommand import
import { findProjectRoot, loadConfig, getMessages } from './utils.js';

async function main() {
  // 1. 프로젝트 루트를 먼저 찾습니다.
  const projectRoot = await findProjectRoot();

  // 2. 설정을 로드합니다. (프로젝트 루트가 없어도 기본 설정은 로드)
  const config = await loadConfig(projectRoot);

  // 3. 언어 파일을 로드합니다.
  const messages = await getMessages(config.lang);

  // 4. 프로젝트 루트 유효성을 검사합니다. (config, init 명령어는 예외)
  const isConfigCommand = process.argv.includes('config');
  const isInitCommand = process.argv.includes('init');
  if (!projectRoot && !isConfigCommand && !isInitCommand) {
    console.error(messages.errors.projectNotFound);
    console.error(messages.errors.projectNotFoundHint);
    process.exit(1);
  }

  const program = new Command();

  program
    .name('nextx')
    .description('Next.js 앱 라우터 프로젝트를 위한 스캐폴딩 CLI')
    .version('0.2.0');

  // 5. 찾은 정보들을 각 명령어에 전달합니다.
  // projectRoot가 없는 경우(config, init 명령어 실행 시)에는 빈 문자열을 전달합니다.
  program.addCommand(pageCommand(projectRoot || '', config, messages));
  program.addCommand(apiCommand(projectRoot || '', config, messages));
  program.addCommand(entityCommand(projectRoot || '', config, messages));
  program.addCommand(configCommand(projectRoot || '', config, messages)); // configCommand 등록
  program.addCommand(initCommand(projectRoot || '', config, messages)); // initCommand 등록

  await program.parseAsync(process.argv);
}

main();
