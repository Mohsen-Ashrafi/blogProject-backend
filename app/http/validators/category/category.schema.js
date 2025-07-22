const Joi = require("joi");
const createHttpError = require("http-errors");

const addCategorySchema = Joi.object({
  title: Joi.string()
    .required()
    .min(3)
    .max(100)
    .error(createHttpError.BadRequest("Category title is invalid.")),
  englishTitle: Joi.string()
    .required()
    .min(3)
    .max(100)
    .error(createHttpError.BadRequest("English category title is invalid.")),
  description: Joi.string()
    .required()
    .min(3)
    .max(200)
    .error(createHttpError.BadRequest("Category description is invalid.")),
});

const updateCategorySchema = Joi.object({
  title: Joi.string()
    .min(3)
    .max(100)
    .error(createHttpError.BadRequest("Category title is invalid.")),
  englishTitle: Joi.string()
    .min(3)
    .max(100)
    .error(createHttpError.BadRequest("English category title is invalid.")),
  description: Joi.string()
    .required()
    .min(3)
    .max(200)
    .error(createHttpError.BadRequest("Category description is invalid.")),
});

module.exports = {
  addCategorySchema,
  updateCategorySchema,
};
