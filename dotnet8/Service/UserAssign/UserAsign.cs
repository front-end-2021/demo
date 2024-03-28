using Web.Api.Dto;
using Web.Api.Entries;

namespace Web.Api.Services
{
    public class SvcUserAssign(IUserService sUser, ITodoService sTodo) : IUserAssign
    {
        private readonly IUserService _sUser = sUser;
        private readonly ITodoService _sTodo = sTodo;

        public async Task<List<UserAssignInfo>> GetAllUserAssign()
        {
            var allAcc = await _sUser.GetAll();
            var allGoal = await _sTodo.GetAllGoal();
            var allAction = await _sTodo.GetAllAction();
            var uAssigns = await _sTodo.GetAllUserAssign();
            var lstInfo = new List<UserAssignInfo>();
            foreach (var item in uAssigns)
            {
                var info = new UserAssignInfo(item, allGoal, allAction);
                var acc = allAcc.FirstOrDefault(a => a.Id == item.AccountId);
                if (acc != null) info.SetAccountInfo(acc);
                lstInfo.Add(info);
            }
            return lstInfo;
        }
        public async Task<List<GoalAssignInfo>> GetGoalsAssign()
        {
            var lstGoal = new List<GoalAssignInfo>();
            var lstInfo = await GetAllUserAssign();
            foreach (var aInfo in lstInfo)
            {
                aInfo.Goals.ForEach(goal =>
                {
                    var gInfo = lstGoal.FirstOrDefault(g => g.Id == goal.Id);
                    if (gInfo == null)
                    {
                        gInfo = new GoalAssignInfo(goal) { Name = goal.Name };
                        lstGoal.Add(gInfo);
                    }
                    var ac = gInfo.Accounts.FirstOrDefault(a => a.Id == aInfo.AccId);
                    if (ac == null)
                    {
                        var acc = new Account
                        {
                            Id = aInfo.AccId,
                            Name = aInfo.AccName,
                            Email = aInfo.AccEmail,
                            Phone = aInfo.AccPhone,
                            DoB = aInfo.AccDoB,
                            Password = string.Empty
                        };
                        gInfo.Accounts.Add(acc);
                    }                    
                });
            }
            return lstGoal;
        }
    }
}