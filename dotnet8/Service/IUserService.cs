using Web.Api.Entries;

namespace Web.Api.Services {
    public interface IUserService {
        Task<IEnumerable<Account>> GetAll();
        Task<Account> GetById(long id);
        Task<Account> AddUser(Account user);
        Task<int> Update(Account user);
        Task<int> Delete (long id);
    }
}