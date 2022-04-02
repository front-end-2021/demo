<template>
  <div class="hello">
    <Header />
    <div class="container mrgnbtm">
          <div class="row">
            <div class="col-md-8">
                <CreateUser @createUser="userCreate($event)" />
            </div>
            <div class="col-md-4">
                <DisplayBoard :numberOfUsers="NumberOfUsers" @getAllUsers="getAllUsers()" />
            </div>
          </div>
    </div>
    <div class="row mrgnbtm">
        <Users v-if="users.length > 0" :users="users" />
    </div>
  </div>
</template>

<script>
import Header from './Header.vue';
import CreateUser from './CreateUser.vue';
import DisplayBoard from './DisplayBoard.vue';
import Users from './Users.vue';
import { createUser } from '../services/UserService';

export default {
  name: 'Dashboard',
  components: {
    Header,
    CreateUser,
    DisplayBoard,
    Users
  },
  data() {
      return {
          users: [],
      }
  },
  inject: ['getUsers'],
  provide() { // use function syntax so that we can access `this`
    return {
      setDetails: this.setDetails,
    }
  },
  computed: {
    NumberOfUsers(){
      return this.users.length;
    },
  },
  methods: {
    getAllUsers(isReload) {
      this.getUsers(isReload).then(data => {
        console.log(data)
        this.users = data;
      })
    },
    userCreate(data) {
      console.log('data:::', data)
      createUser(data).then(response => {
        console.log(response);
        this.getAllUsers(true);
      });
    },
    setDetails(item){
      const index = this.users.findIndex(u => u.id == item.id);
      if(index > -1) this.users.splice(index, 1, item);
    },
  },
  mounted () {
    
  }
}
</script>