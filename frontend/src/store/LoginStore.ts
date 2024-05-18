import { defineStore } from "pinia"

export const useLoginStore = defineStore('Login', {
    state: () => ({
        isLoggedIn: false
    }),
    actions:{
        login(){
            this.isLoggedIn = true
        },
        logout() {
            this.isLoggedIn = false
        }
    }
})