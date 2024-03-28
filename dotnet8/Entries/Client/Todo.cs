namespace Web.Api.Client.Entries
{
    public class UserAssign
    {
        public long Id { get; set; }
        public long AccountId { get; set; }
        public List<long> GoalIds { get; set; } = [];
        public List<long> ActionIds { get; set; } = [];
    }
    
}