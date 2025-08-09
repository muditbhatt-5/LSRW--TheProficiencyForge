//using FluentValidation.AspNetCore;
//using LSRW_Backend.Data;
//using Microsoft.AspNetCore.Authentication.JwtBearer;
//using Microsoft.IdentityModel.Tokens;
//using System.Reflection;
//using System.Text;

//var builder = WebApplication.CreateBuilder(args);

//// Add services to the container.
//builder.Services.AddControllers()
//    .AddFluentValidation(fv =>
//        fv.RegisterValidatorsFromAssemblies(new[] { Assembly.GetExecutingAssembly() }));

//// Register repositories
//builder.Services.AddScoped<UserRepository>();
//builder.Services.AddScoped<Paragraph_ReaderRepository>();
//builder.Services.AddScoped<Paragraph_ListenerRepository>();
//builder.Services.AddScoped<ExamRepository>();
//builder.Services.AddScoped<McqsRepository>();

//// Enable CORS
//builder.Services.AddCors(options =>
//{
//    options.AddPolicy("AllowAllOrigins",
//        builder =>
//        {
//            builder.AllowAnyOrigin()
//                   .AllowAnyMethod()
//                   .AllowAnyHeader();
//        });
//});

//// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
//builder.Services.AddEndpointsApiExplorer();
//builder.Services.AddSwaggerGen();

//builder.Services.AddAuthentication(options =>
//{
//    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
//    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
//}).AddJwtBearer(options =>
//{
//    options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
//    {
//        ValidateIssuer = true,
//        ValidateAudience = true,
//        ValidateLifetime = true,
//        ValidateIssuerSigningKey = true,
//        ValidIssuer = builder.Configuration["Jwt:Issuer"],
//        ValidAudience = builder.Configuration["Jwt:Audience"],
//        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:SecretKey"]))
//    };
//});

//var app = builder.Build();

//// Configure the HTTP request pipeline.
//if (app.Environment.IsDevelopment())
//{
//    app.UseSwagger();
//    app.UseSwaggerUI();
//}

//app.UseHttpsRedirection();

//// Use CORS before Authorization middleware
//app.UseCors("AllowAllOrigins");

//app.UseAuthorization();

//app.MapControllers();

//app.Run();

using FluentValidation.AspNetCore;
using LSRW_Backend.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Reflection;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers()
    .AddFluentValidation(fv =>
        fv.RegisterValidatorsFromAssemblies(new[] { Assembly.GetExecutingAssembly() }));

// Register repositories
builder.Services.AddScoped<UserRepository>();
builder.Services.AddScoped<Paragraph_ReaderRepository>();
builder.Services.AddScoped<Paragraph_ListenerRepository>();
builder.Services.AddScoped<ExamRepository>();
builder.Services.AddScoped<McqsRepository>();

// Enable CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins",
        builder =>
        {
            builder.AllowAnyOrigin()
                   .AllowAnyMethod()
                   .AllowAnyHeader();
        });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:SecretKey"]))
    };
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Serve React build files
app.UseDefaultFiles();
app.UseStaticFiles();

// CORS
app.UseCors("AllowAllOrigins");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Fallback to React index.html for client-side routing
app.MapFallbackToFile("index.html");

app.Run();
