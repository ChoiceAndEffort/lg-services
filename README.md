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
