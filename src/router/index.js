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
        }
    ]
})

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => {
        if (record.meta.guest !== undefined && !record.meta.guest) {
            return true;
        }
        return false;
    })) {
        const userStore = useUserStore();
        if (!userStore.isLoggedIn()) {
            router.push("/");
        } else {
            next();
        }
    } else {
        next();
    }
})

export default router
