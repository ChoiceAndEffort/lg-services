# 封装 services 请求

## 加入了 husky 代码提交规范的校验

## 加入了 standard-version 自动生成 Changelog 日志和自动发版的指令

```json
  "devDependencies": {
        "standard-version": "^9.5.0"
  }


  "scripts": {
    "build": "rollup -c",
    "release": "standard-version && npm publish",
    "prepare": "husky install"
  },

```

```js
import { ElMessage } from 'element-plus';
const options = {
  baseURL: baseUrl,
  withCredentials: false,
  timeout: TIME_OUT,
  headers: {
    'Access-Control-Allow-Origin': '*'
  },
  messageCallback: (message, type: any = 'error') => {
    ElMessage({
      message,
      type
    });
  }
};

const { instance: ajax } = new HttpRequest(options);
export { ajax };
```
