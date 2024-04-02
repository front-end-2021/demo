using Microsoft.EntityFrameworkCore;
using Web.Api.DAL;
using Web.Api.Entries;

namespace Web.Api.Services
{
    public class UserService(SqliteUser dbCtx) : IUserService
    {
        private readonly SqliteUser _dbContext = dbCtx;
        public async Task<IEnumerable<Account>> GetAll() => await _dbContext.Account.ToListAsync();
        public async Task<Account> AddUser(Account user)
        {
            _dbContext.Account.Add(user);
            await _dbContext.SaveChangesAsync();
            return user;
        }
        public async Task<List<Account>> AddUsers(List<Account> users)
        {
            _dbContext.Account.AddRange(users);
            await _dbContext.SaveChangesAsync();
            return users;
        }
        // private bool UserExists(long id) => _dbContext.Account.Any(e => e.Id == id);
        public async Task<int> Update(EntryAccount user)
        {
            var res = -404;
            var item = _dbContext.Account.FirstOrDefault(x => x.Id == user.Id);
            if (item == null || user == null) return res;
            if (!string.IsNullOrEmpty(user.Name) && !item.Name.Equals(user.Name)) item.Name = user.Name;
            if (!string.IsNullOrEmpty(user.Email) && !item.Email.Equals(user.Email)) item.Email = user.Email;
            if (!string.IsNullOrEmpty(user.Phone) && !item.Phone.Equals(user.Phone)) item.Phone = user.Phone;
            if (DateTime.Compare(item.DoB, user.DoB) != 0) item.DoB = user.DoB;
            if (!string.IsNullOrEmpty(user.Password)) {
                if(string.IsNullOrEmpty(item.Password) || !item.Password.Equals(user.Password)) {
                    item.Password = user.Password;
                }
            }
            _dbContext.Entry(item).State = EntityState.Modified;
            try
            {
                res = await _dbContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }
            return res;
        }
        public async Task<int> Delete(long id)
        {
            var item = await _dbContext.Account.FindAsync(id);
            if (item == null) return -404;
            _dbContext.Account.Remove(item);
            await _dbContext.SaveChangesAsync();
            return 200;
        }
    }
}