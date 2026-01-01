import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
// 同步
import Home from '../views/Home.vue'
// const Home = () => import('../views/Home.vue')
import About from '../views/About.vue'
// 异步
const MyRouter = () => import('../views/MyRouter.vue')
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: { requiresAuth: true },
    },
    {
      path: '/about',
      name: 'About',
      component: About,
      meta: { requiresAuth: true },
    },
    {
      path: '/myRouter',
      name: 'MyRouter',
      component: MyRouter,
      meta: { requiresAuth: true },
      // 路由嵌套配置
      children: [
        {
          path: 'login',
          name: 'Login',
          component: () => import('../components/Login.vue'),
        },
        {
          path: 'register',
          name: 'Register',
          component: () => import('../components/Register.vue'),
        },
      ],
    },
    //---------------------------------------------------------------------------//
    {
      path: '/',
      name: 'homeView',
      component: HomeView,
      meta: { requiresAuth: true },
    },
    {
      path: '/aboutView',
      name: 'aboutView',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/ciallo',
      name: 'ciallo',
      component: () => import('../views/CialloView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/login', // 登录页路由
      name: 'Login', // 确保 name 是 'Login'
      component: () => import('../components/Login.vue'),
      // 注意：登录页不需要认证，所以不加 meta: { requiresAuth: true }
    },
    {
      path: '/register', // 注册页路由
      name: 'Register',
      component: () => import('../components/Register.vue'),
      // 注册页通常也不需要认证
    },
    {
      path: '/leftNavigator',
      name: 'LeftNavigator',
      component: () => import('../components/LeftNavigator.vue'),
    },
    {
      path: '/Lab1',
      name: 'lab1',
      component: () => import('../views/Lab1.vue'),
      meta: { requiresAuth: true }, // <--- 添加这行
    },
    {
      path: '/Lab2',
      name: 'lab2',
      component: () => import('../views/Lab2.vue'),
      meta: { requiresAuth: true }, // <--- 添加这行
    },
    {
      path: '/Lab3',
      name: 'Lab3',
      component: () => import('../views/Lab3.vue'),
      meta: { requiresAuth: true }, // <--- 添加这行
    },
    {
      path: '/Lab4',
      name: 'Lab4',
      component: () => import('../views/Lab4.vue'),
      meta: { requiresAuth: true }, // <--- 添加这行
    },
    {
      path: '/Lab5',
      name: 'Lab5',
      component: () => import('../views/Lab5.vue'),
      meta: { requiresAuth: true }, // <--- 添加这行
    },
    {
      path: '/Lab6',
      name: 'Lab6',
      component: () => import('../views/Lab6.vue'),
      meta: { requiresAuth: true }, // <--- 添加这行
    },
    {
      path: '/myAxios', // 需要认证的页面
      name: 'myAxios',
      component: () => import('../views/myAxios.vue'),
      meta: { requiresAuth: true }, // <--- 添加这行
    },
  ],
})

// 全局路由守卫
// router.beforeEach((to, from, next) => {
//   console.log('全局前置钩子:', from.path, '->', to.path)
//   console.log('即将进入:', to.name)
//   next()
// })

// 修改后的全局前置守卫
router.beforeEach((to, from, next) => {
  console.log('全局前置钩子:', from.path, '->', to.path)
  console.log('即将进入:', to.name)

  // 检查即将进入的路由是否需要认证
  const requiresAuth = to.matched.some((record) => record.meta?.requiresAuth)

  // 从 localStorage 获取 token
  const token = 'Bearer ' + localStorage.getItem('authToken') // 假设你存储的 key 是 'token'
  console.log('当前 token:', token)
  if (requiresAuth) {
    // 如果目标路由需要认证
    if (token) {
      // 如果有 token，允许访问
      console.log('Token 有效，允许访问:', to.path)
      next()
    } else {
      // 如果没有 token，重定向到登录页
      console.log('Token 无效，重定向到登录页')
      // 注意：使用 replace: true 以避免在历史记录中留下记录
      next({ name: 'Login', replace: true })
    }
  } else {
    // 如果目标路由不需要认证（例如登录页、注册页、首页等）
    console.log('路由不需要认证，允许访问:', to.path)
    next()
  }
})

router.afterEach((to, from) => {
  console.log('全局后置钩子:', from.path, '->', to.path)
  console.log('已进入:', to.name)
})

export default router
