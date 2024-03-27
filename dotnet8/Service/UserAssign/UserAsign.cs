using Web.Api.Dto;

namespace Web.Api.Services
{
    public class SvcUserAssign
    {
        private readonly IUserService _sUser;
        private readonly ITodoService _sTodo;
        public SvcUserAssign(IUserService sUser, ITodoService sTodo)
        {
            _sUser = sUser;
            _sTodo = sTodo;
        }
        public async Task<List<UserAssignInfo>> GetAllUserAssign()
        {
            var allGoal = await _sTodo.GetAllGoal();
            var allAction = await _sTodo.GetAllAction();
            var uAssigns = await _sTodo.GetAllUserAssign();
            var lstInfo = new List<UserAssignInfo>();
            foreach (var item in uAssigns)
            {
                var info = new UserAssignInfo(item, allGoal, allAction);
                lstInfo.Add(info);
            }
            return lstInfo;
        }
    }
}