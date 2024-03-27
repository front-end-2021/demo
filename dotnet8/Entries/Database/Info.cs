using System.ComponentModel.DataAnnotations.Schema;

namespace Web.Api.Entries {
    public class Account {
        public long Id { get; set; }
        public required string Name { get; set; }
        public required string Email { get; set; }
        public required string Phone { get; set; }
        public DateTime DoB { get; set; }
        public required string Password { get; set; }
    }
    public class Category{
        public long Id { get; set; }
        public required string Name { get; set; }
        
        [ForeignKey("CategoryId")]
        public ICollection<Account>? Users { get; set; }
    }
}