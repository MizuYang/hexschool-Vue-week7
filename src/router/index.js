import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('../views/Dashboard_Navbar.vue'),
    children: [
      {
        path: 'home',
        component: () => import('../views/Dashboard_Home.vue')
      },
      {
        path: 'product',
        component: () => import('../views/Dashboard_Product.vue')
      },
      {
        path: 'order',
        component: () => import('../views/Dashboard_Order.vue')
      },
      {
        path: 'coupon',
        component: () => import('../views/Dashboard_Coupon.vue')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('../views/Login.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
