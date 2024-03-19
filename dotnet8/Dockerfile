# Use the official .NET SDK image as the base image
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-env
WORKDIR /app

# Copy the .NET app files to the container
COPY *.csproj ./
RUN dotnet restore

# Copy the all files and build the app
COPY . ./
RUN dotnet ef database update
RUN dotnet publish -c Release -o out

# Build the runtime image
FROM mcr.microsoft.com/dotnet/runtime:8.0
WORKDIR /app
COPY --from=build-env /app/account.db .
COPY --from=build-env /app/out ./

# Run the app
ENTRYPOINT ["dotnet", "WebApiSqlite.dll"]