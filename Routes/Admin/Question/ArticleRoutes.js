import express from "express";
const router = express.Router();
import Article from "../../../Models/QuestionsModel/Article.js";
import {
  handleServerError,
  handleNotFound,
} from "../../../Middlewares/middle.js";

router.get("/getArticles", async (req, res) => {
  try {
    const searchQuery = req.query.search;
    let allArticles;
    if (searchQuery) {
      const regexQuery = new RegExp(searchQuery, "i");
      allArticles = await Article.find({
        $or: [
          { category: { $regex: regexQuery } },
          { uniqueCode: { $regex: regexQuery } },
          { question: { $regex: regexQuery } },
        ],
      });
    } else {
      allArticles = await Article.find();
    }

    res.status(201).json(allArticles);
  } catch (error) {
    handleServerError(res, error);
  }
});

router.post("/addArticle", async (req, res) => {
  const newArticle = new Article({
    name: req.body.name,
    category: req.body.category,
    paragraph: req.body.paragraph,
    queArray: req.body.queArray,
  });

  try {
    const savedArticle = await newArticle.save();
    res.status(201).json(savedArticle);
  } catch (error) {
    handleServerError(res, error);
  }
});

router.put("/updateArticle/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const updatedArticle = await Article.findByIdAndUpdate(
      id,
      {
        $set: {
          name: req.body.name,
          category: req.body.category,
          paragraph: req.body.paragraph,
          queArray: req.body.queArray,
        },
      },
      { new: true }
    );
    if (!updatedArticle) {
      return handleNotFound(res, "Article not found");
    }
    res.status(201).json(updatedArticle);
  } catch (error) {
    handleServerError(res, error);
  }
});

router.delete("/delArticle/:id", async (req, res) => {
  const articleId = req.params.id;

  try {
    const deletedArticle = await Article.findByIdAndDelete(articleId);

    if (!deletedArticle) {
      return handleNotFound(res, "Article not found");
    }

    res
      .status(200)
      .json({ message: "Article deleted successfully", deletedArticle });
  } catch (error) {
    handleServerError(res, error);
  }
});

export { router as articleRoutes };
