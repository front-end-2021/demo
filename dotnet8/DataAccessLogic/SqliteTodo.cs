using Microsoft.EntityFrameworkCore;

namespace Web.Api.DAL
{
    public class SqliteTodo : DbContext
    {
        public SqliteTodo(DbContextOptions<SqliteTodo> options) : base(options) { }
        public virtual DbSet<Goal> Goals { get; set; }
        public virtual DbSet<TAction> Actions { get; set; }
        public virtual DbSet<Todo> Todos { get; set; }
        public virtual DbSet<TActivity> Activities { get; set; }
        public virtual DbSet<UserAssign> UserAssigns { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasDefaultSchema("todo");
        }
    }
}