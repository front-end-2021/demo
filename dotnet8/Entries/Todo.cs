using System.ComponentModel.DataAnnotations.Schema;

namespace Web.Api.Entries
{
    public class Goal
    {
        public long Id { get; set; }
        public required string Name { get; set; }
        public DateTime? Start { get; set; }
        public DateTime? End { get; set; }


        [ForeignKey("GoalId")]
        public ICollection<TAction>? Actions { get; set; }
    }
    public class TAction
    {
        public long Id { get; set; }
        public required string Name { get; set; }
        public DateTime? Start { get; set; }
        public DateTime? End { get; set; }
        public long GoalId { get; set; }
        
        [ForeignKey("ActionId")]
        public ICollection<Todo>? Todos { get; set; }
        
        [ForeignKey("ActionId")]
        public ICollection<TActivity>? Activities { get; set; }
    }
    public class Todo {
        public long Id { get; set; }
        public required string Name { get; set; }
        public DateTime? Start { get; set; }
        public DateTime? End { get; set; }
        public long ActionId { get; set; }
    }
    public class TActivity {
        public long Id { get; set; }
        public required string Name { get; set; }
        public DateTime? Start { get; set; }
        public DateTime? End { get; set; }
        public long ActionId { get; set; }
    }
}