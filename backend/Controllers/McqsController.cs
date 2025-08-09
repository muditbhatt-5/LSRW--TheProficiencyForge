using LSRW_Backend.Data;
using LSRW_Backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace LSRW_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class McqsController : ControllerBase
    {
        private readonly McqsRepository _mcqsRepository;

        public McqsController(McqsRepository mcqsRepository)
        {
            _mcqsRepository = mcqsRepository;
        }

        #region Select All
        [HttpGet]
        public IActionResult GetAllMcqs()
        {
            var mcqs = _mcqsRepository.SelectAllMcqs();
            return Ok(mcqs);
        }
        #endregion

        #region Select By ID
        [HttpGet("{id}")]
        public IActionResult GetMcqById(int id)
        {
            var mcq = _mcqsRepository.SelectByPK(id);

            if (mcq == null)
                return NotFound();

            return Ok(mcq);
        }
        #endregion

        #region Insert
        [HttpPost]
        public IActionResult InsertMcq([FromBody] McqsModel mcq)
        {
            if (mcq == null)
                return BadRequest("Invalid MCQ data.");

            bool isInserted = _mcqsRepository.Insert(mcq);

            if (isInserted)
                return Ok(new { Message = "MCQ inserted successfully!" });

            return StatusCode(500, "An error occurred while inserting the MCQ.");
        }
        #endregion

        #region Update
        [HttpPut("{id}")]
        public IActionResult UpdateMcq(int id, [FromBody] McqsModel mcq)
        {
            if (mcq == null || id != mcq.McqID)
                return BadRequest("Invalid MCQ data or ID mismatch.");

            var isUpdated = _mcqsRepository.Update(mcq);

            if (!isUpdated)
                return NotFound("MCQ not found.");

            return NoContent();
        }
        #endregion

        #region Delete
        [HttpDelete("{id}")]
        public IActionResult DeleteMcq(int id)
        {
            var isDeleted = _mcqsRepository.Delete(id);
            if (!isDeleted)
                return NotFound("MCQ not found.");

            return NoContent();
        }
        #endregion
    }
}
