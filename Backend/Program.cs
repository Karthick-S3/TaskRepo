using Backend.Context;
using Backend.Contract;
using Backend.Repository;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.Extensions.FileProviders;
using Serilog;
using Microsoft.Extensions.Hosting;
using System.IO;
using MimeKit;
using MailKit.Net.Smtp;
using Backend.Models;

var builder = WebApplication.CreateBuilder(args);

// Read configuration settings
var configSetting = new ConfigurationBuilder()
    .AddJsonFile("appsettings.json")
    .Build();

// Configure Serilog
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Debug()
    .MinimumLevel.Override("Microsoft", Serilog.Events.LogEventLevel.Warning)
    .Enrich.FromLogContext()
    .WriteTo.File(configSetting["Logging:LogPath"])
    .CreateLogger();

// Use Serilog for logging
builder.Host.UseSerilog();
builder.Services.AddControllers();

// Register services
builder.Services.AddSingleton<DapperContext>();
builder.Services.AddScoped<ICompanydetailsRepository, CompanydetailsRepository>();

// Configure worker service
builder.Services.AddHostedService<MyWorkerService>();

builder.Host.UseWindowsService();

// Add this line to bind the EmailSettings section to the EmailSettings class
builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection("EmailSettings"));





// Configure upload folder path
string uploadFolder = configSetting["UploadFolder"];
if (!Directory.Exists(uploadFolder))
{
    Directory.CreateDirectory(uploadFolder);
}
builder.Services.AddSingleton(uploadFolder);

// Configure form options
builder.Services.Configure<FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = 15728640;
});

// Add Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(uploadFolder),
    RequestPath = "/uploads"
});

app.UseCors(policy => policy.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());

app.UseAuthorization();

app.MapControllers();

app.Run();
