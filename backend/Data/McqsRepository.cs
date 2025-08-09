using LSRW_Backend.Models;
using Microsoft.Data.SqlClient;
using System.Data;

namespace LSRW_Backend.Data
{
    public class McqsRepository
    {
        private readonly string _connectionString;

        public McqsRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("ConnectionString");
        }

        #region Select All MCQs
        public IEnumerable<McqsModel> SelectAllMcqs()
        {
            var mcqs = new List<McqsModel>();
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                SqlCommand cmd = new SqlCommand("PR_Mcqs_SelectAll", conn)
                {
                    CommandType = CommandType.StoredProcedure
                };
                conn.Open();
                SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    mcqs.Add(new McqsModel
                    {
                        McqID = Convert.ToInt32(reader["McqID"]),
                        UserID = Convert.ToInt32(reader["UserID"]),
                        Question = reader["Question"].ToString(),
                        OptionA = reader["OptionA"].ToString(),
                        OptionB = reader["OptionB"].ToString(),
                        OptionC = reader["OptionC"].ToString(),
                        OptionD = reader["OptionD"].ToString(),
                        Answer = reader["Answer"].ToString()
                    });
                }
            }

            // Shuffle MCQs for added randomness (optional)
            Random random = new Random();
            return mcqs.OrderBy(x => random.Next()).ToList();
        }
        #endregion


        #region Select By PK
        public McqsModel SelectByPK(int McqID)
        {
            McqsModel mcq = null;
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                SqlCommand cmd = new SqlCommand("PR_Mcqs_SelectByPK", conn)
                {
                    CommandType = CommandType.StoredProcedure
                };
                cmd.Parameters.AddWithValue("@McqID", McqID);
                conn.Open();
                SqlDataReader reader = cmd.ExecuteReader();
                if (reader.Read())
                {
                    mcq = new McqsModel
                    {
                        McqID = Convert.ToInt32(reader["McqID"]),
                        UserID = Convert.ToInt32(reader["UserID"]),
                        Question = reader["Question"].ToString(),
                        OptionA = reader["OptionA"].ToString(),
                        OptionB = reader["OptionB"].ToString(),
                        OptionC = reader["OptionC"].ToString(),
                        OptionD = reader["OptionD"].ToString(),
                        Answer = reader["Answer"].ToString()
                    };
                }
            }
            return mcq;
        }
        #endregion

        #region Insert
        public bool Insert(McqsModel mcq)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                SqlCommand cmd = new SqlCommand("PR_Mcqs_Insert", conn)
                {
                    CommandType = CommandType.StoredProcedure
                };
                cmd.Parameters.AddWithValue("@UserID", mcq.UserID);
                cmd.Parameters.AddWithValue("@Question", mcq.Question);
                cmd.Parameters.AddWithValue("@OptionA", mcq.OptionA);
                cmd.Parameters.AddWithValue("@OptionB", mcq.OptionB);
                cmd.Parameters.AddWithValue("@OptionC", mcq.OptionC);
                cmd.Parameters.AddWithValue("@OptionD", mcq.OptionD);
                cmd.Parameters.AddWithValue("@Answer", mcq.Answer);
                conn.Open();
                int rowsAffected = cmd.ExecuteNonQuery();
                return rowsAffected > 0;
            }
        }
        #endregion

        #region Update
        public bool Update(McqsModel mcq)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                SqlCommand cmd = new SqlCommand("PR_Mcqs_Update", conn)
                {
                    CommandType = CommandType.StoredProcedure
                };
                cmd.Parameters.AddWithValue("@McqID", mcq.McqID);
                cmd.Parameters.AddWithValue("@UserID", mcq.UserID);
                cmd.Parameters.AddWithValue("@Question", mcq.Question);
                cmd.Parameters.AddWithValue("@OptionA", mcq.OptionA);
                cmd.Parameters.AddWithValue("@OptionB", mcq.OptionB);
                cmd.Parameters.AddWithValue("@OptionC", mcq.OptionC);
                cmd.Parameters.AddWithValue("@OptionD", mcq.OptionD);
                cmd.Parameters.AddWithValue("@Answer", mcq.Answer);
                conn.Open();
                int rowsAffected = cmd.ExecuteNonQuery();
                return rowsAffected > 0;
            }
        }
        #endregion

        #region Delete
        public bool Delete(int McqID)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                SqlCommand cmd = new SqlCommand("PR_Mcqs_Delete", conn)
                {
                    CommandType = CommandType.StoredProcedure
                };
                cmd.Parameters.AddWithValue("@McqID", McqID);
                conn.Open();
                int rowsAffected = cmd.ExecuteNonQuery();
                return rowsAffected > 0;
            }
        }
        #endregion
    }
}
