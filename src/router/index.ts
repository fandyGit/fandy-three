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
        {
            path: '/step0203',
            name: 'step0203',
            component: () => import('@/views/step02/step0203.vue'),
        },
        {
            path: '/step0204',
            name: 'step0204',
            component: () => import('@/views/step02/step0204.vue'),
        },
        {
            path: '/step0205',
            name: 'step0205',
            component: () => import('@/views/step02/step0205.vue'),
        },
        {
            path: '/step0206',
            name: 'step0206',
            component: () => import('@/views/step02/step0206.vue'),
        },
        {
            path: '/step0301',
            name: 'step0301',
            component: () => import('@/views/step03/step0301.vue'),
        },
        {
            path: '/step0302',
            name: 'step0302',
            component: () => import('@/views/step03/step0302.vue'),
        },
        {
            path: '/step0303',
            name: 'step0303',
            component: () => import('@/views/step03/step0303.vue'),
        },
        {
            path: '/step0304',
            name: 'step0304',
            component: () => import('@/views/step03/step0304.vue'),
        },
        {
            path: '/step0305',
            name: 'step0305',
            component: () => import('@/views/step03/step0305.vue'),
        },
        {
            path: '/step0306',
            name: 'step0306',
            component: () => import('@/views/step03/step0306.vue'),
        },
        {
            path: '/step0401',
            name: 'step0401',
            component: () => import('@/views/step04/step0401.vue'),
        },
        {
            path: '/step0402',
            name: 'step0402',
            component: () => import('@/views/step04/step0402.vue'),
        },
        {
            path: '/step0403',
            name: 'step0403',
            component: () => import('@/views/step04/step0403.vue'),
        },
        {
            path: '/step0404',
            name: 'step0404',
            component: () => import('@/views/step04/step0404.vue'),
        },
        {
            path: '/step0405',
            name: 'step0405',
            component: () => import('@/views/step04/step0405.vue'),
        },
        {
            path: '/step0406',
            name: 'step0406',
            component: () => import('@/views/step04/step0406.vue'),
        },
    ]
})

export default router
