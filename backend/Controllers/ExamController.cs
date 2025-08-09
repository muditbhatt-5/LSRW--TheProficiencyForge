using LSRW_Backend.Data;
using LSRW_Backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace LSRW_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExamController : ControllerBase
    {
        private readonly ExamRepository _examRepository;

        public ExamController(ExamRepository examRepository)
        {
            _examRepository = examRepository;
        }

        #region Select All
        [HttpGet]
        public ActionResult GetAllExams()
        {
            var exams = _examRepository.SelectAllExams();
            return Ok(exams);
        }
        #endregion

        #region Select By ID
        [HttpGet("{id}")]
        public IActionResult GetExamById(int id)
        {
            var exam = _examRepository.SelectByPK(id);

            if (exam == null)
            {
                return NotFound();
            }

            return Ok(exam);
        }
        #endregion

        #region Insert
        [HttpPost]
        public IActionResult InsertExam([FromBody] ExamModel exam)
        {
            if (exam == null)
                return BadRequest();

            bool isInserted = _examRepository.Insert(exam);

            if (isInserted)
                return Ok(new { Message = "Exam inserted successfully!" });

            return StatusCode(500, "An error occurred while inserting the exam.");
        }
        #endregion

        #region Update
        [HttpPut("{id}")]
        public IActionResult UpdateExam(int id, [FromBody] ExamModel exam)
        {
            if (exam == null || id != exam.UserID_Exam)
                return BadRequest();

            var isUpdated = _examRepository.Update(exam);

            if (!isUpdated)
                return NotFound();

            return NoContent();
        }
        #endregion

        #region Delete
        [HttpDelete("{id}")]
        public IActionResult DeleteExam(int id)
        {
            var isDeleted = _examRepository.Delete(id);
            if (!isDeleted)
            {
                return NotFound();
            }

            return NoContent();
        }
        #endregion
    }
}