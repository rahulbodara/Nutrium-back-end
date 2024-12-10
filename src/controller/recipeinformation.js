const { response } = require("express");
const RecipeData = require("../model/RecipsInformation");
const fs = require('fs');
const path = require('path');
const { default: mongoose } = require('mongoose');
const { totalmem } = require("os");

const createRecipe = async (req, res, next) => {
  try {
    const userId = req.userId;

    const newRecipe = new RecipeData({
      userId,
      ...req.body
    });

    const savedRecipe = await newRecipe.save();
    res.status(201).json({ success: true, data: savedRecipe });
  } catch (error) {
    next(error);
  }
};

const updateRecipe = async (req, res, next) => {
  try {
    const userId = req.userId;
    const recipeId = req.params.recipeId;
    const { name, category, description, totalTime, preparationTime, finalWeight, portions, ingredients, cookingMethod, commonMeasures, website, community } = req.body;
    let existingRecipe = await RecipeData.findOne({ userId: userId, _id: recipeId });
    if (!existingRecipe) {
      res.status(404).json({ message: "Recipe not found" });
    }

    if (existingRecipe) {
      if (ingredients && !ingredients._id) {
        existingRecipe.ingredients.foods.push(ingredients);
      }
      else if (ingredients) {
        let matchingSubarrayIndex = -1;
        existingRecipe.ingredients.foods.some((subarray, index) => {
          if (subarray._id.toString() == ingredients._id) {
            matchingSubarrayIndex = index;
            return true;
          }
          return false;
        });


        if (matchingSubarrayIndex !== -1) {
          existingRecipe.ingredients.foods[matchingSubarrayIndex].subfoods.push({ ...ingredients, _id: new mongoose.Types.ObjectId() });
        } else {
          existingRecipe.ingredients.foods.push(ingredients);
        }
      }

    }
    if (commonMeasures && commonMeasures._id) {
      let indexToUpdate = existingRecipe.commonMeasures.findIndex(oldMeasure =>
        oldMeasure._id.toString() === commonMeasures._id
      );

      if (indexToUpdate !== -1) {
        if (commonMeasures.singularName !== undefined) {
          existingRecipe.commonMeasures[indexToUpdate].singularName = commonMeasures.singularName;
        }
        if (commonMeasures.pluralName !== undefined) {
          existingRecipe.commonMeasures[indexToUpdate].pluralName = commonMeasures.pluralName;
        }
        if (commonMeasures.quantity !== undefined) {
          existingRecipe.commonMeasures[indexToUpdate].quantity = commonMeasures.quantity;
        }
        if (commonMeasures.totalGrams !== undefined) {
          existingRecipe.commonMeasures[indexToUpdate].totalGrams = commonMeasures.totalGrams;
        }
        if (commonMeasures.ediblePortion !== undefined) {
          existingRecipe.commonMeasures[indexToUpdate].ediblePortion = commonMeasures.ediblePortion;
        }
      }
    }

    if (commonMeasures && !commonMeasures._id) {
      existingRecipe.commonMeasures = [...existingRecipe.commonMeasures, commonMeasures];
    }

    const updatedData = {
      name,
      category,
      description,
      totalTime,
      preparationTime,
      finalWeight,
      portions,
      ingredients: existingRecipe.ingredients,
      cookingMethod,
      commonMeasures: existingRecipe.commonMeasures,
      website,
      community
    }

    if (req.file && req.file.filename) {
      if (existingRecipe.image) {
        fs.unlinkSync(path.join(__dirname, `../uploads/${existingRecipe.image}`))
      }
      updatedData.image = req.file.filename;
    }
    else {
      updatedData.image = existingRecipe.image;
    }

    const updateRecipe = await RecipeData.findByIdAndUpdate({ _id: recipeId }, updatedData, { new: true });

    return res.status(200).json({ success: true, message: 'recipe updated successfully', data: updateRecipe })

  } catch (err) {
    console.log(err);
    next(err);
  }
};

const getRecipeById = async (req, res, next) => {
  try {
    const recipeId = req.params.recipeId;
    const userId = req.userId;

    const recipe = await RecipeData.findOne({ userId: userId, _id: recipeId });
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    return res.status(200).json({ success: true, data: recipe });


  } catch (err) {
    next(err);
    console.log(err);
  }
}

const deleteRecipe = async (req, res, next) => {
  try {
    const recipeId = req.params.recipeId;
    const userId = req.userId;

    const recipe = await RecipeData.findOne({ userId: userId, _id: recipeId });
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    if (recipe && recipe?.image) {
      fs.unlinkSync(path.join(__dirname, `../uploads/${recipe.image}`))
    }

    const delRecipe = await RecipeData.findByIdAndDelete({ _id: recipeId });

    return res.status(200).json({ message: 'Recipe deleted successfully ' });

  } catch (err) {
    next(err);
  }
}

