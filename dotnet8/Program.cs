using Microsoft.EntityFrameworkCore;
using Web.Api.Data;
using Web.Api.Entries;
using Web.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// Database
var connStr = builder.Configuration.GetConnectionString("SqliteConnection");
builder.Services.AddDbContext<SqliteContext>(x => x.UseSqlite(connStr));
// DI
builder.Services.AddTransient<UserService>();

var app = builder.Build();

var userGrp = "/users";
var userApi = app.MapGroup(userGrp);
userApi.MapGet("/", async (UserService uService) =>
{
    var users = await uService.GetAll();
    return Results.Ok(users);
});
userApi.MapGet("/{id}", async (UserService uService, long id) =>
{
    var user = await uService.GetById(id);
    if (user == null) return Results.NotFound("User does not exist");
    return Results.Ok(user);
});
userApi.MapPost("/", async (Account item, UserService uService) =>
{
    await uService.AddUser(item);
    return Results.Created($"/${userGrp}/{item.Id}", item);
});
userApi.MapPut("/{id}", async (long id, Account item, UserService uService) =>
{
    var status = await uService.Update(item);
    if (status == -404) return Results.NotFound();
    return Results.NoContent();
});
userApi.MapDelete("/{id}", async (long id, UserService uService) =>
{
    var status = await uService.Delete(id);
    if (status == -404) return Results.NotFound();
    return Results.NoContent();
});
app.Run();