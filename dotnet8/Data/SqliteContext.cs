using Microsoft.EntityFrameworkCore;
using Web.Api.Entries;

namespace Web.Api.Data
{
    public class SqliteContext : DbContext
    {
        public SqliteContext(DbContextOptions<SqliteContext> options) : base(options) { }
        public virtual DbSet<Account> Accounts { get; set; }
        // protected override void OnModelCreating(ModelBuilder builder)
        // {
        //     base.OnModelCreating(builder);
        //     builder.Entity<Account>().Property(e => e.Name).HasColumnType("varchar(512)");
        // }
    }

    // public static class SqliteContextFactory
    // {
    //     public static SqliteContext Create(string connString)
    //     {
    //         var optBuilder = new DbContextOptionsBuilder<SqliteContext>();
    //         optBuilder.UseSqlite(connString);
    //         var context = new SqliteContext(optBuilder.Options);
    //         context.Database.EnsureCreated();
    //         return context;
    //     }
    // }
}