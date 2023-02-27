using MainApi.Models;
using Microsoft.EntityFrameworkCore;

namespace MainApi.Context
{
    public class MainApiContext : DbContext
    {
        public MainApiContext(DbContextOptions<MainApiContext> options) : base(options)
        {
        }
        public DbSet<User> Users { get; set; }
        public DbSet<Message> Messages { get; set; }
    }
}
