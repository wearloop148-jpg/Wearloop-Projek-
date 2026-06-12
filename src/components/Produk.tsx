import React, { useState, useMemo } from "react";
import { Product, FilterState, Page } from "../types";

interface ProdukProps {
  products: Product[];
  onAddToCart: (p: Product) => void;
  likes: Record<string, boolean>;
  onToggleLike: (productId: string) => void;
  initialFilters: FilterState;
  setInitialFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onSelectProduct?: (product: Product) => void;
  setActivePage?: (page: Page) => void;
}

export default function Produk({
  products,
  onAddToCart,
  likes,
  onToggleLike,
  initialFilters,
  setInitialFilters,
  onSelectProduct,
  setActivePage,
}: ProdukProps) {
  // Local state for temporary min and max price inputs
  const [minInput, setMinInput] = useState(initialFilters.minPrice);
  const [maxInput, setMaxInput] = useState(initialFilters.maxPrice);

  const resetFilters = () => {
    const fresh: FilterState = {
      searchQuery: "",
      minPrice: "",
      maxPrice: "",
      categories: [],
      sizes: [],
      conditions: [],
      sortBy: "newest",
    };
    setInitialFilters(fresh);
    setMinInput("");
    setMaxInput("");
  };

  const handlePriceSearch = () => {
    setInitialFilters((prev) => ({
      ...prev,
      minPrice: minInput,
      maxPrice: maxInput,
    }));
  };

  const toggleCategory = (catName: string) => {
    setInitialFilters((prev) => {
      const isSelected = prev.categories.includes(catName);
      const nextCategories = isSelected
        ? prev.categories.filter((c) => c !== catName)
        : [...prev.categories, catName];
      return { ...prev, categories: nextCategories };
    });
  };

  const toggleSize = (sizeName: string) => {
    setInitialFilters((prev) => {
      const isSelected = prev.sizes.includes(sizeName);
      const nextSizes = isSelected
        ? prev.sizes.filter((s) => s !== sizeName)
        : [...prev.sizes, sizeName];
      return { ...prev, sizes: nextSizes };
    });
  };

  const toggleCondition = (condName: string) => {
    setInitialFilters((prev) => {
      const isSelected = prev.conditions.includes(condName);
      const nextConditions = isSelected
        ? prev.conditions.filter((c) => c !== condName)
        : [...prev.conditions, condName];
      return { ...prev, conditions: nextConditions };
    });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as "newest" | "price-low" | "price-high";
    setInitialFilters((prev) => ({ ...prev, sortBy: val }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInitialFilters((prev) => ({ ...prev, searchQuery: val }));
  };

  // Perform dynamic filtering and sorting of products
  const filteredProducts = useMemo(() => {
    // Only display products that are approved by admin and active
    let result = products.filter((p) => p.isApproved && p.status === "active");

    // Search term matching
    if (initialFilters.searchQuery.trim()) {
      const query = initialFilters.searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.size.toLowerCase().includes(query)
      );
    }

    // Min price
    if (initialFilters.minPrice) {
      const minVal = parseFloat(initialFilters.minPrice);
      if (!isNaN(minVal)) {
        result = result.filter((p) => p.price >= minVal);
      }
    }

    // Max price
    if (initialFilters.maxPrice) {
      const maxVal = parseFloat(initialFilters.maxPrice);
      if (!isNaN(maxVal)) {
        result = result.filter((p) => p.price <= maxVal);
      }
    }

    // Categories filter (if empty list, it means "All Items")
    if (initialFilters.categories.length > 0) {
      result = result.filter((p) =>
        initialFilters.categories.includes(p.category)
      );
    }

    // Sizes filter
    if (initialFilters.sizes.length > 0) {
      result = result.filter((p) => initialFilters.sizes.includes(p.size));
    }

    // Conditions filter
    if (initialFilters.conditions.length > 0) {
      result = result.filter((p) =>
        initialFilters.conditions.includes(p.condition)
      );
    }

    // Sorting block
    if (initialFilters.sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (initialFilters.sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else {
      // newest/default
      result.sort((a, b) => parseInt(b.id) - parseInt(a.id));
    }

    return result;
  }, [products, initialFilters]);

  // Pagination setups (8 items per page)
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 8;

  React.useEffect(() => {
    setCurrentPage(1);
  }, [initialFilters]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  // Page index mocks
  const isAllCategoriesChecked = initialFilters.categories.length === 0;
  const isAllConditionsChecked = initialFilters.conditions.length === 0;

  return (
    <main className="max-w-[1400px] mx-auto px-5 lg:px-10 py-10 flex flex-col lg:flex-row gap-10 select-none animate-fade-in">
      
      {/* SIDEBAR FILTERS PANEL */}
      <aside className="w-full lg:w-[280px] flex-shrink-0 text-left">
        <div className="sticky top-28">
          <div className="border border-gray-100 rounded-3xl p-6 shadow-sm bg-white">
            
            {/* Header reset button */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-bold text-lg text-gray-800">Filters</h2>
              <button
                onClick={resetFilters}
                className="text-sm text-[#2c46a9] font-semibold hover:text-blue-800 transition-colors cursor-pointer"
              >
                Reset
              </button>
            </div>

            {/* Price slider inputs */}
            <div className="border-t border-gray-100 pt-6 mb-8">
              <h3 className="font-bold text-sm mb-4 text-[#020c38] uppercase tracking-wide">
                SEARCH PRICE
              </h3>
              <div className="flex gap-3 mb-4">
                <input
                  type="text"
                  placeholder="Min"
                  className="w-full h-11 rounded-xl border border-gray-200 px-4 text-sm focus:border-[#2c46a9] focus:ring-1 focus:ring-[#2c46a9] transition-all"
                  value={minInput}
                  onChange={(e) => setMinInput(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Max"
                  className="w-full h-11 rounded-xl border border-gray-200 px-4 text-sm focus:border-[#2c46a9] focus:ring-1 focus:ring-[#2c46a9] transition-all"
                  value={maxInput}
                  onChange={(e) => setMaxInput(e.target.value)}
                />
              </div>
              <button
                onClick={handlePriceSearch}
                className="w-full h-11 rounded-xl bg-[#2c46a9] text-white hover:bg-[#020c38] font-semibold text-sm transition-colors cursor-pointer"
              >
                Search Price
              </button>
            </div>

            {/* Category selection */}
            <div className="border-t border-gray-100 pt-6">
              <div className="mb-8">
                <h3 className="font-bold text-sm mb-4 text-[#020c38] uppercase tracking-wide">
                  CATEGORY
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-[#2c46a9] focus:ring-[#2c46a9]"
                        checked={isAllCategoriesChecked}
                        onChange={() =>
                          setInitialFilters((prev) => ({ ...prev, categories: [] }))
                        }
                      />
                      <span className={`text-sm ${isAllCategoriesChecked ? "font-semibold text-[#2c46a9]" : "font-medium text-gray-500"}`}>
                        All Items
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">1.248</span>
                  </label>

                  {["T-Shirt", "Hoodie", "Jacket", "Pants", "Accessories", "Shoes"].map((cat) => {
                    const isChecked = initialFilters.categories.includes(cat);
                    const mockCounts: Record<string, string> = {
                      "T-Shirt": "120",
                      "Hoodie": "98",
                      "Jacket": "150",
                      "Pants": "110",
                      "Accessories": "70",
                      "Shoes": "90"
                    };
                    return (
                      <label key={cat} className="flex items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-[#2c46a9] focus:ring-[#2c46a9]"
                            checked={isChecked}
                            onChange={() => toggleCategory(cat)}
                          />
                          <span className={`text-sm ${isChecked ? "font-semibold text-[#2c46a9]" : "text-gray-500"}`}>
                            {cat}
                          </span>
                        </div>
                        <span className="text-xs text-gray-400">{mockCounts[cat]}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Size selector */}
            <div className="border-t border-gray-100 pt-6">
              <div className="mb-8">
                <h3 className="font-bold text-sm mb-4 text-[#020c38] uppercase tracking-wide">
                  Size
                </h3>
                <div className="space-y-3">
                  {["S", "M", "L", "XL"].map((sz) => {
                    const isChecked = initialFilters.sizes.includes(sz);
                    return (
                      <label key={sz} className="flex items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-[#2c46a9] focus:ring-[#2c46a9]"
                            checked={isChecked}
                            onChange={() => toggleSize(sz)}
                          />
                          <span className={`text-sm ${isChecked ? "font-semibold text-[#2c46a9]" : "text-gray-500"}`}>
                            {sz}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Condition check */}
            <div className="border-t border-gray-100 pt-6">
              <h3 className="font-bold text-sm mb-4 text-[#020c38] uppercase tracking-wide">
                CONDITION
              </h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-[#2c46a9] focus:ring-[#2c46a9]"
                    checked={isAllConditionsChecked}
                    onChange={() =>
                      setInitialFilters((prev) => ({ ...prev, conditions: [] }))
                    }
                  />
                  <span className={`text-sm ${isAllConditionsChecked ? "font-semibold text-[#2c46a9]" : "font-medium text-gray-500"}`}>
                    All Condition
                  </span>
                </label>

                {["Like New", "Very Good", "Good"].map((cond) => {
                  const isChecked = initialFilters.conditions.includes(cond);
                  return (
                    <label key={cond} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-[#2c46a9] focus:ring-[#2c46a9]"
                        checked={isChecked}
                        onChange={() => toggleCondition(cond)}
                      />
                      <span className={`text-sm ${isChecked ? "font-semibold text-[#2c46a9]" : "text-gray-500"}`}>
                        {cond}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </aside>

      {/* PRODUCT GRID SECTION */}
      <section className="flex-1">
        
        {/* TOPBAR WITH COUNTERS AND SEARCH */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 mb-10 text-left">
          <div>
            <p className="text-gray-400 text-sm mt-2 font-medium">
              Showing 1-{(filteredProducts.length)} of {filteredProducts.length} products
            </p>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            {/* Search inputs */}
            <div className="flex items-center bg-[#f5f7fb] rounded-xl px-4 h-[48px] w-full sm:w-[260px] border border-transparent focus-within:border-gray-200 focus-within:bg-white transition-all">
              <input
                type="text"
                placeholder="Search in shop..."
                className="bg-transparent text-sm w-full border-none outline-none focus:ring-0 font-poppins"
                value={initialFilters.searchQuery}
                onChange={handleSearchChange}
              />
              {initialFilters.searchQuery && (
                <button
                  onClick={() => setInitialFilters((prev) => ({ ...prev, searchQuery: "" }))}
                  className="text-gray-400 font-bold ml-1 hover:text-gray-800"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sorting Select */}
            <select
              className="h-[48px] px-4 rounded-xl border border-gray-200 text-sm bg-white font-poppins outline-none focus:border-[#2c46a9]"
              value={initialFilters.sortBy}
              onChange={handleSortChange}
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price Low</option>
              <option value="price-high">Price High</option>
            </select>
          </div>
        </div>

        {/* COMPREHENSIVE PRODUCT GRID */}
        {filteredProducts.length === 0 ? (
          <div className="bg-slate-50/50 rounded-3xl p-16 text-center border border-dashed border-gray-200">
            <span className="material-symbols-outlined text-gray-300 text-5xl mb-4">
              search_off
            </span>
            <p className="font-poppins font-medium text-gray-500 text-base">
              Tidak ada produk yang cocok dengan pencarian / filter kamu.
            </p>
            <button
              onClick={resetFilters}
              className="mt-4 bg-[#2c46a9] text-white px-6 py-2.5 rounded-xl text-xs font-semibold hover:bg-black transition-all cursor-pointer"
            >
              Reset Semua Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {paginatedProducts.map((p) => {
              const isLiked = !!likes[p.id];
              return (
                <div
                  key={p.id}
                  className="relative bg-white rounded-2xl p-4 shadow-[0_10px_25px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col justify-between group transition-all duration-300 hover:shadow-[0_15px_30px_rgba(0,0,0,0.06)] h-[355px]"
                >
                  <div className="flex flex-col h-full">
                    <div>
                      {/* Badge / Likes row */}
                      <div className="flex justify-between items-center mb-3">
                        <span className="px-1"></span>

                        <button
                          onClick={() => onToggleLike(p.id)}
                          className={`transition-colors flex items-center justify-center p-1 hover:bg-slate-50 rounded-full ${
                            isLiked ? "text-red-500" : "text-gray-300 hover:text-red-500"
                          }`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2500/svg"
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

                      {/* Aspect Fit Item Image & Title click trigger details page */}
                      <div
                        onClick={() => {
                          if (onSelectProduct && setActivePage) {
                            onSelectProduct(p);
                            setActivePage("detail");
                          }
                        }}
                        className="cursor-pointer group/card"
                      >
                        <div className="w-full aspect-[4/3] flex items-center justify-center mb-4 overflow-hidden bg-white border border-gray-100 rounded-xl">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="object-contain w-full h-full p-2 group-hover/card:scale-102 transition-transform duration-300"
                          />
                        </div>

                        {/* Texts */}
                        <div className="text-left font-poppins">
                          <h3 className="text-[#0F172A] font-black text-sm mb-0.5 tracking-tight group-hover/card:text-[#2c46a9] transition-colors leading-snug truncate">
                            {p.name}
                          </h3>
                          <p className="text-[11px] text-gray-500 font-bold mb-1 font-poppins">
                            Brand: <span className="text-[#2c46a9]">{p.brand || "Wearloop Select"}</span>
                          </p>
                          <div className="flex items-center justify-between">
                            <p className="text-gray-400 text-xs font-semibold">
                              Size {p.size} &bull; {p.condition}
                            </p>
                            <span className={`text-[9.5px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-md ${
                              p.status === "inactive" 
                                ? "bg-red-50 text-red-650 border border-red-155" 
                                : "bg-emerald-50 text-emerald-700 border border-emerald-155"
                            }`}>
                              {p.status === "inactive" ? "Sold Out" : "Available"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Price and Cart Addition */}
                    <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-50">
                      <div className="flex flex-col text-left">
                        <div className="flex items-center gap-2">
                          <span className="text-[#0F172A] font-black text-sm font-poppins">
                            Rp {p.price.toLocaleString("id-ID")}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => onAddToCart(p)}
                        className="bg-[#020c38] hover:bg-[#2c46a9] text-white p-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center cursor-pointer hover:scale-105"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          className="w-4 h-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* PAGINATION ROW */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-16 font-poppins">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`w-10 h-10 rounded-xl border border-gray-200 transition-colors flex items-center justify-center font-bold ${
                currentPage === 1 ? "opacity-50 cursor-not-allowed text-gray-300" : "hover:bg-slate-50 cursor-pointer text-[#020c38]"
              }`}
            >
              &larr;
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
              <button
                key={pg}
                onClick={() => setCurrentPage(pg)}
                className={`w-10 h-10 rounded-xl transition-all font-black text-xs ${
                  currentPage === pg
                    ? "bg-[#020c38] text-white"
                    : "hover:bg-gray-100 text-[#020c38] border border-transparent hover:border-gray-100 cursor-pointer"
                }`}
              >
                {pg}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`w-10 h-10 rounded-xl border border-gray-200 transition-colors flex items-center justify-center font-bold ${
                currentPage === totalPages ? "opacity-50 cursor-not-allowed text-gray-300" : "hover:bg-slate-50 cursor-pointer text-[#020c38]"
              }`}
            >
              &rarr;
            </button>
          </div>
        )}

      </section>

    </main>
  );
}
