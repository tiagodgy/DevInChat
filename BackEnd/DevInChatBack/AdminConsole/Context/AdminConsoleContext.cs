using AdminConsole.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdminConsole.Context
{
    public class AdminConsoleContext : DbContext
    {
        public DbSet<Message> Messages { get; set; }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer("Server=192.241.133.135;Database=DevInChat;User Id=sa;Password=SqlServer2019;TrustServerCertificate=true;");
        }
    }
}
