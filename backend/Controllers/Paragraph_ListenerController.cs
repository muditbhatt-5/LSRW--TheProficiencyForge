using LSRW_Backend.Data;
using LSRW_Backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace LSRW_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class Paragraph_ListenerController : ControllerBase
    {
        private readonly Paragraph_ListenerRepository _Paragraph_ListenerRepository;

        public Paragraph_ListenerController(Paragraph_ListenerRepository Paragraph_ListenerRepository)
        {
            _Paragraph_ListenerRepository = Paragraph_ListenerRepository;
        }

        #region Select All
        [HttpGet]
        public ActionResult GetAllParagraphListeners()
        {
            var listeners = _Paragraph_ListenerRepository.SelectAllParagraphListeners();
            return Ok(listeners);
        }
        #endregion

        #region Select By ID
        [HttpGet("{id}")]
        public IActionResult GetParagraphListenerById(int id)
        {
            var listener = _Paragraph_ListenerRepository.SelectByPK(id);

            if (listener == null)
            {
                return NotFound();
            }

            return Ok(listener);
        }
        #endregion

        #region Insert
        [HttpPost]
        public IActionResult InsertParagraphListener([FromBody] Paragraph_ListenerModel listener)
        {
            if (listener == null)
                return BadRequest();

            bool isInserted = _Paragraph_ListenerRepository.Insert(listener);

            if (isInserted)
                return Ok(new { Message = "Paragraph Listener inserted successfully!" });

            return StatusCode(500, "An error occurred while inserting the paragraph listener.");
        }
        #endregion

        #region Update
        [HttpPut("{id}")]
        public IActionResult UpdateParagraphListener(int id, [FromBody] Paragraph_ListenerModel listener)
        {
            if (listener == null || id != listener.Paragraph_SpeakID)
                return BadRequest();

            var isUpdated = _Paragraph_ListenerRepository.Update(listener);

            if (!isUpdated)
                return NotFound();

            return NoContent();
        }
        #endregion

        #region Delete
        [HttpDelete("{id}")]
        public IActionResult DeleteParagraphListener(int id)
        {
            var isDeleted = _Paragraph_ListenerRepository.Delete(id);
            if (!isDeleted)
            {
                return NotFound();
            }

            return NoContent();
        }
        #endregion
    }
}
