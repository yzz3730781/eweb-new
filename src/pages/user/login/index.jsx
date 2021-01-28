import { Alert, Checkbox, Icon } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import React, { Component } from 'react';
import { Link, router} from 'umi';
import { connect } from 'dva';
import LoginComponents from './components/Login';
import styles from './style.less';
import { getPublicKey } from '@/services/login';
const { Tab, UserName, Password, Mobile, Captcha, Submit } = LoginComponents;
@connect(({login, loading}) => ({
  login,
  submitting: loading.effects['login/login'],
}))
class Login extends Component {
  loginForm = undefined;

  state = {
    type: 'account',
    publicKey: '',
  };
  componentDidMount () {
    console.log(this.props.match, '```matchmatch````')
    this.props.dispatch({
      type: 'login/getPublicKey'
    });
  }

  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  handleSubmit = (err, values) => {
    const {type} = this.state;
    localStorage.setItem('userName', values.userName)
    localStorage.setItem('user_auth', '')

    if (!err) {
      const {dispatch} = this.props;

      // const aggreeDisclaimer = true;

      dispatch({
        type: 'login/login',
        payload: {
          ...values,
          type,
        },
      });
    }
  };

  onTabChange = type => {
    this.setState({
      type,
    });
  };

  onGetCaptcha = () =>
    new Promise((resolve, reject) => {
      if (!this.loginForm) {
        return;
      }

      this.loginForm.validateFields(['mobile'], {}, async (err, values) => {
        if (err) {
          reject(err);
        } else {
          const { dispatch } = this.props;

          try {
            const success = await dispatch({
              type: 'login/getCaptcha',
              payload: values.mobile,
            });
            resolve(!!success);
          } catch (error) {
            reject(error);
          }
        }
      });
    });

  renderMessage = content => (
    <Alert
      style={{
        marginBottom: 24,
      }}
      message={content}
      type="error"
      showIcon
    />
  );

  render() {
    const {login, submitting} = this.props;
    const {type} = this.state;
    console.log(login, '~~~~~~~~~~~~~~')
    return (
      <div className={styles.main}>
        <LoginComponents
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
          ref={form => {
            this.loginForm = form;
          }}
        >
          <div className={styles.title}>基站网管系统</div>
          {login.status === 'error' &&
          login.type === 'account' &&
          !submitting &&
          this.renderMessage(formatMessage({id: "app.login.accountError"}))}
          <UserName className={styles.border_radius} name="userName" focus='true' placeholder={formatMessage({id: "app.login.username"})}/>
          <Password name="password" placeholder={formatMessage({id: "app.login.password"})} />
          <Submit loading={submitting}>{formatMessage({id: "app.login.login"})}</Submit>
        </LoginComponents>
      </div>
    );
  }
}

export default  Login
