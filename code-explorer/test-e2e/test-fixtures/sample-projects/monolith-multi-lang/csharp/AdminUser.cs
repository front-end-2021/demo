namespace App.Models.Admin {
    // Duplicate class name in different namespace + Inheritance
    public class User : App.Models.User {
        public string AdminRole { get; set; }
    }
}