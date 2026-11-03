export class UserService {
  async getUsers() {
    // API Call to Backend Controller
    const response = await fetch('/api/v1/users');
    return response.json();
  }
}