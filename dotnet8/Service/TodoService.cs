
using Microsoft.EntityFrameworkCore;
using Web.Api.Data;
using Web.Api.Entries;

namespace Web.Api.Services
{
    public class GoalActionService(SqliteTodo dbCtx) : ITodoService
    {
        private readonly SqliteTodo _dbContext = dbCtx;
        public async Task<IEnumerable<Goal>> GetAllGoal() { 
            var goals = await _dbContext.Goal.ToListAsync();
            goals.ForEach(async goal => {
                goal.Actions = await GetChilds(goal);
            });
            return goals;
        }
        public async Task<List<Goal>> AddGoals(List<Goal> items)
        {
            if (items == null) return [];
            _dbContext.Goal.AddRange(items);
            await _dbContext.SaveChangesAsync();
            return items;
        }
        public async Task<int> UpdateGoal(Goal item)
        {
            var dItem = await _dbContext.Goal.FindAsync(item.Id);
            var res = -404;
            if (dItem == null) return res;
            _dbContext.Entry(dItem).State = EntityState.Modified;
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
        public async Task<int> DeleteGoal(long id)
        {
            var item = await _dbContext.Goal.FindAsync(id);
            var res = -404;
            if (item == null) return res;
            _dbContext.Goal.Remove(item);
            res = await _dbContext.SaveChangesAsync();
            return res;
        }
        public async Task<IEnumerable<TAction>> GetAllAction() {
            var actions = await _dbContext.Action.ToListAsync();
            actions.ForEach(async action => {
                action = await GetChilds(action);
            });
            return actions;
        }
        public async Task<IEnumerable<TAction>> AddActions() => await _dbContext.Action.ToListAsync();
        public async Task<List<TAction>> AddActions(List<TAction> items)
        {
            if (items == null) return [];
            _dbContext.Action.AddRange(items);
            await _dbContext.SaveChangesAsync();
            return items;
        }
        public async Task<int> UpdateAction(TAction item)
        {
            var dItem = await _dbContext.Action.FindAsync(item.Id);
            var res = -404;
            if (dItem == null) return res;
            _dbContext.Entry(dItem).State = EntityState.Modified;
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
        public async Task<int> DeleteAction(long id)
        {
            var item = await _dbContext.Action.FindAsync(id);
            var res = -404;
            if (item == null) return res;
            _dbContext.Action.Remove(item);
            res = await _dbContext.SaveChangesAsync();
            return res;
        }
        public async Task<IEnumerable<Todo>> GetAllTodo() => await _dbContext.Todo.ToListAsync();
        public async Task<List<Todo>> AddTodos(List<Todo> items)
        {
            if (items == null) return [];
            _dbContext.Todo.AddRange(items);
            await _dbContext.SaveChangesAsync();
            return items;
        }
        public async Task<int> UpdateTodo(Todo item)
        {
            var dItem = await _dbContext.Todo.FindAsync(item.Id);
            var res = -404;
            if (dItem == null) return res;
            _dbContext.Entry(dItem).State = EntityState.Modified;
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
        public async Task<int> DeleteTodo(long id)
        {
            var item = await _dbContext.Todo.FindAsync(id);
            var res = -404;
            if (item == null) return res;
            _dbContext.Todo.Remove(item);
            res = await _dbContext.SaveChangesAsync();
            return res;
        }
        public async Task<IEnumerable<TActivity>> GetAllActivity() => await _dbContext.Activity.ToListAsync();
        public async Task<List<TActivity>> AddActivities(List<TActivity> items)
        {
            if (items == null) return [];
            _dbContext.Activity.AddRange(items);
            await _dbContext.SaveChangesAsync();
            return items;
        }
        public async Task<int> UpdateActivity(TActivity item)
        {
            var dItem = await _dbContext.Activity.FindAsync(item.Id);
            var res = -404;
            if (dItem == null) return res;
            _dbContext.Entry(dItem).State = EntityState.Modified;
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
        public async Task<int> DeleteActivity(long id)
        {
            var item = await _dbContext.Activity.FindAsync(id);
            var res = -404;
            if (item == null) return res;
            _dbContext.Activity.Remove(item);
            res = await _dbContext.SaveChangesAsync();
            return res;
        }
        private async Task<List<TAction>> GetChilds(Goal item)
        {
            var allActivity = await _dbContext.Activity.ToListAsync();
            var allAction = await _dbContext.Action.ToListAsync();
            var allTodo = await _dbContext.Todo.ToListAsync();
            var lstAction = allAction.Where(x => x.GoalId == item.Id).ToList();
            Parallel.ForEach(lstAction, action =>
            {
                action.Activities = allActivity.Where(x => x.ActionId == action.Id).ToList();
                action.Todos = allTodo.Where(x => x.ActionId == action.Id).ToList();
            });
            return lstAction;
        }
        private async Task<TAction> GetChilds(TAction item)
        {
            var allActivity = await _dbContext.Activity.ToListAsync();
            var allTodo = await _dbContext.Todo.ToListAsync();
            Parallel.Invoke(
                () => item.Activities = allActivity.Where(x => x.ActionId == item.Id).ToList(),
                () => item.Todos = allTodo.Where(x => x.ActionId == item.Id).ToList()
            );
            return item;
        }
    }
}