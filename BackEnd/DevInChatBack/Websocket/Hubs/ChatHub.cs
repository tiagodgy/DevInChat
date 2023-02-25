﻿using Microsoft.AspNetCore.SignalR;
using System.Text;
using Websocket.RabbitMQ;

namespace Websocket.Hubs
{
    public class ChatHub : Hub
    {
        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
            MessageObj newMessage = new MessageObj(user, message);
            RabbitConnection.Connect(newMessage);
        }
    }
}