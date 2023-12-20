const { StatusCodes } = require("http-status-codes");
const { ApiError } = require("../../core/ApiError");
const { asyncHandle } = require("../../helpers/asyncHander");
const Joi = require("joi");
const signupValidation = asyncHandle(async (req, res, next) => {
  const correctCondition = Joi.object({
    name: Joi.string().required().min(3).max(50).trim().strict(),
    email: Joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    }),
    password: Joi.string()
      .min(8) // Tối thiểu 8 ký tự
      .max(30) // Tối đa 30 ký tự
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]+$/
      ),
  });
  const validationResult = await correctCondition.validateAsync(req.body, {
    abortEarly: false,
  });

  next();
  // .catch((err) => next(new ApiError(StatusCodes.BAD_GATEWAY, err)));
});

module.exports = {
  signupValidation,
};
