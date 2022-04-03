<template>
  <div class="container">
    <div class="row">
        <div class="col-md-7 mrgnbtm">
        <h2>Create User</h2>
            <form>
                <div class="row">
                    <div class="form-group col-md-6">
                        <label htmlFor="exampleInputEmail1">First Name</label>
                        <input type="text" class="form-control" v-model="FirstName" name="firstname" id="firstname" aria-describedby="emailHelp" placeholder="First Name" />
                    </div>
                    <div class="form-group col-md-6">
                        <label htmlFor="exampleInputPassword1">Last Name</label>
                        <input type="text" class="form-control" v-model="LastName" name="lastname" id="lastname" placeholder="Last Name" />
                    </div>
                </div>
                <div class="row">
                    <div class="form-group col-md-12">
                        <label htmlFor="exampleInputEmail1">Email</label>
                        <input type="text" class="form-control" v-model="Email" name="email" id="email" aria-describedby="emailHelp" placeholder="Email" />
                    </div>
                </div>
                <button type="button" @click='createUser()' class="btn btn-danger">Create</button>
            </form>
        </div>
    </div>
    </div>
</template>

<script>
export default {
  name: 'CreateUser',
  data() {
    return {
      FirstName: '',
      LastName: '',
      Email: ''
    }
  },
  methods: {
      createUser() {
          const payload = {
              FirstName: this.FirstName,
              LastName: this.LastName,
              Email: this.Email
          }
          this.$emit('createUser', payload)
          this.clearForm();
      },
      clearForm() {
          this.FirstName = "";
          this.LastName = "";
          this.Email = "";
      }
  }
}
</script>