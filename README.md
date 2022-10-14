## 项目名称

> hb-services 前端请求 库

## 运行条件

> 列出运行该项目所必须的条件和相关依赖

- rollup
- rollup-plugin-terser
- @babel/core
- rollup-plugin-babel

## 运行说明

> 项目中运用到的公共请求方法

- 切换到公司外部的 npm 镜像

- npm install hb-services -S

- 更新包npm install hb-services@latest -S

- import { axios } from 'hb-services'
- axios.get(url,params)
- axios.post(url,data)

```js
//示列:
//旧的引用:
import axios from 'axios';

//新的引用
import { axios } from 'hb-services';
```



- 卸载包 npm uninstall hb-services

### HttpRequest 方法的使用

- npm install hb-services -S
- import { HttpRequest } from 'hb-services'

```js
const API = {
  production: {
    production: 'https://erp-api.gggjpg.com:9999',
    test: 'https://192.168.20.152:9099',
    release: 'https://test-erp.gggjpg.com:2222'
  },
  development: 'http://192.168.20.151:9099'
};
const TIME_OUT = 30 * 1000;
const NODE_ENV = process.env.NODE_ENV;
const APP_TITLE = process.env.VUE_APP_TITLE;
const options = {
  baseURL:
    Object.prototype.toString.call(API[NODE_ENV]) === '[object Object]'
      ? API[NODE_ENV]?.[APP_TITLE]
      : API[NODE_ENV],
  withCredentials: true,
  timeout: TIME_OUT,
  headers: {
    'Access-Control-Allow-Origin': '*'
  }
};
const { instance } = new HttpRequest(options);

instance.get(url, params);
instance.post(url, data);
```

## 测试说明

> 如果有测试相关内容需要说明，请填写在这里

## 技术架构

> 使用 Rollup.js 打包的文件

## 协作者

> 张航, 龚磊
