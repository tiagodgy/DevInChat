namespace Websocket.RabbitMQ
{
    public class MessageObj
    {
        public string Name { get; set; }
        public string Message { get; set; }

        public DateTime Date = DateTime.Now;

        public MessageObj(string name, string message)
        {
            Name = name;
            Message = message;
        }
    }
}
