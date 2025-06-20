import { Command } from 'a-command';
import { writeJsonFile } from 'a-node-tools';

/**  获取命令行  */
const command = new Command('earthnut-env-setting');

command.bind(['env']).run().isEnd(true);

/**  获取解析参数  */
const { args } = command;

const argsMap = args.$map;

/**  如果有值  */
if (argsMap?.env) {
  writeJsonFile('.env.config', {
    env: argsMap.env.value[0],
  });
}
