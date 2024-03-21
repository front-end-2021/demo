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
        public ICollection<Action>? Actions { get; set; }
    }
    public class Action
    {
        public long Id { get; set; }
        public required string Name { get; set; }
        public DateTime? Start { get; set; }
        public DateTime? End { get; set; }
        public long GoalId { get; set; }
        
        [ForeignKey("ActionId")]
        public ICollection<Todo>? Todos { get; set; }
        
        [ForeignKey("ActionId")]
        public ICollection<Activite>? Activites { get; set; }
    }
    public class Todo {
        public long Id { get; set; }
        public required string Name { get; set; }
        public DateTime? Start { get; set; }
        public DateTime? End { get; set; }
        public long ActionId { get; set; }
    }
    public class Activite {
        public long Id { get; set; }
        public required string Name { get; set; }
        public DateTime? Start { get; set; }
        public DateTime? End { get; set; }
        public long ActionId { get; set; }
    }
}