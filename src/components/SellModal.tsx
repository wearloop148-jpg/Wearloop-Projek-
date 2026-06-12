import React, { useState } from "react";
import { Product } from "../types";

interface SellModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (newProduct: Product) => void;
}

export default function SellModal({ isOpen, onClose, onAddProduct }: SellModalProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<Product["category"]>("T-Shirt");
  const [size, setSize] = useState<Product["size"]>("M");
  const [condition, setCondition] = useState<Product["condition"]>("Like New");
  const [price, setPrice] = useState("");
  const [imagePlaceholder, setImagePlaceholder] = useState("1"); // 1-4 random design placeholders

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) {
      alert("Tolong isi semua bidang nama dan harga!");
      return;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      alert("Harga harus berupa angka positif!");
      return;
    }

    // Assign appropriate design postimg URLs depending on chosen design placeholder or random
    const postimgUrls: Record<string, string> = {
      "1": "https://i.postimg.cc/xTyKfXGJ/hai-(9).png",
      "2": "https://i.postimg.cc/qvrHK53T/hai-(10).png",
      "3": "https://i.postimg.cc/3RXgkW5H/hai-(11).png",
      "4": "https://i.postimg.cc/3rZX7yFq/hai-(12).png",
    };

    const newProduct: Product = {
      id: String(Date.now()),
      name,
      category,
      size,
      condition,
      price: priceNum,
      originalPrice: Math.round(priceNum * 1.25),
      discount: "-20%",
      image: postimgUrls[imagePlaceholder] || postimgUrls["1"],
      isFeatured: true,
    };

    onAddProduct(newProduct);
    onClose();

    // Reset fields
    setName("");
    setPrice("");
    setCategory("T-Shirt");
    setSize("M");
    setCondition("Like New");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-poppins text-[#020c38] select-none">
      {/* Background overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 animate-fade-in"
        onClick={onClose}
      ></div>

      <div className="absolute inset-0 flex items-center justify-center p-4">
        {/* Modal body */}
        <div className="bg-white rounded-[32px] shadow-2xl p-6 md:p-8 w-full max-w-lg relative animate-scale-up border border-gray-100 text-left">
          
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-gray-400 hover:text-red-500 font-bold p-1 rounded-full hover:bg-slate-50 flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>

          <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-3">
            <span className="material-symbols-outlined text-[#2c46a9] text-3xl">storefront</span>
            <div>
              <h2 className="text-lg font-bold">Mulai Jual Pakaian</h2>
              <p className="text-xs text-gray-400 font-medium">Wearloop Verified Seller Panel</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">
                Nama Pakaian / Judul Thrift *
              </label>
              <input
                required
                type="text"
                className="w-full h-11 border border-gray-200 rounded-xl px-4 text-xs font-poppins focus:border-[#2c46a9] focus:outline-none"
                placeholder="e.g. Kaos Vintage Distro"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">
                  Kategori *
                </label>
                <select
                  className="w-full h-11 border border-gray-200 rounded-xl px-4 text-xs font-poppins bg-white text-gray-700"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Product["category"])}
                >
                  <option value="T-Shirt">T-Shirt</option>
                  <option value="Hoodie">Hoodie</option>
                  <option value="Jacket">Jacket</option>
                  <option value="Pants">Pants</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Shoes">Shoes</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">
                  Ukuran Garmen *
                </label>
                <select
                  className="w-full h-11 border border-gray-200 rounded-xl px-4 text-xs font-poppins bg-white text-gray-700"
                  value={size}
                  onChange={(e) => setSize(e.target.value as Product["size"])}
                >
                  <option value="S">S (Small)</option>
                  <option value="M">M (Medium)</option>
                  <option value="L">L (Large)</option>
                  <option value="XL">XL (Extra Large)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">
                  Kondisi Pakaian *
                </label>
                <select
                  className="w-full h-11 border border-gray-200 rounded-xl px-4 text-xs font-poppins bg-white text-gray-700"
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as Product["condition"])}
                >
                  <option value="Like New">Like New (Sangat Mulus)</option>
                  <option value="Very Good">Very Good (Bagus Terawat)</option>
                  <option value="Good">Good (Layak Pakai)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">
                  Tentukan Harga (Rp) *
                </label>
                <input
                  required
                  type="number"
                  className="w-full h-11 border border-gray-200 rounded-xl px-4 text-xs font-poppins text-gray-700 focus:outline-none focus:border-[#2c46a9]"
                  placeholder="e.g. 150000"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">
                Pilih Model Desain Placeholder
              </label>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { key: "1", label: "Tee 1", url: "https://i.postimg.cc/xTyKfXGJ/hai-(9).png" },
                  { key: "2", label: "Jacket 1", url: "https://i.postimg.cc/qvrHK53T/hai-(10).png" },
                  { key: "3", label: "Tee 2", url: "https://i.postimg.cc/3RXgkW5H/hai-(11).png" },
                  { key: "4", label: "Tee 3", url: "https://i.postimg.cc/3rZX7yFq/hai-(12).png" },
                ].map((ph) => {
                  const isSelected = imagePlaceholder === ph.key;
                  return (
                    <div
                      key={ph.key}
                      onClick={() => setImagePlaceholder(ph.key)}
                      className={`cursor-pointer rounded-xl p-1 border-2 text-center flex flex-col items-center justify-center bg-gray-50/50 hover:border-gray-300 transition-all ${
                        isSelected ? "border-[#2c46a9] bg-blue-50/10" : "border-gray-100"
                      }`}
                    >
                      <img src={ph.url} alt={ph.label} className="w-10 h-10 object-contain" />
                      <span className="text-[9px] font-bold text-gray-400 mt-1">{ph.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* NEW REQUIRED SELLER PICTURES */}
            <div className="space-y-3.5 border-t border-gray-100 pt-4">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">
                BUKTI HIGIENITAS & DETAIL KONDISI (3-4 FOTO WAJIB) *
              </label>

              <div className="grid grid-cols-2 gap-3">
                {/* 1. Foto Nyuci Baju */}
                <div className="border border-dashed border-gray-200 rounded-xl p-3 bg-white flex flex-col items-center justify-center text-center hover:border-[#2c46a9] transition-all">
                  <span className="material-symbols-outlined text-gray-400 text-xl">local_laundry_service</span>
                  <p className="text-[10px] font-bold text-gray-600 mt-1">Foto Proses Cuci *</p>
                  <span className="text-[9px] text-[#2c46a9] font-medium mt-1 hover:underline cursor-pointer">
                    Pilih Foto
                  </span>
                  <span className="text-[8px] text-emerald-600 font-semibold mt-1">✓ cuci_proses.jpg</span>
                </div>

                {/* 2. Foto Kerusakan / Detail Baju */}
                <div className="border border-dashed border-gray-200 rounded-xl p-3 bg-white flex flex-col items-center justify-center text-center hover:border-[#2c46a9] transition-all">
                  <span className="material-symbols-outlined text-gray-400 text-xl">report_problem</span>
                  <p className="text-[10px] font-bold text-gray-600 mt-1">Detail Fisik / Kerusakan *</p>
                  <span className="text-[9px] text-[#2c46a9] font-medium mt-1 hover:underline cursor-pointer">
                    Pilih Foto
                  </span>
                  <span className="text-[8px] text-emerald-600 font-semibold mt-1">✓ detail_kerusakan.png</span>
                </div>

                {/* 3. Foto Sisi Belakang */}
                <div className="border border-dashed border-gray-200 rounded-xl p-3 bg-white flex flex-col items-center justify-center text-center hover:border-[#2c46a9] transition-all">
                  <span className="material-symbols-outlined text-gray-400 text-xl">flip</span>
                  <p className="text-[10px] font-bold text-gray-600 mt-1">Tampak Sisi Belakang *</p>
                  <span className="text-[9px] text-[#2c46a9] font-medium mt-1 hover:underline cursor-pointer">
                    Pilih Foto
                  </span>
                  <span className="text-[8px] text-emerald-600 font-semibold mt-1">✓ tampak_belakang.jpeg</span>
                </div>

                {/* 4. Foto Label Kerah / Tag */}
                <div className="border border-dashed border-gray-200 rounded-xl p-3 bg-white flex flex-col items-center justify-center text-center hover:border-[#2c46a9] transition-all">
                  <span className="material-symbols-outlined text-gray-400 text-xl">sell</span>
                  <p className="text-[10px] font-bold text-gray-600 mt-1">Foto Tag / Kerah *</p>
                  <span className="text-[9px] text-[#2c46a9] font-medium mt-1 hover:underline cursor-pointer">
                    Pilih Foto
                  </span>
                  <span className="text-[8px] text-emerald-600 font-semibold mt-1">✓ tag_brand.jpg</span>
                </div>
              </div>
            </div>

            <p className="text-[10px] text-gray-400 bg-gray-50 p-2.5 rounded-lg">
              💡 Item ini akan segera diverifikasi oleh sistem AI Wearloop dan langsung dimasukkan ke tab "Produk" agar siap untuk diuji coba transaksinya!
            </p>

            <button
              type="submit"
              className="w-full h-12 bg-[#2c46a9] hover:bg-[#020c38] text-white rounded-xl font-bold font-poppins text-xs cursor-pointer shadow-md transition-colors"
            >
              Kirim ke Sistem Kurasi Wearloop
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
