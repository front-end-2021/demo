namespace Web.Api.Entries
{
    public class EntryGoal
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public DateTime? Start { get; set; }
        public DateTime? End { get; set; }
        public List<long> AccountIds { get; set; }
    }
    public class EntryAction : EntryGoal
    {
        public long GoalId { get; set; }
        public ICollection<Todo>? Todos { get; set; }
        public ICollection<TActivity>? Activities { get; set; }
    }
}