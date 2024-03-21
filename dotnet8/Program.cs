using Microsoft.EntityFrameworkCore;
using Web.Api.Data;
using Web.Api.Entries;
using Web.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// Database
// dotnet ef migrations add InitialCreate
//dotnet ef database update
var connTodo = builder.Configuration.GetConnectionString("SqliteTodo");
builder.Services.AddDbContext<SqliteTodo>(x => x.UseSqlite(connTodo));
// DI
builder.Services.AddTransient<IUserService, UserService>();
builder.Services.AddTransient<ITodoService, GoalActionService>();

var app = builder.Build();

var userGrp = "/users";
var userApi = app.MapGroup(userGrp);
userApi.MapGet("/", async (IUserService uService) =>
{
    var users = await uService.GetAll();
    return Results.Ok(users);
});
userApi.MapGet("/{id}", async (IUserService uService, long id) =>
{
    var user = await uService.GetById(id);
    if (user == null) return Results.NotFound("User does not exist");
    return Results.Ok(user);
});
app.MapPost("user/", async (Account item, IUserService uService) =>
{
    await uService.AddUser(item);
    return Results.Created($"/${userGrp}/{item.Id}", item);
});
userApi.MapPost("/", async (List<Account> items, IUserService uService) =>
{
    await uService.AddUsers(items);
    return Results.Created($"/${userGrp}", items);
});
userApi.MapPut("/{id}", async (long id, Account item, IUserService uService) =>
{
    var status = await uService.Update(item);
    if (status == -404) return Results.NotFound();
    return Results.NoContent();
});
userApi.MapDelete("/{id}", async (long id, IUserService uService) =>
{
    var status = await uService.Delete(id);
    if (status == -404) return Results.NotFound();
    return Results.NoContent();
});
app.Run();