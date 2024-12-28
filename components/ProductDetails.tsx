'use client'
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

type Recommendation = {
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  recommendationScore: number;
  keyHighlights: string[];
  keyDrawbacks?: string[];
  stars: number;
  reviewsCount: number;
  category: string;
  buyerAdvice: string;
};

type RecommendationProps = {
  productId: string;
  productDescription: string;
};

const Recommendation: React.FC<RecommendationProps> = ({ productId, productDescription }) => {
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRecommendation = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/recommendation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt: `productId: ${productId}\n${productDescription}` }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setRecommendation(data);
      } catch (error) {
        console.error('Failed to fetch recommendation:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendation();
  }, [productId, productDescription]);

  if (loading) {
    return (
      <div className="mt-16 flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!recommendation) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-16 bg-white rounded-2xl shadow-lg overflow-hidden"
    >
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Product Analysis</h2>
          <span className="px-4 py-2 rounded-full text-sm font-semibold bg-gray-100">
            {recommendation.category}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Sentiment Score */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Sentiment</h3>
            <div className={`text-xl font-bold ${
              recommendation.sentiment === 'Positive' ? 'text-green-600' :
              recommendation.sentiment === 'Neutral' ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {recommendation.sentiment}
            </div>
          </div>

          {/* Recommendation Score */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Recommendation</h3>
            <div className="text-xl font-bold text-indigo-600">
              {recommendation.recommendationScore}%
            </div>
          </div>

          {/* Rating */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Rating</h3>
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${i < recommendation.stars ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-gray-600">({recommendation.reviewsCount})</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Key Highlights */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Highlights</h3>
            <ul className="space-y-3">
              {recommendation.keyHighlights.map((highlight, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{highlight}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Key Drawbacks */}
          {recommendation.keyDrawbacks && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Drawbacks</h3>
              <ul className="space-y-3">
                {recommendation.keyDrawbacks.map((drawback, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>{drawback}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Buyer Advice */}
        <div className="mt-8 bg-indigo-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Buyer Advice</h3>
          <p className="text-gray-700 leading-relaxed">{recommendation.buyerAdvice}</p>
        </div>

        {/* Action Buttons */}
        {/* <div className="mt-8 flex gap-4">
          <button className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors font-semibold">
            Save Analysis
          </button>
          <button className="flex-1 border-2 border-indigo-600 text-indigo-600 px-6 py-3 rounded-xl hover:bg-indigo-50 transition-colors font-semibold">
            Share Report
          </button>
        </div> */}
      </div>
    </motion.div>
  );
};

export default Recommendation;
