const { validationResult, body } = require(`express-validator`);

const validateUser = [
  // Validation checks for the request body
  body("nama_user").notEmpty().withMessage("nama_user is required"),
  body("username").notEmpty().withMessage("userame is required"),
  body("email").isEmail().withMessage("Invalid email address"),
  body("password").notEmpty().withMessage("Password is required"),
  body("foto").notEmpty().withMessage("Foto required"),

  (request, response, next) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {

        let errMessage = errors
        .array()
        .map((it) => it.msg)
        .join(",");

      return response.status(422).json({
        success: false,
        message: errMessage,
      });
    }
    next(); 
  },
];

module.exports = { validateUser };