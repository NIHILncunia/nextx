import { Command } from 'commander';
import path from 'path';
import fs from 'fs-extra';
import { NextxConfig, getMessages } from '../utils.js'; // getMessages import

// 타입 정의가 필요하므로 ko.ts에서 가져옵니다.
import { ko } from '../lang/ko.js';
type Messages = typeof ko;

export function configCommand(projectRoot: string, config: NextxConfig, messages: Messages): Command {
  const command = new Command('config');

  command
    .description(messages.config.description);

  // `get` subcommand
  command
    .command('get <key>')
    .description(messages.config.get.description)
    .action(async (key: string) => {
      if (key === 'lang') {
        // `get`은 현재 적용된 설정을 보여줘야 하므로, 시작 시 로드된 config를 사용
        console.log(`lang: ${config.lang}`);
      } else {
        console.error(messages.config.common.unknownKey(key));
      }
    });

  // `set` subcommand
  command
    .command('set <key> <value>')
    .description(messages.config.set.description)
    .action(async (key: string, value: string) => {
      if (key !== 'lang') {
        console.error(messages.config.common.unknownKey(key));
        return;
      }

      const configPathTs = path.join(projectRoot, 'nextx.config.ts');
      const configPathJs = path.join(projectRoot, 'nextx.config.js');

      if (fs.existsSync(configPathTs) || fs.existsSync(configPathJs)) {
        console.error(messages.config.common.manualEdit);
        return;
      }

      const configPathJson = path.join(projectRoot, 'nextx.config.json');
      let currentConfig = {};

      try {
        if (fs.existsSync(configPathJson)) {
          currentConfig = await fs.readJson(configPathJson);
        }

        const newConfig = { ...currentConfig, [key]: value };
        await fs.writeJson(configPathJson, newConfig, { spaces: 2 });

        // 개선된 로직: 언어가 변경된 경우, 메시지를 새로 로드하여 출력
        let finalMessages = messages;
        if (key === 'lang') {
          finalMessages = await getMessages(value);
        }

        console.log(finalMessages.config.set.success(key, value));

      } catch (error) {
        console.error(messages.config.set.error, error);
      }
    });

  return command;
}
