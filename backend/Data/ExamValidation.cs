using FluentValidation;
using LSRW_Backend.Models;

namespace LSRW_Backend.Data
{
    public class ExamValidation : AbstractValidator<ExamModel>
    {
        public ExamValidation()
        {
            RuleFor(e => e.UserID_Exam).NotEmpty().WithMessage("Please enter a value for UserID Exam.");
            RuleFor(e => e.UserID).NotEmpty().WithMessage("Please enter a value for UserID.");
            RuleFor(e => e.Correct_Ans).NotEmpty().WithMessage("Please enter a value for Correct Answers.");
            RuleFor(e => e.InCorrect_Ans).NotEmpty().WithMessage("Please enter a value for Incorrect Answers.");
        }
    }
}
