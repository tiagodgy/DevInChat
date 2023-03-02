using Microsoft.AspNetCore.SignalR;
using Moq;
using RabbitMQ.Client.Events;
using RabbitMQ.Client;
using System.Text;
using Websocket.Hubs;
using Websocket.RabbitMQ;
using Newtonsoft.Json;
using WriteAPI.ViewModel;

namespace TestProject
{
    public class Tests
    {
        [SetUp]
        public void Setup()
        {
        }

        [Test]
        public void SendMessage_WhenMessageIsTooLong_ThrowsException()
        {
            // Arrange
            var hub = new ChatHub();
            var user = "John";
            var message = new string('A', 281);

            // Act & Assert
            Assert.ThrowsAsync<Exception>(() => hub.SendMessage(user, message));
        }

        [Test]
        public void Connect_Publishes_Message_To_Websocket_Queue()
        {
            // Arrange
            var message = new MessageObj("John", "Hello");
            var receivedMessage = "";
            // Act
            RabbitConnection.Connect(message);

            // Assert
            using var connection = new ConnectionFactory
            {
                HostName = "192.241.133.135",
                UserName = "admin",
                Password = "admin"
            }.CreateConnection();
            using var channel = connection.CreateModel();
            channel.QueueDeclarePassive("websocket");

            var consumer = new EventingBasicConsumer(channel);
            consumer.Received += (model, ea) =>
            {
                var body = ea.Body.ToArray();
                receivedMessage = Encoding.UTF8.GetString(body);
                var text = JsonConvert.SerializeObject(message);
                Assert.AreEqual(text, receivedMessage);
            };
            channel.BasicConsume("websocket", true, consumer);
            
            
        }

        [Test]
        public void Connect_Publishes_Message_To_Report_Queue()
        {
            // Arrange
            var message = new ReportMessageObj(1, "John", "Hello");
            var receivedMessage = "";
            // Act
            RabbitConnection.Report(message);

            // Assert
            using var connection = new ConnectionFactory
            {
                HostName = "192.241.133.135",
                UserName = "admin",
                Password = "admin"
            }.CreateConnection();
            using var channel = connection.CreateModel();
            channel.QueueDeclarePassive("reportQueue");

            var consumer = new EventingBasicConsumer(channel);
            consumer.Received += (model, ea) =>
            {
                var body = ea.Body.ToArray();
                receivedMessage = Encoding.UTF8.GetString(body);
                var text = JsonConvert.SerializeObject(message);
                Assert.AreEqual(text, receivedMessage);
            };
            channel.BasicConsume("reportQueue", true, consumer);


        }
    }
}