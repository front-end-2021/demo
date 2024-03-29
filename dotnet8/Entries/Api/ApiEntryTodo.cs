namespace Web.Api.Entries
{
    public class EntryGoal(Goal g)
    {
        public long Id { get; set; } = g.Id;
        public string Name { get; set; } = g.Name;
        public DateTime? Start { get; set; } = g.Start;
        public DateTime? End { get; set; } = g.End;
        public List<long> AccountIds { get; set; } = [];
    }
}