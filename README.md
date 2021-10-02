# koishi-plugin-fortune

占卜插件，每人每天可以算一卦。

本插件使用了 mt19937 算法来保证每天每人占卜结果确定。

## 安装

### npm

```bash
npm install koishi-plugin-fortune
```

### 直接安装

在 https://cdn02.moecube.com:444/nanahira/koishi-plugin/fortune/index.js 下载，并配置 `koishi.config.js` 。

```js
module.exports = {
    plugins: { 
        "/path/to/fortune/index.js": {
            adminContext: (ctx) => ctx.private(),
              header: '今日 ({date}) 的占卜结果:\n',
              masterKey: 'my-master-key',
              results: ['开心', '不开心']
        }
    }
}
```

上例的返回结果为

```
今日 (2021-10-2) 的占卜结果:
不开心
```

## 配置

```ts
export interface Config {
  header?: string;
  masterKey?: string;
  results: string[];
}
```

### 说明

* `header` 占卜结果的标题，会出现在结果首部。

* `masterKey` 占卜随机密钥。占卜结果会由 **日期** **用户ID** **masterKey** 唯一确定。

* `results` 所有可能的占卜结果。

## 命令

* `fortune` 进行占卜。
