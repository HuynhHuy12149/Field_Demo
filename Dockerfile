# ---------- BƯỚC 1: BUILD FRONTEND (NEXT.JS) ----------
FROM node:20-alpine AS build-fe
WORKDIR /fe
# Copy file cấu hình package để cài thư viện trước
COPY field-web/package*.json ./
RUN npm ci
# Copy toàn bộ code frontend vào và build
COPY field-web/ ./
# Đặt API URL thành /api để browser tự hiểu là gọi cùng một domain với giao diện
ENV NEXT_PUBLIC_API_URL=/api
RUN npm run build
# Kết quả build sẽ nằm ở thư mục /fe/out

# ---------- BƯỚC 2: BUILD BACKEND (.NET) ----------
FROM mcr.microsoft.com/dotnet/sdk:10.0-preview AS build-be
WORKDIR /app

COPY FieldServiceAPI/*.csproj ./FieldServiceAPI/
RUN dotnet restore ./FieldServiceAPI/FieldServiceAPI.csproj

COPY FieldServiceAPI/. ./FieldServiceAPI/
RUN dotnet publish ./FieldServiceAPI/FieldServiceAPI.csproj -c Release -o /app/out

# ---------- BƯỚC 3: GỘP CHUNG VÀ CHẠY ----------
FROM mcr.microsoft.com/dotnet/aspnet:10.0-preview
WORKDIR /app

# 1. Copy file chạy của Backend
COPY --from=build-be /app/out .

# 2. Copy cục build tĩnh của Frontend vào thư mục wwwroot của Backend
COPY --from=build-fe /fe/out ./wwwroot

# Mở port 7860 theo yêu cầu của Hugging Face
EXPOSE 7860
ENV ASPNETCORE_URLS=http://0.0.0.0:7860

ENTRYPOINT ["dotnet", "FieldServiceAPI.dll"]