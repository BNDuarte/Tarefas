using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using ToDo.Data.Migrations;
using ToDo.Domain.Listas;
using ToDo.Domain.Tarefas;

namespace ToDo.Data.Context
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext() : base("ToDoDB")
        {
            Database.SetInitializer<ApplicationDbContext>(new MigrateDatabaseToLatestVersion<ApplicationDbContext, Configuration>());
        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
        }

        public DbSet<Tarefa> Tarefas { get; set; }
        public DbSet<Lista> Listas { get; set; }
    }
}
