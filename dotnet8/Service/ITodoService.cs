
using Web.Api.Entries;

namespace Web.Api.Services
{
    public interface ITodoService
    {
        Task<IEnumerable<Goal>> GetAllGoal();
        Task<List<Goal>> AddGoals(List<Goal> items);
        Task<int> DeleteGoal(long id);
        Task<Goal> GetGoalById(long id);
        Task<int> UpdateGoal(Goal item);

        Task<IEnumerable<Entries.Action>> GetAllAction();
        Task<Entries.Action> GetActionById(long id);
        Task<List<Entries.Action>> AddActions(List<Entries.Action> items);
        Task<int> UpdateAction(Entries.Action item);
        Task<int> DeleteAction(long id);

        Task<IEnumerable<Todo>> GetAllTodo();
        Task<Todo> GetTodoById(long id);
        Task<List<Todo>> AddTodos(List<Todo> items);
        Task<int> UpdateTodo(Todo item);
        Task<int> DeleteTodo(long id);
    }
}