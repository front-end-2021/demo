namespace Web.Api.Entries {
    public class EntryAccount {
        public long Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public DateTime DoB { get; set; }
        public string Password { get; set; } = string.Empty;
    }
}