import axios from 'axios';
import { Message } from 'element-ui';

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
