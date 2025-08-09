using FluentValidation;
using LSRW_Backend.Models;

namespace LSRW_Backend.Data
{
    public class Paragraph_ListenerValidation : AbstractValidator<Paragraph_ListenerModel>
    {
        public Paragraph_ListenerValidation()
        {
            RuleFor(p => p.Paragraph_SpeakID).NotEmpty().WithMessage("Please enter a value for Paragraph Speak ID.");
            RuleFor(p => p.Paragraph_Speak_UserName).NotEmpty().WithMessage("Please enter a value for Paragraph Speak User Name.");
            RuleFor(p => p.Paragraph_ReadID).NotEmpty().WithMessage("Please enter a value for Paragraph Read ID.");
            RuleFor(p => p.UserID).NotEmpty().WithMessage("Please enter a value for User ID.");
        }
    }
}
