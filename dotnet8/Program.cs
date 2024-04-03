using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Migrations;
using Web.Api.DAL;
using Web.Api.Entries;
using Web.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// Database
//dotnet ef migrations add IniCreate --context SqliteTodo --output-dir DataAccessLogic/Migrations/Todos
//dotnet ef migrations add IniCreate --context SqliteUser --output-dir DataAccessLogic/Migrations/Users
//dotnet ef database update -c SqliteTodo
//dotnet ef database update -c SqliteUser
//dotnet ef dbcontext optimize --output-dir DataAccessLogic/CompiledModels/Todos -c SqliteTodo --namespace CompiledModels.Todos
//dotnet ef dbcontext optimize --output-dir DataAccessLogic/CompiledModels/Users -c SqliteUser --namespace CompiledModels.Users
var connTodo = builder.Configuration.GetConnectionString("SqliteTodo");
builder.Services.AddDbContext<SqliteTodo>(options =>
    options
    .UseModel(CompiledModels.Todos.SqliteTodoModel.Instance)
    .UseSqlite(
        connTodo,
        o => o.MigrationsHistoryTable(
            tableName: HistoryRepository.DefaultTableName,
            schema: "todo")));
var connUser = builder.Configuration.GetConnectionString("SqliteUser");
builder.Services.AddDbContext<SqliteUser>(options =>
    options
    .UseModel(CompiledModels.Users.SqliteUserModel.Instance)
    .UseSqlite(
        connUser,
        o => o.MigrationsHistoryTable(
            tableName: HistoryRepository.DefaultTableName,
            schema: "user")));
// DI
builder.Services.AddTransient<IUserService, UserService>();
builder.Services.AddTransient<ITodoService, GoalActionService>();

var app = builder.Build();
app.MapGet("/alls", async (IUserService sUser, ITodoService sTodo) =>
{
    var goals = await sTodo.GetAllGoal();
    var users = await sUser.GetAll();
    var userAsgn = await sTodo.GetAllUserAssign();
    AllInfo allInfo = new(goals, users, userAsgn);
    return Results.Ok(allInfo);
});
#region User
var userGrp = "/users";
var userApi = app.MapGroup(userGrp);
userApi.MapGet("/", async (IUserService service) =>
{
    var users = await service.GetAll();
    return Results.Ok(users);
});
app.MapPost("user/", async (Account item, IUserService service) =>
{
    var dUser = await service.AddUser(item);
    if(dUser != null && dUser.Id < 0) {
        return Results.Conflict($"User already exists");
    }
    return Results.Created($"/${userGrp}/{item.Id}", item);
});
userApi.MapPost("/", async (List<Account> items, IUserService service) =>
{
    await service.AddUsers(items);
    return Results.Created($"/${userGrp}", items);
});
userApi.MapPut("/{id}", async (long id, EntryAccount item, IUserService service) =>
{
    item.Id = id;
    var status = await service.Update(item);
    if (status == -404) return Results.NotFound();
    return Results.NoContent();
});
userApi.MapDelete("/{id}", async (long id, IUserService service) =>
{
    var status = await service.Delete(id);
    if (status == -404) return Results.NotFound();
    return Results.NoContent();
});
#endregion User
#region Goal
var goalGrp = "/goals";
var goalApi = app.MapGroup(goalGrp);
goalApi.MapGet("/", async (IUserService sUser, ITodoService sTodo) =>
{
    var uAssign = new SvcUserAssign(sUser, sTodo);
    var goals = await uAssign.GetGoalsAssign();
    return Results.Ok(goals);
});
goalApi.MapPost("/", async (List<EntryGoal> items, ITodoService service) =>
{
    var lstGoal = await service.AddGoals(items);
    return Results.Created($"/${goalGrp}", lstGoal);
});
goalApi.MapPut("/{id}", async (long id, EntryGoal item, ITodoService service) =>
{
    item.Id = id;
    var status = await service.UpdateGoal(item);
    if (status == -404) return Results.NotFound();
    return Results.NoContent();
});
goalApi.MapDelete("/{id}", async (long id, ITodoService service) =>
{
    var status = await service.DeleteGoal(id);
    if (status == -404) return Results.NotFound();
    return Results.NoContent();
});
#endregion
#region Action
var actionGrp = "/actions";
var actionApi = app.MapGroup(actionGrp);
actionApi.MapGet("/", async (ITodoService service) =>
{
    var actions = await service.GetAllAction();
    return Results.Ok(actions);
});
actionApi.MapPost("/", async (List<EntryAction> items, ITodoService service) =>
{
    await service.AddActions(items);
    return Results.Created($"/${actionGrp}", items);
});
actionApi.MapPut("/{id}", async (long id, TAction item, ITodoService service) =>
{
    var status = await service.UpdateAction(item);
    if (status == -404) return Results.NotFound();
    return Results.NoContent();
});
actionApi.MapDelete("/{id}", async (long id, ITodoService service) =>
{
    var status = await service.DeleteAction(id);
    if (status == -404) return Results.NotFound();
    return Results.NoContent();
});
#endregion
#region Todo
var todoGrp = "/todos";
var todoApi = app.MapGroup(todoGrp);
todoApi.MapGet("/", async (ITodoService service) =>
{
    var todos = await service.GetAllTodo();
    return Results.Ok(todos);
});
todoApi.MapPost("/", async (List<Todo> items, ITodoService service) =>
{
    await service.AddTodos(items);
    return Results.Created($"/${todoGrp}", items);
});
todoApi.MapPut("/{id}", async (long id, Todo item, ITodoService service) =>
{
    var status = await service.UpdateTodo(item);
    if (status == -404) return Results.NotFound();
    return Results.NoContent();
});
todoApi.MapDelete("/{id}", async (long id, ITodoService service) =>
{
    var status = await service.DeleteTodo(id);
    if (status == -404) return Results.NotFound();
    return Results.NoContent();
});
#endregion
#region Activity
var activityGrp = "/activities";
var activityApi = app.MapGroup(activityGrp);
activityApi.MapGet("/", async (ITodoService service) =>
{
    var activities = await service.GetAllActivity();
    return Results.Ok(activities);
});
activityApi.MapPut("/{id}", async (long id, TActivity item, ITodoService service) =>
{
    var status = await service.UpdateActivity(item);
    if (status == -404) return Results.NotFound();
    return Results.NoContent();
});
activityApi.MapDelete("/{id}", async (long id, ITodoService service) =>
{
    var status = await service.DeleteActivity(id);
    if (status == -404) return Results.NotFound();
    return Results.NoContent();
});
#endregion

app.Run();
public record AllInfo(IEnumerable<Goal> Goals, IEnumerable<Account> Users, IEnumerable<UserAssign> UserAssigns);