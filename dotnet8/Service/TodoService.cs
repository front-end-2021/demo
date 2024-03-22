
using Microsoft.EntityFrameworkCore;
using Web.Api.Data;
using Web.Api.Entries;

namespace Web.Api.Services
{
    public class GoalActionService(SqliteTodo dbCtx) : ITodoService
    {
        private readonly SqliteTodo _dbContext = dbCtx;
        public async Task<IEnumerable<Goal>> GetAllGoal() => await _dbContext.Goals.ToListAsync();

        public async Task<List<Goal>> AddGoals(List<Goal> items)
        {
            if (items == null) return [];
            _dbContext.Goals.AddRange(items);
            await _dbContext.SaveChangesAsync();
            return items;
        }
        public async Task<int> UpdateGoal(Goal item)
        {
            var dItem = await _dbContext.Goals.FindAsync(item.Id);
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
            var item = await _dbContext.Goals.FindAsync(id);
            var res = -404;
            if (item == null) return res;
            _dbContext.Goals.Remove(item);
            res = await _dbContext.SaveChangesAsync();
            return res;
        }
        public async Task<IEnumerable<Entries.Action>> GetAllAction() => await _dbContext.Actions.ToListAsync();
        public async Task<IEnumerable<Entries.Action>> AddActions() => await _dbContext.Actions.ToListAsync();
        public async Task<List<Entries.Action>> AddActions(List<Entries.Action> items)
        {
            if (items == null) return [];
            _dbContext.Actions.AddRange(items);
            await _dbContext.SaveChangesAsync();
            return items;
        }
        public async Task<int> UpdateAction(Entries.Action item)
        {
            var dItem = await _dbContext.Actions.FindAsync(item.Id);
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
            var item = await _dbContext.Actions.FindAsync(id);
            var res = -404;
            if (item == null) return res;
            _dbContext.Actions.Remove(item);
            res = await _dbContext.SaveChangesAsync();
            return res;
        }
        public async Task<IEnumerable<Todo>> GetAllTodo() => await _dbContext.Todos.ToListAsync();
        public async Task<List<Todo>> AddTodos(List<Todo> items)
        {
            if (items == null) return [];
            _dbContext.Todos.AddRange(items);
            await _dbContext.SaveChangesAsync();
            return items;
        }
        public async Task<int> UpdateTodo(Todo item)
        {
            var dItem = await _dbContext.Todos.FindAsync(item.Id);
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
            var item = await _dbContext.Todos.FindAsync(id);
            var res = -404;
            if (item == null) return res;
            _dbContext.Todos.Remove(item);
            res = await _dbContext.SaveChangesAsync();
            return res;
        }
        public async Task<IEnumerable<Activite>> GetAllActivity() => await _dbContext.Activites.ToListAsync();
        public async Task<List<Activite>> AddActivities(List<Activite> items)
        {
            if (items == null) return [];
            _dbContext.Activites.AddRange(items);
            await _dbContext.SaveChangesAsync();
            return items;
        }
        public async Task<int> UpdateActivity(Activite item)
        {
            var dItem = await _dbContext.Activites.FindAsync(item.Id);
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
            var item = await _dbContext.Activites.FindAsync(id);
            var res = -404;
            if (item == null) return res;
            _dbContext.Activites.Remove(item);
            res = await _dbContext.SaveChangesAsync();
            return res;
        }
    }
}