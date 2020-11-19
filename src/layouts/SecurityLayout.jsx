import React from 'react';
import { connect } from 'dva';
import { PageLoading } from '@ant-design/pro-layout';
import { Redirect } from 'umi';
import { stringify } from 'querystring';
import {getAccessToken} from '@/utils/authority';

class SecurityLayout extends React.Component {
  state = {
    isReady: false,
  };

  componentDidMount() {
    this.setState({
      isReady: true,
    });
    // const { dispatch } = this.props;

    // if (dispatch) {
    //   dispatch({
    //     type: 'user/fetchCurrent',
    //   });
    // }
  }

  render() {
    const { isReady } = this.state;
    const { children, loading} = this.props; // You can replace it to your authentication rule (such as check token exists)
    let accessToken = getAccessToken()
    // 你可以把它替换成你自己的登录认证规则（比如判断 token 是否存在）
    const queryString = stringify({
      redirect: window.location.href,
    });

    if ((!accessToken && loading) || !isReady) {
      return <PageLoading />;
    }

    if (!accessToken && window.location.pathname !== '/user/login') {
      return <Redirect to={`/user/login?${queryString}`} />;
    }

    return children;
  }
}

export default connect(({ user, loading }) => ({
  loading: loading.models.user,
}))(SecurityLayout);
