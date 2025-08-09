using FluentValidation;
using LSRW_Backend.Models;

namespace LSRW_Backend.Data
{
    public class ParagraphReaderValidation : AbstractValidator<Paragraph_ReaderModel>
    {
        public ParagraphReaderValidation()
        {
            RuleFor(p => p.Paragraph_ReadID).NotEmpty().WithMessage("Please enter a value!");
            RuleFor(p => p.Paragraphs).NotEmpty().WithMessage("Please enter a value!");
            RuleFor(p => p.UserID).NotEmpty().WithMessage("Please enter a value!");
        }
    }
}
