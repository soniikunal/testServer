import express from "express";
const router = express.Router();
import categorySchema from "../../Models/QuestionsModel/Category.js";
import { handleServerError, handleNotFound } from "../../Middlewares/middle.js";

router.get("/allCategories", async (req, res) => {
  try {
    const allCategories = await categorySchema.find();
    res.status(200).json(allCategories);
  } catch (error) {
    handleServerError(res, error);
  }
});

router.post("/addCategory", async (req, res) => {
  const newCategory = new categorySchema({
    name: req.body.name,
    heads: req.body.heads,
  });
  try {
    const savedCategory = await newCategory.save();
    res.status(200).json(savedCategory);
  } catch (error) {
    handleServerError(res, error);
  }
});

router.put("/updateCategory/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const updatedCategory = await categorySchema.findByIdAndUpdate(
      id,
      {
        $set: { name: req.body.name, heads: req.body.heads },
      },
      { new: true }
    );
    if (!updatedCategory) {
      return handleNotFound(res, "Category not found");
    }

    res.status(200).json(updatedCategory);
  } catch (error) {
    handleServerError(res, error);
  }
});

router.delete("/delCategory/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const deletedCategory = await categorySchema.findByIdAndDelete(id);

    if (!deletedCategory) {
      return handleNotFound(res, "Category not found");
    }

    res.status(200).json(deletedCategory);
  } catch (error) {
    handleServerError(res, error);
  }
});

export { router as categoryRoutes };
