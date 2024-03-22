using Microsoft.EntityFrameworkCore;
using Web.Api.Data;
using Web.Api.Entries;

namespace Web.Api.Services
{
    public class UserService(SqliteUser dbCtx) : IUserService
    {
        private readonly SqliteUser _dbContext = dbCtx;
        public async Task<IEnumerable<Account>> GetAll() => await _dbContext.Accounts.ToListAsync();
        public async Task<Account> AddUser(Account user)
        {
            _dbContext.Accounts.Add(user);
            await _dbContext.SaveChangesAsync();
            return user;
        }
        public async Task<List<Account>> AddUsers(List<Account> users) {
            _dbContext.Accounts.AddRange(users);
            await _dbContext.SaveChangesAsync();
            return users;
        }
        // private bool UserExists(long id) => _dbContext.Accounts.Any(e => e.Id == id);
        public async Task<int> Update(Account user)
        {
            var item = _dbContext.Accounts.FirstOrDefault(x => x.Id == user.Id);
            if (item == null) return -404;
            _dbContext.Entry(item).State = EntityState.Modified;
            try
            {
                await _dbContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }
            return 200;
        }
        public async Task<int> Delete(long id)
        {
            var item = await _dbContext.Accounts.FindAsync(id);
            if (item == null) return -404;
            _dbContext.Accounts.Remove(item);
            await _dbContext.SaveChangesAsync();
            return 200;
        }
    }
}