using LSRW_Backend.Models;
using Microsoft.Data.SqlClient;
using System.Data;

namespace LSRW_Backend.Data
{
    public class ExamRepository
    {
        private readonly string _connectionString;

        public ExamRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("ConnectionString");
        }

        #region Select All Exams
        public IEnumerable<ExamModel> SelectAllExams()
        {
            var exams = new List<ExamModel>();
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                SqlCommand cmd = new SqlCommand("PR_Exam_SelectAll", conn)
                {
                    CommandType = CommandType.StoredProcedure
                };
                conn.Open();
                SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    exams.Add(new ExamModel
                    {
                        UserID_Exam = Convert.ToInt32(reader["UserID_Exam"]),
                        UserID = Convert.ToInt32(reader["UserID"]),
                        Correct_Ans = Convert.ToInt32(reader["Correct_Ans"]),
                        InCorrect_Ans = Convert.ToInt32(reader["InCorrect_Ans"])
                    });
                }
            }
            return exams;
        }
        #endregion

        #region Select By PK
        public ExamModel SelectByPK(int UserID_Exam)
        {
            ExamModel exam = null;
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                SqlCommand cmd = new SqlCommand("PR_Exam_SelectByPK", conn)
                {
                    CommandType = CommandType.StoredProcedure
                };
                cmd.Parameters.AddWithValue("@UserID_Exam", UserID_Exam);
                conn.Open();
                SqlDataReader reader = cmd.ExecuteReader();
                if (reader.Read())
                {
                    exam = new ExamModel
                    {
                        UserID_Exam = Convert.ToInt32(reader["UserID_Exam"]),
                        UserID = Convert.ToInt32(reader["UserID"]),
                        Correct_Ans = Convert.ToInt32(reader["Correct_Ans"]),
                        InCorrect_Ans = Convert.ToInt32(reader["InCorrect_Ans"])
                    };
                }
            }
            return exam;
        }
        #endregion

        #region Insert
        public bool Insert(ExamModel exam)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                SqlCommand cmd = new SqlCommand("PR_Exam_Insert", conn)
                {
                    CommandType = CommandType.StoredProcedure
                };
                cmd.Parameters.AddWithValue("@UserID", exam.UserID);
                cmd.Parameters.AddWithValue("@Correct_Ans", exam.Correct_Ans);
                cmd.Parameters.AddWithValue("@InCorrect_Ans", exam.InCorrect_Ans);
                conn.Open();
                int rowsAffected = cmd.ExecuteNonQuery();
                return rowsAffected > 0;
            }
        }
        #endregion

        #region Update
        public bool Update(ExamModel exam)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                SqlCommand cmd = new SqlCommand("PR_Exam_Update", conn)
                {
                    CommandType = CommandType.StoredProcedure
                };
                cmd.Parameters.AddWithValue("@UserID_Exam", exam.UserID_Exam);
                cmd.Parameters.AddWithValue("@UserID", exam.UserID);
                cmd.Parameters.AddWithValue("@Correct_Ans", exam.Correct_Ans);
                cmd.Parameters.AddWithValue("@InCorrect_Ans", exam.InCorrect_Ans);
                conn.Open();
                int rowsAffected = cmd.ExecuteNonQuery();
                return rowsAffected > 0;
            }
        }
        #endregion

        #region Delete
        public bool Delete(int UserID_Exam)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                SqlCommand cmd = new SqlCommand("PR_Exam_Delete", conn)
                {
                    CommandType = CommandType.StoredProcedure
                };
                cmd.Parameters.AddWithValue("@UserID_Exam", UserID_Exam);
                conn.Open();
                int rowsAffected = cmd.ExecuteNonQuery();
                return rowsAffected > 0;
            }
        }
        #endregion
    }
}
