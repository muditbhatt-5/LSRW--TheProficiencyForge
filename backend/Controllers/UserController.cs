using LSRW_Backend.Data;
using LSRW_Backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace LSRW_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserRepository _userRepository;
        private readonly IConfiguration _configuration;

        public UserController(UserRepository userRepository, IConfiguration configuration)
        {
            _userRepository = userRepository;
            _configuration = configuration;
        }

        #region Select All
        [HttpGet]
        public ActionResult GetAllUsers()
        {
            var users = _userRepository.SelectAllUsers();
            return Ok(users);
        }
        #endregion

        #region Select by ID
        [HttpGet("{id}")]
        public IActionResult GetUserById(int id)
        {
            var user = _userRepository.SelectByPK(id);
            if (user == null)
                return NotFound();
            return Ok(user);
        }
        #endregion

        #region Insert
        [HttpPost]
        public IActionResult InsertUser([FromBody] UserModel user)
        {
            if (user == null)
                return BadRequest("Invalid user data.");

            bool isInserted = _userRepository.Insert(user);
            if (isInserted)
                return Ok(new { Message = "User inserted successfully!" });

            return StatusCode(500, "An error occurred while inserting the user.");
        }
        #endregion

        #region Update
        [HttpPut("{id}")]
        public IActionResult UpdateUser(int id, [FromBody] UserModel user)
        {
            if (user == null || id != user.UserID)
                return BadRequest("Invalid user data.");

            var isUpdated = _userRepository.Update(user);
            if (!isUpdated)
                return NotFound("User not found.");

            return NoContent();
        }
        #endregion

        #region Delete
        [HttpDelete("{id}")]
        public IActionResult DeleteUser(int id)
        {
            var isDeleted = _userRepository.Delete(id);
            if (!isDeleted)
                return NotFound("User not found.");

            return NoContent();
        }
        #endregion

        #region Login
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginModel login)
        {
            if (login == null || string.IsNullOrEmpty(login.UserEmail) || string.IsNullOrEmpty(login.Password))
                return BadRequest("Email and Password are required.");

            var user = _userRepository.Login(login.UserEmail, login.Password);
            if (user == null)
                return Unauthorized("Invalid email or password.");

            // ✅ Generate JWT Token
            var token = GenerateJwtToken(user);

            return Ok(new
            {
                UserID = user.UserID,
                UserName = user.UserName,
                UserEmail = user.UserEmail,
                UserMobile = user.UserMobile,
                UserImage = user.UserImage,
                Enrollment = user.Enrollment,
                Role = user.Role,
                userAccess = user.userAccess,
                Token = token
            });
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
