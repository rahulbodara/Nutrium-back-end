const availableOptions = [
  "Dairy and Egg Products",
  "Spices and Herbs",
  "Baby Foods",
  "Fats and Oils",
  "Poultry Products",
  "Soup,Sauces,and Gravies",
  "Sausages and Luncheon Meats",
  "Breakfast Cereals",
  "Fruits and Fruit Juices",
  "Pork Products",
  "Vegetables and Vegetable Products",
  "Nut and Seed Products",
  "Beef Products",
  "Beverages",
  "Finfish and Shellfish Products",
  "Legumes and Legume Products",
  "Lamb,Veal,and Game Products",
  "Baked Products",
  "Sweets",
  "Cereal Grains and Pasta",
  "Fast Foods",
  "Meals,Entrees,and Side Dishes",
  "Snacks",
  "American Indian/Alaska Native Foods",
  "Restaurants Food",
];

exports.getGroupOptions = (req, res) => {
  res.json(availableOptions);
};
