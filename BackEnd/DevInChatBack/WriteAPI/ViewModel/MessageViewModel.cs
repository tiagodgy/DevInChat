namespace WriteAPI.ViewModel
{
    public class MessageViewModel
    {
        public string Name {get; set;}
        public string Message { get; set; }
        
        public DateTime Date = DateTime.Now;
    }
}
