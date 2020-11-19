export default [
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './user/login',
      },
    ],
  },
  {
    path: '/',
    component: '../layouts/SecurityLayout',
    routes: [
      {
        path: '/',
        component: '../layouts/BasicLayout',
        authority: ['admin', 'user'],
        routes: [
          {
            path: '/',
            redirect: '/admin',
          },
          // {
          //   path: '/listtablelist',
          //   name: 'listtablelist',
          //   icon: 'smile',
          //   component: './listtablelist',
          // },
          {
            path: '/admin',
            name: 'admin',
            icon: 'crown',
            component: './Admin',
          },
          {
            component: './404',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    component: './404',
  },
];
