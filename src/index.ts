import 'source-map-support/register';
import { Context } from 'koishi-core';
import { Config, MyPlugin } from './plugin';
export { Config } from './plugin';

export const name = 'fortune';
export function apply(ctx: Context, config: Config) {
  ctx.plugin(new MyPlugin(), config);
}
