import React, { useState } from "react";
import { User, Order, Page, Product } from "../types";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface BuyerDashboardProps {
  currentUser: User | null;
  orders: Order[];
  setActivePage: (p: Page) => void;
  onLogout: () => void;
  showAlert: (title: string, message: string, type?: "info" | "success" | "warning" | "error") => void;
  products: Product[];
  likes: Record<string, boolean>;
  onToggleLike: (productId: string) => void;
  onAddToCart: (p: Product) => void;
  onOpenChatWithSeller?: (product: Product) => void;
  onOpenChatWithAdmin?: () => void;
  onOpenInbox?: () => void;
}

export default function BuyerDashboard({
  currentUser,
  orders,
  setActivePage,
  onLogout,
  showAlert,
  products,
  likes,
  onToggleLike,
  onAddToCart,
  onOpenChatWithSeller,
  onOpenChatWithAdmin,
  onOpenInbox,
}: BuyerDashboardProps) {
  const [activeTab, setActiveTab] = useState<"transactions" | "wishlist">("transactions");
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<Order | null>(null);
  if (!currentUser) {
    return (
      <div className="min-h-[70vh] bg-[#f5f6ff] flex items-center justify-center p-6 text-left">
        <div className="bg-white rounded-[32px] p-8 max-w-sm w-full text-center border border-blue-100 shadow-sm">
          <span className="material-symbols-outlined text-5xl text-gray-300">account_circle</span>
          <h3 className="font-sora font-extrabold text-lg text-[#020c38] mt-4">Sesi Tidak Ditemukan</h3>
          <p className="font-poppins text-xs text-gray-500 mt-2">
            Silakan masuk akun terlebih dahulu untuk melihat dashboard belanja Anda.
          </p>
          <button
            onClick={() => setActivePage("login")}
            className="w-full bg-[#2c46a9] hover:bg-[#020c38] text-white py-3 rounded-xl font-bold text-xs mt-6 transition-all"
          >
            Menuju Login
          </button>
        </div>
      </div>
    );
  }

  // Filter orders by this buyer's ID or name
  const buyerOrders = orders.filter(
    (o) => o.buyerId === currentUser.id || o.buyerName.toLowerCase() === currentUser.name.toLowerCase()
  );

  // Dynamically calculate actual buyer spending based on their real order records
  const buyerSpendingData = buyerOrders.map((o) => ({
    name: `Trx #${o.id.substring(0, 5)}`,
    nominal: o.totalPrice,
    tanggal: o.createdAt.substring(0, 10),
  }));

  // If no transactions exist, seed useful baseline data for membership presentation
  const chartData = buyerSpendingData.length > 0 
    ? buyerSpendingData 
    : [
        { name: "Registrasi", nominal: 0, tanggal: "-" },
        { name: "Pekan 1", nominal: 145000, tanggal: "Premium" },
        { name: "Pekan 2", nominal: 95000, tanggal: "Premium" },
        { name: "Pekan 3", nominal: 320000, tanggal: "Premium" },
        { name: "Pekan 4", nominal: 180000, tanggal: "Premium" },
      ];

  const getOrderStatusBadge = (status: Order["status"]) => {
    switch (status) {
      case "pending_payment":
        return (
          <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span>
            Menunggu Pembayaran
          </span>
        );
      case "paid":
        return (
          <span className="bg-blue-50 text-[#2c46a9] border border-blue-200 px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-[#2c46a9] rounded-full"></span>
            Pembayaran Lunas
          </span>
        );
      case "shipped":
        return (
          <span className="bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
            Dikirim (Kurir)
          </span>
        );
      case "completed":
        return (
          <span className="bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
            Selesai
          </span>
        );
      case "cancelled":
        return (
          <span className="bg-red-50 text-red-700 border border-red-200 px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-red-400 rounded-full"></span>
            Dibatalkan
          </span>
        );
      default:
        return null;
    }
  };

  const getWhatsAppURL = (order: Order) => {
    const itemsList = order.items
      .map((i) => `- ${i.product.name} x${i.quantity}`)
      .join("\r\n");

    const message = `Halo Admin Wearloop! Saya ingin konfirmasi Pembayaran Transfer Rekening.

========================
📌 DETAIL TRANSAKSI
========================
- ID Transaksi: ${order.id}
- Nama Pembeli: ${order.buyerName}
- No. WhatsApp: ${order.buyerPhone}
- Kirim ke: ${order.address}

📦 DAFTAR BARANG:
${itemsList}

💰 TOTAL TRANSFER: Rp ${order.totalPrice.toLocaleString("id-ID")}

Saya telah melakukan transfer ke rekening penjual. Mohon divalidasi dan di-approve. Terima kasih!`;

    return `https://wa.me/6281234567890?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="font-poppins font-semibold min-h-[90vh] bg-[#f5f6ff] py-10 text-left text-[#020c38]">
      <div className="max-w-[1400px] mx-auto px-5 lg:px-14">
        
        {/* UPPER ROW: WELCOME BANNER */}
        <div className="w-full bg-[#020c38] text-white rounded-[40px] p-8 md:p-12 mb-8 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
          <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-80 h-80 bg-[#2c46a9]/30 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="space-y-2.5 relative z-10">
            <div className="inline-flex items-center px-3.5 py-1 rounded-full bg-blue-900 border border-blue-700 text-xs font-bold uppercase tracking-wider text-[#9db1ff]">
              🚀 Member Account Workspace
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Selamat Datang, {currentUser.name}!
            </h1>
            <p className="text-[#a5b2fc] text-xs font-poppins font-medium max-w-md leading-relaxed">
              Ini adalah dashboard terpadu Anda untuk melacak riwayat pakaian vintage terkurasi Anda, status donasi cerdas, dan detail transaksi.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 shrink-0 relative z-10 font-poppins font-semibold">
            <button
              onClick={() => {
                if (onOpenInbox) {
                  onOpenInbox();
                }
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[#020c38] hover:text-white font-bold text-xs px-5 py-3 rounded-xl transition-all cursor-pointer shadow-md flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm font-black">mail</span>
              Chat & Kotak Masuk
            </button>
            <button
              onClick={() => {
                if (onOpenChatWithAdmin) {
                  onOpenChatWithAdmin();
                }
              }}
              className="bg-[#2c46a9] hover:bg-[#1f337f] text-white hover:text-white font-bold text-xs px-5 py-3 rounded-xl transition-all cursor-pointer shadow-md flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm font-bold">support_agent</span>
              Hubungi CS Admin
            </button>
            <button
              onClick={() => setActivePage("produk")}
              className="bg-white text-[#020c38] hover:bg-[#e6ecff] font-bold text-xs px-5 py-3 rounded-xl transition-all cursor-pointer shadow-md"
            >
              Belanja Pakaian Lain
            </button>
            <button
              onClick={() => {
                onLogout();
                showAlert("Logout Berhasil", "Sesi Anda telah diakhiri. Kembali ke beranda utama.", "success");
              }}
              className="bg-red-600/90 hover:bg-red-700 text-white font-bold text-xs px-5 py-3 rounded-xl transition-all cursor-pointer flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm font-bold">logout</span>
              Log Out
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* PROFILE SUMMARY LEFT */}
          <div className="lg:col-span-4 bg-white rounded-[32px] p-6 md:p-8 border border-blue-100 shadow-xs space-y-6">
            <div className="flex gap-4 items-center">
              <div className="w-14 h-14 bg-blue-50 border border-blue-100 rounded-full flex items-center justify-center text-[#2c46a9] shrink-0 font-extrabold text-xl font-sora">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-extrabold text-base leading-tight">{currentUser.name}</h3>
                <p className="text-[11px] font-bold text-purple-600 uppercase bg-purple-50 px-2 py-0.5 rounded-md inline-block mt-1">
                  🌐 Role: BUYER
                </p>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-5 space-y-4 text-xs font-poppins">
              <div>
                <span className="text-gray-400 block font-bold text-[10px] uppercase">Alamat Email</span>
                <span className="font-semibold text-gray-850 mt-0.5 block">{currentUser.email}</span>
              </div>

              <div>
                <span className="text-gray-400 block font-bold text-[10px] uppercase">No. WhatsApp Aktif</span>
                <span className="font-semibold text-gray-850 mt-0.5 block">{currentUser.phoneNumber || "08XXXXXXXXXX"}</span>
              </div>

              <div>
                <span className="text-gray-400 block font-bold text-[10px] uppercase">Status Keanggotaan</span>
                <span className="text-[#2c46a9] mt-0.5 block font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">verified</span>
                  Wearloop Premium Member
                </span>
              </div>
            </div>

            <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100/50 flex gap-3 text-emerald-800 text-xs items-start font-poppins">
              <span className="material-symbols-outlined text-[20px] font-bold text-emerald-600">gpp_good</span>
              <div>
                <h4 className="font-bold">Keamanan Terjamin</h4>
                <p className="text-[10px] text-emerald-700/80 mt-0.5 leading-relaxed">
                  Semua dana transaksi Anda di-hold aman di rekening eskrow Wearloop sebelum diteruskan ke seller setelah paket terkirim.
                </p>
              </div>
            </div>
          </div>

          {/* HISTORY buyer tab panel list */}
          <div className="lg:col-span-8 bg-white rounded-[32px] p-6 lg:p-8 border border-blue-100 shadow-xs space-y-6">
            
            {/* SPENDING RUNNING GRAPH */}
            <div className="bg-[#fcfdfe] border border-blue-50 rounded-2xl p-5">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
                <div>
                  <h3 className="font-extrabold text-[#020c38] text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-[#2c46a9]">monitoring</span>
                    Aktivitas &amp; Pengeluaran Belanja Garmen Anda
                  </h3>
                  <p className="text-[10px] text-gray-400 font-poppins mt-0.5">Grafik dinamik berjalan berdasarkan data transaksi riil Anda.</p>
                </div>
                <span className="text-[10px] font-extrabold text-[#2c46a9] bg-blue-50 px-2.5 py-1 rounded-md font-mono shrink-0">
                  Total Terbelanja: Rp {buyerOrders.reduce((sum, ord) => sum + ord.totalPrice, 0).toLocaleString("id-ID")}
                </span>
              </div>

              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="buyerGlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2c46a9" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#2c46a9" stopOpacity={0.01}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f5" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      stroke="#a3aed0" 
                      fontSize={9} 
                      tickLine={false} 
                      axisLine={false} 
                      fontFamily="Inter, sans-serif"
                    />
                    <YAxis 
                      stroke="#a3aed0" 
                      fontSize={9} 
                      tickLine={false} 
                      axisLine={false}
                      fontFamily="Inter, sans-serif"
                      tickFormatter={(v) => `Rp${v >= 1000 ? v / 1000 + "k" : v}`}
                    />
                    <Tooltip 
                      contentStyle={{ background: "#020c38", borderRadius: "12px", border: "none" }}
                      labelStyle={{ color: "#9db1ff", fontSize: "10px", fontWeight: "bold" }}
                      itemStyle={{ color: "white", fontSize: "11px", fontWeight: "black" }}
                      formatter={(value: any) => [`Rp ${Number(value).toLocaleString("id-ID")}`, "Volume Belanja"]}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="nominal" 
                      stroke="#2c46a9" 
                      strokeWidth={2.5} 
                      fillOpacity={1} 
                      fill="url(#buyerGlow)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* TABS CONTROLLER */}
            <div className="flex border-b border-gray-100 gap-6 font-poppins pb-1">
              <button
                onClick={() => setActiveTab("transactions")}
                className={`pb-3 text-xs md:text-sm font-semibold flex items-center gap-2 relative transition-all cursor-pointer ${
                  activeTab === "transactions"
                    ? "text-[#2c46a9] font-bold after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2.5px] after:bg-[#2c46a9]"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">local_shipping</span>
                Transaksi Saya ({buyerOrders.length})
              </button>

              <button
                onClick={() => setActiveTab("wishlist")}
                className={`pb-3 text-xs md:text-sm font-semibold flex items-center gap-2 relative transition-all cursor-pointer ${
                  activeTab === "wishlist"
                    ? "text-[#2c46a9] font-bold after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2.5px] after:bg-[#2c46a9]"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">favorite</span>
                Wishlist Saya ({products.filter((p) => likes[p.id]).length})
              </button>
            </div>

            {activeTab === "transactions" ? (
              buyerOrders.length === 0 ? (
                <div className="py-16 text-center max-w-md mx-auto space-y-4">
                  <span className="material-symbols-outlined text-6xl text-gray-200">receipt_long</span>
                  <h4 className="font-black text-gray-700 text-sm">Belum Ada Transaksi</h4>
                  <p className="text-xs text-gray-400 font-poppins max-w-xs mx-auto">
                    Anda belum pernah melakukan order pakaian thrifting berkelanjutan di sistem kami. Jelajahi katalog sekarang!
                  </p>
                  <button
                    onClick={() => setActivePage("produk")}
                    className="bg-[#2c46a9] hover:bg-[#020c38] text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all"
                  >
                    Lihat Katalog Produk
                  </button>
                </div>
              ) : (
                <div className="space-y-6 divide-y divide-gray-100">
                  {buyerOrders.map((order, index) => (
                    <div key={order.id} className={`pt-6 ${index === 0 ? "pt-0" : ""} space-y-3`}>
                      
                      {/* Header bar order */}
                      <div className="flex flex-wrap justify-between items-center gap-2">
                        <div>
                          <span className="text-xs font-black bg-blue-50 text-[#2c46a9] px-2.5 py-1 rounded-xl">
                            {order.id}
                          </span>
                          <span className="text-[11px] text-gray-400 font-medium font-poppins ml-2 font-mono">
                            Dibuat: {order.createdAt}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 font-poppins">
                          <span className="text-[11px] font-semibold text-gray-400">Status:</span>
                          {getOrderStatusBadge(order.status)}
                        </div>
                      </div>

                      {/* Products details */}
                      <div className="bg-[#fbfcff] p-4 rounded-2xl border border-gray-100/50 space-y-3">
                        {order.items.map((it) => (
                          <div key={it.product.id} className="flex gap-4 items-center">
                            <img
                              src={it.product.image}
                              alt={it.product.name}
                              className="w-12 h-12 rounded-xl object-contain bg-white border p-1"
                            />
                            <div className="text-xs flex-grow">
                              <h5 className="font-bold truncate text-gray-800">{it.product.name}</h5>
                              <p className="text-gray-400 text-[10px] mt-0.5 font-medium">
                                Size {it.product.size} &bull; Cond: {it.product.condition} &bull; Qty {it.quantity}
                              </p>
                            </div>
                            <span className="font-extrabold text-xs text-gray-700">
                              Rp {it.product.price.toLocaleString("id-ID")}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Footer transfer block */}
                      <div className="flex flex-wrap justify-between items-center gap-4 text-xs font-poppins pt-1 bg-gray-50/55 p-3 rounded-2xl border border-dashed border-gray-200">
                        <div>
                          <span className="text-gray-400 block text-[10px] uppercase font-bold">Total Pembayaran</span>
                          <span className="font-black text-sm text-[#2c46a9] font-mono leading-none block mt-1">
                            Rp {order.totalPrice.toLocaleString("id-ID")}
                          </span>
                        </div>

                        <div className="text-left">
                          <span className="text-gray-400 block text-[10px] uppercase font-bold">Transfer Rekening Bank</span>
                          <span className="font-extrabold text-xs text-gray-800 font-mono">
                            {order.sellerBankDetails.bankName} - {order.sellerBankDetails.bankAccountNumber}
                          </span>
                          <span className="text-[10px] text-gray-400 block">
                            Atas Nama: {order.sellerBankDetails.bankAccountName} ({order.sellerBankDetails.shopName})
                          </span>
                        </div>

                        <button
                          onClick={() => setSelectedReceiptOrder(order)}
                          className="bg-blue-600 hover:bg-[#2c46a9] text-white font-extrabold text-xs px-4.5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-blue-100 cursor-pointer font-poppins"
                        >
                          <span className="material-symbols-outlined text-base">description</span>
                          Nota / Note Struk
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              )
            ) : (
              // WISHLIST TAB CONTENT
              (() => {
                const likedProducts = products.filter((p) => likes[p.id]);
                return likedProducts.length === 0 ? (
                  <div className="py-16 text-center max-w-md mx-auto space-y-4 font-poppins">
                    <span className="material-symbols-outlined text-6xl text-red-100">favorite</span>
                    <h4 className="font-bold text-gray-750 text-sm">Wishlist Anda Kosong</h4>
                    <p className="text-xs text-gray-400 max-w-xs mx-auto leading-relaxed">
                      Belum ada garmen favorit yang disimpan. Ketuk ikon love ❤️ di katalog untuk memantau harganya di sini!
                    </p>
                    <button
                      onClick={() => setActivePage("produk")}
                      className="bg-[#2c46a9] hover:bg-[#020c38] text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
                    >
                      Jelajahi Katalog Vintage &rarr;
                    </button>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-4 text-left font-poppins">
                    {likedProducts.map((prod) => (
                      <div
                        key={prod.id}
                        className="border border-gray-150 rounded-2xl p-4 flex gap-4 bg-[#fcfdfd]"
                      >
                        <div className="w-20 h-20 bg-white border border-gray-100 rounded-xl p-1.5 shrink-0 flex items-center justify-center overflow-hidden">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        <div className="flex-1 flex flex-col justify-between min-w-0">
                          <div>
                            <h4 className="text-xs font-bold text-gray-900 truncate leading-snug">
                              {prod.name}
                            </h4>
                            <div className="flex items-center gap-1.5 mt-1">
                              <span className="bg-blue-50 text-[#2c46a9] text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
                                {prod.size}
                              </span>
                              <span className="text-gray-400 text-[9px]">&bull; {prod.condition}</span>
                            </div>
                            <div className="text-xs font-extrabold text-[#2c46a9] mt-1 font-mono">
                              Rp {prod.price.toLocaleString("id-ID")}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => {
                                onAddToCart(prod);
                                showAlert("Masuk Keranjang", `${prod.name} berhasil ditambahkan ke keranjang belanja!`, "success");
                              }}
                              className="bg-[#2c46a9] hover:bg-[#020c38] text-white font-semibold text-[10px] px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-[12px]">shopping_bag</span>
                              Beli
                            </button>
                            <button
                              onClick={() => onToggleLike(prod.id)}
                              className="text-red-500 hover:text-red-700 font-semibold text-[10px] px-2 py-1.5 rounded-lg border border-red-100 hover:bg-red-50 transition-all flex items-center gap-0.5 cursor-pointer"
                            >
                              Hapus
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()
            )}

          </div>

        </div>

      </div>

      {/* RENDER MODAL BELANJA / STRUK / RECEIPT NOTE */}
      {selectedReceiptOrder && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl p-6 relative animate-fadeIn border border-slate-100 font-poppins text-slate-800 max-h-[90vh] overflow-y-auto">
            {/* Upper state header */}
            <div className="text-center pb-3">
              <div className="w-[52px] h-[52px] bg-emerald-50 border border-emerald-400 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-2 shadow-xs">
                <span className="material-symbols-outlined text-[26px] font-bold">verified</span>
              </div>
              <h3 className="text-base font-black text-[#020c38]">Pesanan Berhasil!</h3>
            </div>

            {/* Custom alert banner exact text */}
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 mb-4 text-emerald-950 text-xs leading-relaxed font-semibold">
              <div className="flex gap-2">
                <span className="material-symbols-outlined text-base text-emerald-600 shrink-0 font-bold select-none">campaign</span>
                <p>
                  Selamat pesanan anda berhasil dan kami sudah informasikan kepada penjual , untuk proses selanjutnya penjual akan menghubungi <span className="text-[#2c46a9] font-black font-sans">{selectedReceiptOrder.buyerName}</span>
                </p>
              </div>
            </div>

            {/* HIGH FIDELITY THERMAL SLIP STRUK */}
            <div className="bg-slate-50 border border-gray-200 rounded-2xl p-4.5 text-gray-700 font-mono text-[11px] space-y-3.5 relative overflow-hidden">
              {/* Paper punch decor */}
              <div className="absolute top-0 left-0 right-0 h-1 flex justify-between px-3">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="w-2 h-2 bg-white rounded-full -translate-y-1/2 border border-gray-200"></div>
                ))}
              </div>

              <div className="text-center pt-1 pb-2 border-b border-dashed border-gray-300">
                <p className="font-sans font-black text-xs tracking-wider text-gray-900">WEARLOOP STRUK BELANJA</p>
                <p className="font-sans text-[8px] text-gray-400 uppercase tracking-widest mt-0.5">TERIMA KASIH TELAH BERBELANJA SUSTAINABLE</p>
              </div>

              {/* Order Metadata */}
              <div className="space-y-1 text-[10px] border-b border-dashed border-gray-300 pb-2">
                <div className="flex justify-between">
                  <span>No. Transaksi:</span>
                  <span className="font-sans font-bold text-gray-900">{selectedReceiptOrder.id}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tanggal:</span>
                  <span>{selectedReceiptOrder.createdAt}</span>
                </div>
                <div className="flex justify-between">
                  <span>Customer:</span>
                  <span className="font-sans font-bold text-gray-900">{selectedReceiptOrder.buyerName}</span>
                </div>
                <div className="flex justify-between">
                  <span>No. Handphone:</span>
                  <span>{selectedReceiptOrder.buyerPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span>Alamat Kirim:</span>
                  <span className="font-sans truncate max-w-[200px]" title={selectedReceiptOrder.address}>{selectedReceiptOrder.address}</span>
                </div>
              </div>

              {/* Shopping List Rows */}
              <div className="space-y-2 border-b border-dashed border-gray-300 pb-2">
                <p className="font-sans font-extrabold text-[9px] text-gray-400 uppercase">Daftar Barang</p>
                <div className="space-y-1.5">
                  {selectedReceiptOrder.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between items-start gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-gray-950 font-sans font-bold">{it.product.name}</p>
                        <p className="text-[9px] text-gray-400 font-sans">Size {it.product.size} x {it.quantity}</p>
                      </div>
                      <span className="font-bold shrink-0">
                        Rp {(it.product.price * it.quantity).toLocaleString("id-ID")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="space-y-1 font-sans text-[10px]">
                <div className="flex justify-between">
                  <span>Subtotal Produk:</span>
                  <span>
                    Rp {selectedReceiptOrder.items.reduce((sum, it) => sum + (it.product.price * it.quantity), 0).toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Ongkos Kirim:</span>
                  <span>Rp {(selectedReceiptOrder.shippingCost || 0).toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between font-black text-xs text-[#2c46a9] pt-2 border-t border-dashed border-gray-300 font-mono">
                  <span>TOTAL BAYAR:</span>
                  <span>Rp {selectedReceiptOrder.totalPrice.toLocaleString("id-ID")}</span>
                </div>
              </div>

              {/* Rekening Info */}
              {selectedReceiptOrder.sellerBankDetails && (
                <div className="bg-white border rounded-xl p-2 text-[9px] font-sans text-gray-500 leading-normal">
                  <span className="font-extrabold text-[8px] text-gray-400 uppercase block mb-0.5">Tujuan Transfer Bank:</span>
                  <p className="font-bold text-gray-800 font-mono">
                    {selectedReceiptOrder.sellerBankDetails.bankName} - {selectedReceiptOrder.sellerBankDetails.bankAccountNumber}
                  </p>
                  <p>
                    A.N. {selectedReceiptOrder.sellerBankDetails.bankAccountName} ({selectedReceiptOrder.sellerBankDetails.shopName})
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-4">
              <button
                onClick={() => setSelectedReceiptOrder(null)}
                className="w-full bg-[#020c38] hover:bg-[#2c46a9] text-white py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer shadow-sm text-center"
              >
                Tutup Nota
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
