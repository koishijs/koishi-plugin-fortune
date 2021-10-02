import 'source-map-support/register';
import { Context } from 'koishi-core';
import { pickOne } from './random';
import moment from 'moment';

export interface Config {
  header?: string;
  masterKey?: string;
  results: string[];
}

export class MyPlugin {
  config: Config;
  ctx: Context;
  name = 'fortune-main';
  private getResult(userId: string) {
    if (!userId) {
      return '获取用户信息失败。';
    }
    let result = this.config.header
      ? this.config.header.replace('{date}', moment().format('YYYY-MM-DD'))
      : '';
    result += pickOne(
      this.config.results,
      userId.toString(),
      this.config.masterKey,
    );
    return result;
  }
  apply(ctx: Context, config: Config) {
    this.ctx = ctx;
    this.config = config;
    ctx
      .command('fortune', '进行占卜')
      .usage('占卜结果每天固定。')
      .action((argv) => {
        return this.getResult(argv.session.userId);
      });
  }
}
