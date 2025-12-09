import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
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

export default router
