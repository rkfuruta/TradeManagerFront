import { createRouter, createWebHistory } from 'vue-router'
import {useUserStore} from "@/stores/user";
import {storeToRefs} from "pinia";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('../views/Home.vue')
        },
        {
            path: '/inventory',
            name: 'inventory',
            meta: {
                guest: false
            },
            component: () => import('../views/Inventory.vue')
        },
        {
            path: '/settings',
            name: 'settings',
            meta: {
                guest: false
            },
            component: () => import('../views/Settings.vue')
        }
    ]
})

router.beforeEach((to, from, next) => {
    const userStore = useUserStore();
    if (to.matched.some(record => {
        if (record.meta.guest !== undefined && !record.meta.guest) {
            return true;
        }
        return false;
    })) {
        if (!userStore.isLoggedIn()) {
            router.push("/");
        } else {
            next();
        }
    } else {
        userStore.checkToken();
        next();
    }
})

export default router
