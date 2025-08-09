using FluentValidation;
using LSRW_Backend.Models;

namespace LSRW_Backend.Data
{
    public class UserValidation : AbstractValidator<UserModel>
    {
        public UserValidation()
        {

            RuleFor(u => u.UserName)
                .NotEmpty().WithMessage("Please Enter UserName!!");

            RuleFor(u => u.UserMobile)
                .NotEmpty().WithMessage("Please Enter UserMobile!!")
                .Matches(@"^\d+$").WithMessage("UserMobile should contain only digits!!");

            RuleFor(u => u.UserEmail)
                .NotEmpty().WithMessage("Please Enter UserEmail!!")
                .EmailAddress().WithMessage("Please Enter a valid Email Address!!");

            RuleFor(u => u.UserImage)
                .NotEmpty().WithMessage("Please Enter UserImage!!");

            RuleFor(u => u.Enrollment)
                .NotEmpty().WithMessage("Please Enter Enrollment!!");

            RuleFor(u => u.Password)
    .NotEmpty().WithMessage("Please Enter Password!!");
        }
    }
}
