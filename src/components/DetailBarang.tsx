import React, { useState, useEffect, useMemo } from "react";
import { Product, Page, ProductFeedback, User } from "../types";

interface DetailBarangProps {
  product: Product | null;
  onAddToCart: (p: Product) => void;
  likes: Record<string, boolean>;
  onToggleLike: (productId: string) => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
  setActivePage: (p: Page) => void;
  showAlert?: (title: string, message: string, type?: "info" | "success" | "warning" | "error") => void;
  onOpenChatWithSeller: (product: Product) => void;
  reviews?: ProductFeedback[];
  onUpdateReviews?: React.Dispatch<React.SetStateAction<ProductFeedback[]>>;
  currentUser?: User | null;
  onVisitShop?: (shopName: string) => void;
}

export default function DetailBarang({
  product,
  onAddToCart,
  likes,
  onToggleLike,
  products,
  onSelectProduct,
  setActivePage,
  showAlert,
  onOpenChatWithSeller,
  reviews = [],
  onUpdateReviews,
  currentUser,
  onVisitShop,
}: DetailBarangProps) {
  // If no product is passed, fallback to Racing Jacket (id: '2' from data.ts or custom mockup)
  const activeProduct = product || products.find((p) => p.id === "2") || products[0];

  const [activeThumbIdx, setActiveThumbIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>("M");
  const [selectedCondition, setSelectedCondition] = useState<string>("Like New");

  // Review Submittal States
  const [reviewName, setReviewName] = useState(currentUser?.name || "");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState("");

  useEffect(() => {
    if (currentUser) {
      setReviewName(currentUser.name);
    }
  }, [currentUser]);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewText.trim()) {
      if (showAlert) {
        showAlert("Form Tidak Lengkap", "Harap isi Nama Anda dan Ulasan Garmen Anda terlebih dahulu!", "warning");
      } else {
        alert("Harap isi Nama Anda dan Ulasan Garmen Anda terlebih dahulu!");
      }
      return;
    }

    const newFeedback: ProductFeedback = {
      id: `rev-${Date.now()}`,
      productId: activeProduct.id,
      productName: activeProduct.name,
      buyerName: reviewName.trim(),
      rating: reviewRating,
      reviewText: reviewText.trim(),
      createdAt: new Date().toLocaleDateString("id-ID"),
      isApproved: false, // Moderated by Admin first!
    };

    if (onUpdateReviews) {
      onUpdateReviews((prev) => [...prev, newFeedback]);
    }

    setReviewText("");
    setReviewSuccessMsg("Ulasan sukses dikirim! Ulasan akan dikaji terlebih dahulu oleh Admin untuk di-approve sebelum tampil secara live.");
    
    if (showAlert) {
      showAlert("Ulasan Terikirim", "Ulasan Anda berhasil dikirim untuk moderasi Admin. Terima kasih!", "success");
    }

    setTimeout(() => {
      setReviewSuccessMsg("");
    }, 7000);
  };

  // Reset states on product changes
  useEffect(() => {
    setActiveThumbIdx(0);
    if (activeProduct) {
      setSelectedSize(activeProduct.size || "M");
      setSelectedCondition(activeProduct.condition || "Like New");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeProduct]);

  if (!activeProduct) {
    return (
      <div className="py-20 text-center font-poppins">
        <p>No product selected.</p>
        <button onClick={() => setActivePage("produk")} className="mt-4 bg-[#2c46a9] text-white px-4 py-2 rounded-xl">
          Kembali ke Toko
        </button>
      </div>
    );
  }

  // Only display photos that are actually uploaded by the seller
  const thumbnails = useMemo(() => {
    const list: string[] = [];
    if (activeProduct.image) list.push(activeProduct.image);
    
    // Add laundry, sterilization, and detailed photos if they exist
    if (activeProduct.fullPhoto && activeProduct.fullPhoto !== activeProduct.image) {
      list.push(activeProduct.fullPhoto);
    }
    if (activeProduct.washPhoto) {
      list.push(activeProduct.washPhoto);
    }
    if (activeProduct.perfumePhoto) {
      list.push(activeProduct.perfumePhoto);
    }
    if (activeProduct.detailPhoto) {
      list.push(activeProduct.detailPhoto);
    }
    if (activeProduct.detailPhotos && Array.isArray(activeProduct.detailPhotos)) {
      activeProduct.detailPhotos.forEach(p => {
        if (p && !list.includes(p)) {
          list.push(p);
        }
      });
    }
    
    // Fallback if empty
    if (list.length === 0) {
      list.push("https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=600&auto=format&fit=crop");
    }
    return list;
  }, [activeProduct]);

  const isLiked = !!likes[activeProduct.id];
  const approvedReviews = reviews.filter((r) => r.productId === activeProduct.id && r.isApproved);

  const handlePrevSlide = () => {
    setActiveThumbIdx((prev) => (prev === 0 ? thumbnails.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setActiveThumbIdx((prev) => (prev === thumbnails.length - 1 ? 0 : prev + 1));
  };

  // Get similar items from jackets or related category, showing exactly 5 items
  const relatedItems = [
    ...products.filter((p) => p.id !== activeProduct.id && p.category === activeProduct.category && p.status !== "draft" && p.status !== "posting"),
    ...products.filter((p) => p.id !== activeProduct.id && p.category !== activeProduct.category && p.status !== "draft" && p.status !== "posting")
  ].slice(0, 5);

  const isSoldOut = activeProduct.status === "inactive" || (activeProduct.stock !== undefined && activeProduct.stock <= 0);

  const handleBuyNow = () => {
    if (isSoldOut) {
      if (showAlert) {
        showAlert(
          "Maaf, barang sudah habis",
          "Mohon maaf, pakaian preloved estetik ini telah habis terjual ke pembeli lain sehingga stok kosong.",
          "warning"
        );
      } else {
        alert("Maaf, barang sudah habis");
      }
      return;
    }
    onAddToCart(activeProduct);
    setActivePage("cart");
  };

  const handleAddToCartClick = () => {
    if (isSoldOut) {
      if (showAlert) {
        showAlert(
          "Maaf, barang sudah habis",
          "Mohon maaf, pakaian preloved estetik ini telah habis terjual ke pembeli lain sehingga stok kosong.",
          "warning"
        );
      } else {
        alert("Maaf, barang sudah habis");
      }
      return;
    }
    onAddToCart(activeProduct);
  };

  return (
    <div className="bg-white font-poppins select-none animate-fade-in text-left">
      
      {/* BREADCRUMBS ROW */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-14 pt-6 pb-4">
        <div className="flex items-center gap-2 text-xs text-gray-400 font-semibold font-poppins">
          <a href="#home" onClick={(e) => { e.preventDefault(); setActivePage("beranda"); }} className="hover:text-[#2c46a9] transition-colors">
            Home
          </a>
          <span>&gt;</span>
          <a href="#shop" onClick={(e) => { e.preventDefault(); setActivePage("produk"); }} className="hover:text-[#2c46a9] transition-colors">
            Shop
          </a>
          <span>&gt;</span>
          <span className="hover:text-[#2c46a9] cursor-pointer" onClick={() => setActivePage("produk")}>
            {activeProduct.category}s
          </span>
          <span>&gt;</span>
          <span className="text-gray-900 font-bold truncate max-w-[160px] md:max-w-none">
            {activeProduct.name}
          </span>
        </div>
      </div>

      {/* CORE PRODUCT SHOT & METADATA SECTION */}
      <section className="max-w-[1400px] mx-auto px-6 lg:px-14 pb-16 grid lg:grid-cols-12 gap-10 items-start">
        
        {/* LEFT COLUMN: GALLERY VIEW (3 cols thumbnail column + 9 cols center card or inline flex) */}
        <div className="lg:col-span-7 grid md:grid-cols-12 gap-4">
          
          {/* Thumbnails left row */}
          <div className="md:col-span-2 flex md:flex-col gap-3 order-2 md:order-1 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
            {thumbnails.map((thumbUrl, idx) => {
              const isSelected = activeThumbIdx === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveThumbIdx(idx)}
                  className={`w-14 h-14 md:w-16 md:h-16 rounded-xl border-2 flex items-center justify-center p-1 bg-gray-50/50 shrink-0 overflow-hidden transition-all hover:border-[#2c46a9]/50 ${
                    isSelected ? "border-[#2c46a9] bg-blue-50/10 shadow-xs" : "border-gray-100"
                  }`}
                >
                  <img src={thumbUrl} alt="Thumbnail view" className="w-full h-full object-contain" />
                </button>
              );
            })}
          </div>

          {/* Central main product photobox */}
          <div className="md:col-span-10 relative aspect-square rounded-[32px] overflow-hidden bg-[#fafbfc] border border-gray-100/50 p-6 flex items-center justify-center order-1 md:order-2 group">
            
            {/* Main Picture */}
            <img
              src={thumbnails[activeThumbIdx]}
              alt={activeProduct.name}
              className="max-h-[85%] w-auto object-contain scale-100 group-hover:scale-[1.03] transition-transform duration-500"
            />

            {/* Slide left right triggers */}
            <button
              onClick={handlePrevSlide}
              className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-md border border-gray-100 flex items-center justify-center text-gray-700 hover:bg-[#2c46a9] hover:text-white transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px] font-bold">arrow_back_ios_new</span>
            </button>

            <button
              onClick={handleNextSlide}
              className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-md border border-gray-100 flex items-center justify-center text-gray-700 hover:bg-[#2c46a9] hover:text-white transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px] font-bold">arrow_forward_ios</span>
            </button>

            {/* Like trigger overlay top right */}
            <button
              onClick={() => onToggleLike(activeProduct.id)}
              className={`absolute top-6 right-6 w-11 h-11 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center transition-colors cursor-pointer ${
                isLiked ? "text-red-500 hover:bg-slate-50" : "text-gray-300 hover:text-red-500 hover:bg-slate-50"
              }`}
            >
              <span className="material-symbols-outlined font-bold" style={{ fontVariationSettings: ` 'FILL' ${isLiked ? 1 : 0}, 'wght' 600` }}>
                favorite
              </span>
            </button>

            {/* Slider counters bottom right */}
            <div className="absolute bottom-6 right-6 bg-black/60 text-white rounded-full px-3 py-1 text-[10px] font-bold tracking-wider">
              {activeThumbIdx + 1}/{thumbnails.length}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: REQUISITE OPTIONS & CHECKOUT BLOCK */}
        <div className="lg:col-span-5 space-y-6">

          {/* Title only (Best Seller & Rating removed) */}
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#020c38] leading-tight">
              {activeProduct.name}
            </h1>
          </div>

          {/* Pricing area discounts & status & stock */}
          <div className="border-y border-gray-100 py-4 text-left space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black text-[#2c46a9]">
                Rp {activeProduct.price.toLocaleString("id-ID")}
              </span>
              <span className={`px-2.5 py-1 text-[10px] uppercase tracking-wider font-extrabold rounded-md flex items-center gap-1 ${
                isSoldOut 
                  ? "bg-red-50 text-red-600 border border-red-200" 
                  : "bg-emerald-50 text-emerald-700 border border-emerald-200"
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isSoldOut ? "bg-red-500" : "bg-emerald-500"}`}></span>
                {isSoldOut ? "Sold Out" : "Available"}
              </span>
            </div>

            {/* Stock details */}
            <div className={`flex gap-2 items-center text-xs font-semibold px-3 py-2 rounded-xl border ${isSoldOut ? "text-red-700 bg-red-50 border-red-100" : "text-orange-700 bg-orange-50 border-orange-100"}`}>
              <span className="material-symbols-outlined text-sm shrink-0">inventory</span>
              <span>Informasi Stok: {isSoldOut ? "Habis Terjual (0 Pcs)" : `Tersedia ${activeProduct.stock !== undefined ? activeProduct.stock : 1} Pcs!`} (Lulus Kurasi Higienis Ringkas)</span>
            </div>

            {/* Shop Page / Partner Store Widget */}
            <div className="bg-[#fbfcff] border border-slate-100 p-3 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#2c46a9] text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                  {(activeProduct.sellerName || "Peaky Blinders").substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-xs font-black text-[#020c38] leading-none font-poppins">
                    {activeProduct.sellerName || "Peaky Blinders"}
                  </h4>
                  <p className="text-[9.5px] text-gray-400 mt-1 font-semibold">⭐ 4.9 &bull; Toko Partner Terverifikasi</p>
                </div>
              </div>
              <button
                onClick={() => {
                  if (onVisitShop) {
                    onVisitShop(activeProduct.sellerName || "Wearloop Partner");
                  } else if (setActivePage) {
                    setActivePage("produk");
                  }
                }}
                className="text-[#2c46a9] bg-white hover:bg-blue-50 border border-[#2c46a9] font-bold text-[9.5px] px-3 py-1.5 rounded-xl transition-all cursor-pointer font-poppins shrink-0"
              >
                Kunjungi Toko
              </button>
            </div>

            <div className="flex gap-4 text-[11px] text-gray-450 font-semibold pt-1">
              <span className="flex items-center gap-1 text-gray-500">
                <span className="material-symbols-outlined text-sm">local_shipping</span>
                Pengiriman 1-3 hari kerja
              </span>
            </div>
          </div>

          {/* Wearloop Guarantee Blue Banner */}
          <div className="bg-[#edf2ff] border border-[#d3e0ff] rounded-2xl p-4 flex gap-3 text-left">
            <span className="material-symbols-outlined text-[#2c46a9] text-2xl shrink-0 mt-0.5">gpp_good</span>
            <div>
              <h4 className="text-[11px] font-bold text-[#020c38] uppercase tracking-wide">Wearloop Guarantee</h4>
              <p className="text-[10px] text-gray-500 mt-1 leading-relaxed font-semibold">
                Semua item di platform Wearloop telah lulus uji kurasi fisik garmen & pencucian dry clean sterilisasi.
              </p>
            </div>
          </div>

          {/* Size parameters */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-extrabold text-[#020c38] uppercase tracking-wider">Ukuran</span>
              <button
                onClick={() => {
                  if (showAlert) {
                    showAlert(
                      "Panduan Dimensi Pakaian (Size Guide)",
                      "Standard Ukuran Fisik Garmen Wearloop:\r\n\r\n• Size S  : Lebar Dada 48cm, Panjang 66cm\r\n• Size M  : Lebar Dada 52cm, Panjang 69cm\r\n• Size L  : Lebar Dada 56cm, Panjang 72cm\r\n• Size XL : Lebar Dada 60cm, Panjang 75cm\r\n\r\nMargin toleransi ritsleting ±1cm. Silakan ukur dengan seksama sebelum bertransaksi.",
                      "info"
                    );
                  } else {
                    alert("Size Chart: S (Lebar 48cm), M (Lebar 52cm), L (Lebar 56cm), XL (Lebar 60cm)");
                  }
                }}
                className="text-[#2c46a9] hover:underline font-bold text-[11px]"
              >
                Size Guide
              </button>
            </div>
            
            <div className="flex gap-2.5">
              {["S", "M", "L", "XL", "XXL"].map((sz) => {
                const isSelected = selectedSize === sz;
                return (
                  <button
                    key={sz}
                    disabled
                    className={`w-11 h-11 rounded-xl text-xs font-bold border opacity-60 transition-all ${
                      isSelected
                        ? "bg-[#2c46a9] text-white border-[#2c46a9]"
                        : "bg-gray-100 text-gray-400 border-gray-200 pointer-events-none"
                    }`}
                  >
                    {sz}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Conditions highlight tags */}
          <div className="space-y-3">
            <span className="block text-xs font-extrabold text-[#020c38] uppercase tracking-wider">Kondisi</span>
            <div className="flex flex-wrap gap-2">
              {["Like New", "Very Good", "Good", "Fair"].map((cond) => {
                const isSelected = selectedCondition === cond;
                return (
                  <button
                    key={cond}
                    disabled
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold border opacity-60 transition-all ${
                      isSelected
                        ? "bg-[#020c38] text-white border-[#020c38]"
                        : "bg-gray-100 text-gray-400 border-gray-200 pointer-events-none"
                    }`}
                  >
                    {cond}
                  </button>
                );
              })}
            </div>
            <p className="text-[10px] text-gray-400 font-medium">
              💡 Kondisi: <strong>9/10</strong> &bull; Item ini dijamin sangat minim pemakaian dan bebas noda/cacat bawaan.
            </p>
          </div>

          {/* Action trigger buttons row */}
          <div className="space-y-3 pt-2 font-poppins">
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleAddToCartClick}
                className={`py-4 px-4 rounded-xl text-xs font-extrabold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                  isSoldOut
                    ? "bg-slate-300 text-slate-500 hover:bg-slate-350 hover:text-slate-600 shadow-none"
                    : "bg-[#2c46a9] hover:bg-[#020c38] text-white shadow-blue-100"
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {isSoldOut ? "do_not_disturb_on" : "shopping_bag"}
                </span>
                {isSoldOut ? "Habis Terjual (Sold Out)" : "Tambah ke Keranjang"}
              </button>
              <button
                onClick={handleBuyNow}
                className={`py-3 px-4 rounded-xl text-xs font-extrabold transition-colors cursor-pointer border-2 ${
                  isSoldOut
                    ? "bg-slate-100 text-slate-400 border-slate-300"
                    : "bg-white hover:bg-slate-50 border-[#2c46a9] text-[#2c46a9]"
                }`}
              >
                {isSoldOut ? "Stok Kosong" : "Beli Sekarang"}
              </button>
            </div>
            
            <button
              onClick={() => onOpenChatWithSeller(activeProduct)}
              className="w-full bg-[#f0f4ff] hover:bg-blue-100 text-[#2c46a9] py-3.5 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 border border-[#2c46a9]/20 cursor-pointer shadow-xs"
            >
              <span className="material-symbols-outlined text-[18px]">chat</span>
              Tanyakan Produk (Live Chat Seller)
            </button>
          </div>

          {/* Flat seals logos */}
          <div className="pt-4 border-t border-gray-100 grid grid-cols-3 gap-3">
            {[
              { icon: "security", title: "100% Original", sub: "Terjamin original" },
              { icon: "verified_user", title: "Secure Payment", sub: "Pembayaran aman" },
              { icon: "replay", title: "Easy Returns", sub: "7 hari retur" },
            ].map((seal, idx) => (
              <div key={idx} className="flex gap-2 items-center text-left">
                <span className="material-symbols-outlined text-[#2c46a9] text-base shrink-0">{seal.icon}</span>
                <div>
                  <h4 className="text-[9px] font-black text-[#020c38] leading-tight">{seal.title}</h4>
                  <p className="text-[8px] text-gray-400 font-medium leading-none mt-0.5">{seal.sub}</p>
                </div>
              </div>
            ))}
          </div>

        </div>

      </section>

      {/* DETAILED SPECIFICATIONS & COLLAPSES */}
      <section className="max-w-[1400px] mx-auto px-6 lg:px-14 pb-20 grid lg:grid-cols-2 gap-8 items-start">
        
        {/* Left Card: Desks */}
        <div className="bg-white border border-gray-100 rounded-[28px] p-8 shadow-sm space-y-5 text-left">
          <h3 className="text-sm font-extrabold text-[#020c38] uppercase tracking-wider pb-3 border-b border-gray-50">
            Deskripsi Produk
          </h3>
          <p className="text-gray-500 text-xs leading-relaxed font-medium">
            Jaket racing style eksklusif dengan kombinasi tatanan premium warna biru sirkular dan hitam yang bold. Dibuat menggunakan materi nylon garmen yang awet, ringan, dan sangat nyaman dipasang untuk melengkapi gaya fashion streetwear trendi harianmu!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {[
              "Material: Nylon Premium",
              "Warna: Biru, Hitam, Putih",
              "Cocok untuk Unisex",
              "Detail bordir rapi di dada & lengan",
              "Resleting full kokoh, saku kanan-kiri",
              "Aesthetic Style: Racing / Vintage",
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-2 text-xs font-semibold text-[#020c38]">
                <span className="material-symbols-outlined text-green-600 text-sm font-black">check</span>
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Card: Info Table */}
        <div className="bg-white border border-gray-100 rounded-[28px] p-8 shadow-sm space-y-4 text-left">
          <h3 className="text-sm font-extrabold text-[#020c38] uppercase tracking-wider pb-3 border-b border-gray-50">
            Informasi Produk
          </h3>
          
          <div className="divide-y divide-gray-50 space-y-3.5 text-xs">
            {[
              { label: "Kategori", value: activeProduct.category },
              { label: "Merek / Brand", value: activeProduct.brand || "Speedtech Apparel Vintage" },
              { label: "Ukuran Garmen", value: `${selectedSize} (Standard Indo)` },
              { label: "Kondisi Detil", value: `${selectedCondition} (9/10)` },
              { label: "Lokasi Pengiriman", value: "Jakarta Selatan, Indonesia" },
            ].map((row, i) => (
              <div key={i} className="flex justify-between items-center pt-3.5">
                <span className="text-gray-410 font-bold">{row.label}</span>
                <span className="text-[#020c38] font-black">{row.value}</span>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* REVIEWS & RATINGS SECTIONS (Dynamic & Interactive) */}
      <section className="max-w-[1400px] mx-auto px-6 lg:px-14 pb-12 text-left">
        <div className="border-t border-gray-150 pt-10">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#020c38] mb-6 flex items-center gap-1.5 font-poppins">
            <span className="material-symbols-outlined text-yellow-500 font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            Ulasan Garmen &amp; Rating Pelanggan
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6 font-poppins">
            {approvedReviews.map((r) => (
              <div key={r.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs space-y-2.5">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center font-semibold text-xs text-[#2c46a9]">
                      {r.buyerName.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-gray-900 leading-none">{r.buyerName}</h4>
                      <span className="text-[9px] text-[#2c46a9] block mt-1">Verified Buyer &bull; {r.createdAt}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 text-yellow-500">
                    {Array.from({ length: r.rating }).map((_, idx) => (
                      <span key={idx} className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed font-semibold">
                  "{r.reviewText}"
                </p>
              </div>
            ))}

            {approvedReviews.length === 0 && (
              <div className="md:col-span-2 bg-[#f4f7ff]/40 rounded-2xl p-8 text-center border border-dashed border-[#dce5ff] mb-2">
                <p className="text-xs text-gray-500 font-semibold">Belum ada ulasan terverifikasi untuk garmen vintage ini. Jadilah yang pertama memberikan ulasan!</p>
              </div>
            )}
          </div>

          {/* Interactive Review Form */}
          <div className="mt-10 bg-slate-50/50 p-6 rounded-3xl border border-dashed border-gray-200 max-w-2xl font-poppins">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#020c38] mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-xs font-semibold">rate_review</span>
              Tulis Ulasan untuk Garmen Ini
            </h4>

            {!currentUser ? (
              <div className="bg-slate-100/60 border border-gray-200 text-slate-800 p-6 rounded-2xl text-xs font-semibold text-center flex flex-col items-center gap-2">
                <span className="material-symbols-outlined text-gray-500 text-2xl">lock</span>
                <p className="font-bold text-slate-700">Silakan login terlebih dahulu untuk memberikan ulasan dan rating garmen.</p>
                <button 
                  onClick={() => setActivePage("login")} 
                  className="mt-1 bg-[#2c46a9] hover:bg-[#020c38] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
                >
                  Login Sekarang
                </button>
              </div>
            ) : reviewSuccessMsg ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-5 py-4 rounded-2xl text-xs font-semibold transition-all">
                {reviewSuccessMsg}
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Nama Tampilan Anda (Buyer)</label>
                    <input
                      type="text"
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#2c46a9] font-medium"
                      placeholder="Masukkan nama lengkap"
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Rating Produk</label>
                    <div className="flex items-center gap-1.5 h-10">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="hover:scale-110 transition-transform cursor-pointer"
                        >
                          <span
                             className={`material-symbols-outlined text-xl ${
                              reviewRating >= star ? "text-yellow-500" : "text-gray-300"
                            }`}
                            style={{ fontVariationSettings: `'FILL' ${reviewRating >= star ? 1 : 0}` }}
                          >
                            star
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Tulis Komentar / Penilaian</label>
                  <textarea
                    rows={3}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#2c46a9] font-medium"
                    placeholder="Tulis kualitas higienitas garmen, keselarasan ukuran, dll..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    maxLength={200}
                  />
                </div>

                <div className="flex items-center justify-between gap-4 pt-1 flex-wrap">
                  <p className="text-[10px] text-gray-400 leading-normal max-w-sm font-semibold">
                    💡 Info: Review akan ditinjau Admin demi reputasi penjual mitra WearLoop sebelum ditampilkan live.
                  </p>
                  <button
                    type="submit"
                    className="bg-[#2c46a9] hover:bg-[#020c38] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
                  >
                    Kirim Ulasan Moderator
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* YOU MIGHT ALSO LIKE ROW CAROUSEL */}
      <section className="bg-slate-50 border-t border-gray-100 py-16 text-left">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-14">
          <div className="flex justify-between items-end mb-10">
            <div>
              <span className="text-xs font-black text-[#2c46a9] uppercase tracking-wider">TERKAIT</span>
              <h2 className="text-2xl md:text-3xl font-black text-[#020c38] mt-1">You Might Also Like</h2>
            </div>
            <button
              onClick={() => setActivePage("produk")}
              className="text-[#2c46a9] hover:text-[#020c38] text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 hover:underline"
            >
              Lihat Semua
              <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
            </button>
          </div>

          {/* 5-column responsive grid styled exact same way as dashboard */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 font-poppins">
            {relatedItems.map((relItem) => {
              const itemLiked = !!likes[relItem.id];
              return (
                <div
                  key={relItem.id}
                  onClick={() => onSelectProduct(relItem)}
                  className="relative bg-white rounded-2xl p-4 shadow-[0_10px_25px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col justify-between group transition-all duration-300 hover:shadow-[0_15px_30px_rgba(0,0,0,0.06)] h-[355px] cursor-pointer text-left"
                >
                  <div className="flex flex-col">
                    {/* Top action flags */}
                    <div className="flex justify-between items-center mb-3">
                      <span className="px-2 py-0.5"></span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleLike(relItem.id);
                        }}
                        className={`transition-colors p-1.5 rounded-full hover:bg-gray-50 flex items-center justify-center ${
                          itemLiked ? "text-red-500" : "text-gray-400"
                        }`}
                      >
                        <span className="material-symbols-outlined text-base">favorite</span>
                      </button>
                    </div>

                    {/* Product Image Area */}
                    <div className="w-full aspect-[4/3] flex items-center justify-center mb-4 overflow-hidden bg-white border border-gray-100 rounded-xl">
                      <img
                        src={relItem.image || relItem.fullPhoto || "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=600&auto=format&fit=crop"}
                        alt={relItem.name}
                        className="object-contain w-full h-full p-2 group-hover:scale-[1.04] transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Titles */}
                    <div className="text-left font-poppins">
                      <h3 className="text-[#0F172A] font-black text-sm mb-0.5 tracking-tight group-hover:text-[#2c46a9] transition-colors leading-snug truncate">
                        {relItem.name}
                      </h3>
                      <p className="text-[11px] text-gray-500 font-bold mb-1">
                        Brand: <span className="text-[#2c46a9]">{relItem.brand || "Wearloop Select"}</span>
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-gray-400 text-xs font-semibold">
                          Size {relItem.size} &bull; {relItem.condition}
                        </p>
                        <span className={`text-[9.5px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-md ${
                          relItem.status === "inactive" 
                            ? "bg-red-50 text-red-600 border border-red-200" 
                            : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        }`}>
                          {relItem.status === "inactive" ? "Sold Out" : "Available"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing and Action */}
                  <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-50">
                    <span className="text-base font-extrabold text-[#0F172A]">Rp {relItem.price.toLocaleString("id-ID")}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(relItem);
                      }}
                      className="bg-[#020c38] hover:bg-[#2c46a9] text-white p-2 rounded-xl transition-all shadow-sm flex items-center justify-center hover:scale-105 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">shopping_bag</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
}
