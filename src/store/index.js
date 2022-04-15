import { defineStore } from 'pinia'

export const mainStore = defineStore('main',{
    state:()=>{
      return {
          user: null
      }
    },
    getters: {
        getUser: (state) => state.user,
    },
  })
