// import 'source-map-support/register';
import { Context } from 'koishi';
import { PluginConfig, MyPlugin } from './plugin';
export * from './plugin';

const plugin = new MyPlugin();
export default class fortune {
  static Config: any = plugin.schema;
  constructor(ctx: Context, config: PluginConfig) {
    ctx.plugin(plugin, config);
  }
}
