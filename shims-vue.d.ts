// shims-vue.d.ts
import Vue from 'vue'
import VueRouter, {Router } from 'vue-router'

declare module 'vue/types/vue' {

    interface Vue {

        // @ts-ignore
        $router: VueRouter;

        // @ts-ignore
        $route: Route;

// 以下是在main.ts中挂载到Vue.prototype上的变量

        $api: any;

        $mock: any;

        $configs: any;

    }

}
