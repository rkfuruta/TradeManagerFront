<template>
    <div class="login-form">
        <div class="header">
            <span class="title">Login</span>
        </div>
        <form v-on:submit.prevent="login">
            <div class="fieldset">
                <input type="text" id="email" v-model="email" placeholder="Email">
            </div>
            <div class="fieldset">
                <input type="password" id="password" v-model="password" placeholder="Password">
            </div>
            <div class="login-actions">
                <button class="btn login" type="submit">Login</button>
                <button class="btn login steam" type="button" @click="steam">
                    <img src="https://community.akamai.steamstatic.com/public/shared/images/header/logo_steam.svg?t=962016">
                </button>
            </div>
        </form>
    </div>
</template>

<script>
import axios from "axios";
import { useMessageStore } from '@/stores/message';
import { useUserStore } from '@/stores/user';
const messageStore = useMessageStore();
const userStore = useUserStore();
export default {
    data() {
        return {
            email: "",
            password: ""
        }
    },
    methods : {
        login() {
            axios.post(
                `/api/v1/users/login`,
                { email: email.value, password: password.value }
            ).then(async (response) => {
                userStore.set(response.data);
                messageStore.success("You are successfully logged in");
            }).catch((err) => {
                if (!err.response.data.success && err.response.data.message) {
                    messageStore.error(err.response.data.message);
                }
            });
        },
        steam() {
            window.location.href = '/api/v1/steam/login';
        }
    }
}
</script>

<style scoped>
    .login-form .header .title {
        display: flex;
        justify-content: center;
        font-size: 30px;
    }
    .login-form .header {
        margin-bottom: 50px;
    }
    .login-form {
        min-width: 350px;
        padding: 30px;
        background-color: #383838;
        border-radius: 10px;
    }
    .fieldset {
        display: flex;
        flex-wrap: wrap;
        margin-bottom: 15px;
    }
    .login-actions {
        margin-top: 40px;
    }
    .login-actions .steam {
        margin-top: 40px;
        background-color: #171a21;
    }
    .login-actions .steam img {
        max-height: 25px;
    }
    .fieldset label,
    .fieldset input,
    .login-actions button {
        width: 100%;
    }
    .fieldset label {
        margin-bottom: 5px;
    }
    .fieldset input {
        min-height: 35px;
        background-color: #383838;
        border: none;
        border-bottom: 2px solid;
        margin-bottom: 15px;
        color: var(--color-text);
    }
    .fieldset input:focus-visible {
        outline: none;
    }
    .btn.login {
        height: 40px;
        display: flex;
        justify-content: center;
    }
</style>