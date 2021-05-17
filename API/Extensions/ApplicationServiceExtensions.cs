using Microsoft.Extensions.Configuration;
using Persistence;
using MediatR;
using Application.Activities;
using Application.Core;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;


namespace API.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddAppServices(this IServiceCollection services, 
			IConfiguration config)
		{
			services.AddSwaggerGen(c =>
			{
				c.SwaggerDoc("v1", new OpenApiInfo { Title = "API", Version = "v1" });
			});

			services.AddDbContext<DataContext>(opt =>
			{
				opt.UseSqlite(config.GetConnectionString("DefaultConnection"));
			});

			services.AddCors(opt => {
				opt.AddPolicy("CorsPolicy", policy => {
					policy.AllowAnyMethod().AllowAnyHeader().WithOrigins("*");
				});
			});

			services.AddMediatR(typeof(List.Handler).Assembly);

			services.AddAutoMapper(typeof(MappingProfiles).Assembly);

			return services;
		}
    }
}