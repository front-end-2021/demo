<template>
  <div id="app">
    <Dashboard v-if="settings == true"/>
  </div>
</template>

<script>
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import { getAllUsers } from './services/UserService';
import Dashboard from './components/Dashboard.vue';

export default {
  name: 'App',
  components: {
    Dashboard
  },
  data() {
      return {
          settings: false,
          jwtKey: '',
      }
  },
  mounted() {
    console.log("I am in mounted!!!")
    this.settings = true;

  },
  setup () {
    console.log("I am in setup!!!")
  },
  provide() { // use function syntax so that we can access `this`
    return {
      getUsers: this.getUsers,
      getToken: this.getToken,
    }
  },
  methods: {
    getUsers(isReload) {
      return new Promise(reslv => {
        getAllUsers().then(response => {
          reslv(response.data);
          if(!isReload) this.jwtKey = response.key;
        })
      });
    },
    getToken(){return this.jwtKey},
  }
}
</script>

<style>
  @import './assets/styles/global.css';
</style>