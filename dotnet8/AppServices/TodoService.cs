
using Microsoft.EntityFrameworkCore;
using Web.Api.Common;
using Web.Api.DAL;
using Web.Api.Entries;

namespace Web.Api.Services
{
    public partial class GoalActionService(SqliteTodo dbCtx) : ITodoService
    {
        private readonly SqliteTodo _dbContext = dbCtx;
        #region Goal
        public async Task<IEnumerable<Goal>> GetAllGoal()
        {
            var goals = await _dbContext.Goals.ToListAsync();
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
            _dbContext.Goals.AddRange(lstGoal);
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
        public async Task<int> UpdateGoal(EntryGoal item)
        {
            var dItem = await _dbContext.Goals.FindAsync(item.Id);
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
            var item = await _dbContext.Goals.FindAsync(id);
            var res = -404;
            if (item == null) return res;
            _dbContext.Goals.Remove(item);
            var allUserAssgn = await _dbContext.UserAssigns.ToListAsync();
            var allAction = await _dbContext.Actions.ToListAsync();
            var removeAcIds = new List<long>();
            res = 1;
            foreach (var action in allAction)
            {
                if (action.GoalId != id) continue;
                _dbContext.Actions.Remove(action);
                removeAcIds.Add(action.Id);
            }
            if (0 < removeAcIds.Count)
            {
                res = await RemoveTodoActivityUserAssign(removeAcIds);
                res++;
            }
            foreach (var uAssign in allUserAssgn)
            {
                var ids = uAssign.GoalIds.IdsToList();
                if (0 < ids.Count && ids.Remove(id))
                {
                    uAssign.GoalIds = ids.ListToTxt();
                    _dbContext.Entry(uAssign).State = EntityState.Modified;
                    res++;
                }
            }
            await _dbContext.SaveChangesAsync();
            return res;
        }
        #endregion
        #region Action
        public async Task<IEnumerable<TAction>> GetAllAction()
        {
            var actions = await _dbContext.Actions.ToListAsync();
            actions.ForEach(async action =>
            {
                action = await GetChilds(action);
            });
            return actions;
        }
        public async Task<List<EntryAction>> AddActions(List<EntryAction> items)
        {
            if (items == null) return [];
            items = items.Where(x => !string.IsNullOrEmpty(x.Name)).ToList();
            var dateNow = DateTime.UtcNow;
            var actions = items.Select(a =>
            {
                var acn = new TAction
                {
                    Name = a.Name,
                    Start = a.Start,
                    End = a.End,
                    GoalId = a.GoalId,
                };
                acn.Activities?.Add(new TActivity
                {
                    Name = $"New action: {a.Name}",
                    Start = dateNow,
                    End = a.End == null ? dateNow : a.End,
                });
                if (a.Todos != null && 0 < a.Todos.Count)
                {
                    foreach (var todo in a.Todos)
                    {
                        acn.Todos?.Add(new Todo
                        {
                            Name = todo.Name,
                            Start = todo.Start,
                            End = todo.End,
                        });
                        acn.Activities?.Add(new TActivity
                        {
                            Name = $"New todo: {todo.Name}",
                            Start = dateNow,
                            End = todo.End == null ? dateNow : todo.End,
                        });
                    }
                }
                return acn;
            }).ToList();
            _dbContext.Actions.AddRange(actions);
            await _dbContext.SaveChangesAsync();    // insert action to DB => new id
            Parallel.ForEach(items, item =>
            {
                var action = actions.FirstOrDefault(a => item.Name.Equals(a.Name));
                if (action != null)
                {
                    item.Id = action.Id;
                    item.Todos = action.Todos;
                    item.Activities = action.Activities;
                }
            });
            await SetUserAssign(items.Where(x => x.AccountIds != null && 0 < x.AccountIds.Count).Select(a => new EntryGoal
            {
                Id = a.Id,
                Name = a.Name,
                Start = a.Start,
                End = a.End,
                AccountIds = a.AccountIds
            }).ToList());
            return items;
        }
        public async Task<int> UpdateAction(TAction item)
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
            res = await RemoveTodoActivityUserAssign(new List<long>() { id });
            await _dbContext.SaveChangesAsync();
            return ++res;
        }
        #endregion
        public async Task<IEnumerable<UserAssign>> GetAllUserAssign() => await _dbContext.UserAssigns.ToListAsync();
        public async Task<int> AssignUsers(List<Client.Entries.UserAssign> items)
        {
            var res = -405;
            if (items == null || items.Count < 1) return res;
            items.ForEach(async item =>
            {
                var dItem = await _dbContext.UserAssigns.FindAsync(item.Id);
                if (dItem != null)
                {
                    if (0 < item.AccountId && item.AccountId != dItem.AccountId)
                    {
                        dItem.AccountId = item.AccountId;
                    }
                    dItem.GoalIds = item.GoalIds.ListToTxt();
                    dItem.ActionIds = item.ActionIds.ListToTxt();
                    _dbContext.Entry(dItem).State = EntityState.Modified;
                }
                else
                {
                    var entry = new UserAssign()
                    {
                        AccountId = item.AccountId,
                        GoalIds = item.GoalIds.ListToTxt(),
                        ActionIds = item.ActionIds.ListToTxt()
                    };
                    _dbContext.UserAssigns.Add(entry);
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
    public partial class GoalActionService : ITodoService
    {
        #region Todo
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
        #endregion
        #region Activity
        public async Task<IEnumerable<TActivity>> GetAllActivity() => await _dbContext.Activities.ToListAsync();
        public async Task<int> UpdateActivity(TActivity item)
        {
            var dItem = await _dbContext.Activities.FindAsync(item.Id);
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
            var item = await _dbContext.Activities.FindAsync(id);
            var res = -404;
            if (item == null) return res;
            _dbContext.Activities.Remove(item);
            res = await _dbContext.SaveChangesAsync();
            return res;
        }
        #endregion
        private async Task<int> RemoveTodoActivityUserAssign(IEnumerable<long> removeAcIds)
        {
            var res = 0;
            var allTodo = await _dbContext.Todos.ToListAsync();
            foreach (var todo in allTodo)
            {
                if (removeAcIds.Contains(todo.ActionId)) { _dbContext.Todos.Remove(todo); res++; }
            }
            var allActivity = await _dbContext.Activities.ToListAsync();
            foreach (var activity in allActivity)
            {
                if (removeAcIds.Contains(activity.ActionId)) { _dbContext.Activities.Remove(activity); res++; }
            }
            var allUserAssgn = await _dbContext.UserAssigns.ToListAsync();
            foreach (var uAssign in allUserAssgn)
            {
                var ids = uAssign.ActionIds.IdsToList();
                if (0 < ids.Count)
                {
                    var newIds = new List<long>();
                    foreach (var rid in ids)
                    {
                        if (removeAcIds.Contains(rid)) continue;
                        newIds.Add(rid);
                    }
                    if (newIds.Count != ids.Count)
                    {
                        uAssign.ActionIds = newIds.ListToTxt();
                        _dbContext.Entry(uAssign).State = EntityState.Modified;
                        res++;
                    }
                }
            }
            return res;
        }
        private async Task<int> SetUserAssign(List<EntryGoal> items)
        {
            int res = 0;
            var allUserAssgn = await GetAllUserAssign();
            foreach (var uAssgn in allUserAssgn)
            {
                var oldGoalIds = uAssgn.GoalIds.IdsToList();
                items.ForEach(goal =>
                {
                    if (goal.AccountIds.Count < 1)
                    {
                        if (!oldGoalIds.Contains(goal.Id)) return;   // continue ForEach
                        if (oldGoalIds.Remove(goal.Id))
                        {
                            uAssgn.GoalIds = oldGoalIds.ListToTxt();
                            _dbContext.Entry(uAssgn).State = EntityState.Modified;
                            res++;
                        }
                        return;
                    }
                    if (goal.AccountIds.Contains(uAssgn.AccountId))
                    {
                        if (!oldGoalIds.Contains(goal.Id))
                        {
                            oldGoalIds.Add(goal.Id);
                            uAssgn.GoalIds = oldGoalIds.ListToTxt();
                            _dbContext.Entry(uAssgn).State = EntityState.Modified;
                            res++;
                            return;
                        }

                        return;
                    }
                    if (oldGoalIds.Contains(goal.Id))
                    {
                        if (oldGoalIds.Remove(goal.Id))
                        {
                            uAssgn.GoalIds = oldGoalIds.ListToTxt();
                            _dbContext.Entry(uAssgn).State = EntityState.Modified;
                            res++;
                        }
                        return;
                    }
                    if (0 < oldGoalIds.Count)
                    {
                        var newGoalIds = oldGoalIds.Join(goal.AccountIds, oId => oId, nId => nId, (oId, nId) => oId).ToList();
                        if (newGoalIds == null)
                        {
                            uAssgn.GoalIds = string.Empty;
                            _dbContext.Entry(uAssgn).State = EntityState.Modified;
                            res++;
                            return;
                        }
                        if (newGoalIds.Count != oldGoalIds.Count)
                        {
                            uAssgn.GoalIds = newGoalIds.ListToTxt();
                            _dbContext.Entry(uAssgn).State = EntityState.Modified;
                            res++;
                        }
                    }
                });
            }
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
        private async Task<List<TAction>> GetChilds(Goal item)
        {
            var allActivity = await _dbContext.Activities.ToListAsync();
            var allAction = await _dbContext.Actions.ToListAsync();
            var allTodo = await _dbContext.Todos.ToListAsync();
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
            var allActivity = await _dbContext.Activities.ToListAsync();
            var allTodo = await _dbContext.Todos.ToListAsync();
            Parallel.Invoke(
                () => item.Activities = allActivity.Where(x => x.ActionId == item.Id).ToList(),
                () => item.Todos = allTodo.Where(x => x.ActionId == item.Id).ToList()
            );
            return item;
        }
    }
}