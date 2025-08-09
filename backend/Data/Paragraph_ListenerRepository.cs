using LSRW_Backend.Models;
using Microsoft.Data.SqlClient;
using System.Data;

namespace LSRW_Backend.Data
{
    public class Paragraph_ListenerRepository
    {
        private readonly string _connectionString;

        public Paragraph_ListenerRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("ConnectionString");
        }

        #region Select All Paragraph Listeners
        public IEnumerable<Paragraph_ListenerModel> SelectAllParagraphListeners()
        {
            var listeners = new List<Paragraph_ListenerModel>();
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                SqlCommand cmd = new SqlCommand("PR_ParagraphListener_SelectAll", conn)
                {
                    CommandType = CommandType.StoredProcedure
                };
                conn.Open();
                SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    listeners.Add(new Paragraph_ListenerModel
                    {
                        Paragraph_SpeakID = Convert.ToInt32(reader["Paragraph_SpeakID"]),
                        Paragraph_Speak_UserName = reader["Paragraph_Speak_UserName"].ToString(),
                        Paragraph_ReadID = Convert.ToInt32(reader["Paragraph_ReadID"]),
                        UserID = Convert.ToInt32(reader["UserID"]),
                        Accuracy = reader["Accuracy"].ToString()
                    });
                }
            }
            return listeners;
        }
        #endregion

        #region Select By PK
        public Paragraph_ListenerModel SelectByPK(int Paragraph_SpeakID)
        {
            Paragraph_ListenerModel listener = null;

            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                SqlCommand cmd = new SqlCommand("PR_ParagraphListener_SelectByPK", conn)
                {
                    CommandType = CommandType.StoredProcedure
                };

                cmd.Parameters.AddWithValue("@Paragraph_SpeakID", Paragraph_SpeakID);

                conn.Open();

                SqlDataReader reader = cmd.ExecuteReader();

                if (reader.Read())
                {
                    listener = new Paragraph_ListenerModel
                    {
                        Paragraph_SpeakID = Convert.ToInt32(reader["Paragraph_SpeakID"]),
                        Paragraph_Speak_UserName = reader["Paragraph_Speak_UserName"].ToString(),
                        Paragraph_ReadID = Convert.ToInt32(reader["Paragraph_ReadID"]),
                        UserID = Convert.ToInt32(reader["UserID"]),
                        Accuracy = reader["Accuracy"].ToString()
                    };
                }
            }
            return listener;
        }
        #endregion

        #region Insert
        public bool Insert(Paragraph_ListenerModel listener)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                SqlCommand cmd = new SqlCommand("PR_ParagraphListener_Insert", conn)
                {
                    CommandType = CommandType.StoredProcedure
                };

                cmd.Parameters.AddWithValue("@Paragraph_Speak_UserName", listener.Paragraph_Speak_UserName);
                cmd.Parameters.AddWithValue("@Paragraph_ReadID", listener.Paragraph_ReadID);
                cmd.Parameters.AddWithValue("@UserID", listener.UserID);
                cmd.Parameters.AddWithValue("@Accuracy", listener.Accuracy);

                conn.Open();

                int rowsAffected = cmd.ExecuteNonQuery(); // Execute the stored procedure

                return rowsAffected > 0;
            }
        }
        #endregion

        #region Update
        public bool Update(Paragraph_ListenerModel listener)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                SqlCommand cmd = new SqlCommand("PR_ParagraphListener_Update", conn)
                {
                    CommandType = CommandType.StoredProcedure
                };

                cmd.Parameters.AddWithValue("@Paragraph_SpeakID", listener.Paragraph_SpeakID);
                cmd.Parameters.AddWithValue("@Paragraph_Speak_UserName", listener.Paragraph_Speak_UserName);
                cmd.Parameters.AddWithValue("@Paragraph_ReadID", listener.Paragraph_ReadID);
                cmd.Parameters.AddWithValue("@UserID", listener.UserID);

                conn.Open();

                int rowsAffected = cmd.ExecuteNonQuery();

                return rowsAffected > 0;
            }
        }
        #endregion

        #region Delete
        public bool Delete(int Paragraph_SpeakID)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                SqlCommand cmd = new SqlCommand("PR_ParagraphListener_Delete", conn)
                {
                    CommandType = CommandType.StoredProcedure
                };

                cmd.Parameters.AddWithValue("@Paragraph_SpeakID", Paragraph_SpeakID);

                conn.Open();
                int rowsAffected = cmd.ExecuteNonQuery();
                return rowsAffected > 0;
            }
        }
        #endregion
    }
}
