"use server"

// Assuming you have proper imports and setup for Mongoose, models, scraping function, and utils
import { revalidatePath } from "next/cache";

import { scrapeAmazonProduct } from "@/scrapper";
import { connectToDB } from "@/scrapper/mongoose";
import Product from "./models/product.model";
import { getAveragePrice, getHighestPrice, getLowestPrice } from "./utils";
import { User } from "@/types";
import { generateEmailBody, sendEmail } from "./nodemailer";

export async function exportAndStoreProduct(productUrl: string) {
  if (!productUrl) return;

  try {
    await connectToDB(); 
    console.log("Connected to MongoDB");
    // Ensure connectToDB() returns a promise and is awaited
    const scrapedProduct = await scrapeAmazonProduct(productUrl);
   // console.log("Scraped product:", scrapedProduct);

    if (!scrapedProduct) {
      throw new Error(`Failed to scrape product data from ${productUrl}`);
    }

    let product = scrapedProduct;

    const existingProduct = await Product.findOne({ url: scrapedProduct.url });

    if (existingProduct) {
      const updatedPriceHistory :any = [
        ...existingProduct.priceHistory,
        { price: scrapedProduct.currentPrice }
      ];

      product = {
        ...scrapedProduct,
        priceHistory: updatedPriceHistory,
        lowestPrice: getLowestPrice(updatedPriceHistory),
        highestPrice: getHighestPrice(updatedPriceHistory),
        averagePrice: getAveragePrice(updatedPriceHistory),
      };
    }

    // Using findOneAndUpdate with upsert:true to either update existing or create new product
    const newProduct = await Product.findOneAndUpdate(
      { url: scrapedProduct.url },
      product,
      { upsert: true, new: true }
    );   
    revalidatePath(`/products/${newProduct._id}`);
  } catch (error: any) {
    console.error(`Failed to create/update product: ${error.message}`);
    throw new Error(`Failed to create/update product: ${error.message}`);
  }
}

export async function getProductById(productId: string) {
    try {
      connectToDB();
  
      const product = await Product.findOne({ _id: productId });
  
      if(!product) return null;
  
      return product;
    } catch (error) {
      console.log(error);
    }
  }

export async function getAllProducts(){
    connectToDB();
    try{
        const products=await Product.find();
        return products;
    }catch (error) {
        console.log(error);
      }
}

export async function getSimilarProducts(productId:string){
  try{
    connectToDB();
    const  currrentProduct=await Product.findById(productId);
    if(!currrentProduct)return null;
    const similarProducts=await  Product.find({
      _id:{$ne:productId},
    }).limit(3);
    return similarProducts;
  }
  catch (error) {
    console.log(error);
  }  
}
export const addUserEmailToProduct = async (productId: string, email: string) => {
  try {
    if (!email) {
      throw new Error("Email is required");
    }

    const product = await Product.findById(productId);
    if (!product) {
      throw new Error("Product not found");
    }

    product.users.push({ email }); // Ensure the users array accepts an object with an email field
    await product.save();
    console.log("Email added to product successfully");
    const emailContent = await generateEmailBody({ title: 'Sample Product', url: 'http://example.com' }, 'WELCOME');
    await sendEmail(emailContent, [email]);
    console.log("Email sent successfully");
  } catch (error) {
    console.error(error);
    throw error;
  }
};