<template>
    <div class="container">
        <h2>Users</h2>
        <table class="table table-bordered">
            <thead>
            <tr>
                <th>User Id</th>
                <th>Firstname</th>
                <th>Lastname</th>
                <th>Email</th>
                <th>Details</th>
            </tr>
            </thead>
            <tbody>
              <tr v-for="item in users" :key="item.Id">
                  <td>{{ item.Id }}</td>
                  <td>{{ item.FirstName }}</td>
                  <td>{{ item.LastName }}</td>
                  <td>{{ item.Email }}</td>
                  <td><button @click='getDetails(item.Id)' type="button" 
                    class="btn btn-primary">Details</button></td>
              </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    import { getUser } from '../services/UserService';
    export default {
        name: 'Users',
        props: ['users'],
        inject: ['getToken', 'setDetails'],
        data(){
            return {
                lstUser: this.users,
            }
        },
        methods: {
            getDetails(id) {
                const token = this.getToken();
                getUser(id, token).then(res => {
                    const item = res.data;
                    this.setDetails(item);
                });
            }
        }
     }
</script>