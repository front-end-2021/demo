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
// dotnet ef migrations add RenameTbAction --context SqliteTodo --output-dir Migrations/SqliteTodos
// dotnet ef database update -c SqliteTodo
// dotnet ef dbcontext optimize --output-dir CompiledModels/Todos -c SqliteTodo --namespace CompiledModels.Todos
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

    [Table("UserAssign")]
    public class UserAssign{
        public long Id { get; set; }
        public long AccountId { get; set; }
        public required string GoalIds { get; set; }
        public required string ActionIds { get; set; }
    }
}