const getAllRecipe = async (req, res, next) => {
  try {
    const userId = req.userId;
    const recipe = await RecipeData.find({ userId: userId });
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    return res.status(200).json({ success: true, data: recipe });

  }
  catch (err) {
    next(err);
  }
}

const copyRecipe = async (req, res, next) => {
  try {
    const userId = req.userId;
    const recipeId = req.params.recipeId;
    const recipe = await RecipeData.findOne({ userId: userId, _id: recipeId });
    if (!recipe) {
      return res.status(404).json({ message: 'recipe not found' });
    }
    const copyData = new RecipeData({
      userId: userId,
      image: recipe.image,
      name: `${recipe.name} (copy)`,
      category: recipe.category,
      description: recipe.description,
      totalTime: recipe.totalTime,
      preparationTime: recipe.preparationTime,
      finalWeight: recipe.finalWeight,
      portions: recipe.portions,
      ingredients: recipe.ingredients,
      cookingMethod: recipe.cookingMethod,
      commonMeasures: recipe.commonMeasures
    });

    const saveRecipe = await copyData.save();

    return res.status(200).json({ success: true, message: 'Recipe copied successfully', data: saveRecipe });
  } catch (err) {
    next(err);
  }
}

const deleteMainFood = async (req, res, next) => {
  try {
    const userId = req.userId;

    const recipeId = req.params.recipeId;
    const objectId = req.params.objectId;

    let recipe = await RecipeData.findOne({ userId: userId, _id: recipeId });
    if (!recipe) {
      res.status(404).json({ message: 'recipe not found' });
    }

    const recipeObject = recipe.ingredients.foods.map((recipe) => {
      if (recipe._id.toString() === objectId) {
        return recipe;
      }
    })

    const filteredRecipes = recipeObject.filter(recipe => recipe !== undefined);

    if (filteredRecipes[0].subfoods.length > 0 && filteredRecipes[0].subfoods[0] !== undefined) {
      filteredRecipes[0].name = filteredRecipes[0].subfoods[0].name;
      filteredRecipes[0].quantity = filteredRecipes[0].subfoods[0].quantity;
      filteredRecipes[0].foodId = filteredRecipes[0].subfoods[0].foodId;
      filteredRecipes[0].subfoods[0] = undefined;
      const removeIndex = 0;
      const deleteFood = filteredRecipes[0].subfoods.splice(removeIndex, 1);
      await recipe.save();
      return res.status(200).json({ success: true, message: 'subfood deleted successfully', data: recipe })
    }
    else {
      const newFoods = recipe.ingredients.foods.map(food => {
        if (filteredRecipes[0]._id !== food._id) {
          return food;
        }
      });
      const finalNewFoods = newFoods.filter(food => food !== undefined);
      recipe.ingredients.foods = finalNewFoods;
      await recipe.save();
      return res.status(200).json({ success: true, message: 'food deleted successfully', data: recipe });
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
}

const deleteSubFoods = async (req, res, next) => {
  try {
    const userId = req.userId;

    const recipeId = req.params.recipeId;
    const objectId = req.params.objectId;

    const recipe = await RecipeData.findOne({ userId: userId, _id: recipeId });
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    const subFoodExists = recipe.ingredients.foods.some((mainfood) => {
      mainfood.subfoods = mainfood.subfoods.filter((subfood) => subfood._id.toString() === objectId);
    
      return mainfood.subfoods.length > 0;
    });
    
    if (!subFoodExists) {
      return res.status(404).json({ message: 'Food not found' });
    }

    recipe.ingredients.foods.forEach((mainfood) => {
      mainfood.subfoods = mainfood.subfoods.filter((subfood) => subfood._id.toString() !== objectId);
    });

    recipe.save()
      .then(() => {
        return res.status(200).json({ success: true, message: 'Subfood deleted successfully', data: recipe });
      })

  } catch (err) {
    next(err);
  }
}

const deleteCommonMeasure = async(req, res, next) => {
  try {
    const userId = req.userId;
    const recipeId = req.params.recipeId;
    const objectId = req.params.objectId;

    let recipe = await RecipeData.findOne({userId:userId, _id:recipeId});
    if(!recipe) {
      return res.status(404).json({message:'Recipe not found'});
    }

    const commonMeasureExists = recipe.commonMeasures.filter((measure) => {
      return measure._id.toString() === objectId;
    });
    
    if (commonMeasureExists.length === 0) {
      return res.status(404).json({ message: 'No common measures found' });
    }

    recipe.commonMeasures = recipe.commonMeasures.filter((measure) =>{
      if( measure._id.toString() !== objectId) {
        return measure
      }
    })

    recipe.save()
    .then(()=> {
      return res.status(200).json({ success: true, message: 'commonMeasure deleted successfully', data: recipe });
    })

  }catch(err) {
    next(err);
  }
}


module.exports = {
  createRecipe,
  updateRecipe,
  getRecipeById,
  deleteRecipe,
  getAllRecipe,
  copyRecipe,
  deleteMainFood,
  deleteSubFoods,
  deleteCommonMeasure
};
  


