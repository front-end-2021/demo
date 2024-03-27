using Web.Api.Entries;

namespace Web.Api.Dto
{
    public class UserAssignInfo
    {
        public long Id { get; set; }
        public long AccountId { get; set; }
        public List<Goal> Goals { get; set; } = [];
        public UserAssignInfo(UserAssign userAssign, IEnumerable<Goal> allGoal, IEnumerable<TAction> allAction)
        {
            SetInfoGoalActions(userAssign, allGoal, allAction);
        }
        public void SetInfoGoalActions(UserAssign userAssign, IEnumerable<Goal> allGoal, IEnumerable<TAction> allAction)
        {
            var gIds = userAssign.GoalIds.Split(",");
            if (gIds != null && gIds.Length != 0)
            {
                var goalIds = gIds.Select(tId => (long)Convert.ToDouble(tId)).ToList();
                var goals = allGoal.Join(goalIds, ag => ag.Id, gId => gId, (ag, gId) => ag);
                var aIds = userAssign.ActionIds.Split(",");
                if (aIds != null && aIds.Length != 0)
                {
                    var actionIds = aIds.Select(tId => (long)Convert.ToDouble(tId)).ToList();
                    Parallel.ForEach(goals,
                    goal =>
                    {
                        IEnumerable<TAction> lstA;
                        if (goal.Actions != null && goal.Actions.Count != 0)
                        {
                            lstA = goal.Actions.Join(actionIds, ag => ag.Id, gId => gId, (ag, gId) => ag);
                            goal.Actions = lstA.ToList();
                        }
                        else
                        {
                            lstA = allAction.Join(actionIds, ag => ag.Id, gId => gId, (ag, gId) => ag);
                            goal.Actions = lstA.Where(a => a.GoalId == goal.Id).ToList();
                        }
                    });
                }
                else
                {
                    Parallel.ForEach(goals,
                    goal =>
                    {
                        goal.Actions = [];
                    });
                }
                Goals = goals.ToList();
            }
        }
    }
}