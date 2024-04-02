
using Web.Api.DAL;
using Web.Api.Entries;

namespace Web.Api.Services
{
    public interface ITodoService
    {
        Task<IEnumerable<Goal>> GetAllGoal();
        Task<int> DeleteGoal(long id);
        Task<List<EntryGoal>> AddGoals(List<EntryGoal> items);
        Task<int> UpdateGoal(EntryGoal item);

        Task<IEnumerable<TAction>> GetAllAction();
        Task<List<EntryAction>> AddActions(List<EntryAction> items);
        Task<int> UpdateAction(TAction item);
        Task<int> DeleteAction(long id);

        Task<IEnumerable<Todo>> GetAllTodo();
        Task<List<Todo>> AddTodos(List<Todo> items);
        Task<int> UpdateTodo(Todo item);
        Task<int> DeleteTodo(long id);

        Task<IEnumerable<TActivity>> GetAllActivity();
        Task<int> UpdateActivity(TActivity item);
        Task<int> DeleteActivity(long id);

        Task<IEnumerable<UserAssign>> GetAllUserAssign();
        Task<int> AssignUsers(List<Client.Entries.UserAssign> items);
    }
}