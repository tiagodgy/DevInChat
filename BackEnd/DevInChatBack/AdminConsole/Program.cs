using AdminConsole.Context;
using AdminConsole.Models;
using AdminConsole.ViewModel;
using Newtonsoft.Json;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Text;

var factory = new ConnectionFactory()
{
    HostName = "192.241.133.135",
    UserName = "admin",
    Password = "admin"
};

using var connection = factory.CreateConnection();
using var channel = connection.CreateModel();


channel.QueueDeclare(queue: "reportQueue",
                           durable: true,
                           exclusive: false,
                           autoDelete: false,
                           arguments: null);

var consumer = new EventingBasicConsumer(channel);

consumer.Received += (model, ea) =>
{
    var body = ea.Body.ToArray();
    var message = Encoding.UTF8.GetString(body);
    MessageViewModel text = JsonConvert.DeserializeObject<MessageViewModel>(message);
    Console.WriteLine($"Report received: {text.UserName} for '{text.Text}'");
    Console.WriteLine("Type Y to accept or N to reject");
    string selection = Console.ReadLine().ToLower();
    while (!selection.Equals("y") && !selection.Equals("n"))
    {
        selection = Console.ReadLine().ToLower();
    }
    if (selection.Equals("y"))
    {
        DeleteMessage(text.Id);
        Console.WriteLine($"The message with Id {text.Id} has been successfully deleted");
    }
    Console.WriteLine();
    Console.WriteLine("Waiting for messages.........");

};

Console.WriteLine("Welcome to AdminConsole!");
Console.WriteLine("Waiting for messages.........");

while (true)
{
    channel.BasicConsume(queue: "reportQueue",
                         autoAck: true,
                         consumer: consumer);
}


async Task DeleteMessage(int id)
{
    using var ctx = new AdminConsoleContext();
    var message = await ctx.Messages.FindAsync(id);
    if (message != null)
    {
        ctx.Messages.Remove(message);
        await ctx.SaveChangesAsync();
    }
}