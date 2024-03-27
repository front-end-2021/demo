using Web.Api.Dto;

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
                if(acc != null) info.SetAccountInfo(acc);
                lstInfo.Add(info);
            }
            return lstInfo;
        }
    }
}