using LSRW_Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace LSRW_Backend.Data
{
    public class UserRepository
    {
        private readonly string _connectionString;
        private readonly IConfiguration _configuration;

        public UserRepository(IConfiguration configuration)
        {
            _configuration = configuration;
            _connectionString = configuration.GetConnectionString("ConnectionString");
        }

        #region Select All Users
        public IEnumerable<UserModel> SelectAllUsers()
        {
            var users = new List<UserModel>();
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                SqlCommand cmd = new SqlCommand("PR_Users_SelectAll", conn)
                {
                    CommandType = CommandType.StoredProcedure
                };
                conn.Open();
                SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    users.Add(new UserModel
                    {
                        UserID = Convert.ToInt32(reader["UserID"]),
                        UserName = reader["UserName"].ToString(),
                        UserMobile = reader["UserMobile"].ToString(),
                        UserEmail = reader["UserEmail"].ToString(),
                        UserImage = reader["UserImage"]?.ToString(),
                        Enrollment = reader["Enrollment"]?.ToString(),
                        Password = reader["Password"].ToString(),
                        Role = reader["Role"].ToString(),
                        userAccess = reader["userAccess"].ToString()
                    });
                }
            }
            return users;
        }
        #endregion

        #region Select By PK
        public UserModel SelectByPK(int UserID)
        {
            UserModel user = null;
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                SqlCommand cmd = new SqlCommand("PR_Users_SelectByPK", conn)
                {
                    CommandType = CommandType.StoredProcedure
                };
                cmd.Parameters.AddWithValue("@UserID", UserID);
                conn.Open();
                SqlDataReader reader = cmd.ExecuteReader();
                if (reader.Read())
                {
                    user = new UserModel
                    {
                        UserID = Convert.ToInt32(reader["UserID"]),
                        UserName = reader["UserName"].ToString(),
                        UserMobile = reader["UserMobile"].ToString(),
                        UserEmail = reader["UserEmail"].ToString(),
                        UserImage = reader["UserImage"]?.ToString(),
                        Enrollment = reader["Enrollment"]?.ToString(),
                        Password = reader["Password"].ToString(),
                        Role = reader["Role"].ToString(),
                        userAccess = reader["userAccess"].ToString()
                    };
                }
            }
            return user;
        }
        #endregion

        #region Insert
        public bool Insert(UserModel user)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                SqlCommand cmd = new SqlCommand("PR_Users_Insert", conn)
                {
                    CommandType = CommandType.StoredProcedure
                };
                cmd.Parameters.AddWithValue("@UserName", user.UserName);
                cmd.Parameters.AddWithValue("@UserMobile", user.UserMobile);
                cmd.Parameters.AddWithValue("@UserEmail", user.UserEmail);
                cmd.Parameters.AddWithValue("@UserImage", user.UserImage ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Enrollment", user.Enrollment ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Password", user.Password);
                cmd.Parameters.AddWithValue("@Role", user.Role);
                conn.Open();
                int rowsAffected = cmd.ExecuteNonQuery();
                return rowsAffected > 0;
            }
        }
        #endregion

        #region Update
        public bool Update(UserModel user)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                SqlCommand cmd = new SqlCommand("PR_LOC_User_Update", conn) // Fixed stored procedure name
                {
                    CommandType = CommandType.StoredProcedure
                };
                cmd.Parameters.AddWithValue("@UserID", user.UserID);
                cmd.Parameters.AddWithValue("@UserName", user.UserName);
                cmd.Parameters.AddWithValue("@UserMobile", user.UserMobile);
                cmd.Parameters.AddWithValue("@UserEmail", user.UserEmail);
                cmd.Parameters.AddWithValue("@UserImage", user.UserImage ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Enrollment", user.Enrollment ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Password", user.Password);
                cmd.Parameters.AddWithValue("@Role", user.Role);
                cmd.Parameters.AddWithValue("@userAccess", user.userAccess);
                conn.Open();
                int rowsAffected = cmd.ExecuteNonQuery();
                return rowsAffected > 0;
            }
        }
        #endregion

        #region Delete
        public bool Delete(int UserID)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                try
                {

                    SqlCommand cmd = new SqlCommand("PR_User_Delete", conn)
                    {
                        CommandType = CommandType.StoredProcedure
                    };
                    cmd.Parameters.AddWithValue("@UserID", UserID);
                    conn.Open();
                    int rowsAffected = cmd.ExecuteNonQuery();
                    return rowsAffected > 0;
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }
        #endregion

        #region Login
        public UserModel Login(string email, string password)
        {
            UserModel user = null;
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                SqlCommand cmd = new SqlCommand("PR_Users_CheckLogin", conn)
                {
                    CommandType = CommandType.StoredProcedure
                };
                cmd.Parameters.AddWithValue("@UserEmail", email);
                cmd.Parameters.AddWithValue("@Password", password);
                conn.Open();
                SqlDataReader reader = cmd.ExecuteReader();
                if (reader.Read())
                {
                    user = new UserModel
                    {
                        UserID = Convert.ToInt32(reader["UserID"]),
                        UserName = reader["UserName"].ToString(),
                        UserMobile = reader["UserMobile"].ToString(),
                        UserEmail = reader["UserEmail"].ToString(),
                        UserImage = reader["UserImage"]?.ToString(),
                        Enrollment = reader["Enrollment"]?.ToString(),
                        Role = reader["Role"].ToString(),
                        userAccess = reader["userAccess"].ToString()
                    };
                }
            }
            return user;
        }

        public string AuthenticateUser(string email, string password)
        {
            var user = Login(email, password);
            if (user == null)
                return null;
            return GenerateJwtToken(user);
        }
        #endregion

        #region Generate JWT Token
        private string GenerateJwtToken(UserModel user)
        {
            var secretKey = _configuration["Jwt:SecretKey"];
            if (string.IsNullOrEmpty(secretKey) || secretKey.Length < 32)
            {
                throw new Exception("JWT Secret Key must be at least 32 characters long.");
            }

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.UserID.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.UserEmail),
                new Claim("UserName", user.UserName),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
        #endregion
    }
}
