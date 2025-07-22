const createHttpError = require("http-errors");
const Controller = require("./controller");
const { StatusCodes: HttpStatus } = require("http-status-codes");
const { default: slugify } = require("slugify");
const { CategoryModel } = require("../../models/category");
const {
  addCategorySchema,
  updateCategorySchema,
} = require("../validators/category/category.schema");

class CategoryController extends Controller {
  async getListOfCategories(req, res) {
    const query = req.query;
    const categories = await CategoryModel.find(query);
    if (!categories)
      throw createHttpError.ServiceUnavailable("Categories not found");

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        categories,
      },
    });
  }
  async addNewCategory(req, res) {
    const { title, englishTitle, description, type, parent } =
      await addCategorySchema.validateAsync(req.body);
    await this.findCategoryWithTitle(englishTitle);
    const category = await CategoryModel.create({
      title,
      englishTitle,
      description,
      slug: slugify(englishTitle),
    });

    if (!category) throw createHttpError.InternalServerError("Internal error");
    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      data: {
        message: "Category added successfully",
      },
    });
  }
  async updateCategory(req, res) {
    const { id } = req.params;
    const { title, englishTitle, description } = req.body;
    await this.checkExistCategory(id);
    await updateCategorySchema.validateAsync(req.body);
    const updateResult = await CategoryModel.updateOne(
      { _id: id },
      {
        $set: { title, englishTitle, description },
      }
    );
    if (updateResult.modifiedCount == 0)
      throw createError.InternalServerError("Update failed");
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message: "Update completed successfully",
      },
    });
  }
  async removeCategory(req, res) {
    const { id } = req.params;
    await this.checkExistCategory(id);
    const deleteResult = await CategoryModel.findByIdAndDelete(id);
    if (deleteResult.deletedCount == 0)
      throw createError.InternalServerError("Category deletion failed");
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message: "Category deleted successfully",
      },
    });
  }
  async findCategoryWithTitle(englishTitle) {
    const category = await CategoryModel.findOne({ englishTitle });
    if (category)
      throw createHttpError.BadRequest("There is a category with this title.");
  }
  async checkExistCategory(id) {
    const category = await CategoryModel.findById(id);
    if (!category)
      throw createHttpError.BadRequest("There is no category with this title.");
    return category;
  }
}

module.exports = {
  CategoryController: new CategoryController(),
};
