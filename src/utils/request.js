/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request';
import { notification } from 'antd';
import {
  getAccessToken,
  getAuthInfo,
  getProfile,
  setAuthority
} from "./authority";
const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};
/**
 * 异常处理程序
 */

const errorHandler = error => {
  const { response} = error;

  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url, body } = response;
    notification.error({
      message: `请求错误 ${status}: ${url}`,
      description: errorText,
    });
  } else if (!response) {
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
  }
  return error&&response || error;
};
/**
 * 配置request请求时的默认参数
 */

const request = extend({
  errorHandler,
  // 默认错误处理
  getResponse: true,
  credentials: 'include', // 默认请求是否带上cookie
});

/**
 * 刷新token
 * @author: zhzhy
 * @createDate: 2020/7/17
 * @return {Promise<any | never | never>}
 */
export function refreshToken() {
  return req(`${API_URL}/oauth/token`,
    {
      mode: 'cors',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: qs.stringify({
        grant_type: 'refresh_token',
        client_id: OAUTH_CLIENT_ID,
        client_secret: OAUTH_CLIENT_SECRET,
        refresh_token: getAuthInfo().refresh_token
      })
    }).then((response) => {
    if (response && response.access_token) {
      setAuthority(response);
    }
  })
  .catch((err) => {
    throw err;
  })
}

/**
 * 校验token
 * @author: zhzhy
 * @createDate: 2020/7/17
 * @return {Promise<void>}
 */
async function checkToken() {
  if (getAccessToken()) {
    const decoded = getProfile();
    const now = new Date().getTime()/1000;
    const refreshPreOffset =  60 * ( 30 - 5)
    const refreshTime = decoded.exp - refreshPreOffset;
    if (now >= refreshTime && now< decoded.exp) {
      await refreshToken();
    }
  }
}

/**
 * header需要权限时请求头
 * @author: zhzhy
 * @createDate: 2020/7/17
 * @return {Promise<{'X-Auth', 'Content-Type': string} | never>}
 */
function headers() {
  return checkToken().then(() => {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAccessToken()}`
    };
  });
}

/**
 * 对umi-request 封装一下
 * @author: zhzhy
 * @createDate: 2020/7/17
 * @return {Promise<any>}
 * @param url
 * @param options
 * @param type
 */
async function req (url, options, type) {
  switch (type) {
    case 'oauth':
      await headers().then(res => {
        options.headers = res
      })
      break
    default:
      break
  }
  const promise = new Promise((resolve, reject)=> {
    request(url, options).then((res)=> {
      resolve(res.data)
    }).catch(e=> {
      reject(e)
    })
  })
  return promise
}

export default req;
