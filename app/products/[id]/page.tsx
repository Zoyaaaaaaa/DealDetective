import Modal from "@/components/Modal";
import PriceInfoCard from "@/components/PriceInfoCard";
import ProductCard from "@/components/ProductCard";
import { getProductById, getSimilarProducts } from '@/libs/actions';
import { formatNumber } from '@/libs/actions/utils';
import { Product } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import Recommendation from "@/components/ProductDetails";

type Props = {
  params: { id: string };
};

const ProductDetails = async ({ params: { id } }: Props) => {
  const product: Product = await getProductById(id);

  if (!product) redirect("/");

  const similarProducts = await getSimilarProducts(id);

  const discount = Math.round(((product.originalPrice - product.currentPrice) / product.originalPrice) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid lg:grid-cols-2 gap-12 mb-10">
        {/* Product Image Section */}
        <div className="relative group">
          <div className="aspect-square rounded-2xl overflow-hidden bg-white shadow-lg">
            <Image
              src={product.image}
              alt={product.title}
              width={580}
              height={580}
              className="object-contain w-full h-full transform transition-transform duration-300 group-hover:scale-105"
            />
            {discount > 0 && (
              <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                -{discount}% OFF
              </div>
            )}
          </div>
        </div>

        {/* Product Info Section */}
        <div className="flex flex-col space-y-6">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                {product.title}
              </h1>
              <Link
                href={product.url}
                target="_blank"
                className="inline-flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                Visit Store
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <button className="p-2 rounded-full bg-red-50 hover:bg-red-100 transition-colors">
                <Image
                  src="/assets/icons/red-heart.svg"
                  alt="heart"
                  width={24}
                  height={24}
                  className="transform transition-transform hover:scale-110"
                />
              </button>
              <button className="p-2 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors">
                <Image
                  src="/assets/icons/bookmark.svg"
                  alt="bookmark"
                  width={24}
                  height={24}
                  className="transform transition-transform hover:scale-110"
                />
              </button>
              <button className="p-2 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors">
                <Image
                  src="/assets/icons/share.svg"
                  alt="share"
                  width={24}
                  height={24}
                  className="transform transition-transform hover:scale-110"
                />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-baseline gap-4 mb-4">
              <span className="text-4xl font-bold text-gray-900">
                {product.currency} {formatNumber(product.currentPrice)}
              </span>
              <span className="text-xl text-gray-500 line-through">
                {product.currency} {formatNumber(product.originalPrice)}
              </span>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${i < product.stars ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  ({product.reviewsCount} reviews)
                </span>
              </div>
              <div className="text-sm text-gray-600">
                <span className="text-green-600 font-semibold">93% </span>
                recommend this product
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <PriceInfoCard
              title="Current Price"
              iconSrc="/assets/icons/price-tag.svg"
              value={`${product.currency} ${formatNumber(product.currentPrice)}`}
            />
            <PriceInfoCard
              title="Average Price"
              iconSrc="/assets/icons/chart.svg"
              value={`${product.currency} ${formatNumber(product.averagePrice)}`}
            />
            <PriceInfoCard
              title="Highest Price"
              iconSrc="/assets/icons/arrow-up.svg"
              value={`${product.currency} ${formatNumber(product.highestPrice)}`}
            />
            <PriceInfoCard
              title="Lowest Price"
              iconSrc="/assets/icons/arrow-down.svg"
              value={`${product.currency} ${formatNumber(product.lowestPrice)}`}
            />
          </div>
        </div>
        <Modal productId={id} />
      </div>

      <Recommendation productId={id} productDescription={product.description} />

      <div className="flex justify-center mt-8 mb-8">
        <Link 
          href={product.url}
          target="_blank"
          className="bg-indigo-600 text-white py-4 px-12 rounded-xl text-center font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
        >
          <Image
            src="/assets/icons/bag.svg"
            alt="check"
            width={22}
            height={22}
          />
          Buy Now
        </Link>
      </div>

      {similarProducts && similarProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Similar Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarProducts.map((product: any) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;