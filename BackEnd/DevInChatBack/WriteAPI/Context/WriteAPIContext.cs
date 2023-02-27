using Microsoft.EntityFrameworkCore;
using WriteAPI.Models;
using static System.Net.Mime.MediaTypeNames;

namespace WriteAPI.Context
{
    public class WriteAPIContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Message> Messages { get; set; }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer("Server=192.241.133.135;Database=DevInChat;User Id=sa;Password=SqlServer2019;TrustServerCertificate=true;");
        }
    }
}
