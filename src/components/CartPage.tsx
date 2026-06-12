import React, { useState } from "react";
import { Product, User, Order } from "../types";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartPageProps {
  cartItems: CartItem[];
  onUpdateQty: (productId: string, qty: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  currentUser: User | null;
  registeredUsers: User[];
  onAddOrder: (order: Order) => void;
  setActivePage: (p: any) => void;
}

export default function CartPage({
  cartItems,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  currentUser,
  registeredUsers,
  onAddOrder,
  setActivePage,
}: CartPageProps) {
  // Steps: 1 = Informasi, 2 = Pembayaran, 3 = Konfirmasi
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Cart checkboxes (simulate selecting items to checkout)
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>(
    cartItems.map((item) => item.product.id)
  );

  // Form inputs
  const [fullName, setFullName] = useState(currentUser?.name || "");
  const [whatsapp, setWhatsapp] = useState(currentUser?.phoneNumber || "");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [courier, setCourier] = useState<"JNE" | "JNT">("JNE");
  const [shippingType, setShippingType] = useState<"Reguler" | "Express">("Reguler");
  const [notes, setNotes] = useState("");

  // Proof of Transfer state
  const [proofImage, setProofImage] = useState<string | null>(null);

  // Simulated placed order details to show in step 3
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  const toggleSelectItem = (id: string) => {
    if (selectedItemIds.includes(id)) {
      setSelectedItemIds((prev) => prev.filter((i) => i !== id));
    } else {
      setSelectedItemIds((prev) => [...prev, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedItemIds.length === activeCartItems.length) {
      setSelectedItemIds([]);
    } else {
      setSelectedItemIds(activeCartItems.map((i) => i.product.id));
    }
  };

  const handleHapusSemua = () => {
    activeCartItems.forEach((i) => onRemoveItem(i.product.id));
  };

  const activeCartItems = cartItems;
  const checkedItems = activeCartItems.filter((i) => selectedItemIds.includes(i.product.id));

  // Pricing calculations
  const subtotal = checkedItems.reduce(
    (acc, current) => acc + current.product.price * current.quantity,
    0
  );

  // Ongkos kirim tidak gratis sesuai instruksi
  const isFreeShipping = false;
  
  // Courier specific rate
  const shippingCost = checkedItems.length === 0 
    ? 0 
    : isFreeShipping 
      ? 0 
      : courier === "JNE" 
        ? 15000 
        : 18000;

  const totalPembayaran = subtotal + shippingCost;

  // Retrieve the Seller details for direct bank transfer
  const getSellerBankDetails = () => {
    if (checkedItems.length === 0) {
      return {
        bankName: "BCA",
        bankAccountName: "CV WEARLOOP SEJAHTERA",
        bankAccountNumber: "8620891230",
        shopName: "Wearloop Partner",
      };
    }
    // Find seller of the first item
    const firstItem = checkedItems[0].product;
    const seller = registeredUsers.find((u) => u.id === firstItem.sellerId);
    if (seller && seller.bankAccountNumber) {
      return {
        bankName: seller.bankName || "BCA",
        bankAccountName: seller.bankAccountHolder || seller.name,
        bankAccountNumber: seller.bankAccountNumber,
        shopName: seller.shopName || "Seller Partner",
      };
    }
    // Fallback default
    return {
      bankName: "BCA",
      bankAccountName: "Dinar Setyawan (Wearloop Escrow)",
      bankAccountNumber: "4410189429",
      shopName: "Wearloop Store",
    };
  };

  const sellerBank = getSellerBankDetails();

  const handleLanjutCheckout = () => {
    if (checkedItems.length === 0) {
      alert("Pilih minimal 1 item untuk diproses ke Checkout!");
      return;
    }
    setStep(1); // Go to checkout info
  };

  const handleLanjutPembayaran = () => {
    if (!fullName || !whatsapp || !address || !city || !postalCode) {
      alert("Mohon lengkapi seluruh data pengiriman Anda!");
      return;
    }
    setStep(2); // Go to payment choice
  };

  const handleBayarSekarang = () => {
    if (!proofImage) {
      alert("Bukti transfer wajib diunggah! Silakan upload foto atau screenshoot bukti TF Anda terlebih dahulu.");
      return;
    }

    const orderId = "WRLP-TX-" + Math.floor(10000 + Math.random() * 90000);
    const newOrder: Order = {
      id: orderId,
      buyerId: currentUser?.id || "anonymous-buyer",
      buyerName: fullName,
      buyerPhone: whatsapp,
      address: `${address}, ${city}`,
      postalCode,
      courier,
      items: checkedItems,
      totalPrice: totalPembayaran,
      shippingCost,
      paymentMethod: "Direct Bank Transfer",
      sellerBankDetails: sellerBank,
      status: "pending_payment", // waiting for seller processing in buyer dashboard / UI
      createdAt: new Date().toLocaleDateString("id-ID"),
      paymentProof: proofImage,
    };

    onAddOrder(newOrder);
    setPlacedOrder(newOrder);
    setStep(3); // Direct to confirmation
  };

  // WhatsApp confirm string generator
  const getWhatsAppURL = (order: Order) => {
    const itemsList = order.items
      .map((i) => `- ${i.product.name} (Size ${i.product.size}) x${i.quantity} @ Rp${i.product.price.toLocaleString("id-ID")}`)
      .join("\r\n");

    const message = `Halo Admin Wearloop! Saya ingin konfirmasi Pembayaran Transfer Rekening Penjual.

========================
📌 *DETAIL PESANAN*
========================
- *ID Transaksi:* ${order.id}
- *Nama Pembeli:* ${order.buyerName}
- *No. WhatsApp:* ${order.buyerPhone}
- *Alamat Kirim:* ${order.address}
- *Kurir Pilihan:* ${order.courier} (${shippingType})

📦 *DAFTAR ITEM VINTAGE:*
${itemsList}

💰 *RINGKASAN HARGA:*
- Subtotal: Rp ${subtotal.toLocaleString("id-ID")}
- Ongkos Kirim: Rp ${order.shippingCost.toLocaleString("id-ID")}
- *Total Transfer:* Rp ${order.totalPrice.toLocaleString("id-ID")}

🏦 *TRANSFER DIKIRIM KE PENJUAL:*
- *Bank:* ${order.sellerBankDetails.bankName}
- *No. Rekening:* ${order.sellerBankDetails.bankAccountNumber}
- *Nama Pemilik:* ${order.sellerBankDetails.bankAccountName}
- *Toko Partner:* ${order.sellerBankDetails.shopName}

Saya sudah melakukan transfer sesuai nominal di atas. Harap segera divalidasi dan diproses ya. Terima kasih!`;

    const encodedText = encodeURIComponent(message);
    return `https://wa.me/6281234567890?text=${encodedText}`;
  };

  const getWhatsAppURLBuyer = (order: Order) => {
    const itemsList = order.items
      .map((i) => `- ${i.product.name} (Size ${i.product.size})`)
      .join("\r\n");

    const message = `Halo Kak *${order.buyerName}*! Pesanan Anda dengan ID *${order.id}* di Wearloop sedang disiapkan oleh penjual (${order.sellerBankDetails.shopName}).

📦 *Detail Item:*
${itemsList}

💰 *Total Pembayaran:* Rp ${order.totalPrice.toLocaleString("id-ID")}
🏦 *Bank Penjual:* ${order.sellerBankDetails.bankName} - ${order.sellerBankDetails.bankAccountNumber}
Atas Nama: ${order.sellerBankDetails.bankAccountName}

Terima kasih telah berbelanja thrifting ramah lingkungan di Wearloop! Selamat bernostalgia!`;

    const encodedText = encodeURIComponent(message);
    const cleanPhone = order.buyerPhone.replace(/[^0-9]/g, "");
    const destinationPhone = cleanPhone.startsWith("0") ? "62" + cleanPhone.substring(1) : (cleanPhone.startsWith("62") ? cleanPhone : "6281234567890");
    return `https://wa.me/${destinationPhone}?text=${encodedText}`;
  };

  const getWhatsAppURLSeller = (order: Order) => {
    const itemsList = order.items
      .map((i) => `- ${i.product.name} (Size ${i.product.size}) x${i.quantity}`)
      .join("\r\n");

    const message = `Halo Kak Penjual dari *${order.sellerBankDetails.shopName}*! Ada pembelian baru untuk produk Anda di Wearloop:

📌 *DETAIL TRANSAKSI:*
- ID Pesanan: ${order.id}
- Nama Pembeli: ${order.buyerName}
- Alamat Kirim: ${order.address}
- Kurir: ${order.courier}

📦 *DAFTAR ITEM BERHASIL DIBELI:*
${itemsList}

💰 *Total Harga:* Rp ${order.totalPrice.toLocaleString("id-ID")}

Silakan lakukan verifikasi pembayaran transfer bank Anda, dan segera kemas & siapkan produk thrifting premium ini untuk dikirimkan ke pembeli ya Kak! Terima kasih.`;

    const encodedText = encodeURIComponent(message);
    const sellerUser = registeredUsers.find((u) => u.shopName === order.sellerBankDetails.shopName || u.role === "seller");
    const rawPhone = sellerUser?.phoneNumber || "08987654321";
    const cleanPhone = rawPhone.replace(/[^0-9]/g, "");
    const destinationPhone = cleanPhone.startsWith("0") ? "62" + cleanPhone.substring(1) : (cleanPhone.startsWith("62") ? cleanPhone : "628987654321");
    return `https://wa.me/${destinationPhone}?text=${encodedText}`;
  };

  return (
    <div className="bg-[#f5f6ff] min-h-[90vh] py-10 selection:bg-[#2c46a9] text-[#020c38] font-poppins font-semibold" id="cart-parent">
      <div className="max-w-[1400px] mx-auto px-5 lg:px-14">
        
        {/* Title row */}
        <div className="text-left mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-[#020c38] tracking-tight">
              {step === 3 ? "Pesanan Sukses!" : "Keranjang Belanja & Checkout"}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {step === 3
                ? "Lakukan transfer langsung ke rekening penjual dan konfirmasi via WhatsApp."
                : "Kelola item vintage pilihan Anda lalu isi detail pengiriman garmen berkelanjutan."}
            </p>
          </div>
          <button
            onClick={() => setActivePage("produk")}
            className="text-xs font-bold text-[#2c46a9] bg-white border border-[#2c46a9]/30 hover:bg-[#2c46a9] hover:text-white px-4 py-2.5 rounded-xl transition-all"
          >
            ← Lanjut Belanja
          </button>
        </div>

        {activeCartItems.length === 0 && step !== 3 ? (
          <div className="bg-white rounded-[28px] border border-blue-100 p-16 text-center max-w-lg mx-auto shadow-sm">
            <span className="material-symbols-outlined text-6xl text-gray-300">
              shopping_cart_off
            </span>
            <h3 className="text-lg font-black mt-4 text-[#020c38]">Keranjang Kosong</h3>
            <p className="text-xs text-gray-500 mt-2 max-w-xs mx-auto">
              Sepertinya Anda belum memasukkan produk thrifting preloaded kami ke keranjang belanja Anda.
            </p>
            <button
              onClick={() => setActivePage("produk")}
              className="mt-6 bg-[#2c46a9] hover:bg-[#020c38] text-white font-bold text-xs px-5 py-3 rounded-xl transition-all shadow-md shadow-blue-100"
            >
              Cari Item Favorit Sekarang
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT CONTAINER: CART LIST (Only visible when NOT in Step 3 / complete) */}
            {step !== 3 && (
              <div className="lg:col-span-7 space-y-5 text-left">
                <div className="bg-white rounded-[32px] p-6 lg:p-8 border border-blue-100/60 shadow-xs">
                  
                  {/* Cart Header block matching image */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-[#2c46a9]">
                      <span className="material-symbols-outlined text-[24px]">
                        local_mall
                      </span>
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-[#020c38]">Keranjang Saya</h2>
                      <p className="text-xs text-gray-400 font-semibold mt-0.5">
                        {activeCartItems.length} item dalam keranjang
                      </p>
                    </div>
                  </div>

                  {/* Rate shipping notification banner */}
                  <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-center gap-3 text-xs mb-6 text-left">
                    <span className="material-symbols-outlined text-[#020c38] font-bold">
                      local_shipping
                    </span>
                    <span className="font-semibold text-[#020c38]">
                      Biaya ongkos kirim tidak gratis. Tarif dihitung tetap berdasarkan kurir pilihan Anda (JNE flat Rp15.000, J&amp;T Express flat Rp18.000).
                    </span>
                  </div>

                  {/* Group checkboxes selectors */}
                  <div className="flex justify-between items-center pb-4 border-b border-gray-100 mb-4 text-xs font-bold text-gray-500">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedItemIds.length === activeCartItems.length}
                        onChange={toggleSelectAll}
                        className="rounded text-[#2c46a9] focus:ring-[#2c46a9] w-4 h-4"
                      />
                      <span>Pilih Semua ({selectedItemIds.length})</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleHapusSemua}
                      className="text-red-500 hover:underline flex items-center gap-1 font-extrabold uppercase text-[10px]"
                    >
                      <span className="material-symbols-outlined text-xs">delete</span>
                      Hapus Semua
                    </button>
                  </div>

                  {/* Item loop */}
                  <div className="divide-y divide-gray-100">
                    {activeCartItems.map((item) => {
                      const isChecked = selectedItemIds.includes(item.product.id);
                      return (
                        <div
                          key={item.product.id}
                          className="py-5 flex items-center gap-4 text-left"
                        >
                          {/* Checkbox */}
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleSelectItem(item.product.id)}
                            className="rounded text-[#2c46a9] focus:ring-[#2c46a9] w-4 h-4 shrink-0"
                          />

                          {/* Image Box */}
                          <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-[#fbfcfd] border border-gray-100 flex items-center justify-center p-2 shrink-0 overflow-hidden">
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="max-h-full w-auto object-contain"
                            />
                          </div>

                          {/* Meta fields */}
                          <div className="flex-grow space-y-1">
                            <h3 className="font-bold text-sm md:text-base text-gray-900 leading-snug">
                              {item.product.name}
                            </h3>
                            <p className="text-[11px] text-gray-400 font-semibold">
                              Size {item.product.size} &bull; {item.product.condition}
                            </p>
                            
                            {item.product.sellerName && (
                              <p className="text-[10px] text-purple-600 font-bold flex items-center gap-1 bg-purple-50 px-2 py-0.5 rounded-md inline-block">
                                <span className="material-symbols-outlined text-[12px]">storefront</span>
                                {item.product.sellerName}
                              </p>
                            )}
                            
                            <div className="text-xs font-black text-[#2c46a9] md:hidden pt-1">
                              Rp {item.product.price.toLocaleString("id-ID")}
                            </div>
                          </div>

                          {/* Controls column */}
                          <div className="flex flex-col items-end gap-3 shrink-0 justify-between h-20 md:h-24">
                            <button
                              onClick={() => onRemoveItem(item.product.id)}
                              className="text-gray-300 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50 flex items-center justify-center"
                            >
                              <span className="material-symbols-outlined text-[18px]">delete</span>
                            </button>

                            <div className="hidden md:block text-sm font-black text-[#020c38]">
                              Rp {item.product.price.toLocaleString("id-ID")}
                            </div>

                            {/* Qty selectors */}
                            <div className="flex items-center border border-gray-100 rounded-xl overflow-hidden bg-gray-50/50">
                              <button
                                type="button"
                                onClick={() => onUpdateQty(item.product.id, item.quantity - 1)}
                                className="w-8 h-8 flex items-center justify-center font-bold hover:bg-gray-100 text-gray-500 text-xs transition-colors"
                              >
                                &minus;
                              </button>
                              <span className="px-3 text-xs font-bold text-gray-800">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => onUpdateQty(item.product.id, item.quantity + 1)}
                                className="w-8 h-8 flex items-center justify-center font-bold hover:bg-gray-100 text-gray-500 text-xs transition-colors"
                              >
                                &#43;
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                </div>
              </div>
            )}

            {/* RIGHT CONTAINER: CHECKOUT STEPS & TRANSFER INFO */}
            <div className={`${step === 3 ? "lg:col-span-12 max-w-2xl mx-auto" : "lg:col-span-5"} w-full text-left`}>
              <div className="bg-white rounded-[32px] p-6 lg:p-8 border border-blue-100/60 shadow-md space-y-6">
                
                {/* Visual Title segment header */}
                <div className="flex items-center gap-3 pb-3 border-b border-gray-50">
                  <span className="material-symbols-outlined text-[#2c46a9] text-2xl font-bold">
                    {step === 3 ? "verified_user" : "assignment_turned_in"}
                  </span>
                  <div>
                    <h2 className="text-lg font-black text-[#020c38]">
                      {step === 3 ? "Konfirmasi Pesanan" : "Checkout Pembayaran"}
                    </h2>
                    <p className="text-[11px] text-gray-400 font-bold">
                      {step === 3 ? "Selesaikan Pembayaran Langsung" : "Lengkapi data dan pilih kurir JNE/JNT"}
                    </p>
                  </div>
                </div>

                {/* PROGRESS SEGMENT MOCKUP */}
                {step !== 3 && (
                  <div className="bg-gray-50 p-3 rounded-2xl flex items-center justify-between text-[11px] font-bold text-gray-400 border border-gray-100/50">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className={`flex-1 py-1 px-1.5 rounded-lg text-center transition-colors ${
                        step === 1 ? "bg-white text-[#2c46a9] shadow-xs" : ""
                      }`}
                    >
                      1. Informasi
                    </button>
                    <div className="text-gray-300 px-1">&rarr;</div>
                    <button
                      type="button"
                      disabled={!fullName || !address}
                      onClick={() => setStep(2)}
                      className={`flex-1 py-1 px-1.5 rounded-lg text-center transition-colors ${
                        step === 2 ? "bg-white text-[#2c46a9] shadow-xs" : "opacity-75"
                      }`}
                    >
                      2. Pembayaran
                    </button>
                    <div className="text-gray-300 px-1">&rarr;</div>
                    <button
                      type="button"
                      disabled
                      className="flex-1 py-1 px-1.5 rounded-lg text-center opacity-50"
                    >
                      3. Konfirmasi
                    </button>
                  </div>
                )}

                {/* WIZARD RENDER */}
                {step === 1 && (
                  <div className="space-y-4">
                    <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#2c46a9]">
                      🚚 Informasi Pengiriman
                    </h3>
                    
                    <div>
                      <label className="block text-[11px] font-bold text-[#020c38] mb-1.5">
                        Nama Lengkap *
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Nama penerima paket garmen"
                        className="w-full text-xs px-4 py-3 border border-gray-100 rounded-xl focus:border-[#2c46a9] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#020c38] mb-1.5">
                        No. WhasApp Penerima *
                      </label>
                      <input
                        type="text"
                        required
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        placeholder="Contoh: 08XXXXXXXXXX"
                        className="w-full text-xs px-4 py-3 border border-gray-100 rounded-xl focus:border-[#2c46a9] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#020c38] mb-1.5">
                        Alamat Lengkap Pengiriman *
                      </label>
                      <textarea
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Nama jalan, Blok, RT/RW, Kecamatan..."
                        className="w-full text-xs px-4 py-3 border border-gray-100 rounded-xl focus:border-[#2c46a9] outline-none min-h-[70px] resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-[#020c38] mb-1.5">
                          Kota / Kabupaten *
                        </label>
                        <input
                          type="text"
                          required
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="Contoh: Jakarta Selatan"
                          className="w-full text-xs px-4 py-3 border border-gray-100 rounded-xl focus:border-[#2c46a9] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#020c38] mb-1.5">
                          Kode Pos *
                        </label>
                        <input
                          type="text"
                          required
                          value={postalCode}
                          onChange={(e) => setPostalCode(e.target.value)}
                          placeholder="Kode pos"
                          className="w-full text-xs px-4 py-3 border border-gray-100 rounded-xl focus:border-[#2c46a9] outline-none"
                        />
                      </div>
                    </div>

                    {/* Shipping carrier option: enforce JNE vs JNT */}
                    <div className="space-y-2 mt-2">
                      <label className="block text-[11px] font-bold text-[#020c38]">
                        Pilih Kurir Pengiriman *
                        <span className="text-[10px] text-gray-400 font-semibold block uppercase">
                          Hanya melayani pengiriman via JNE dan JNT garmen
                        </span>
                      </label>
                      
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <label className={`cursor-pointer p-3 rounded-2xl border-2 flex flex-col gap-1 transition-all ${
                          courier === "JNE" ? "border-[#2c46a9] bg-blue-50/15" : "border-gray-100 hover:border-gray-200"
                        }`}>
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="courier"
                              checked={courier === "JNE"}
                              onChange={() => setCourier("JNE")}
                              className="text-[#2c46a9]"
                            />
                            <span className="font-extrabold text-blue-900">JNE Express</span>
                          </div>
                          <span className="text-[10px] text-gray-400 font-semibold pl-6">
                            Reguler: 2-3 hari
                          </span>
                        </label>

                        <label className={`cursor-pointer p-3 rounded-2xl border-2 flex flex-col gap-1 transition-all ${
                          courier === "JNT" ? "border-[#2c46a9] bg-blue-50/15" : "border-gray-100 hover:border-gray-200"
                        }`}>
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="courier"
                              checked={courier === "JNT"}
                              onChange={() => setCourier("JNT")}
                              className="text-[#2c46a9]"
                            />
                            <span className="font-extrabold text-red-900">J&amp;T Express</span>
                          </div>
                          <span className="text-[10px] text-gray-400 font-semibold pl-6">
                            Kilat: 1-2 hari
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* Operational Notes */}
                    <div>
                      <label className="block text-[11px] font-bold text-[#020c38] mb-1.5">
                        Catatan untuk Penjual (Opsional)
                      </label>
                      <input
                        type="text"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Contoh: Warna sesuai foto, packing aman, bubblewrap"
                        className="w-full text-xs px-4 py-2 border border-gray-100 rounded-xl focus:border-[#2c46a9] outline-none"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleLanjutPembayaran}
                      className="w-full bg-[#2c46a9] hover:bg-[#020c38] text-white font-extrabold text-xs py-3.5 rounded-2xl transition-all text-center cursor-pointer shadow-md shadow-blue-100 mt-4 uppercase tracking-widest"
                    >
                      Lanjut ke Metode Pembayaran &rarr;
                    </button>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#2c46a9]">
                      🏦 Rekening Bank Penjual Langsung
                    </h3>

                    {/* Bank Info highlight box according to instructions */}
                    <div className="bg-slate-50 border border-blue-100 rounded-2xl p-4 space-y-3">
                      <p className="text-[10px] text-gray-500 font-semibold leading-relaxed">
                        💡 Sesuai kebijakan Wearloop, pembayaran disalurkan langsung ke Nomor Rekening Penjual untuk menjamin efisiensi transaksi:
                      </p>

                      <div className="bg-white p-3 rounded-xl border border-blue-100 space-y-2">
                        <div className="flex justify-between text-xs font-bold text-[#020c38]">
                          <span>Metode Pembayaran</span>
                          <span className="text-[#2c46a9]">Transfer Bank (Direct Bank)</span>
                        </div>
                        <div className="border-t border-gray-100 pt-2 grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-[10px] text-gray-400 block font-semibold uppercase">Nama Bank</span>
                            <span className="font-black text-gray-800">{sellerBank.bankName}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-gray-400 block font-semibold uppercase">Toko Mitra</span>
                            <span className="font-black text-purple-600 truncate">{sellerBank.shopName}</span>
                          </div>
                        </div>

                        <div className="border-t border-gray-100 pt-2">
                          <span className="text-[10px] text-gray-400 block font-semibold uppercase">Nomor Rekening Penjual</span>
                          <span className="font-black text-base text-[#2c46a9] block tracking-widest font-mono select-all">
                            {sellerBank.bankAccountNumber}
                          </span>
                        </div>

                        <div className="border-t border-gray-100 pt-2">
                          <span className="text-[10px] text-gray-400 block font-semibold uppercase">Atas Nama Pemilik</span>
                          <span className="font-bold text-gray-800 text-xs block truncate">
                            {sellerBank.bankAccountName}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Upload Rekening Bukti TF */}
                    <div className="bg-slate-50 border border-blue-100 rounded-2xl p-4 space-y-3">
                      <label className="block text-[11px] font-extrabold uppercase tracking-widest text-[#2c46a9]">
                        📸 Upload Bukti Transfer (Wajib) *
                      </label>
                      <p className="text-[10px] text-gray-500 font-semibold leading-relaxed">
                        Silakan unggah foto atau screenshot struk transfer bank Anda. Format .jpg, .jpeg, atau .png.
                      </p>
                      
                      <div className="flex flex-col items-center justify-center border-2 border-dashed border-[#2c46a9]/30 rounded-2xl p-4 bg-white hover:bg-slate-50/50 transition-colors relative">
                        {proofImage ? (
                          <div className="w-full flex flex-col items-center gap-3">
                            <div className="relative w-40 h-40 border border-gray-100 rounded-xl overflow-hidden bg-white">
                              <img 
                                src={proofImage} 
                                alt="Pratinjau Bukti Transfer" 
                                className="w-full h-full object-contain"
                              />
                              <button
                                type="button"
                                onClick={() => setProofImage(null)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-md cursor-pointer flex items-center justify-center w-6 h-6 text-sm font-bold"
                                title="Hapus foto"
                              >
                                &times;
                              </button>
                            </div>
                            <span className="text-[11px] text-emerald-600 font-extrabold flex items-center gap-1">
                              <span className="material-symbols-outlined text-[14px]">check_circle</span>
                              Gambar berhasil dimuat
                            </span>
                          </div>
                        ) : (
                          <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer py-4">
                            <span className="material-symbols-outlined text-3xl text-gray-400 mb-2">
                              cloud_upload
                            </span>
                            <span className="text-xs font-bold text-[#2c46a9] hover:underline">
                              Klik untuk pilih gambar bukti TF
                            </span>
                            <span className="text-[9px] text-gray-400 mt-1">
                              Maksimal ukuran 5MB
                            </span>
                            <input 
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    const base64 = reader.result;
                                    if (typeof base64 !== "string") return;
                                    const img = new Image();
                                    img.src = base64;
                                    img.onload = () => {
                                      const canvas = document.createElement("canvas");
                                      const maxDim = 480;
                                      let w = img.width;
                                      let h = img.height;
                                      if (w > h) {
                                        if (w > maxDim) {
                                          h = Math.round((h * maxDim) / w);
                                          w = maxDim;
                                        }
                                      } else {
                                        if (h > maxDim) {
                                          w = Math.round((w * maxDim) / h);
                                          h = maxDim;
                                        }
                                      }
                                      canvas.width = w;
                                      canvas.height = h;
                                      const ctx = canvas.getContext("2d");
                                      if (ctx) {
                                        ctx.drawImage(img, 0, 0, w, h);
                                        setProofImage(canvas.toDataURL("image/jpeg", 0.6));
                                      } else {
                                        setProofImage(base64);
                                      }
                                    };
                                    img.onerror = () => {
                                      setProofImage(base64);
                                    };
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2 border-t border-gray-50 pt-3">
                      <h4 className="text-[11px] font-black uppercase text-gray-500 tracking-wider">
                        Ringkasan Alamat Transaksi
                      </h4>
                      <p className="text-xs text-gray-600">
                        <strong>Nama Penerima:</strong> {fullName}
                      </p>
                      <p className="text-xs text-gray-600 truncate">
                        <strong>Kirim ke:</strong> {address}, {city}
                      </p>
                      <p className="text-xs text-gray-600">
                        <strong>Kurir:</strong> {courier} ({shippingType})
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="bg-white border-2 border-slate-100 text-gray-500 font-bold text-xs py-3 rounded-2xl text-center cursor-pointer hover:bg-slate-50 transition-all"
                      >
                        &larr; Ubah Alamat
                      </button>
                      <button
                        type="button"
                        onClick={handleBayarSekarang}
                        className="bg-[#2c46a9] hover:bg-green-700 text-white font-extrabold text-xs py-3 rounded-2xl text-center cursor-pointer shadow-md shadow-blue-100 transition-all uppercase tracking-wider"
                      >
                        Pembayaran Selesai &rarr;
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: ORDER CONFIRMED & SLIP STYLE RECEIPT */}
                {step === 3 && placedOrder && (
                  <div className="space-y-6 w-full">
                    {/* Visual Green Tick badge */}
                    <div className="text-center">
                      <div className="w-[72px] h-[72px] bg-emerald-50 border border-emerald-500 rounded-full flex items-center justify-center text-emerald-600 mx-auto animate-bounce shadow-sm mt-3">
                        <span className="material-symbols-outlined text-[36px] font-black">
                          verified
                        </span>
                      </div>
                      <h3 className="text-lg font-black text-[#020c38] mt-3">Pesanan Berhasil Disubmit!</h3>
                      <div className="bg-blue-50 border border-blue-105 rounded-2xl p-4 mt-3 max-w-md mx-auto text-left font-poppins text-xs text-blue-900 leading-relaxed">
                        <div className="flex gap-2">
                          <span className="material-symbols-outlined text-base text-[#2c46a9] shrink-0 font-bold">campaign</span>
                          <p className="font-bold">
                            Hallo <span className="text-[#2c46a9] font-black">{placedOrder.buyerName}</span>, pesanan kamu telah diinformasikan kepada penjual. Berikut adalah detail pesanan kamu:
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* VINTAGE THERMAL PRINT STYLE RECEIPT RECEIPT / STRUK */}
                    <div className="bg-white border-2 border-dashed border-gray-300 rounded-3xl p-6 shadow-md max-w-md mx-auto text-gray-800 font-mono text-left space-y-4">
                      
                      {/* Brand banner Header */}
                      <div className="text-center pb-2 border-b-2 border-dashed border-gray-200">
                        <h4 className="font-extrabold text-lg tracking-wider text-[#020c38] font-poppins">WEARLOOP SLIP KWITANSI</h4>
                        <p className="text-[10px] text-gray-400 font-semibold uppercase font-poppins">GARMEN REVOLUTION & SUSTAINABLE FASHION</p>
                        <p className="text-[10px] text-gray-500 mt-2 font-mono">ID: {placedOrder.id}</p>
                        <p className="text-[9px] text-gray-400 font-mono">TGL: {placedOrder.createdAt} &bull; JAM: {new Date().toLocaleTimeString("id-ID")}</p>
                      </div>

                      {/* Info Status block */}
                      <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 space-y-1">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-gray-500 font-poppins">STATUS:</span>
                          <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[10px] font-black uppercase border border-amber-200 font-poppins">
                            Menunggu Di Proses Seller
                          </span>
                        </div>
                        <div className="border-t border-gray-200/50 my-1 pt-1">
                          <span className="block text-[10px] text-[#020c38] font-bold font-poppins leading-normal">
                            📝 Note: jika barang sudah di proses akan di konfirmasi oleh penjual melalui wa.
                          </span>
                        </div>
                      </div>

                      {/* Items details */}
                      <div className="space-y-2 text-xs pt-1 font-mono">
                        <p className="font-extrabold pb-1 border-b border-gray-100 uppercase">DAFTAR ITEM:</p>
                        {placedOrder.items.map((i, index) => (
                          <div key={index} className="flex justify-between items-start gap-4">
                            <span className="truncate flex-1">
                              {i.product.name} (S-{i.product.size}) x{i.quantity}
                            </span>
                            <span className="font-bold shrink-0 font-mono">
                              Rp {(i.product.price * i.quantity).toLocaleString("id-ID")}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Financial statistics calculations */}
                      <div className="border-t border-dashed border-gray-200 pt-3 space-y-1 text-xs font-mono">
                        <div className="flex justify-between">
                          <span>SUBTOTAL:</span>
                          <span>Rp {subtotal.toLocaleString("id-ID")}</span>
                        </div>
                        <div className="flex justify-between font-mono">
                          <span>ONGKOS KIRIM ({placedOrder.courier}):</span>
                          <span>Rp {placedOrder.shippingCost.toLocaleString("id-ID")}</span>
                        </div>
                        <div className="flex justify-between font-bold text-base pt-2 text-[#020c38] border-t border-gray-100 font-mono">
                          <span>TOTAL TRANSAKSI:</span>
                          <span>Rp {placedOrder.totalPrice.toLocaleString("id-ID")}</span>
                        </div>
                      </div>

                      {/* Transfer recipient banking instructions */}
                      <div className="border-t border-dashed border-gray-200 pt-3 space-y-1.5 text-xs font-mono">
                        <p className="font-extrabold text-[#020c38] font-poppins text-[11px]">BANK TUJUAN TRANSFER PENJUAL:</p>
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-gray-150 space-y-1">
                          <div>
                            <span className="text-[9px] text-gray-400 block font-bold">REKENING TOKO:</span>
                            <span className="font-black text-gray-700 font-poppins">{placedOrder.sellerBankDetails.shopName}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-gray-400 block font-bold">BANK PENERIMA:</span>
                            <span className="font-black text-gray-800">{placedOrder.sellerBankDetails.bankName}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-gray-400 block font-bold">NOMOR REKENING:</span>
                            <span className="font-black text-blue-900 font-mono tracking-wide underline select-all">{placedOrder.sellerBankDetails.bankAccountNumber}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-gray-400 block font-bold">PEMILIK REKENING:</span>
                            <span className="font-extrabold text-gray-700">{placedOrder.sellerBankDetails.bankAccountName}</span>
                          </div>
                        </div>
                      </div>

                      {/* Uploaded image preview */}
                      {placedOrder.paymentProof && (
                        <div className="border-t border-dashed border-gray-200 pt-3 space-y-2 text-xs">
                          <p className="font-extrabold text-emerald-700 flex items-center gap-1 font-poppins">
                            <span className="material-symbols-outlined text-sm font-bold">check_circle</span>
                            LAMPIRAN BUKTI TRANSFER:
                          </p>
                          <div className="w-full h-36 border border-gray-200 rounded-xl overflow-hidden bg-white flex items-center justify-center p-1">
                            <img 
                              src={placedOrder.paymentProof} 
                              alt="Bukti Transfer Uploaded" 
                              className="max-h-full max-w-full object-contain"
                            />
                          </div>
                        </div>
                      )}

                      {/* Footer decorative barcodes placeholder */}
                      <div className="text-center pt-3 border-t border-dashed border-gray-200 space-y-2 font-mono">
                        <div className="flex flex-col items-center justify-center gap-0.5">
                          <div className="flex gap-0.5 text-gray-800 font-bold overflow-hidden h-6 select-none leading-none items-center opacity-70">
                            |||| | || |||| | | |||| || |||| | |||
                          </div>
                          <span className="text-[9px] text-gray-400 select-none">CODE-93_SECURE_PAYMENT</span>
                        </div>
                        <p className="text-[9px] text-center text-gray-450 uppercase leading-relaxed font-poppins">
                          KEEP CLOTHES IN LOOP &bull; SAVE THE WORLD <br />
                          TERIMA KASIH TELAH BERBELANJA DI MITRA WEARLOOP
                        </p>
                      </div>

                    </div>

                    <div className="text-center pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          onClearCart();
                          setActivePage("beranda");
                        }}
                        className="bg-[#020c38] hover:bg-[#2c46a9] text-white font-extrabold text-xs px-12 py-4 rounded-2xl transition-all shadow-md shadow-blue-100 uppercase tracking-widest leading-none font-poppins cursor-pointer animate-pulse"
                      >
                        Selesai &amp; Kembali ke Beranda
                      </button>
                    </div>
                  </div>
                )}

                {/* PRICING STATISTICS SUMMARY (Only if step !== 3) */}
                {step !== 3 && (
                  <div className="bg-[#fcfdfd] border border-gray-50 rounded-2xl p-4 md:p-5 text-xs text-left space-y-3 shadow-xs">
                    <h4 className="font-extrabold text-[#020c38] uppercase tracking-wider text-[11px]">
                      Ringkasan Belanja ({checkedItems.length} Produk)
                    </h4>
                    
                    <div className="divide-y divide-gray-100 space-y-2.5">
                      <div className="flex justify-between items-center text-gray-500 font-bold">
                        <span>Subtotal Item</span>
                        <span className="text-gray-900 font-black">
                          Rp {subtotal.toLocaleString("id-ID")}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center text-gray-500 font-bold pt-2.5">
                        <span>Ongkos Kirim ({courier})</span>
                        <span className={shippingCost === 0 ? "text-green-600 font-bold uppercase text-[10px]" : "text-gray-900 font-black"}>
                          {shippingCost === 0 ? "Gratis" : `Rp ${shippingCost.toLocaleString("id-ID")}`}
                        </span>
                      </div>

                      <div className="flex justify-between items-center pt-3 text-sm font-bold text-[#020c38]">
                        <span>Total Pembayaran</span>
                        <span className="text-base font-black text-[#2c46a9] font-mono">
                          Rp {totalPembayaran.toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
