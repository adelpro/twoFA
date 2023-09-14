const { body } = require("express-validator");

const validate = [
  body("name").notEmpty().withMessage("You must enter a valide Name").trim(),
  body("email")
    .notEmpty()
    .isEmail()
    .withMessage("You must enter a valide email")
    .normalizeEmail(),
  body("subject")
    .notEmpty()
    .withMessage("You must enter a valide subject")
    .trim(),
  body("text")
    .notEmpty()
    .withMessage("You must enter a valide text")
    .isLength({ min: 10 })
    .withMessage("Text must be at least 10 characters long")
    .trim(),
];
module.exports = validate;
