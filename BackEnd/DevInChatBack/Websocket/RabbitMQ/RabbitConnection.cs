using System.Text;
using System.Threading.Channels;
using RabbitMQ.Client;
namespace Websocket.RabbitMQ
{
    public class RabbitConnection
    {
        public static void Connect(MessageObj message)
        {
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
            var preBody =  Newtonsoft.Json.JsonConvert.SerializeObject(message);
            var body = Encoding.UTF8.GetBytes(preBody);

            channel.BasicPublish(exchange: string.Empty,
                                 routingKey: "websocket",
                                 basicProperties: null,
                                 body: body);

        }

        public static void Report(ReportMessageObj message)
        {
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
            var preBody = Newtonsoft.Json.JsonConvert.SerializeObject(message);
            var body = Encoding.UTF8.GetBytes(preBody);

            channel.BasicPublish(exchange: string.Empty,
                                 routingKey: "reportQueue",
                                 basicProperties: null,
                                 body: body);

        }
    }
}
