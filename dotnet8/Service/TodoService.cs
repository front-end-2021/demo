
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.ObjectPool;
using Web.Api.Data;
using Web.Api.Entries;

namespace Web.Api.Services
{
    public class GoalActionService(SqliteTodo dbCtx) : ITodoService
    {
        private readonly SqliteTodo _dbContext = dbCtx;
        #region Goal
        public async Task<IEnumerable<Goal>> GetAllGoal()
        {
            var goals = await _dbContext.Goal.ToListAsync();
            goals.ForEach(async goal =>
            {
                goal.Actions = await GetChilds(goal);
            });
            return goals;
        }
        public async Task<List<EntryGoal>> AddGoals(List<EntryGoal> items)
        {
            if (items == null) return [];
            items = items.Where(x => !string.IsNullOrEmpty(x.Name)).ToList();
            if (items.Count < 1) return [];
            #region check equal name
            for (var i = 0; i < items.Count; i++)
            {
                var item = items[i];
                int ix = 1;
                for (var j = i + 1; j < items.Count; j++)
                {
                    var itemj = items[j];
                    if (item.Name.Equals(itemj.Name))
                    {
                        itemj.Name += $" (${ix++})";
                    }
                }
            }
            #endregion
            var lstGoal = items.Select(x => new Goal()
            {
                Name = x.Name,
                Start = x.Start,
                End = x.End
            }).ToList();
            _dbContext.Goal.AddRange(lstGoal);
            await _dbContext.SaveChangesAsync();
            #region map Id from lstGoal to items
            for (var i = 0; i < items.Count; i++)
            {
                var item = items[i];
                var goal = lstGoal[i];
                if (goal == null)
                {
                    Console.WriteLine($"Parameter {i} is out of range list goal");
                    continue;
                }
                if (!item.Name.Equals(goal.Name))
                {
                    Console.WriteLine($"Two items not match name");
                    continue;
                }
                item.Id = goal.Id;
            }
            #endregion
            var res = await SetUserAssign(items);
            return items;
        }
        private async Task<int> SetUserAssign(List<EntryGoal> goals)
        {
            int res = 0;
            var lstUserAsgn = new List<Client.Entries.UserAssign>();
            goals.ForEach(item =>
            {
                item.AccountIds.ForEach(aId =>
                {
                    var userAsgn = lstUserAsgn.FirstOrDefault(x => x.AccountId == aId);
                    if (userAsgn == null) lstUserAsgn.Add(new Client.Entries.UserAssign(aId, [item.Id]));
                    else userAsgn.GoalIds.Add(item.Id);
                });
            });
            var allUserAssgn = await GetAllUserAssign();
            if (lstUserAsgn.Count < 1)
            {
                foreach (var uAssgn in allUserAssgn)
                {
                    var oldGoalIds = uAssgn.GoalIds.Split(",").Select(tId => (long)Convert.ToDouble(tId)).ToList();
                    goals.ForEach(goal =>
                    {
                        if (!oldGoalIds.Contains(goal.Id)) return;   // continue ForEach
                        var newGoalIds = oldGoalIds.Remove(goal.Id);
                        uAssgn.GoalIds = string.Join(",", newGoalIds);
                        _dbContext.Entry(uAssgn).State = EntityState.Modified;
                        res++;
                    });
                }
            }
            lstUserAsgn.ForEach(userAsgn =>
            {
                var uAssgn = allUserAssgn.FirstOrDefault(x => x.AccountId == userAsgn.AccountId);
                if (uAssgn == null)
                {
                    _dbContext.UserAssign.Add(new UserAssign()
                    {
                        AccountId = userAsgn.AccountId,
                        GoalIds = string.Join(",", userAsgn.GoalIds),
                        ActionIds = string.Join(",", userAsgn.ActionIds)
                    });
                    res++;
                    return;  // continue
                }
                var oldGoalIds = uAssgn.GoalIds.Split(",").Select(tId => (long)Convert.ToDouble(tId)).ToList();
                oldGoalIds = [.. oldGoalIds.Order()];
                var newGoalIds = userAsgn.GoalIds.Order().ToList();
                var txtOldGoalIds = string.Join(",", oldGoalIds);
                var txtNewGoalIds = string.Join(",", newGoalIds);
                if (!txtNewGoalIds.Equals(txtOldGoalIds))
                {
                    _dbContext.Entry(uAssgn).State = EntityState.Modified;
                    res++;
                }
            });
            if (0 < res)
            {
                try
                {
                    res = await _dbContext.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    throw;
                }
            }
            return res;
        }
        public async Task<int> UpdateGoal(EntryGoal item)
        {
            var dItem = await _dbContext.Goal.FindAsync(item.Id);
            var res = -404;
            if (dItem == null || item == null) return res;
            res = 0;
            if (!string.IsNullOrEmpty(item.Name) && !dItem.Name.Equals(item.Name))
            {
                dItem.Name = item.Name;
                res++;
            }
            #region Start-End
            if (item.Start != null)
            {
                if (dItem.Start == null)
                {
                    dItem.Start = item.Start;
                    res++;
                }
                else if (DateTime.Compare(dItem.Start.Value, item.Start.Value) != 0)
                {
                    dItem.Start = item.Start;
                    res++;
                }
            }
            if (item.End != null)
            {
                if (dItem.End == null)
                {
                    dItem.End = item.End;
                    res++;
                }
                else if (DateTime.Compare(dItem.End.Value, item.End.Value) != 0)
                {
                    dItem.End = item.End;
                    res++;
                }
            }
            #endregion
            if (0 < res)
            {
                _dbContext.Entry(dItem).State = EntityState.Modified;
                try
                {
                    res = await _dbContext.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    throw;
                }
            }
            await SetUserAssign([item]);
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
        #endregion
        #region Action
        public async Task<IEnumerable<TAction>> GetAllAction()
        {
            var actions = await _dbContext.Action.ToListAsync();
            actions.ForEach(async action =>
            {
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
        #endregion
        #region Todo
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
        #endregion
        #region Activity
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
        #endregion
        public async Task<IEnumerable<UserAssign>> GetAllUserAssign() => await _dbContext.UserAssign.ToListAsync();
        public async Task<int> AssignUsers(List<Client.Entries.UserAssign> items)
        {
            var res = -405;
            if (items == null || items.Count < 1) return res;
            items.ForEach(async item =>
            {
                var dItem = await _dbContext.UserAssign.FindAsync(item.Id);
                if (dItem != null)
                {
                    if (0 < item.AccountId && item.AccountId != dItem.AccountId)
                    {
                        dItem.AccountId = item.AccountId;
                    }
                    dItem.GoalIds = string.Join(",", item.GoalIds);
                    dItem.ActionIds = string.Join(",", item.ActionIds);
                    _dbContext.Entry(dItem).State = EntityState.Modified;
                }
                else
                {
                    var entry = new UserAssign()
                    {
                        AccountId = item.AccountId,
                        GoalIds = string.Join(",", item.GoalIds),
                        ActionIds = string.Join(",", item.ActionIds)
                    };
                    _dbContext.UserAssign.Add(entry);
                }
            });
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
    }
}