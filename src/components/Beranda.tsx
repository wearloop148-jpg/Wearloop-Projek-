import React from "react";
import { Product, Page, CategoryData } from "../types";
import { CATEGORIES_DATA } from "../data";

interface BerandaProps {
  products: Product[];
  onAddToCart: (p: Product) => void;
  onSelectCategory: (category: string) => void;
  setActivePage: (page: Page) => void;
  likes: Record<string, boolean>;
  onToggleLike: (productId: string) => void;
  onSelectProduct?: (product: Product) => void;
  categoriesData?: CategoryData[];
}

export default function Beranda({
  products,
  onAddToCart,
  onSelectCategory,
  setActivePage,
  likes,
  onToggleLike,
  onSelectProduct,
  categoriesData = CATEGORIES_DATA,
}: BerandaProps) {
  // Get featured products (e.g. limit to 4) that are approved and active
  const featured = products.filter((p) => p.isApproved && p.status === "active" && p.isFeatured).slice(0, 4);

  const handleCategoryClick = (catName: string) => {
    onSelectCategory(catName);
    setActivePage("produk");
  };

  return (
    <div className="font-poppins overflow-x-hidden selection:bg-[#2c46a9] selection:text-white animate-fade-in">
      {/* Hero Section */}
      <header className="relative overflow-hidden bg-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-14 pt-10 pb-6 grid lg:grid-cols-2 items-center gap-10">
          {/* LEFT */}
          <div className="relative z-20 text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#f5f6ff] border border-[#e5e9ff] mb-8">
              <span className="font-poppins text-[12px] font-semibold uppercase tracking-wide text-[#020c38]">
                Thrift it. Wear it. Loop it.
              </span>
              <span
                className="material-symbols-outlined text-[#2c46a9] text-[16px] animate-spin"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                auto_awesome
              </span>
            </div>

            {/* Heading */}
            <h1 className="font-bebas leading-[0.88] tracking-tight text-[#020c38] text-[68px] lg:text-[110px]">
              FIND GOOD STUFF,<br />
              <span className="text-[#2c46a9]"> GREAT STYLE </span>
            </h1>

            {/* Description */}
            <p className="mt-4 max-w-[500px] font-poppins text-[16px] leading-[1.9] text-[#4b5563] font-medium">
              Temukan ribuan item thrift pilihan dengan kualitas terbaik dan harga
              terjangkau. Style keren, budget aman.
            </p>

            {/* Button */}
            <button
              onClick={() => setActivePage("produk")}
              className="mt-6 bg-[#2c46a9] hover:bg-[#020c38] hover:translate-y-[-2px] transition-all duration-300 text-white px-9 py-4 rounded-2xl font-poppins font-semibold flex items-center gap-3 shadow-md shadow-blue-200 cursor-pointer"
            >
              Shop Now
              <span className="material-symbols-outlined"> arrow_forward </span>
            </button>
          </div>

          {/* RIGHT */}
          <div className="relative flex justify-end w-full">

            {/* MAIN BANNER IMAGE - PUTIH POLOS TANPA SHADOW */}
            <img
              src="https://i.postimg.cc/YS7QpGtd/banner.png"
              alt="Wearloop Banner"
              className="relative z-10 w-full max-w-[550px] object-contain"
            />

            {/* ARRIVAL FLOAT CARD */}
            <div className="absolute left-0 top-[40%] z-20 bg-[#020c38] text-white rounded-2xl px-5 py-4 shadow-xl border border-blue-900/35 hidden sm:block animate-bounce">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">
                    checkroom
                  </span>
                </div>
                <div className="text-left">
                  <p className="font-poppins text-[14px] font-semibold">
                    New Arrivals
                  </p>
                  <p className="font-poppins text-[12px] text-white/80">
                    This Week
                  </p>
                </div>
              </div>
            </div>

            {/* TRUSTED FLOAT CARD */}
            <div className="absolute right-0 bottom-12 bg-white rounded-2xl px-5 py-4 shadow-xl border border-gray-100 flex items-center gap-3 z-20 hover:scale-105 transition-transform">
              <div className="w-12 h-12 rounded-full bg-[#2c46a9] flex items-center justify-center text-white">
                <span
                  className="material-symbols-outlined"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
              </div>
              <div className="text-left">
                <p className="font-poppins font-semibold text-[#111827]">
                  Trusted Seller
                </p>
                <p className="font-poppins text-sm text-gray-500">4.9/5 Rating</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Trust Badges Strip Section */}
      <section className="relative z-30 px-6 lg:px-14 max-w-[1400px] mx-auto mt-10">
        <div className="bg-white rounded-[24px] shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-[#eef1ff] px-8 py-6 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: "verified",
              title: "Premium Quality",
              desc: "Item pilihan & terkurasi",
            },
            {
              icon: "sell",
              title: "Affordable Price",
              desc: "Harga terbaik setiap hari",
            },
            {
              icon: "shield",
              title: "Secure Payment",
              desc: "Transaksi aman 100%",
            },
            {
              icon: "forum",
              title: "Fast Response",
              desc: "Kami siap membantu",
            },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-xl bg-[#f5f6ff] flex items-center justify-center text-[#2c46a9] group-hover:bg-[#2c46a9] group-hover:text-white transition-all duration-300">
                <span className="material-symbols-outlined text-[22px]">
                  {item.icon}
                </span>
              </div>
              <div className="text-left">
                <p className="font-poppins text-[14px] font-semibold text-[#111827]">
                  {item.title}
                </p>
                <p className="font-poppins text-[12px] text-[#6b7280] mt-0.5">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Shop By Category Section */}
      <section className="relative z-30 px-6 lg:px-14 mt-16 max-w-[1400px] mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-5 rounded-full bg-[#2c46a9]"></span>
            <h2 className="text-xl font-bold tracking-wider text-[#2c46a9] uppercase font-poppins">
              Shop By Category
            </h2>
          </div>
          <a
            href="#produk"
            onClick={(e) => {
              e.preventDefault();
              setActivePage("produk");
            }}
            className="flex items-center gap-2 text-sm font-semibold text-[#020c38] hover:underline group cursor-pointer"
          >
            View All
            <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">
              arrow_forward
            </span>
          </a>
        </div>

        {/* Categories Bento Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4">
          {categoriesData.map((cat, idx) => (
            <div
              key={idx}
              onClick={() => handleCategoryClick(cat.name)}
              className="relative flex flex-col justify-end p-4 rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] aspect-[4/5] overflow-hidden group cursor-pointer bg-gradient-to-b from-[#F8FAFC] via-[#F1F5F9] to-[#2c46a9]"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-transparent to-transparent pointer-events-none"></div>
              <div className="w-full text-center z-10">
                <h3 className="text-base font-bold text-white tracking-wide">
                  {cat.name}
                </h3>
                <p className="text-xs text-blue-100 mt-0.5">{cat.count} Items</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products Showcase Section */}
      <section className="relative z-30 px-6 lg:px-14 max-w-[1400px] mx-auto mt-16 mb-10">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-5 rounded-full bg-[#2c46a9]"></span>
            <h2 className="text-xl font-bold tracking-wider text-[#2c46a9] uppercase font-poppins">
              Featured Product
            </h2>
          </div>
          <a
            href="#produk"
            onClick={(e) => {
              e.preventDefault();
              setActivePage("produk");
            }}
            className="flex items-center gap-1.5 text-xs font-bold text-[#020c38] hover:text-[#2c46a9] transition-colors font-poppins cursor-pointer"
          >
            View All Products
            <span className="material-symbols-outlined text-[14px]">
              arrow_forward
            </span>
          </a>
        </div>

        {/* Product Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((p) => {
            const isLiked = !!likes[p.id];
            return (
              <div
                key={p.id}
                className="relative bg-white rounded-2xl p-4 shadow-[0_10px_25px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col justify-between group transition-all duration-300 hover:shadow-[0_15px_30px_rgba(0,0,0,0.06)] h-[385px]"
              >
                <div className="flex flex-col">
                  {/* Top action flags */}
                  <div className="flex justify-between items-center mb-3">
                    <span className="px-2 py-0.5"></span>
                    <button
                      onClick={() => onToggleLike(p.id)}
                      className={`transition-colors p-1.5 rounded-full hover:bg-gray-50 flex items-center justify-center ${
                        isLiked ? "text-red-500" : "text-gray-400"
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill={isLiked ? "currentColor" : "none"}
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Product Image Area & Title click triggers details */}
                  <div 
                    onClick={() => {
                      if (onSelectProduct) {
                        onSelectProduct(p);
                        setActivePage("detail");
                      }
                    }}
                    className="cursor-pointer group"
                  >
                    <div className="w-full aspect-[4/3] flex items-center justify-center mb-4 overflow-hidden bg-white border border-gray-100 rounded-xl">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="object-contain w-full h-full p-2 group-hover:scale-[1.04] transition-transform duration-300"
                      />
                    </div>

                    {/* Titles */}
                    <div className="text-left font-poppins">
                      <h3 className="text-[#0F172A] font-black text-sm mb-0.5 tracking-tight group-hover:text-[#2c46a9] transition-colors leading-snug truncate">
                        {p.name}
                      </h3>
                      <p className="text-[11px] text-gray-500 font-bold mb-1">
                        Brand: <span className="text-[#2c46a9]">{p.brand || "Wearloop Select"}</span>
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-gray-400 text-xs font-semibold">
                          Size {p.size} &bull; {p.condition}
                        </p>
                        <span className={`text-[9.5px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-md ${
                          p.status === "inactive" 
                            ? "bg-red-50 text-red-600 border border-red-200" 
                            : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        }`}>
                          {p.status === "inactive" ? "Sold Out" : "Available"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pricing & Cart Action Row */}
                <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-50">
                  <div className="flex flex-row items-baseline gap-2 text-left">
                    <span className="text-[#0F172A] font-extrabold text-base font-poppins">
                      Rp {p.price.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <button
                    onClick={() => onAddToCart(p)}
                    className="bg-[#020c38] hover:bg-[#2c46a9] text-white p-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95"
                    aria-label="Add to cart"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2.2"
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75 7.5 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Carousel indicator dots - stylish accent */}
        <div className="flex justify-center items-center gap-2 mt-8">
          <span className="w-2 h-2 rounded-full bg-[#020c38]"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-gray-200"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-gray-200"></span>
        </div>
      </section>
    </div>
  );
}
