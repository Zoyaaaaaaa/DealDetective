// import { generateObject } from 'ai';
// import { createOpenAI as createGroq } from '@ai-sdk/openai';
// import { z } from 'zod';
// import { NextRequest, NextResponse } from 'next/server';

// // Validate environment variables
// if (!process.env.GROQ_API_KEY) {
//   throw new Error('GROQ_API_KEY is not set in environment variables');
// }

// // Initialize the Groq AI instance
// const groq = createGroq({
//   baseURL: 'https://api.groq.com/openai/v1',
//   apiKey: process.env.GROQ_API_KEY,
// });

// // Define a comprehensive Zod schema for product recommendations
// const ProductRecommendationSchema = z.object({
//   title: z.string().min(3, "Product title must be at least 3 characters"),
//   description: z.string().min(10, "Description must be at least 10 characters"),
//   overallReview: z.string().min(5, "Review must be at least 5 characters"),
//   stars: z.number().min(1, "Stars must be between 1 and 5").max(5),
//   reviewsCount: z.number().min(0, "Reviews count can't be negative"),
//   category: z.string().min(3, "Category must be at least 3 characters"),
// });


// export async function POST(req: NextRequest) {
//   try {
//     // Parse the request body
//     const body = await req.json();
//     const { prompt } = body;
//     const product=await 
//     // Validate input prompt
//     if (!prompt || typeof prompt !== 'string') {
//       return NextResponse.json(
//         { error: 'A valid prompt is required' }, 
//         { status: 400 }
//       );
//     }

//     // Generate product recommendation object
//     const { object } = await generateObject({
//       model: groq('llama-3.1-70b-versatile'),
//       schema: ProductRecommendationSchema,
//       prompt: `Generate a detailed product recommendation based on: ${prompt}. 
//         Ensure the recommendation includes:
//         - A catchy and clear product title
//         - A detailed product description
//         - An overall review with key highlights
//         - Product price, category, and stars (1-5)
//         - The product's link for purchase`,
//     });

//     // Validate the generated object against the schema
//     ProductRecommendationSchema.parse(object);
//     console.log(object);

//     // Return the generated product recommendation as an array
//     return NextResponse.json([object], { status: 200 });
//   } catch (error) {
//     console.error('Product recommendation error:', error);

//     // Handle different types of errors
//     if (error instanceof z.ZodError) {
//       return NextResponse.json(
//         { 
//           error: 'Invalid product recommendation generated', 
//           details: error.errors.map(e => e.message) 
//         }, 
//         { status: 422 }
//       );
//     }

//     return NextResponse.json(
//       { 
//         error: 'Failed to generate product recommendation', 
//         details: error instanceof Error ? error.message : 'Unknown error' 
//       }, 
//       { status: 500 }
//     );
//   }
// }
// // import { generateObject } from 'ai';
// // import { createOpenAI as createGroq } from '@ai-sdk/openai';
// // import { z } from 'zod';
// // import { NextRequest, NextResponse } from 'next/server';

// // // Schema Definition
// // const ProductSchema = z.object({
// //   title: z.string()
// //     .min(3, '✗ Title too short')
// //     .max(100, '✗ Title too long'),
    
// //   description: z.string()
// //     .min(10, '✗ Description too brief')
// //     .max(500, '✗ Description too long'),
    
// //   overallReview: z.string()
// //     .min(5, '✗ Review too short')
// //     .max(200, '✗ Review too long'),

// //   stars: z.number()
// //     .min(1, '✗ Min 1 star')
// //     .max(5, '✗ Max 5 stars'),
    
// //   reviewsCount: z.number()
// //     .int('✗ Must be whole number')
// //     .min(0, '✗ Cannot be negative'),
    
// //   category: z.string()
// //     .min(3, '✗ Category too short')
// //     .max(50, '✗ Category too long')
// // });

// // // AI Configuration
// // const CONFIG = {
// //   model: 'llama-3.1-70b-versatile',
// //   baseURL: 'https://api.groq.com/openai/v1',
// //   apiKey: process.env.GROQ_API_KEY
// // };

