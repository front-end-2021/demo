using Web.Api.Entries;

namespace Web.Api.Services {
    public interface IUserService {
        Task<IEnumerable<Account>> GetAll();
        Task<Account> AddUser(Account user);
        Task<List<Account>> AddUsers(List<Account> users);
        Task<int> Update(EntryAccount user);
        Task<int> Delete (long id);
    }
}