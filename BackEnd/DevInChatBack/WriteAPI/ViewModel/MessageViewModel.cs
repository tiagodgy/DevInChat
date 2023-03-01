namespace WriteAPI.ViewModel
{
    public class MessageViewModel
    {
        public string UserName {get; set;}
        public string Text { get; set; }
        
        public DateTime Date = DateTime.Now;
    }
}
