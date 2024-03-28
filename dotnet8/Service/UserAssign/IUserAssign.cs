using Web.Api.Client.Entries;

namespace Web.Api.Services {
    public interface IUserAssign {
        Task<List<GoalInfo>> GetGoalsAssign();
    }
}