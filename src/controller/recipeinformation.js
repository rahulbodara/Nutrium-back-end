const { response } = require("express");
const RecipeData = require("../model/RecipsInformation");
const fs = require('fs');
const path = require('path');
const { default: mongoose } = require('mongoose');

const createRecipe = async (req, res, next) => {
  try {
    const userId = req.userId;
   
    const newRecipe = new RecipeData({ 
      userId,
      ...req.body
    });

    const savedRecipe = await newRecipe.save();
    res.status(201).json({success:true,data:savedRecipe});
  } catch (error) {
    next(error);
  }
};

const updateRecipe = async (req, res, next) => {
  try {
    const userId = req.userId;
    const recipeId = req.params.recipeId;
    const {name,description,totalTime,preparationTime,finalWeight,portions,ingredients,cookingMethod,commonMeasures} = req.body;
    let existingRecipe = await RecipeData.findOne({userId:userId,_id:recipeId});
    if(!existingRecipe){
      res.status(404).json({message:"Recipe not found"});
    }

    if(existingRecipe){
      if(ingredients && !ingredients._id){
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
        }else {
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
        } else {
          existingRecipe.commonMeasures = [...existingRecipe.commonMeasures, commonMeasures];
        }

    const updatedData = {
      name,
      description,
      totalTime,
      preparationTime,
      finalWeight,
      portions,
      ingredients: existingRecipe.ingredients,
      cookingMethod,
      commonMeasures: existingRecipe.commonMeasures
    }

    if(req.file && req.file.filename){
      if(existingRecipe.image){
        fs.unlinkSync(path.join(__dirname,`../uploads/${existingRecipe.image}`))
      }
      updatedData.image = req.file.filename;
    }
    else{
      updatedData.image = existingRecipe.image;
    }

    const updateRecipe = await RecipeData.findByIdAndUpdate({_id:recipeId},updatedData,{new:true});

    return res.status(200).json({success:true,message:'recipe updated successfully',data:updateRecipe})

  } catch (err) {
    console.log(err);
    next(err);
  }
};

const getRecipeById = async(req, res, next) => {
  try {
    const recipeId = req.params.recipeId;
    const userId = req.userId;

    const recipe = await RecipeData.findOne({userId:userId,_id:recipeId});
    if(!recipe){
      return res.status(404).json({message: 'Recipe not found'});
    }

    return res.status(200).json({success:true,data:recipe});


  }catch(err){
    next(err);
    console.log(err);
  }
}

const deleteRecipe = async(req, res, next) => {
  try{
    const recipeId = req.params.recipeId;
    const userId = req.userId;

    const recipe = await RecipeData.findOne({userId:userId,_id: recipeId});
    if(!recipe){
      return res.status(404).json({message: 'Recipe not found'});
    }
    if(recipe && recipe?.image){
      fs.unlinkSync(path.join(__dirname,`../uploads/${recipe.image}`))
    }

    const delRecipe = await RecipeData.findByIdAndDelete({_id:recipeId});

    return res.status(200).json({message: 'Recipe deleted successfully '});

  }catch(err){
    next(err);
  }
}

const getAllRecipe = async(req,res,next) => {
  try{
    const userId = req.userId;
    const recipe = await RecipeData.find({userId: userId});
    if(!recipe){
      return res.status(404).json({message: 'Recipe not found'});
    }
    return res.status(200).json({success: true, data: recipe});

  }
  catch(err){
    next(err);
  }
}



module.exports = { createRecipe, updateRecipe, getRecipeById, deleteRecipe, getAllRecipe };