// // // Error Response Helper
// // const createError = (message: string, details: any, status: number) => 
// //   NextResponse.json({ error: message, details }, { status });

// // // Main Handler
// // export async function POST(req: NextRequest) {
// //   if (!CONFIG.apiKey) {
// //     return createError('API configuration error', 'Missing API key', 500);
// //   }

// //   try {
// //     const { prompt } = await req.json();

// //     if (!prompt?.trim()) {
// //       return createError('Invalid input', 'Prompt is required', 400);
// //     }

// //     const groq = createGroq({
// //       baseURL: CONFIG.baseURL,
// //       apiKey: CONFIG.apiKey,
// //     });

// //     const { object } = await generateObject({
// //       model: groq(CONFIG.model),
// //       schema: ProductSchema,
// //       prompt: `
// //         CREATE PRODUCT RECOMMENDATION
// //         ---------------------------
// //         Context: ${prompt}
        
// //         Required Elements:
// //         • Engaging product title
// //         • Comprehensive description
// //         • Detailed review
// //         • Accurate pricing
// //         • Star rating (1-5)
// //         • Category classification
// //       `
// //     });

// //     ProductSchema.parse(object);
    
// //     return NextResponse.json([object], { 
// //       status: 200,
// //       headers: { 'Cache-Control': 'no-store' }
// //     });

// //   } catch (error) {
// //     console.error('⚠️ Error:', error);

// //     if (error instanceof z.ZodError) {
// //       return createError(
// //         'Validation failed',
// //         error.errors.map(e => e.message),
// //         422
// //       );
// //     }

// //     return createError(
// //       'Server error',
// //       error instanceof Error ? error.message : 'Unknown error',
// //       500
// //     );
// //   }
// // }
// // import { generateObject } from 'ai';
// // import { createOpenAI as createGroq } from '@ai-sdk/openai';
// // import { z } from 'zod';
// // import { NextRequest, NextResponse } from 'next/server';
// // import { Product } from '@/types';
// // import { getProductById } from '@/libs/actions';

// // const ProductSchema = z.object({
// //   title: z.string().min(3).max(100),
// //   description: z.string().min(10).max(500),
// //   overallReview: z.string().min(5).max(200),
// //   sentiment: z.enum(['Positive', 'Neutral', 'Negative']),
// //   recommendationScore: z.number().min(0).max(100),
// //   keyHighlights: z.array(z.string()),
// //   keyDrawbacks: z.array(z.string()),
// //   stars: z.number().min(1).max(5),
// //   reviewsCount: z.number().int().min(0),
// //   category: z.string().min(3).max(50),
// //   buyerAdvice: z.string(),
// // });

// // const CONFIG = {
// //   model: 'llama-3.1-70b-versatile',
// //   baseURL: 'https://api.groq.com/openai/v1',
// //   apiKey: process.env.GROQ_API_KEY,
// // };

// // export async function POST(req: NextRequest) {
// //   if (!CONFIG.apiKey) {
// //     return NextResponse.json({ error: 'API configuration error' }, { status: 500 });
// //   }

// //   try {
// //     const { prompt } = await req.json(); // Get the product description (prompt)

// //     // Validate that the prompt (description) is not empty or malformed
// //     if (!prompt?.trim()) {
// //       return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
// //     }

// //     // Fetch the product using a description or other identifier (if needed)
// //     const product = await getProductById(prompt); // Make sure this is adjusted to work with the description or an ID

// //     // If no product is found, return an error
// //     if (!product) {
// //       return NextResponse.json({ error: 'Product not found' }, { status: 404 });
// //     }

// //     const groq = createGroq({
// //       baseURL: CONFIG.baseURL,
// //       apiKey: CONFIG.apiKey,
// //     });

// //     // Modify the prompt based on the description or product data
// //     const { object } = await generateObject({
// //       model: groq(CONFIG.model),
// //       schema: ProductSchema,
// //       prompt: `
// //         Analyze the following product description and provide:
// //         • Complete product details
// //         • Sentiment analysis
// //         • Key highlights and drawbacks
// //         • Buyer recommendation score
// //         • Clear purchase advice

