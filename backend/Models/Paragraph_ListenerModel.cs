namespace LSRW_Backend.Models
{
    public class Paragraph_ListenerModel
    {
        public int Paragraph_SpeakID { get; set; }
        public string Paragraph_Speak_UserName { get; set; }
        public int Paragraph_ReadID { get; set; }
        public int UserID { get; set; }
        public string Accuracy { get; set; }
    }
}
