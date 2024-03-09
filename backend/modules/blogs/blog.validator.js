const Joi = require("joi");

const BlogSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().min(50).required(),
  author: Joi.string(),
  status: Joi.string().valid("published", "draft").default("draft"),
});

const validate = (req, res, next) => {
  const { error } = BlogSchema.validate(req.body);
  if (error) {
    return next(error.details[0].message);
  }
  next();
};

module.exports = { validate };