// //         Product description: 
// //         ${product.description}
// //       `
// //     });

// //     // Parse and validate the object generated by the AI model
// //     ProductSchema.parse(object);

// //     // Return the response with the analyzed product details
// //     return NextResponse.json([object], { status: 200 });
// //   } catch (error) {
// //     console.error('⚠️ Error:', error);
// //     return NextResponse.json({
// //       error: error instanceof Error ? error.message : 'Server error',
// //     }, { status: 500 });
// //   }
// // }
import { generateObject } from 'ai';
import { createOpenAI as createGroq } from '@ai-sdk/openai';
import { z } from 'zod';
import { NextRequest, NextResponse } from 'next/server';
import { getProductById } from '@/libs/actions';

// Validate environment variables
if (!process.env.GROQ_API_KEY) {
  throw new Error('GROQ_API_KEY is not set in environment variables');
}

// Initialize the Groq AI instance
const groq = createGroq({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});

// Define the required schema for product recommendations
const ProductRecommendationSchema = z.object({
  sentiment: z.enum(['Positive', 'Neutral', 'Negative']),
  recommendationScore: z.number().min(0).max(100),
  keyHighlights: z.array(z.string()).nonempty(),
  keyDrawbacks: z.array(z.string()).optional(),
  stars: z.number().min(1).max(5),
  reviewsCount: z.number().int().min(0),
  category: z.string().min(3).max(50),
  buyerAdvice: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const body = await req.json();
    const { prompt } = body;

    // Validate input prompt
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'A valid prompt is required' }, 
        { status: 400 }
      );
    }

    // Extract the product ID from the prompt using regex
    const productIdMatch = prompt.match(/productId:\s*(\w+)/);
    if (!productIdMatch) {
      return NextResponse.json(
        { error: 'No valid productId found in the prompt' },
        { status: 400 }
      );
    }
    const productId = productIdMatch[1];

    // Fetch product details from the database (assuming a function `getProductById`)
    const product = await getProductById(productId);
    if (!product || !product.description) {
      return NextResponse.json(
        { error: 'Product not found or has no description' },
        { status: 404 }
      );
    }

    // Trim the product description to the first 6 lines to prevent too much data being sent to the AI
    const trimmedDescription = product.description
      .split('\n')
      .slice(0, 6)
      .join('\n');

    // Generate product recommendation object using Groq
    const { object } = await generateObject({
      model: groq('llama-3.1-70b-versatile'),
      schema: ProductRecommendationSchema,
      prompt: `Based on the product description below, generate a detailed recommendation:
        "${trimmedDescription}"
        Include:
        - Sentiment (Positive, Neutral, Negative)
        - Recommendation score (0-100)
        - Key highlights and drawbacks
        - Buyer advice based on product features
        - Product category and review statistics`,
    });

    // Construct the final recommendation object
    const recommendation = {
      sentiment: object.sentiment,
      recommendationScore: object.recommendationScore,
      keyHighlights: object.keyHighlights,
      keyDrawbacks: object.keyDrawbacks || [], // Default to empty array if not provided
      stars: object.stars,
      reviewsCount: object.reviewsCount,
      category: object.category,
      buyerAdvice: object.buyerAdvice || trimmedDescription, // Use AI generated buyer advice, fallback to trimmed description
    };

    // Log recommendation for debugging
    console.log('Generated Product Recommendation:', recommendation);

    // Return the final recommendation as a JSON response
    return NextResponse.json(recommendation, { status: 200 });
  } catch (error) {
    console.error('Error generating product recommendation:', error);

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Invalid product recommendation generated', 
          details: error.errors.map(e => e.message) 
        }, 
        { status: 422 }
      );
    }

    // Handle unexpected errors
    return NextResponse.json(
      { 
        error: 'Failed to generate product recommendation', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      }, 
      { status: 500 }
    );
  }
}
