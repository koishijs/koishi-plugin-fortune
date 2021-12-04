import 'source-map-support/register';
import { Context, Schema } from 'koishi';
import { pickOne } from './random';
import moment from 'moment';
import Mustache from 'mustache';

export interface PluginConfig {
  header?: string;
  masterKey?: string;
  results?: string[];
  useDatabase?: boolean;
}

export class MyPlugin {
  private useDatabase = false;
  private config: PluginConfig;
  private ctx: Context;
  name = 'fortune-main';
  private render(template: string, view: any) {
    return Mustache.render(template, view, null, { escape: (v) => v });
  }
  schema: Schema<PluginConfig> = Schema.object({
    header: Schema.string().description('占卜结果的标题，会出现在结果首部。'),
    masterKey: Schema.string().description(
      '占卜随机密钥。占卜结果会由 **日期** **用户ID** **masterKey** 唯一确定。',
    ),
    useDatabase: Schema.boolean()
      .description('从数据库获取用户名。')
      .default(false),
    results: Schema.array(Schema.string())
      .description('所有可能的占卜结果。')
      .required(),
  });
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
  apply(ctx: Context, config: PluginConfig) {
    ctx.on('service', (name) => {
      if (this.config.useDatabase && name === 'database') this.useDatabase = !!ctx.database;
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
