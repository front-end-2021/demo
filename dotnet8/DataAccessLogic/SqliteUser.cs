using Microsoft.EntityFrameworkCore;

namespace Web.Api.DAL
{
    public class SqliteUser : DbContext
    {
        public SqliteUser(DbContextOptions<SqliteUser> options) : base(options) { }
        public virtual DbSet<Account> Account { get; set; }
        public virtual DbSet<Category> Category { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasDefaultSchema("user");
        }
    }
}