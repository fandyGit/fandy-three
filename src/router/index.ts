import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
    history: createWebHashHistory(), // hash模式：createWebHashHistory，history模式：createWebHistory
    routes: [
        {
            path: '/',
            redirect: '/step0101'
        },
        {
            path: '/step0101',
            name: 'Step0101',
            component: () => import('@/views/step01/step0101.vue'),
        },
        {
            path: '/step0102',
            name: 'Step0102',
            component: () => import('@/views/step01/step0102.vue'),
        },
        {
            path: '/step0103',
            name: 'Step0103',
            component: () => import('@/views/step01/step0103.vue'),
        },
        {
            path: '/step0104',
            name: 'Step0104',
            component: () => import('@/views/step01/step0104.vue'),
        },
        {
            path: '/step0105',
            name: 'Step0105',
            component: () => import('@/views/step01/step0105.vue'),
        },
        {
            path: '/step0201',
            name: 'step0201',
            component: () => import('@/views/step02/step0201.vue'),
        },
        {
            path: '/step0202',
            name: 'step0202',
            component: () => import('@/views/step02/step0202.vue'),
        },
    ]
})

export default router
