# Use the official .NET SDK image as the base image
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy the .NET app files to the container
COPY *.sln ./
COPY *.csproj ./
RUN dotnet restore

# copy everything else and build app
COPY . ./
RUN dotnet tool install --global dotnet-ef
ENV PATH="$PATH:/root/.dotnet/tools"
RUN dotnet ef database update -c SqliteTodo
RUN dotnet ef database update -c SqliteUser
RUN dotnet publish -c Release -o out

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
ENV ASPNETCORE_HTTP_PORTS=8080
COPY --from=build /app/todo.db .
COPY --from=build /app/user.db .
COPY --from=build /app/out ./

# Run the app
ENTRYPOINT ["dotnet", "WebApiSqlite.dll"]

#docker build -t dotnet-docker8-api .
#docker run --rm -it -p 5000:8080 dotnet-docker8-api