import uploadOnCloudinary from "../middlewire/cloudnary.middlewire.js";
import { Product } from "../model/product.model.js";
import {User} from "../model/user.model.js"
const addProduct = async (req, res) => {
  try {
    const {
      name,
      title,
      description,
      brand,
      catagory,
      headline,
      mrp,
      saleprice,
      stock,
    } = req.body;

    if (!name) {
      return res.status(400).send("name is required");
    }
    if (!title) {
      return res.status(400).send("title is required");
    }
    if (!description) {
      return res.status(400).send("description is required");
    }
    if (!brand) {
      return res.status(400).send("brand is required");
    }
    if (!catagory) {
      return res.status(400).send("catagory is required");
    }
    if (!headline) {
      return res.status(400).send("catagory is required");
    }
    if (!mrp) {
      return res.status(400).send("catagory is required");
    }
    if (!saleprice) {
      return res.status(400).send("catagory is required");
    }
    if (!stock) {
      return res.status(400).send("catagory is required");
    }

    const localFilepath = req.file.path;

    if (!localFilepath) {
      return res.status(500).send("Error in file uploading.");
    }

    const avatar = await uploadOnCloudinary(localFilepath);

    if (!avatar) {
      return res.status(401).send("Avatar Url is required");
    }
    const product = await Product.create({
      image: avatar.url,
      name,
      description,
      mrp,
      saleprice,
      headline,
      catagory,
      stock,
      brand,
      title,
    });
    if (!product) {
      return res.status(401).send("Product creation failed");
    }
    res.status(201).send(product);
  } catch (error) {
    res.status(500).json("Internal Server Error while creat product");
  }
};


const getAllProduct = async (req,res)=>{

  try {
    if(!req.user){
      return res.status(403).send("You are not Authorize")
    }
  
    const data = await Product.find()
    res.status(200).send(data)
  } catch (error) {
    return res.status(400).send("Internal Server error while fetch the data please try after some time")
  }

}

const reviewProduct = async (req,res)=>{
  const {productId , text , userId , rating} = req.body
  if(!productId){
    return res.status(400).send("Product Id is required")
  }
  if(!userId){
    return res.status(400).send("User not Valid")
  }
  if(!rating){
    return res.status(400).send("Rating is Mandatary") 
  }
  if(!text){
    return res.status(400).send("Text is required")
  }
  const findProduct = await Product.findById(productId)
  if(!findProduct){
    return res.status(400).send("Product not found")
  }
  const findUser = await User.findById(userId)
  if(!findUser){
    return res.status(400).send("User not found")
  }
  const review = {
    name : findUser.name,
    text : text,
    rating : rating,
  }
  findProduct.review.push(review)
  findProduct.save({validateBeforeSave : false})
  res.status(200).send("ok")
}

export { addProduct, getAllProduct , reviewProduct};
