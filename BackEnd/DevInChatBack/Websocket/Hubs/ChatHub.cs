using Microsoft.AspNetCore.SignalR;
using System.Text;
using Websocket.RabbitMQ;

namespace Websocket.Hubs
{
    public class ChatHub : Hub
    {
        public async Task SendMessage(string user, string message)
        {
            if (message.Length > 280)
            {
                throw new Exception("Invalid number of characters");
            }
            await Clients.All.SendAsync("ReceiveMessage", user, message);
            MessageObj newMessage = new MessageObj(user, message);
            RabbitConnection.Connect(newMessage);
        }

        public async Task SendReport(int id, string user, string message)
        {
            ReportMessageObj newMessage = new ReportMessageObj(id, user, message);
            RabbitConnection.Report(newMessage);
        }
    }
}
