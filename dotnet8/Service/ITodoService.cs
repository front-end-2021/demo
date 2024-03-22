
using Web.Api.Entries;

namespace Web.Api.Services
{
    public interface ITodoService
    {
        Task<IEnumerable<Goal>> GetAllGoal();
        Task<int> DeleteGoal(long id);
        Task<List<Goal>> AddGoals(List<Goal> items);
        Task<int> UpdateGoal(Goal item);

        Task<IEnumerable<Entries.Action>> GetAllAction();
        Task<List<Entries.Action>> AddActions(List<Entries.Action> items);
        Task<int> UpdateAction(Entries.Action item);
        Task<int> DeleteAction(long id);

        Task<IEnumerable<Todo>> GetAllTodo();
        Task<List<Todo>> AddTodos(List<Todo> items);
        Task<int> UpdateTodo(Todo item);
        Task<int> DeleteTodo(long id);
        
        Task<IEnumerable<Activite>> GetAllActivity();
        Task<List<Activite>> AddActivities(List<Activite> items);
        Task<int> UpdateActivity(Activite item);
        Task<int> DeleteActivity(long id);
    }
}