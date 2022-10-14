import axios from 'axios';
import { Message } from 'element-ui';

// //不同环境的API
// const API = {
//   production: {
//     production: 'https://erp-api.gggjpg.com:9999',
//     test: 'https://192.168.20.152:9099',
//     release: 'https://test-erp.gggjpg.com:2222'
//   },
//   development: 'http://192.168.20.151:9099'
// };
// const TIME_OUT = 30 * 1000;

// const NODE_ENV = process.env.NODE_ENV;
// const APP_TITLE = process.env.VUE_APP_TITLE;

// const options = {
//   baseURL:
//     Object.prototype.toString.call(API[NODE_ENV]) === '[object Object]'
//       ? API[NODE_ENV]?.[APP_TITLE]
//       : API[NODE_ENV],
//   withCredentials: true,
//   timeout: TIME_OUT,
//   headers: {
//     'Access-Control-Allow-Origin': '*'
//   }
// };

class HttpRequest {
  constructor(options) {
    this.instance = axios.create(options);
    // this.instance.CancelToken = axios.CancelToken;
    this.addRequestInterceptor(options);
    this.addResponseInterceptor(options);
  }
  //请求拦截
  addRequestInterceptor(options) {
    this.instance.interceptors.request.use(
      (config) => {
        config.headers.Token =
          JSON.parse(window.sessionStorage.getItem('vuex'))?.user?.token || '';
        if (config.method === 'get') {
          //为get请求添加时间戳，防止缓存问题
          const t = Date.now();
          config.params.t = t;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  //相应拦截
  addResponseInterceptor(options) {
    this.instance.interceptors.response.use(
      (response) => {
        //返回数据是json格式处理函数
        function jsonHandler(response) {
          const { code, msg } = response.data;
          const res = response.data;
          if (code === 0) {
            return response.data;
          } else if (code === 401 || code === 403) {
            Message({
              message: res.msg || '访问凭证无效，请重新授权',
              type: 'error'
            });
            //如果返回码为需要登录, 清除token,跳转到登录页
            setTimeout(() => {
              window.sessionStorage.removeItem('vuex');
              let url = window.location.href;
              window.location.href = url?.split('#')?.[0];
            }, 500);
            return Promise.reject(res);
          } else {
            Message({
              message: res.msg || 'Error',
              type: 'error'
            });
            return Promise.reject(res);
          }
        }

        if (response.status === 200) {
          if (
            Object.prototype.toString.call(response.data) !== '[object Object]'
          ) {
            return response;
          }
          return jsonHandler(response);
        } else {
          Message({
            message: response.statusText || 'Error',
            type: 'error'
          });
          return Promise.reject(response);
        }
      },
      (error) => {
        Message({
          message: error,
          type: 'error'
        });
        return Promise.reject(error);
      }
    );
  }
}

export default HttpRequest;
