const pages = import.meta.glob('@/pages/**/*.vue');

const resolveComponent = (relativePath) => {
  const path = `/src/pages/${relativePath}`;
  if (pages[path]) {
    return pages[path];
  } else {
    console.error(`Component not found: ${path}`);
    return null;
  }
};

const generateRoutes = (moduleStore) => {
  const routes = [
    // guest routes
    {
      path: '/',
      component: () => import('../layouts/Login.vue'),
      meta: { isGuest: true },
    },
    {
      path: '/forgot-password',
      component: () => import('../layouts/ForgotPassword.vue'),
      meta: { isGuest: true },
    },
    {
      path: '/reset-password',
      component: () => import('../layouts/ResetPassword.vue'),
      meta: { isGuest: true },
    },
    {
      path: '/:pathMatch(.*)*',
      component: () => import('../pages/general/NotFoundPage.vue'),
      meta: { isGuest: true },
    },

    // main layout routes
    {
      path: '/dashboard',
      component: () => import('../layouts/Main.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '/unauthorized-access',
          component: () => import('../pages/general/UnauthorizedAccess.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: '/canvasCost',
          component: () => import('../pages/canvassCost/canvassCostPage.vue'),
          // meta: { requiresAuth: true },
        },
        {
          path: '/salescore/service',
          component: () => import('../pages/salesCore/service.vue'),
          // meta: { requiresAuth: true },
        },
          
    
      ],
    },
  ];

  return routes;
};

export { generateRoutes };
