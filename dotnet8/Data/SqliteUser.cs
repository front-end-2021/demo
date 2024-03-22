using Microsoft.EntityFrameworkCore;
using Web.Api.Entries;

namespace Web.Api.Data
{
    public class SqliteUser : DbContext
    {
        public SqliteUser(DbContextOptions<SqliteUser> options) : base(options) { }
        public virtual DbSet<Account> Account { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasDefaultSchema("user");
        }
    }
}