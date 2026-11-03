<template>
  <div>User List</div>
</template>

<script>
import { UserService } from './UserService';

export default {
  mounted() {
    const service = new UserService();
    service.getUsers();
  }
}
</script>