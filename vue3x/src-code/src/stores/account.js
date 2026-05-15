import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getUsers } from '../mockdata/account'

export const useAccStore = defineStore('acc', () => {
    const users = ref(getUsers())
    const account = ref(users.value[0])

    return {
        users, account
    }
})
