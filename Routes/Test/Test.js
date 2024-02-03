const QuestionModel = require('../../Models/QuestionsModel/Question.js'); // Adjust the path accordingly
const ArticleModel = require('../../Models/QuestionsModel/Article.js'); // Adjust the path accordingly

async function getRandomQuestionsAndArticle() {
  try {
    // Fetch 10 random questions
    const questions = await QuestionModel.aggregate([{ $sample: { size: 10 } }]);

    // Fetch one random article
    const article = await ArticleModel.aggregate([{ $sample: { size: 1 } }]);

    return { questions, article };
  } catch (error) {
    console.error('Error fetching questions and article:', error.message);
    throw error;
  }
}

// Example usage with async/await
async function fetchRandomData() {
  try {
    const { questions, article } = await getRandomQuestionsAndArticle();
    console.log('Random Questions:', questions);
    console.log('Random Article:', article);
  } catch (error) {
    // Handle errors
  }
}

// Call the async function
fetchRandomData();
