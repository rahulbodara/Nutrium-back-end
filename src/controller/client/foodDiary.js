const createFoodDiary = async (req, res, next) => {
    try {
      console.log("sucess");
      
      res.status(200)//.json(templet);
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  module.exports = {
    createFoodDiary,
  };