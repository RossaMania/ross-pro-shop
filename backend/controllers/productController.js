import asyncHandler from "../middleware/asyncHandler.js";

import Product from "../models/productModel.js";

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
const products = await Product.find({}); //Find all products in the database.
res.json(products); //Send the products in JSON format.

});

// @desc    Fetch single product by id
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Resource not found!");
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  //Create a new product object with the data from the request body.
  const product = new Product({
    name: "Sample name",
    price: 0,
    user: req.user._id,
    image: "/images/sample.jpg",
    brand: "Sample brand",
    category: "Sample category",
    countInStock: 0,
    numReviews: 0,
    description: "Sample description",
  });

  //Save the product to the database and send the product data in JSON format.
  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } =
    req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name; //If the name is provided, update the name.
    product.price = price; //If the price is provided, update the price.
    product.description = description; //If the description is provided, update the description.
    product.image = image; //If the image is provided, update the image.
    product.brand = brand; //If the brand is provided, update the brand.
    product.category = category; //If the category is provided, update the category.
    product.countInStock = countInStock; //If the countInStock is provided, update the countInStock.

    const updatedProduct = await product.save(); //Save the updated product to the database.
    res.json(updatedProduct);
  } else {
    res.status(404); //That means the product is not found.
    throw new Error("Oops! Product not found!");
  }
});


// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {

  const product = await Product.findById(req.params.id);

  if (product) {
   await Product.deleteOne({_id: product._id})
   res.status(200).json({ message: "Yay! Product deleted!"});
  } else {
    res.status(404); //That means the product is not found.
    throw new Error("Oops! Product not found!");
  }
});

export { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
