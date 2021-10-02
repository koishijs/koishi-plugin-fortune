import 'source-map-support/register';
import { Context } from 'koishi-core';
import { pickOne } from './random';
import moment from 'moment';
import Mustache from 'mustache';

export interface Config {
  header?: string;
  masterKey?: string;
  results: string[];
  useDatabase?: boolean;
}

export class MyPlugin {
  private useDatabase = false;
  private config: Config;
  private ctx: Context;
  name = 'fortune-main';
  private render(template: string, view: any) {
    return Mustache.render(template, view, null, { escape: (v) => v });
  }
  private getResult(userId: string, name: string) {
    if (!userId) {
      return '获取用户信息失败。';
    }
    const view = {
      id: userId,
      name,
      date: moment().format('YYYY-MM-DD'),
    };
    let result = this.config.header
      ? this.render(this.config.header, view)
      : '';
    result += this.render(
      pickOne(this.config.results, userId.toString(), this.config.masterKey),
      view,
    );
    return result;
  }
  apply(ctx: Context, config: Config) {
    ctx.on('connect', () => {
      if (ctx.database && this.config.useDatabase) this.useDatabase = true;
    });
    this.ctx = ctx;
    this.config = config;
    ctx
      .command('fortune', '进行占卜')
      .usage('占卜结果每天固定。')
      .userFields(['name'])
      .action(({ session }) => {
        let name = session.author.nickname || session.author.username;
        if (this.useDatabase) {
          if (session.user.name) {
            name = session.user.name;
          }
        }
        return this.getResult(session.userId, name);
      });
  }
}
