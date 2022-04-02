<template>
  <div id="app">
    <Dashboard v-if="settings == true"/>
  </div>
</template>

<script>
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import axios from 'axios';
import Dashboard from './components/Dashboard.vue'

export default {
  name: 'App',
  components: {
    Dashboard
  },
  data() {
      return {
          settings: false,
          Users: [],
      }
  },
  mounted() {
    console.log("I am in mounted!!!")
    this.settings = true;

    axios.get('http://localhost:8001/api/users/')
      .then(response => {
        this.Users = response;
        console.log(response)
      });
  },
  setup () {
    console.log("I am in setup!!!")
  }
}
</script>

<style>
  @import './assets/styles/global.css';
</style>