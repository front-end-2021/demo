using System.ComponentModel.DataAnnotations.Schema;

namespace Web.Api.DAL
{
    [Table("Goal")]
    public class Goal
    {
        public long Id { get; set; }
        public required string Name { get; set; }
        public DateTime? Start { get; set; }
        public DateTime? End { get; set; }

        [ForeignKey("GoalId")]
        public ICollection<TAction>? Actions { get; set; }
    }

    [Table("Action")]
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
        public TAction()
        {
            Activities = new HashSet<TActivity>();
            Todos = new HashSet<Todo>();
        }
    }

    [Table("Todo")]
    public class Todo
    {
        public long Id { get; set; }
        public required string Name { get; set; }
        public DateTime? Start { get; set; }
        public DateTime? End { get; set; }
        public long ActionId { get; set; }
    }

    [Table("Activity")]
    public class TActivity
    {
        public long Id { get; set; }
        public required string Name { get; set; }
        public DateTime? Start { get; set; }
        public DateTime? End { get; set; }
        public long ActionId { get; set; }
    }

    [Table("UserAssign")]
    public class UserAssign
    {
        public long Id { get; set; }
        public long AccountId { get; set; }
        public required string GoalIds { get; set; }
        public required string ActionIds { get; set; }
    }
}