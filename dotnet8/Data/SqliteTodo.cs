using Microsoft.EntityFrameworkCore;
using Web.Api.Entries;

namespace Web.Api.Data
{
    public class SqliteTodo : DbContext
    {
        public SqliteTodo(DbContextOptions<SqliteTodo> options) : base(options) { }
        public virtual DbSet<Account> Accounts { get; set; }
        public virtual DbSet<Goal> Goals { get; set; }
        public virtual DbSet<Entries.Action> Actions { get; set; }
        public virtual DbSet<Todo> Todos { get; set; }
        public virtual DbSet<Activite> Activites { get; set; }
    }
}