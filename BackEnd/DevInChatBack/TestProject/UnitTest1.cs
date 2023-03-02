using Microsoft.AspNetCore.SignalR;
using Moq;
using Websocket.Hubs;

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
    }
}