namespace Web.Api.Entries {
    public class Account {
        public long Id { get; set; }
        public required string Name { get; set; }
        public required string Email { get; set; }
        public required string Phone { get; set; }
        public DateTime DoB { get; set; }
    }
}