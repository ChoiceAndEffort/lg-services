import axios from 'axios';
import { Message } from 'element-ui';

//不同环境的API
const API = {
  developmentApi: 'http://192.168.20.151:9099',
  productionApi: 'https://erp-api.gggjpg.com:9999',
  testApi: 'https://192.168.20.152:9099',
  releaseApi: 'https://test-erp.gggjpg.com:2222'
};
const TIME_OUT = 30 * 1000;

function setAxiosDefault() {
  const NODE_ENV = process.env.NODE_ENV;
  const APP_TITLE = process.env.VUE_APP_TITLE;
  let baseUrl = '';
  if (NODE_ENV === 'production') {
    if (APP_TITLE === 'test') {
      baseUrl = API.testApi;
    } else if (APP_TITLE === 'release') {
      baseUrl = API.releaseApi;
    } else {
      baseUrl = API.productionApi;
    }
  } else if (NODE_ENV === 'development') {
    baseUrl = API.developmentApi;
  }

  axios.defaults.baseURL = baseUrl; //默认基础路径
  axios.defaults.withCredentials = true; //跨域请求时是否需要使用凭证
  axios.defaults.timeout = TIME_OUT; //超时时间
  axios.defaults.headers = {
    'Access-Control-Allow-Origin': '*'
  };
}
setAxiosDefault();
/**
 * @description: 请求拦截-请求发起前对请求进行处理
 * @return {*}
 */
axios.interceptors.request.use(
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
  (err) => {
    // 请求发生错误时可在此处处理
    Promise.reject(err);
  }
);

/**
 * @description: 处理返回结果的函数
 * @param {*} response
 * @return {*}
 */
function jsonHandler(response) {
  const { code, msg } = response.data;
  const res = response.data;
  if (code === 0) {
    return response.data;
  } else if (code === 401 || code === 403) {
    Message({
      message: res.msg || '访问凭证无效，请重新授权!',
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

/**
 * @description: 响应拦截-统一处理请求回的数据.
 * @return {*}
 */
axios.interceptors.response.use(
  (response) => {
    if (response.status === 200) {
      //返回的数据不是对象
      if (Object.prototype.toString.call(response.data) !== '[object Object]') {
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
  // 请求发生错误时可在此处处理
  (err) => {
    Message({
      message: err,
      type: 'error'
    });
    Promise.reject(err);
  }
);

export default axios;
