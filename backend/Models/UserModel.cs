namespace LSRW_Backend.Models
{
    public class UserModel
    {
        public int UserID { get; set; } // Maps to UserID in the table
        public string UserName { get; set; } // Maps to UserName in the table
        public string UserMobile { get; set; } // Maps to UserMobile in the table
        public string UserEmail { get; set; } // Maps to UserEmail in the table
        public string UserImage { get; set; } // Maps to UserImage in the table
        public string Enrollment { get; set; } // Maps to Enrollment in the table
        public string Password { get; set; }
        
        public string userAccess { get; set; }
        public string Role { get; set; } // Maps to Role in the table
    }
}
