using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using Newtonsoft.Json;
using System.Text;
using static System.Net.Mime.MediaTypeNames;
using WriteAPI.ViewModel;
using WriteAPI.Context;
using WriteAPI.Models;

var factory = new ConnectionFactory()
{
    HostName = "192.241.133.135",
    UserName = "admin",
    Password = "admin"
};

using var connection = factory.CreateConnection();
using var channel = connection.CreateModel();


channel.QueueDeclare(queue: "websocket",
                           durable: false,
                           exclusive: false,
                           autoDelete: false,
                           arguments: null);

var consumer = new EventingBasicConsumer(channel);

consumer.Received += (model, ea) =>
{
    var body = ea.Body.ToArray();
    var message = Encoding.UTF8.GetString(body);
    MessageViewModel text = JsonConvert.DeserializeObject<MessageViewModel>(message);
    Console.WriteLine($"Recebido {text.Text} de {text.UserName}.");
    SaveMessage(text);

};

channel.BasicConsume(queue: "websocket",
                        autoAck: true,
                        consumer: consumer);
Console.ReadLine();
async Task SaveMessage(MessageViewModel text)
{
    using var ctx = new WriteAPIContext();
    ctx.Messages.Add(new Message
    {
        UserName = text.UserName,
        Text = text.Text,
        Date = DateTime.Now
    });
    await ctx.SaveChangesAsync();


}