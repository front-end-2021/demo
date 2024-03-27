using Microsoft.EntityFrameworkCore;
using Web.Api.Entries;

namespace Web.Api.Data
{
    public class SqliteTodo : DbContext
    {
        public SqliteTodo(DbContextOptions<SqliteTodo> options) : base(options) { }
        public virtual DbSet<Goal> Goal { get; set; }
        public virtual DbSet<TAction> Action { get; set; }
        public virtual DbSet<Todo> Todo { get; set; }
        public virtual DbSet<TActivity> Activity { get; set; }
        public virtual DbSet<UserAssign> UserAssign { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasDefaultSchema("todo");
        }
    }
}