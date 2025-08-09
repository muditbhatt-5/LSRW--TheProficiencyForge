using LSRW_Backend.Data;
using LSRW_Backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace LSRW_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class Paragraph_ReaderController : ControllerBase
    {
        private readonly Paragraph_ReaderRepository _Paragraph_ReaderRepository;

        public Paragraph_ReaderController(Paragraph_ReaderRepository Paragraph_ReaderRepository)
        {
            _Paragraph_ReaderRepository = Paragraph_ReaderRepository;
        }

        #region Select All
        [HttpGet]
        public ActionResult GetAllParagraphReaders()
        {
            var paragraphs = _Paragraph_ReaderRepository.SelectAllParagraphReaders();
            return Ok(paragraphs);
        }
        #endregion

        #region Select By ID
        [HttpGet("{id}")]
        public IActionResult GetParagraphReaderById(int id)
        {
            var paragraph = _Paragraph_ReaderRepository.SelectByPK(id);

            if (paragraph == null)
            {
                return NotFound();
            }

            return Ok(paragraph);
        }
        #endregion

        #region Insert
        [HttpPost]
        public IActionResult InsertParagraphReader([FromBody] Paragraph_ReaderModel paragraph)
        {
            if (paragraph == null)
                return BadRequest();

            bool isInserted = _Paragraph_ReaderRepository.Insert(paragraph);

            if (isInserted)
                return Ok(new { Message = "Paragraph Reader inserted successfully!" });

            return StatusCode(500, "An error occurred while inserting the paragraph reader.");
        }
        #endregion

        #region Update
        [HttpPut("{id}")]
        public IActionResult UpdateParagraphReader(int id, [FromBody] Paragraph_ReaderModel paragraph)
        {
            if (paragraph == null || id != paragraph.Paragraph_ReadID)
                return BadRequest();

            var isUpdated = _Paragraph_ReaderRepository.Update(paragraph);

            if (!isUpdated)
                return NotFound();

            return NoContent();
        }
        #endregion

        #region Delete
        [HttpDelete("{id}")]
        public IActionResult DeleteParagraphReader(int id)
        {
            var isDeleted = _Paragraph_ReaderRepository.Delete(id);
            if (!isDeleted)
            {
                return NotFound();
            }

            return NoContent();
        }
        #endregion
    }
}
