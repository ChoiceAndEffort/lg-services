import axios from "axios";

const MESSAGE_NOTICE = {
  503: "服务器内部异常!",
  401: "访问凭证无效，请重新登录授权!",
  403: "访问凭证无效，请重新登录授权!",
};

class HttpRequest {
  constructor(options) {
    this.instance = axios.create(options);
    // this.instance.CancelToken = axios.CancelToken;
    // 手动挂载2个方法
    this.instance.all = axios.all;
    this.instance.spread = axios.spread;
    this.instance.token = options?.customParams?.token;
    this.instance.setToken = (token) => {
      this.instance.token = token;
    };
    this.addRequestInterceptor(options);
    this.addResponseInterceptor(options);
  }
  //请求拦截
  addRequestInterceptor(options) {
    this.instance.interceptors.request.use(
      (config) => {
        // const token =
        //   this.instance.token ||
        //   JSON.parse(window.sessionStorage.getItem('vuex'))?.user?.token;
        // config.headers.token = token || '';

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
        // console.log('interceptors.response', options);
        //返回数据是json格式处理函数
        function jsonHandler(response) {
          const { code, msg } = response.data;
          const res = response.data;
          if (code === options.successCode) {
            return response.data;
          } else {
            options.messageCallback(res.msg || "Error", options?.componentType);
            return Promise.reject(res);
          }
        }

        if (response.status === 200) {
          //返回的数据不是对象
          if (
            Object.prototype.toString.call(response.data) !== "[object Object]"
          ) {
            return response;
          }
          return jsonHandler(response);
        } else {
          options.messageCallback(
            response.statusText || "Error",
            options?.componentType
          );
          return Promise.reject(response);
        }
      },
      (error) => {
        options.messageCallback(error, options?.componentType);
        return Promise.reject(error);
      }
    );
  }
}

export default HttpRequest;
