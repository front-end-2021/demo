using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Migrations;
using Web.Api.Data;
using Web.Api.Entries;
using Web.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// Database
//dotnet ef migrations add IniCreate --context SqliteTodo --output-dir Migrations/SqliteTodos
//dotnet ef migrations add IniCreate --context SqliteUser --output-dir Migrations/SqliteUsers
//dotnet ef database update -c SqliteTodo
//dotnet ef database update -c SqliteUser
//dotnet ef dbcontext optimize --output-dir CompiledModels/Todos -c SqliteTodo --namespace CompiledModels.Todos
//dotnet ef dbcontext optimize --output-dir CompiledModels/Users -c SqliteUser --namespace CompiledModels.Users
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
    AllInfo allInfo = new(goals, users);
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
    await service.AddUser(item);
    return Results.Created($"/${userGrp}/{item.Id}", item);
});
userApi.MapPost("/", async (List<Account> items, IUserService service) =>
{
    await service.AddUsers(items);
    return Results.Created($"/${userGrp}", items);
});
userApi.MapPut("/{id}", async (long id, Account item, IUserService service) =>
{
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
goalApi.MapGet("/", async (ITodoService service) =>
{
    var goals = await service.GetAllGoal();
    return Results.Ok(goals);
});
goalApi.MapPost("/", async (List<Goal> items, ITodoService service) =>
{
    await service.AddGoals(items);
    return Results.Created($"/${goalGrp}", items);
});
goalApi.MapPut("/{id}", async (long id, Goal item, ITodoService service) =>
{
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
actionApi.MapPost("/", async (List<TAction> items, ITodoService service) =>
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
activityApi.MapPost("/", async (List<TActivity> items, ITodoService service) =>
{
    await service.AddActivities(items);
    return Results.Created($"/${activityGrp}", items);
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

public record AllInfo(IEnumerable<Goal> Goals, IEnumerable<Account> Users);