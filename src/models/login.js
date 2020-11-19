import { stringify } from 'querystring';
import { router } from 'umi';
import { login, getFakeCaptcha, getPublicKey } from '@/services/login';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { JSEncrypt } from 'jsencrypt'
import { reloadAuthorized } from '@/utils/Authorized'; // use localStorage to store the authority info, which might be sent from server in actual project.

const Model = {
  namespace: 'login',
  state: {
    status: undefined,
    publickey: ''
  },
  effects: {
    *login({ payload }, { call, put, select }) {
      const publickey = yield select(
        state => state.login.publickey
      );
      let encrypt = new JSEncrypt();
      encrypt.setPublicKey(publickey);
      let password= encrypt.encrypt(payload.password);
      payload.password = password;
      const response = yield call(login, payload);
      if (response&&response.access_token) {
        yield put({
          type: 'changeLoginStatus',
          payload: {currentAuthority:response,status:"ok"},
        });
      }else{
        yield put({
          type: 'changeLoginStatus',
          payload: {currentAuthority:undefined,status:"error"},
        });
      }
      // Login successfully
      if (response&&response.access_token) {
        reloadAuthorized();
        router.replace('/');
      }
    },

    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },

    *getPublicKey({ payload }, { call, put }) {
      const response = yield call(getPublicKey, payload);
      if(response && response.success){
        yield put({
          type:'update',
          payload:{
            publickey:response.data
          }
        });

      }
    },
    *logout({payload},{put}) {
      const { redirect } = getPageQuery(); // Note: There may be security issues, please note
      reloadAuthorized();
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
          currentAuthority: 'guest',
        },
      });
      if (window.location.pathname !== '/user/login' && !redirect) {
        router.replace({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        });
      }
    },
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
        type: 'account',
      };
    },
    update(state,payload){
      return {
        ...state,
        ...payload.payload
      }
    }
  },
};
export default Model;
