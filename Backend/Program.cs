using Backend.Context;
using Backend.Contract;
using Backend.Repository;
using Microsoft.AspNetCore.Http.Features;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Configure form options for file uploads
builder.Services.Configure<FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = 15728640;
});


// Add DapperContext as a singleton
builder.Services.AddSingleton<DapperContext>();

// Add CompanydetailsRepository with the connection string
builder.Services.AddScoped<ICompanydetailsRepository, CompanydetailsRepository>();

// Add the upload folder path as a singleton
builder.Services.AddSingleton(builder.Configuration["UploadFolder"]);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors(policy => policy.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());

app.UseAuthorization();

app.MapControllers();

app.Run();
