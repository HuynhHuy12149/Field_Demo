FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /app

COPY FieldServiceAPI/*.csproj ./FieldServiceAPI/
RUN dotnet restore ./FieldServiceAPI/FieldServiceAPI.csproj

COPY FieldServiceAPI/. ./FieldServiceAPI/
RUN dotnet publish ./FieldServiceAPI/FieldServiceAPI.csproj -c Release -o /app/out

FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /app/out .
EXPOSE 7860
ENV ASPNETCORE_URLS=http://0.0.0.0:7860
ENTRYPOINT ["dotnet", "FieldServiceAPI.dll"]