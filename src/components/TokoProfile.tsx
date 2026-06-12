import React, { useState } from "react";
import { Product, User, Page } from "../types";

interface TokoProfileProps {
  shopName: string;
  products: Product[];
  registeredUsers: User[];
  setActivePage: (p: Page) => void;
  onSelectProduct: (p: Product) => void;
  onAddToCart: (p: Product) => void;
  likes: Record<string, boolean>;
  onToggleLike: (productId: string) => void;
}

export default function TokoProfile({
  shopName,
  products,
  registeredUsers,
  setActivePage,
  onSelectProduct,
  onAddToCart,
  likes,
  onToggleLike,
}: TokoProfileProps) {
  // Find the user with this shop name or name
  const seller = registeredUsers.find(
    (u) =>
      u.role === "seller" &&
      (u.shopName?.toLowerCase() === shopName.toLowerCase() ||
        u.name.toLowerCase() === shopName.toLowerCase())
  );

  // Fallbacks for details to make sure the page is completely beautiful and informative
  const namaToko = seller?.shopName || shopName || "Wearloop Partner";
  const deskripsiToko =
    seller?.shopDesc ||
    seller?.shopSlogan ||
    "Kurator pakaian preloved & vintage berkualitas tinggi, lulus kurasi sterilisasi & kebersihan Wearloop.";
  const alamatToko =
    seller?.role === "seller" && seller.shopName === "Budi Vintage"
      ? "Kawasan Kreatif Bandung, Jl. Setiabudi No.229, Sukasari, Bandung, Jawa Barat 40154"
      : "Sentra Retail Modern, Jl. M.H. Thamrin No.11, Gondangdia, Jakarta Pusat 10350";
  const ratingToko = "⭐ 4.9 dari 5.0 (Kurator Terverifikasi)";
  
  // Bank details
  const bankN = seller?.bankName || "BCA";
  const bankNo = seller?.bankAccountNumber || "8620891230";
  const bankH = seller?.bankAccountHolder || seller?.name || "Wearloop Partner Bank";

  // Filter products by this seller name
  const shopProducts = products.filter(
    (p) =>
      p.status === "active" &&
      p.isApproved !== false &&
      (p.sellerName?.toLowerCase() === shopName.toLowerCase() ||
        (!p.sellerName && shopName.toLowerCase() === "wearloop partner"))
  );

  const [tokoSearch, setTokoSearch] = useState("");

  const filteredProducts = shopProducts.filter((p) =>
    p.name.toLowerCase().includes(tokoSearch.toLowerCase())
  );

  return (
    <div className="bg-[#fbfcff] min-h-screen py-10 font-poppins text-left">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-14">
        
        {/* Breadcrumb & Navigation */}
        <div className="mb-6">
          <button
            onClick={() => setActivePage("beranda")}
            className="flex items-center gap-1.5 text-xs text-gray-500 font-bold hover:text-[#2c46a9] transition-colors"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Kembali ke Beranda
          </button>
        </div>

        {/* TOKO PROFILE CORE CARD */}
        <div id="toko-profile-header" className="bg-white border border-slate-100 rounded-3xl p-6 lg:p-8 shadow-sm flex flex-col md:flex-row justify-between gap-6 mb-10 transition-all">
          <div className="flex gap-4 items-start">
            <div className="w-14 h-14 md:w-20 md:h-20 rounded-full bg-[#2c46a9] text-white flex items-center justify-center font-black text-xl md:text-3xl uppercase shadow-md shrink-0">
              {namaToko.substring(0, 2).toUpperCase()}
            </div>
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl md:text-3xl font-extrabold text-[#020c38] tracking-tight leading-none">
                  {namaToko}
                </h1>
                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-md border border-emerald-100 uppercase tracking-wider flex items-center gap-1 shrink-0">
                  <span className="material-symbols-outlined text-[10px]">verified</span>
                  Partner Resmi
                </span>
              </div>
              <p className="text-gray-400 text-xs font-semibold tracking-wide">
                {ratingToko} &bull; Respon Chat Akurat 99%
              </p>
              <p className="text-gray-500 text-xs md:text-sm max-w-2xl leading-relaxed">
                {deskripsiToko}
              </p>

              {/* Shop Address Badge */}
              <div className="flex items-start gap-1.5 text-xs text-gray-600 font-semibold pt-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 max-w-xl">
                <span className="material-symbols-outlined text-sm text-[#2c46a9] mt-0.5 shrink-0">location_on</span>
                <div>
                  <strong className="text-[#020c38] block text-[10px] uppercase tracking-wide mb-0.5">Alamat Resmi Store:</strong>
                  {alamatToko}
                </div>
              </div>
            </div>
          </div>

          {/* BANK INFORMATION */}
          <div className="border-t md:border-t-0 md:border-l border-gray-100 md:pl-8 pt-6 md:pt-0 shrink-0 w-full md:w-80 flex flex-col justify-center">
            <div className="border border-indigo-50 bg-[#fbfdff] rounded-2xl p-4 space-y-2.5">
              <div className="flex items-center gap-1.5 text-[#2c46a9] font-black text-xs uppercase tracking-wider">
                <span className="material-symbols-outlined text-sm">account_balance</span>
                Detail Bank Rekening Toko
              </div>
              <div className="space-y-1 text-xs">
                <p className="text-gray-500 font-semibold">
                  Nama Bank: <strong className="text-gray-800">{bankN}</strong>
                </p>
                <p className="text-gray-500 font-semibold">
                  No. Rekening: <strong className="text-[#2c46a9] font-black select-all tracking-wider">{bankNo}</strong>
                </p>
                <p className="text-gray-500 font-semibold text-ellipsis overflow-hidden">
                  Atas Nama: <strong className="text-gray-800">{bankH}</strong>
                </p>
              </div>
              <p className="text-[10px] text-gray-400 font-medium italic mt-1 leading-tight">
                *Rekening resmi yang digunakan untuk verifikasi manual bukti bayar transfer.
              </p>
            </div>
          </div>
        </div>

        {/* TOKO PRODUCTS COLLECTION */}
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h2 className="text-lg md:text-xl font-extrabold text-[#020c38] font-poppins uppercase tracking-wide">
                Koleksi Pakaian {namaToko}
              </h2>
              <p className="text-xs text-gray-400 mt-1 font-semibold">
                Menampilkan {filteredProducts.length} Pcs produk pilihan siap kirim
              </p>
            </div>

            {/* In-store Search Bar */}
            <div className="relative w-full sm:w-72">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-sm select-none">
                search
              </span>
              <input
                type="text"
                value={tokoSearch}
                onChange={(e) => setTokoSearch(e.target.value)}
                placeholder="Cari item di toko ini..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-250 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#2c46a9] focus:border-[#2c46a9] font-semibold text-gray-700"
              />
            </div>
          </div>

          {/* Fallback empty view */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white border border-dashed border-slate-200 rounded-2xl py-14 text-center">
              <span className="material-symbols-outlined text-gray-300 text-4xl mb-2">
                sentiment_dissatisfied
              </span>
              <p className="text-gray-400 text-xs font-bold">
                Tidak ada produk aktif yang cocok dengan pencarian di toko ini.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {filteredProducts.map((p) => {
                const isItemLiked = !!likes[p.id];
                const itemSoldOut = p.status === "inactive" || (p.stock !== undefined && p.stock <= 0);

                return (
                  <div
                    key={p.id}
                    id={`toko-prod-${p.id}`}
                    onClick={() => {
                      onSelectProduct(p);
                      setActivePage("detail");
                    }}
                    className="bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 cursor-pointer flex flex-col h-full relative"
                  >
                    {/* Status Badge */}
                    {itemSoldOut ? (
                      <span className="absolute top-3 left-3 z-10 bg-red-600 text-white text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded shadow-sm">
                        Sold Out
                      </span>
                    ) : (
                      p.originalPrice &&
                      p.price < p.originalPrice && (
                        <span className="absolute top-3 left-3 z-10 bg-rose-500 text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded shadow-sm">
                          PROMO
                        </span>
                      )
                    )}

                    {/* Image block */}
                    <div className="relative aspect-[4/5] bg-gray-50 overflow-hidden w-full shrink-0">
                      <img
                        src={p.image}
                        alt={p.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover select-none"
                      />
                      {/* Favorite trigger bubble */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleLike(p.id);
                        }}
                        className={`absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center border transition-all shadow-sm ${
                          isItemLiked
                            ? "bg-rose-500 border-rose-500 text-white scale-110"
                            : "bg-white border-gray-100 text-gray-400 hover:text-rose-500"
                        }`}
                      >
                        <span className="material-symbols-outlined text-sm">
                          {isItemLiked ? "favorite" : "favorite"}
                        </span>
                      </button>
                    </div>

                    {/* Detail block */}
                    <div className="p-3.5 flex flex-col flex-grow text-left">
                      <span className="text-[9px] text-[#2c46a9] font-black uppercase tracking-wider">
                        {p.category}
                      </span>
                      <h3 className="text-xs font-bold text-[#020c38] mt-1.5 line-clamp-2 h-8 leading-tight font-poppins">
                        {p.name}
                      </h3>

                      <div className="flex gap-2 items-center text-[10px] mt-1 font-semibold text-gray-500">
                        <span className="bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded">
                          Size {p.size}
                        </span>
                        <span className="bg-orange-50 text-orange-700 px-2 py-0.5 rounded border border-orange-100/50">
                          {p.condition}
                        </span>
                      </div>

                      {/* Pricing block */}
                      <div className="mt-3.5 pt-3.5 border-t border-gray-50 flex flex-col justify-end flex-grow">
                        {p.originalPrice && p.price < p.originalPrice && (
                          <span className="text-[10px] text-gray-400 line-through font-semibold mb-1">
                            Rp {p.originalPrice.toLocaleString("id-ID")}
                          </span>
                        )}
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-black text-slate-800">
                            Rp {p.price.toLocaleString("id-ID")}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onAddToCart(p);
                            }}
                            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors shadow-xs ${
                              itemSoldOut
                                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                : "bg-[#f0f4ff] hover:bg-[#2c46a9] text-[#2c46a9] hover:text-white"
                            }`}
                          >
                            <span className="material-symbols-outlined text-sm">
                              {itemSoldOut ? "do_not_disturb_on" : "add_shopping_cart"}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
