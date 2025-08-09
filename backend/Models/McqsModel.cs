namespace LSRW_Backend.Models
{
    public class McqsModel
    {
        public int McqID { get; set; }  // Primary Key
        public int UserID { get; set; } // Foreign Key referencing Users table
        public string Question { get; set; }
        public string OptionA { get; set; }
        public string OptionB { get; set; }
        public string OptionC { get; set; }
        public string OptionD { get; set; }
        public string Answer { get; set; }
    }
}
