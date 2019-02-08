using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Phonebook.Models;

namespace Phonebook
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);

            var connection = $@"Server=(localdb)\mssqllocaldb;Database={nameof(PhoneDbContext)};Trusted_Connection=True;ConnectRetryCount=0";
            //var connection = Configuration.GetConnectionString("PhoneDbContext");
            services.AddDbContext<PhoneDbContext>
                (options => options.UseSqlServer(connection));

            //Cors Policy
            //services.AddCors(o => o.AddPolicy("AppPolicy", builder =>
            //{
            //    builder.AllowAnyOrigin()
            //    .AllowAnyMethod()
            //    .AllowAnyHeader();
            //}));

            //services.AddMvc().Configure<MvcOptions>(options =>
            //{
            //    options.OutputFormatters
            //               .Where(f => f.Instance is JsonOutputFormatter)
            //               .Select(f => f.Instance as JsonOutputFormatter)
            //               .First()
            //               .SerializerSettings
            //               .ContractResolver = new CamelCasePropertyNamesContractResolver();
            //});
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseHsts();
            }

            ///by tutorial
            app.Use(async (context, next) =>
            {
                await next();
                if (context.Response.StatusCode == 404 && !Path.HasExtension(context.Request.Path.Value))
                {
                    context.Request.Path = "/index.html";
                    context.Response.StatusCode = 200;
                    await next();
                }
            });
            ///

            app.UseHttpsRedirection();

            //DefaultFilesOptions options = new DefaultFilesOptions();
            //options.DefaultFileNames.Clear();
            //options.DefaultFileNames.Add("/index.html");
            //app.UseDefaultFiles(options);

            app.UseStaticFiles();
            app.UseMvc();
        }
    }
}
