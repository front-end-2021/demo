using Web.Api.Entries;

namespace Web.Api.Client.Entries
{
    public class UserAssign
    {
        public long Id { get; set; }
        public long AccountId { get; set; }
        public List<long> GoalIds { get; set; }
        public List<long> ActionIds { get; set; }
        // public UserAssign(long aId, List<long> goalIds)
        // {
        //     AccountId = aId;
        //     GoalIds = goalIds;
        //     ActionIds = [];
        // }
        public UserAssign(Api.Entries.UserAssign u)
        {
            Id = u.Id;
            AccountId = u.AccountId;
            GoalIds = string.IsNullOrEmpty(u.GoalIds) ? [] : u.GoalIds.Split(",").Select(tId => (long)Convert.ToDouble(tId)).ToList();
            ActionIds = string.IsNullOrEmpty(u.ActionIds) ? [] : u.ActionIds.Split(",").Select(tId => (long)Convert.ToDouble(tId)).ToList();
        }
    }
    public class GoalInfo
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public DateTime? Start { get; set; }
        public DateTime? End { get; set; }
        public List<ActionInfo> Actions { get; set; } = [];
        public GoalInfo(Goal goal)
        {
            Id = goal.Id;
            Name = goal.Name;
            Start = goal.Start;
            End = goal.End;
            if (goal.Actions != null)
                Actions = goal.Actions.Select(a => new ActionInfo(a) { Name = a.Name }).ToList();
        }
        public List<Account> Accounts { get; set; } = [];
        public void SetAccounts(IEnumerable<Account> allAcc, IEnumerable<UserAssign> uAssigns)
        {
            var accIds = uAssigns.Where(u => u.GoalIds.Contains(Id)).Select(u => u.AccountId);
            accIds = accIds.Distinct();
            var lstAcc = new List<Account>();
            Parallel.ForEach(accIds, accId =>
            {
                var acc = allAcc.FirstOrDefault(a => a.Id == accId);
                if (acc != null)
                {
                    lstAcc.Add(acc);
                }
            });
            Accounts = lstAcc;
            Parallel.ForEach(Actions, action =>
            {
                var acIds = uAssigns.Where(u => u.ActionIds.Contains(action.Id)).Select(u => u.AccountId);
                acIds = acIds.Distinct();
                foreach (var accId in acIds)
                {
                    var acc = allAcc.FirstOrDefault(a => a.Id == accId);
                    if (acc != null)
                    {
                        action.Accounts.Add(acc);
                    }
                }
            });
        }
    }
    public class ActionInfo : TAction
    {
        public ActionInfo(TAction a)
        {
            Id = a.Id;
            Start = a.Start;
            End = a.End;
            GoalId = a.GoalId;
            Todos = a.Todos;
            Activities = a.Activities;
        }
        public List<Account> Accounts { get; set; } = [];
    }
}