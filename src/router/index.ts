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
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/myRouter',
    name: 'MyRouter',
    component: MyRouter,
    // 路由嵌套配置
    children: [
      {
        path: 'login',
        name: 'Login',
        component: () => import('../components/Login.vue')
      },
      {
        path: 'register',
        name: 'Register',
        component: () => import('../components/Register.vue')
      }
    ]
  },
//---------------------------------------------------------------------------//
    {
      path: '/',
      name: 'homeView',
      component: HomeView,
    },
    {
      path: '/aboutView',
      name: 'aboutView',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/ciallo',
      name: 'ciallo',
      component: () => import('../views/CialloView.vue'),
    },
     {
        path: '/login',
        name: 'Login',
        component: () => import('../components/Login.vue')
      },
      {
        path: '/register',
        name: 'Register',
        component: () => import('../components/Register.vue')
      },
    {
      path: '/Lab1',
      name: 'lab1',
      component: () => import('../views/Lab1.vue'),
    },
    {
      path: '/Lab2',
      name: 'lab2',
      component: () => import('../views/Lab2.vue'),
    },
    {
      path: '/Lab3',
      name: 'Lab3',
      component: () => import('../views/Lab3.vue'),
    },
    {
      path: '/Lab4',
      name: 'Lab4',
      component: () => import('../views/Lab4.vue'),
    },
    {
      path: '/Lab5',
      name: 'Lab5',
      component: () => import('../views/Lab5.vue'),
    },
    {
      path: '/Lab6',
      name: 'Lab6',
      component: () => import('../views/Lab6.vue'),
    }
  ],
})
// const router = createRouter({
//   history: createWebHistory(process.env.BASE_URL),
//   routes
// })

// 全局路由钩子
router.beforeEach((to, from, next) => {
  console.log('全局前置钩子:', from.path, '->', to.path)
  console.log('即将进入:', to.name)
  next()
})

router.afterEach((to, from) => {
  console.log('全局后置钩子:', from.path, '->', to.path)
  console.log('已进入:', to.name)
})

export default router
