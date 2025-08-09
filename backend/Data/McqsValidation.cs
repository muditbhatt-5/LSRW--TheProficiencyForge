using FluentValidation;
using LSRW_Backend.Models;

namespace LSRW_Backend.Data
{
    public class McqsValidation : AbstractValidator<McqsModel>
    {
        public McqsValidation()
        {
            RuleFor(m => m.UserID)
                .NotEmpty().WithMessage("UserID is required!!")
                .GreaterThan(0).WithMessage("UserID must be a positive integer!!");

            RuleFor(m => m.Question)
                .NotEmpty().WithMessage("Question is required!!")
                .MaximumLength(255).WithMessage("Question must be at most 255 characters long!!");

            RuleFor(m => m.OptionA)
                .NotEmpty().WithMessage("Option A is required!!")
                .MaximumLength(255).WithMessage("Option A must be at most 255 characters long!!");

            RuleFor(m => m.OptionB)
                .NotEmpty().WithMessage("Option B is required!!")
                .MaximumLength(255).WithMessage("Option B must be at most 255 characters long!!");

            RuleFor(m => m.OptionC)
                .NotEmpty().WithMessage("Option C is required!!")
                .MaximumLength(255).WithMessage("Option C must be at most 255 characters long!!");

            RuleFor(m => m.OptionD)
                .NotEmpty().WithMessage("Option D is required!!")
                .MaximumLength(255).WithMessage("Option D must be at most 255 characters long!!");

            RuleFor(m => m.Answer)
                .NotEmpty().WithMessage("Answer is required!!")
                .Must((m, answer) => answer == m.OptionA || answer == m.OptionB || answer == m.OptionC || answer == m.OptionD)
                .WithMessage("Answer must match one of the provided options!!");
        }
    }
}
