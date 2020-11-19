import { reloadAuthorized } from './Authorized'; // use localStorage to store the authority info, which might be sent from server in actual project.
import { router } from 'umi';
import store from 'store2';
import decode from "jwt-decode";

export function isTokenExpired(token){
  // // fixme temp
  // return false;
  try{
    const decoded = decode(token);
    if(!decoded.exp || decoded.exp < Date.now()/1000){
      console.log('token expired');
      return true;
    }
    return false;
  } catch (error){
    console.error(error);
    return false;
  }
}

export function getAuthority(str) {
  const authorityString =
    typeof str === 'undefined' && localStorage ? localStorage.getItem('antd-pro-authority') : str; // authorityString could be admin, "admin", ["admin"]

  let authority;

  try {
    if (authorityString) {
      authority = JSON.parse(authorityString);
    }
  } catch (e) {
    authority = authorityString;
  }

  if (typeof authority === 'string') {
    return [authority];
  } // preview.pro.ant.design only do not use in your production.
  // preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。

  if (!authority && ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return ['admin'];
  }

  return authority;
}
export function setAuthority(authority) {
  localStorage.setItem('auth_info', JSON.stringify(authority)); // auto reload
}


export function getAccessToken() {
  const authInfo = getAuthInfo();
  const accessToken = authInfo?authInfo.access_token:undefined;
  if(!accessToken || isTokenExpired(accessToken)){
    // notification.error({
    //   message: `会话超时`,
    //   description: `因长时间未操作，token过期，请重新认证，谢谢`,
    // });
    clearAuthority();
    router.push('/user/login');
  }
  return accessToken;
}

export function clearAuthority() {
  return store.remove("auth_info");
}

export function getAuthInfo() {
  const authInfo=store.get("auth_info");
  if(authInfo){
    return authInfo;
  }
  return undefined;
}

export function getProfile(){
  try {
    return decode(getAccessToken());
  }catch (error){
    console.error(error);
    return {
      authorities:['guest']
    };
  }
}
