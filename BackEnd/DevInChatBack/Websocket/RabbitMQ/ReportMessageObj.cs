namespace Websocket.RabbitMQ
{
    public class ReportMessageObj
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public string Text { get; set; }

        public ReportMessageObj(int id, string name, string message)
        {
            Id = id;
            UserName = name;
            Text = message;
        }
    }
}
