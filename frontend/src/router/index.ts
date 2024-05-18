import { createRouter, createWebHistory } from 'vue-router'

import Analysis from '@/pages/Analysis.vue'
import Crawl from '@/pages/Crawl.vue'
import DashBoard from '@/pages/DashBoard.vue'
import Personal from '@/pages/Personal.vue'
import Setting from '@/pages/Setting.vue'
import Feedback from '@/pages/Feedback.vue'
import Cabinet from '@/view/Cabinet.vue'
import Login from '@/view/Login.vue'

import { useLoginStore } from '@/store/LoginStore'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            name: 'login',
            path: '/login',
            component: Login
        },
        {
            name: 'cabinet',
            path: '/cabinet',
            component: Cabinet,
            meta: { requiresAuth: true },
            children: [
                {
                    name: 'analysis',
                    path: 'analysis',
                    component: Analysis
                },
                {
                    name: 'crawl',
                    path: 'crawl',
                    component: Crawl
                },
                {
                    name: 'dash-board',
                    path: 'dashboard',
                    component: DashBoard
                },
                {
                    name: 'personal',
                    path: 'personal',
                    component: Personal
                },
                {
                    name: 'setting',
                    path: 'setting',
                    component: Setting
                },
                {
                    name: 'feedback',
                    path: 'feedback',
                    component: Feedback
                }
            ]
        }
    ]
})

// 在路由导航之前检查用户的登录状态
router.beforeEach((to, from, next) => {
    // 如果用户访问的页面需要登录，并且当前用户未登录，则重定向到登录页面
    const isLoggedIn = useLoginStore().isLoggedIn
    if (to.matched.some(record => record.meta.requiresAuth) && !isLoggedIn) {
        next('/login')
    } else {
        next() // 继续导航
    }
})

export default router
