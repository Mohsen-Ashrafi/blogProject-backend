const Joi = require("joi");
const createHttpError = require("http-errors");
const { MongoIDPattern } = require("../../../utils/constants");

async function validateAddNewPost(data) {
  const addNewPostSchema = Joi.object({
    title: Joi.string()
      .min(5)
      .max(100)
      .required()
      .error(createHttpError.BadRequest("Enter the post title correctly")),
    slug: Joi.string()
      .required()
      .error(createHttpError.BadRequest("Enter the post slug correctly")),
    category: Joi.string()
      .required()
      .pattern(MongoIDPattern)
      .error(createHttpError.BadRequest("Enter the category ID correctly")),
    text: Joi.string()
      .required()
      .error(createHttpError.BadRequest("Enter the post text correctly")),
    briefText: Joi.string()
      .required()
      .error(createHttpError.BadRequest("Enter the post summary correctly")),
    readingTime: Joi.number()
      .required()
      .error(
        createHttpError.BadRequest(
          "Enter the correct reading time for the post"
        )
      ),
    type: Joi.string()
      .regex(/(free|premium)/i)
      .error(createHttpError.BadRequest("Post type is not valid")),
    related: Joi.array()
      .items(Joi.string().pattern(MongoIDPattern))
      .error(createHttpError.BadRequest("Related posts are not correct")),
    tags: Joi.array()
      .items(Joi.string())
      .error(createHttpError.BadRequest("Post tags are incorrect")),
  });
  return addNewPostSchema.validateAsync(data);
}

module.exports = {
  validateAddNewPost,
};
