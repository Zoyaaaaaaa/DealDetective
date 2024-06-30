import { NextResponse } from "next/server";
import { getLowestPrice, getHighestPrice, getAveragePrice, getEmailNotifType } from "@/libs/actions/utils";
import { connectToDB } from "@/scrapper/mongoose";
import Product from "@/libs/actions/models/product.model";
import { scrapeAmazonProduct } from "@/scrapper";
import { generateEmailBody, sendEmail } from "@/libs/actions/nodemailer";

export const maxDuration = 60; 
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    await connectToDB();

    const products = await Product.find({});

    if (!products) throw new Error("No product fetched");

    // Scrape latest product details & update DB
    const updatedProducts = await Promise.all(
      products.map(async (currentProduct) => {
        // Scrape product
        const scrapedProduct = await scrapeAmazonProduct(currentProduct.url);

        // Check if scrapedProduct is valid
        if (!scrapedProduct || !scrapedProduct.currentPrice) {
          console.error(`Failed to scrape product or product does not have a current price: ${currentProduct.url}`);
          return currentProduct; // Skip updating this product
        }

        const updatedPriceHistory = [
          ...currentProduct.priceHistory,
          {
            price: scrapedProduct.currentPrice,
            date: new Date(), // Ensure each price entry has a date
          },
        ];

        const product = {
          ...scrapedProduct,
          priceHistory: updatedPriceHistory,
          lowestPrice: getLowestPrice(updatedPriceHistory),
          highestPrice: getHighestPrice(updatedPriceHistory),
          averagePrice: getAveragePrice(updatedPriceHistory),
        };

        // Update Products in DB
        const updatedProduct = await Product.findOneAndUpdate(
          {
            url: product.url,
          },
          product,
          { new: true } // Return the updated document
        );

        // Check each product's status & send email accordingly
        const emailNotifType = getEmailNotifType(scrapedProduct, currentProduct);

        if (emailNotifType && updatedProduct && updatedProduct.users.length > 0) {
          const productInfo = {
            title: updatedProduct.title,
            url: updatedProduct.url,
          };
          // Construct emailContent
          const emailContent = await generateEmailBody(productInfo, emailNotifType);
          // Get array of user emails
          const userEmails = updatedProduct.users.map((user: any) => user.email);
          // Send email notification
          await sendEmail(emailContent, userEmails);
        }

        return updatedProduct;
      })
    );

    return NextResponse.json({
      message: "Ok",
      data: updatedProducts.filter(product => product !== undefined), // Filter out undefined products
    });
  } catch (error: any) {
    console.error(`Failed to get all products: ${error.message}`);
    return NextResponse.json({
      message: `Failed to get all products: ${error.message}`,
    }, { status: 500 });
  }
}
