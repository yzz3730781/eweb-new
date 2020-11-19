import { DefaultFooter, getMenuData, getPageTitle } from '@ant-design/pro-layout';
import { Helmet } from 'react-helmet';
import { Link } from 'umi';
import React from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import SelectLang from '@/components/SelectLang';
import logo from '../assets/login/logo@3.png';
import styles from './UserLayout.less';

const UserLayout = props => {
  const {
    route = {
      routes: [],
    },
  } = props;
  const { routes = [] } = route;
  const {
    children,
    location = {
      pathname: '',
    },
  } = props;
  const { breadcrumb } = getMenuData(routes);
  const title = getPageTitle({
    pathname: location.pathname,
    breadcrumb,
    formatMessage,
    ...props,
  });
  return (
    // @TODO <DocumentTitle title={this.getPageTitle()}>
    <div className={styles.container}>
      <div className={styles.header}>
        <Link to="/">
          <img alt="logo" className={styles.logo} src={logo} />
        </Link>
      </div>
      {/* <div className={styles.lang}> */}
      {/*   <SelectLang /> */}
      {/* </div> */}
      <div className={styles.content}>
        <div className={styles.bgitem} />
        <div className={styles.childcontainer}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default connect(({ settings }) => ({ ...settings }))(UserLayout);
