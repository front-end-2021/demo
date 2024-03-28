using Web.Api.Client.Entries;

namespace Web.Api.Services
{
    public class SvcUserAssign(IUserService sUser, ITodoService sTodo) : IUserAssign
    {
        private readonly IUserService _sUser = sUser;
        private readonly ITodoService _sTodo = sTodo;
        public async Task<List<GoalInfo>> GetGoalsAssign()
        {
            var allAcc = await _sUser.GetAll();
            var allGoal = await _sTodo.GetAllGoal();
            var allAction = await _sTodo.GetAllAction();
            var uAssigns = await _sTodo.GetAllUserAssign();
            var cUserAssgns = uAssigns.Select(u => new UserAssign(u));
            return allGoal.Select(goal =>
            {
                var gInfo = new GoalInfo(goal);
                gInfo.SetAccounts(allAcc, cUserAssgns);
                return gInfo;
            }).ToList();
        }
    }
}