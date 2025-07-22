const Joi = require("joi");
const createHttpError = require("http-errors");
const { MongoIDPattern } = require("../../../utils/constants");

const contentSchema = Joi.object().keys({
  text: Joi.string()
    .min(10)
    .max(2000)
    .required()
    .error(createHttpError.BadRequest("Enter the comment text correctly")),
});

const addNewCommentSchema = Joi.object({
  content: contentSchema,
  postId: Joi.string()
    .allow()
    .pattern(MongoIDPattern)
    .error(createHttpError.BadRequest("Enter the post ID correctly")),
});

module.exports = {
  addNewCommentSchema,
};
