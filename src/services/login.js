import request from '@/utils/request';
const moduleName="cloud-uaa-shiro"
import {confModuleName, maintainModuleName} from './serviceCommon';
import qs from 'qs';

/**
 * 登入接口
 * @author: zhzhy
 * @createDate: 2020/7/17
 * @return {Promise<void>}
 * @param params
 */
export async function login(params) {
  const options = {
    mode: 'cors',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    body: qs.stringify({
      grant_type: 'password',
      client_id: OAUTH_CLIENT_ID,
      client_secret: OAUTH_CLIENT_SECRET,
      username:params.userName,
      password:params.password
    }),
  };
  return request(`${API_URL}/auth/oauth/token`, options);
}

/**
 * getFakeCaptcha
 * @author: zhzhy
 * @createDate: 2020/7/17
 * @return {Promise<void>}
 * @param mobile
 */
export async function getFakeCaptcha(mobile) {
  return request(`${API_URL}/api/login/captcha?mobile=${mobile}`);
}

/**
 * 获取publickey
 * @author: zhzhy
 * @createDate: 2020/7/17
 * @return {Promise<void>}
 */
export async function getPublicKey(){
  const options = {
    method: 'GET'
  };
  return request(`${API_URL}/auth/oauth/publicKey`, options);
}

// 获取设备列表
export async function getAllDeviceInfo(
  params={filters: ["c321acabb", "cacabb111", "cacabbaac"],
    orderByField: "state",
    pageNo: 1,
    pageSize: 20,
    searchKey: "",
    sort: "asc"}) {
  return request(`${API_URL}/test`, {
    method: 'POST',
    data: {
    },
  }, 'oauth');
}
