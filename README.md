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
import { HttpRequest } from "@lg/lg-services";
import { ElMessage } from "element-plus";
const options = {
  baseURL: "",
  withCredentials: false,
  timeout: 30 * 1000,
  headers: {
    "Access-Control-Allow-Origin": "*",
  },
  successCode: 0, //业务状态码-即服务端业务请求正确的状态码(区分与浏览器的ok的状态码,浏览器正常的状态是200,)
  messageCallback: (message, type: any = "error") => {
    ElMessage({
      message,
      type,
    });
  },
};

const { instance: ajax } = new HttpRequest(options);
export { ajax };
```
