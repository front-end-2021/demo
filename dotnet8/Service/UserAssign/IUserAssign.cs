using Web.Api.Dto;

namespace Web.Api.Services {
    public interface IUserAssign {
        Task<List<UserAssignInfo>> GetAllUserAssign();
    }
}