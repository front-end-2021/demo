namespace Web.Api.Entries
{
    public class EntryGoal
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public DateTime? Start { get; set; }
        public DateTime? End { get; set; }
        public List<long> AccountIds { get; set; }
        public EntryGoal()
        {
            AccountIds = [];
        }
        public EntryGoal(Goal g)
        {
            Id = g.Id;
            Name = g.Name;
            Start = g.Start;
            End = g.End;
            AccountIds = [];
        }
    }
}