namespace Websocket.RabbitMQ
{
    public class MessageObj
    {
        public string UserName { get; set; }
        public string Text { get; set; }

        public DateTime Date = DateTime.Now;

        public MessageObj(string name, string message)
        {
            UserName = name;
            Text = message;
        }
    }
}
