#Build Stage
FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /source
COPY . .
RUN dotnet restore "./WriteApi.csproj" --disable-parallel
RUN dotnet publish "./WriteApi.csproj" -c release -o /app --no-restore


#Serve Stage
FROM mcr.microsoft.com/dotnet/aspnet:7.0
WORKDIR /app
COPY --from=build /app ./
CMD ["tail", "-f", "/dev/null"]

EXPOSE 7114

ENTRYPOINT ["dotnet", "WriteApi.dll"]