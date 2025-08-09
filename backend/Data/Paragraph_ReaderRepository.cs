using LSRW_Backend.Models;
using Microsoft.Data.SqlClient;
using System.Data;

namespace LSRW_Backend.Data
{
    public class Paragraph_ReaderRepository
    {
        private readonly string _connectionString;

        public Paragraph_ReaderRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("ConnectionString");
        }

        #region Select All Paragraph Readers
        public IEnumerable<Paragraph_ReaderModel> SelectAllParagraphReaders()
        {
            var paragraphs = new List<Paragraph_ReaderModel>();
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                SqlCommand cmd = new SqlCommand("PR_ParagraphReader_SelectAll", conn)
                {
                    CommandType = CommandType.StoredProcedure
                };
                conn.Open();
                SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    paragraphs.Add(new Paragraph_ReaderModel
                    {
                        Paragraph_ReadID = Convert.ToInt32(reader["Paragraph_ReadID"]),
                        Paragraphs = reader["Paragraphs"].ToString(),
                        UserID = Convert.ToInt32(reader["UserID"])
                    });
                }
            }
            return paragraphs;
        }
        #endregion

        #region Select By PK
        public Paragraph_ReaderModel SelectByPK(int Paragraph_ReadID)
        {
            Paragraph_ReaderModel paragraph = null;

            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                SqlCommand cmd = new SqlCommand("PR_ParagraphReader_SelectByPK", conn)
                {
                    CommandType = CommandType.StoredProcedure
                };

                cmd.Parameters.AddWithValue("@Paragraph_ReadID", Paragraph_ReadID);

                conn.Open();

                SqlDataReader reader = cmd.ExecuteReader();

                if (reader.Read())
                {
                    paragraph = new Paragraph_ReaderModel
                    {
                        Paragraph_ReadID = Convert.ToInt32(reader["Paragraph_ReadID"]),
                        Paragraphs = reader["Paragraphs"].ToString(),
                        UserID = Convert.ToInt32(reader["UserID"])
                    };
                }
            }
            return paragraph;
        }
        #endregion

        #region Insert
        public bool Insert(Paragraph_ReaderModel paragraph)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                SqlCommand cmd = new SqlCommand("PR_ParagraphReader_Insert", conn)
                {
                    CommandType = CommandType.StoredProcedure
                };

                cmd.Parameters.AddWithValue("@Paragraphs", paragraph.Paragraphs);
                cmd.Parameters.AddWithValue("@UserID", paragraph.UserID);

                conn.Open();

                int rowsAffected = cmd.ExecuteNonQuery(); // Execute the stored procedure

                return rowsAffected > 0;
            }
        }
        #endregion

        #region Update
        public bool Update(Paragraph_ReaderModel paragraph)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                SqlCommand cmd = new SqlCommand("PR_ParagraphReader_Update", conn)
                {
                    CommandType = CommandType.StoredProcedure
                };

                cmd.Parameters.AddWithValue("@Paragraph_ReadID", paragraph.Paragraph_ReadID);
                cmd.Parameters.AddWithValue("@Paragraphs", paragraph.Paragraphs);
                cmd.Parameters.AddWithValue("@UserID", paragraph.UserID);

                conn.Open();

                int rowsAffected = cmd.ExecuteNonQuery();

                return rowsAffected > 0;
            }
        }
        #endregion

        #region Delete
        public bool Delete(int Paragraph_ReadID)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                SqlCommand cmd = new SqlCommand("PR_ParagraphReader_Delete", conn)
                {
                    CommandType = CommandType.StoredProcedure
                };

                cmd.Parameters.AddWithValue("@Paragraph_ReadID", Paragraph_ReadID);

                conn.Open();
                int rowsAffected = cmd.ExecuteNonQuery();
                return rowsAffected > 0;
            }
        }
        #endregion
    }
}
