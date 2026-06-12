import React, { useState, useMemo } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from "recharts";
import { 
  Product, User, Order, Page, ProductFeedback, ChatRoom, CategoryData 
} from "../types";

interface AdminDashboardProps {
  currentUser: User | null;
  products: Product[];
  orders: Order[];
  registeredUsers: User[];
  onUpdateProductsList: React.Dispatch<React.SetStateAction<Product[]>>;
  onUpdateOrdersList: React.Dispatch<React.SetStateAction<Order[]>>;
  onUpdateUsersList: React.Dispatch<React.SetStateAction<User[]>>;
  setActivePage: (p: Page) => void;
  allChatRooms?: ChatRoom[];
  onSendMessage?: (roomId: string, messageText: string, customSenderId?: string, customSenderName?: string) => void;
  reviews: ProductFeedback[];
  onUpdateReviews: React.Dispatch<React.SetStateAction<ProductFeedback[]>>;
  categoriesData?: CategoryData[];
  onUpdateCategories?: React.Dispatch<React.SetStateAction<CategoryData[]>>;
  showAlert?: (
    title: string,
    message: string,
    type?: "info" | "warning" | "success" | "error",
    onConfirm?: () => void,
    confirmLabel?: string,
    cancelLabel?: string
  ) => void;
}

interface SimulatedChat {
  id: string;
  senderName: string;
  senderRole: string;
  avatar: string;
  lastMessage: string;
  time: string;
  messages: { sender: "user" | "admin"; text: string; time: string }[];
}

export default function AdminDashboard({
  currentUser,
  products,
  orders,
  registeredUsers,
  onUpdateProductsList,
  onUpdateOrdersList,
  onUpdateUsersList,
  setActivePage,
  allChatRooms = [],
  onSendMessage,
  reviews,
  onUpdateReviews,
  categoriesData = [],
  onUpdateCategories,
  showAlert,
}: AdminDashboardProps) {
  // Tabs: "overview", "users", "products", "categories", "chats", "reports", "ratings"
  const [activeTab, setActiveTab] = useState<
    "overview" | "users" | "products" | "categories" | "chats" | "reports" | "ratings"
  >("overview");

  const [notif, setNotif] = useState<string | null>(null);

  // Search filter inside submenus
  const [globalSearch, setGlobalSearch] = useState("");

  const showNotif = (msg: string) => {
    setNotif(msg);
    setTimeout(() => setNotif(null), 4000);
  };

  const categoriesList = categoriesData && categoriesData.length > 0 ? categoriesData : [
    { name: "Shirt", count: "120+", image: "https://i.postimg.cc/BnDDdvSM/hai-(17).png" },
    { name: "Hoodie", count: "98+", image: "https://i.postimg.cc/hj0kDxn0/hai-(18).png" },
    { name: "Jacket", count: "150+", image: "https://i.postimg.cc/76pKyZGG/hai-(19).png" },
    { name: "Pants", count: "110+", image: "https://i.postimg.cc/y8gWD6kR/hai-(20).png" },
    { name: "Sneakers", count: "90+", image: "https://i.postimg.cc/Pxxqktsk/hai-(22).png" },
    { name: "Accessories", count: "70+", image: "https://i.postimg.cc/J0DSbFJJ/hai-(21).png" }
  ];

  const categories = categoriesList.map((c) => c.name);
  const [newCatInput, setNewCatInput] = useState("");
  const [newCatPhoto, setNewCatPhoto] = useState("https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=600&auto=format&fit=crop");

  const [brands, setBrands] = useState<string[]>([
    "Nike", "Levi's", "Adidas", "Zara", "Puma", "Uniqlo"
  ]);
  const [newBrandInput, setNewBrandInput] = useState("");

  // Product Add Form States
  const [prodName, setProdName] = useState("");
  const [prodBrand, setProdBrand] = useState("Nike");
  const [prodPrice, setProdPrice] = useState("");
  const [prodCategory, setProdCategory] = useState("T-Shirt");
  const [prodSize, setProdSize] = useState("L");
  const [prodCondition, setProdCondition] = useState("Like New");
  const [prodColor, setProdColor] = useState("Black");
  const [prodImage, setProdImage] = useState("https://i.postimg.cc/qvrHK53T/hai-(10).png");
  const [prodDesc, setProdDesc] = useState("Official curated premium garment from WearLoop HQ.");
  const [washPhoto, setWashPhoto] = useState("https://images.unsplash.com/photo-1545173168-9f1947eebd01?q=80&w=600&auto=format&fit=crop");
  const [perfumePhoto, setPerfumePhoto] = useState("https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=600&auto=format&fit=crop");
  const [fullPhoto, setFullPhoto] = useState("https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600&auto=format&fit=crop");
  const [detailPhoto, setDetailPhoto] = useState("https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=600&auto=format&fit=crop");

  // Helper to read and compress image before setting state
  const compressAndSetImage = (file: File, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      if (typeof base64 !== "string") return;
      
      const img = new Image();
      img.src = base64;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxDim = 480; // Small and crisp
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
          const compressed = canvas.toDataURL("image/jpeg", 0.65);
          callback(compressed);
        } else {
          callback(base64);
        }
      };
      img.onerror = () => {
        callback(base64);
      };
    };
    reader.readAsDataURL(file);
  };

  // Reviews & Rating are now managed via global props (reviews & onUpdateReviews) as requested

  // Chat Global Real-Time states for Administrator Support
  const adminRooms = allChatRooms.filter((r) => r.sellerId === "admin");
  const [selectedChatId, setSelectedChatId] = useState<string>("room_buyer_admin_seed");
  const [replyInput, setReplyInput] = useState("");

  const activeSelectedId = adminRooms.some((r) => r.id === selectedChatId)
    ? selectedChatId
    : (adminRooms[0]?.id || "");
  const activeChatRoom = adminRooms.find((r) => r.id === activeSelectedId);

  // Total buyers, sellers, system stats
  const totalBuyers = registeredUsers.filter((u) => u.role === "buyer").length;
  const totalSellers = registeredUsers.filter((u) => u.role === "seller").length;
  const approvedSellers = registeredUsers.filter((u) => u.role === "seller" && u.isApproved).length;
  const pendingSellers = registeredUsers.filter((u) => u.role === "seller" && !u.isApproved).length;

  const totalProducts = products.length;
  const pendingProductCuration = products.filter((p) => !p.isApproved && p.status === "posting").length;
  
  // Sales Total gross merchandizing value from orders
  const grossSalesVolume = orders
    .filter((o) => o.status === "paid" || o.status === "shipped" || o.status === "completed" || o.status === "packing" || o.status === "with_courier" || o.status === "in_transit")
    .reduce((acc, curr) => acc + curr.totalPrice, 0);

  const totalOrdersCount = orders.length;

  // Render Charts data source dynamically
  const mainSalesData = useMemo(() => {
    return [
      { name: "Senin", penjualan: grossSalesVolume * 0.12 },
      { name: "Selasa", penjualan: grossSalesVolume * 0.15 },
      { name: "Rabu", penjualan: grossSalesVolume * 0.08 },
      { name: "Kamis", penjualan: grossSalesVolume * 0.22 },
      { name: "Jumat", penjualan: grossSalesVolume * 0.18 },
      { name: "Sabtu", penjualan: grossSalesVolume * 0.25 },
      { name: "Minggu", penjualan: grossSalesVolume },
    ];
  }, [grossSalesVolume]);

  const sellerSalesReport = useMemo(() => {
    const sellers = registeredUsers.filter(u => u.role === "seller");
    return sellers.map(seller => {
      // Find orders that contain products matching this sellerId
      const sellerOrders = orders.filter(ord => 
        ord.items.some(item => item.product.sellerId === seller.id)
      );
      // Sum the total price for this seller's products only
      const totalAmount = sellerOrders.reduce((sum, ord) => {
        const sellerItemsSum = ord.items
          .filter(item => item.product.sellerId === seller.id)
          .reduce((itemSum, item) => itemSum + (item.product.price * item.quantity), 0);
        return sum + sellerItemsSum;
      }, 0);
      return {
        id: seller.id,
        name: seller.name,
        shopName: seller.shopName || "Toko Penjual Loft",
        email: seller.email,
        totalTransactions: sellerOrders.length,
        totalSalesRevenue: totalAmount,
      };
    });
  }, [registeredUsers, orders]);

  const userDonutData = [
    { name: "Sellers", value: totalSellers, color: "#2541ff" },
    { name: "Buyers", value: totalBuyers, color: "#10b981" },
    { name: "Admin", value: 1, color: "#8b5cf6" },
  ];

  // Core functions
  const handleApproveSeller = (userId: string) => {
    onUpdateUsersList((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isApproved: true } : u))
    );
    const seller = registeredUsers.find((u) => u.id === userId);
    showNotif(`Success: Akun Seller "${seller?.shopName || seller?.name}" telah disetujui!`);
  };

  const handleToggleUserSuspend = (userId: string) => {
    onUpdateUsersList((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isApproved: !u.isApproved } : u))
    );
    showNotif("Status keaktifan user berhasil diperbarui!");
  };

  const handleApproveProduct = (productId: string) => {
    onUpdateProductsList((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, isApproved: true, status: "active" } : p))
    );
    const prod = products.find((p) => p.id === productId);
    showNotif(`Success: Produk "${prod?.name}" Lolos Kurasi Cepat & Ditampilkan ke Toko.`);
  };

  const handleToggleProductStatus = (productId: string) => {
    onUpdateProductsList((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const nextStatus = p.status === "inactive" ? "active" : "inactive";
          return { ...p, status: nextStatus };
        }
        return p;
      })
    );
    showNotif("Status keaktifan produk berhasil diubah!");
  };

  const handleDeleteProduct = (productId: string) => {
    if (showAlert) {
      showAlert(
        "Hapus Produk Permanen",
        "Apakah Anda yakin ingin menghapus produk ini secara permanen dari database Wearloop? Tindakan ini tidak dapat dibatalkan.",
        "warning",
        () => {
          onUpdateProductsList((prev) => prev.filter((p) => p.id !== productId));
          showNotif("Produk berhasil dihapus dari database Wearloop!");
        },
        "Hapus Permanen",
        "Batal"
      );
    } else {
      onUpdateProductsList((prev) => prev.filter((p) => p.id !== productId));
      showNotif("Produk berhasil dihapus dari database Wearloop!");
    }
  };

  const handleAddDirectCatalog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName || !prodPrice || !prodBrand) {
      alert("Lengkapi nama, brand, dan harga produk!");
      return;
    }

    const newProd: Product = {
      id: "prod-admin-" + Date.now(),
      name: prodName,
      brand: prodBrand,
      price: parseInt(prodPrice) || 120000,
      category: prodCategory,
      size: prodSize,
      condition: prodCondition,
      color: prodColor,
      image: fullPhoto || prodImage,
      washPhoto: washPhoto,
      perfumePhoto: perfumePhoto,
      fullPhoto: fullPhoto,
      detailPhoto: detailPhoto,
      isApproved: true, // auto approved
      status: "active",
      sellerId: "admin",
      sellerName: "Wearloop Official",
      isFeatured: true,
      description: prodDesc,
    };

    onUpdateProductsList((prev) => [newProd, ...prev]);
    showNotif(`Sukses: Produk "${prodName}" ditambahkan langsung ke Katalog Aktif!`);
    
    // Clear Form
    setProdName("");
    setProdPrice("");
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const catName = newCatInput.trim();
    if (!catName) return;
    if (categories.some(c => c.toLowerCase() === catName.toLowerCase())) {
      alert("Kategori ini sudah terdaftar!");
      return;
    }
    const newCatObj = {
      name: catName,
      count: "0+",
      image: newCatPhoto || "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=600&auto=format&fit=crop",
    };
    if (onUpdateCategories) {
      onUpdateCategories((prev) => [...prev, newCatObj]);
    }
    setNewCatInput("");
    showNotif(`Kategori "${catName}" baru berhasil ditambahkan!`);
  };

  const handleDeleteCategory = (cat: string) => {
    if (showAlert) {
      showAlert(
        "Hapus Kategori",
        `Apakah Anda yakin ingin menghapus kategori "${cat}"?`,
        "warning",
        () => {
          if (onUpdateCategories) {
            onUpdateCategories((prev) => prev.filter(c => c.name !== cat));
          }
          showNotif(`Kategori "${cat}" berhasil dihapus.`);
        }
      );
    } else {
      if (onUpdateCategories) {
        onUpdateCategories((prev) => prev.filter(c => c.name !== cat));
      }
      showNotif(`Kategori "${cat}" berhasil dihapus.`);
    }
  };

  const handleAddBrand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrandInput.trim()) return;
    if (brands.includes(newBrandInput.trim())) {
      alert("Brand ini sudah terdaftar!");
      return;
    }
    setBrands([...brands, newBrandInput.trim()]);
    setNewBrandInput("");
    showNotif("Merek brand baru berhasil ditambahkan!");
  };

  const handleDeleteBrand = (br: string) => {
    if (showAlert) {
      showAlert(
        "Hapus Merek Brand",
        `Apakah Anda yakin ingin menghapus brand "${br}"?`,
        "warning",
        () => {
          setBrands(brands.filter(b => b !== br));
          showNotif(`Brand "${br}" berhasil dihapus.`);
        }
      );
    } else {
      setBrands(brands.filter(b => b !== br));
      showNotif(`Brand "${br}" berhasil dihapus.`);
    }
  };

  const handleDeleteReview = (id: string) => {
    if (showAlert) {
      showAlert(
        "Hapus Ulasan Pengguna",
        "Apakah Anda yakin ingin menghapus ulasan ini?",
        "warning",
        () => {
          onUpdateReviews(prev => prev.filter(r => r.id !== id));
          showNotif("Ulasan berhasil dihapus.");
        }
      );
    } else {
      onUpdateReviews(prev => prev.filter(r => r.id !== id));
      showNotif("Ulasan berhasil dihapus.");
    }
  };

  const handleApproveReview = (id: string) => {
    onUpdateReviews(prev => prev.map(r => r.id === id ? { ...r, isApproved: true } : r));
    showNotif("Ulasan berhasil disetujui! Ulasan tersebut sekarang live dan tampil di halaman produk garmen terkait.");
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyInput.trim()) return;
    
    if (onSendMessage && activeSelectedId) {
      onSendMessage(activeSelectedId, replyInput.trim(), "admin", "Super Admin");
      showNotif("Balasan chat berhasil dikirim!");
    } else {
      showNotif("Gagal mengirim pesan: obrolan tidak aktif.");
    }
    
    setReplyInput("");
  };

  // Filtered queries
  const filteredUsers = registeredUsers.filter(u => 
    u.name.toLowerCase().includes(globalSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(globalSearch.toLowerCase()) ||
    (u.shopName || "").toLowerCase().includes(globalSearch.toLowerCase())
  );

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(globalSearch.toLowerCase()) ||
    (p.brand || "").toLowerCase().includes(globalSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(globalSearch.toLowerCase())
  );

  const filteredOrders = orders.filter(o =>
    o.id.toLowerCase().includes(globalSearch.toLowerCase()) ||
    o.buyerName.toLowerCase().includes(globalSearch.toLowerCase()) ||
    o.courier.toLowerCase().includes(globalSearch.toLowerCase())
  );

  const ratingRate = 4.8;

  return (
    <div className="flex bg-[#f8fafc] text-slate-800 min-h-screen text-left font-sans">
      
      {/* 1. SIDEBAR PANEL */}
      <aside className="w-72 bg-[#020c38] text-white flex flex-col shrink-0">
        <div className="p-7">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#2541ff] text-2xl font-black">loop</span>
            <h1 className="text-xl font-black tracking-tight font-poppins">WearLoop Admin</h1>
          </div>
          <p className="text-[9px] text-[#2541ff] font-extrabold tracking-widest uppercase mt-1">
            CONTROL CENTER PANEL
          </p>
        </div>

        <nav className="flex-1 px-4 mt-2 space-y-1 overflow-y-auto">
          {[
            { id: "overview", label: "Dashboard Utama", icon: "space_dashboard" },
            { id: "users", label: `Manajemen User (${registeredUsers.length})`, icon: "group" },
            { id: "products", label: `Manajemen Produk (${products.length})`, icon: "apparel" },
            { id: "categories", label: `Manajemen Kategori (${categories.length})`, icon: "category" },
            { id: "chats", label: `Support Chat (${adminRooms.length})`, icon: "forum" },
            { id: "reports", label: `Laporan Penjualan (${orders.length})`, icon: "receipt_long" },
            { id: "ratings", label: "Rating & Review", icon: "star" },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setGlobalSearch("");
                }}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all text-left border-l-4 cursor-pointer ${
                  isActive
                    ? "bg-[#2541ff] text-white border-white shadow-md font-sans"
                    : "text-slate-400 hover:text-white border-transparent hover:bg-white/5"
                }`}
              >
                <span className="material-symbols-outlined text-base">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar profile summary */}
        <div className="m-4 p-4 rounded-2xl bg-white/5 border border-white/10 text-xs">
          <div className="flex items-center gap-2 mb-2 text-emerald-400 font-extrabold text-[10px] tracking-wider uppercase">
            <span className="material-symbols-outlined text-sm font-black">lock_open</span>
            <span>Super Admin Mode</span>
          </div>
          <p className="text-slate-300 text-[10px] leading-relaxed mb-3">
            Gunakan panel ini untuk mengelola circular marketplace WearLoop demi kelestarian bumi.
          </p>
          <button
            onClick={() => {
              alert("Keluar dari Admin Dashboard!");
              setActivePage("beranda");
            }}
            className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-[10px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-xs">logout</span>
            Keluar Dashboard
          </button>
        </div>

        {/* Sidebar Footer Profile */}
        <div className="p-4.5 border-t border-white/10 flex items-center gap-3">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBhkKrmDLklOaMMCncyMjUpu5RQv8VFQ0iITEZVz7vHh-PGU0AIQHR_SectFxUijHVVGg74UgLp-ISjIm7d0hrs6ClpOLkHLVtdstM9pxR9GE6ATnlk0vwZAZ3yxjovcbOTVy3J8Xuazb0OhdPIOOR8Fr2isCz1r2olnLoMY9nLfbInRowu-Xi0N7V7ggs5eViK3aM_JI_w1rhTpFONFqYZwiIt9uQpC632HPWHpz4FYoDSCR49l1ok06zlEx2nyuvav3UrmOOsphQ"
            alt="Admin"
            className="w-8 h-8 rounded-full border border-white/20"
          />
          <div className="min-w-0">
            <p className="text-[11px] font-extrabold text-white truncate">Super Admin Wearloop</p>
            <p className="text-[9px] text-[#2541ff] font-extrabold">Active Session</p>
          </div>
        </div>
      </aside>

      {/* COLUMN 2. MAIN WORKSPACE CONTAINER */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* TOP HEADER MENU */}
        <header className="h-16.5 bg-white border-b border-gray-150 flex items-center justify-between px-8 sticky top-0 z-10 shrink-0">
          <div className="relative w-1/3 max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 select-none">
              <span className="material-symbols-outlined text-xs">search</span>
            </span>
            <input
              type="text"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              placeholder="Cari user, barang, merek, ID pesanan..."
              className="block w-full pl-9 pr-4 py-1.5 bg-slate-50 border-0 rounded-2xl text-[11px] focus:ring-1.5 focus:ring-[#2541ff] outline-none text-slate-800"
            />
          </div>

          <div className="flex items-center gap-6">
            {/* System Info Indicators */}
            <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
                <span className="text-[10px]">Real-Time Sync</span>
              </div>
            </div>

            {/* Admin Avatar Header Profile */}
            <div className="flex items-center gap-2.5 border-l border-gray-200 pl-6">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBhkKrmDLklOaMMCncyMjUpu5RQv8VFQ0iITEZVz7vHh-PGU0AIQHR_SectFxUijHVVGg74UgLp-ISjIm7d0hrs6ClpOLkHLVtdstM9pxR9GE6ATnlk0vwZAZ3yxjovcbOTVy3J8Xuazb0OhdPIOOR8Fr2isCz1r2olnLoMY9nLfbInRowu-Xi0N7V7ggs5eViK3aM_JI_w1rhTpFONFqYZwiIt9uQpC632HPWHpz4FYoDSCR49l1ok06zlEx2nyuvav3UrmOOsphQ"
                alt="Admin"
                className="w-8.5 h-8.5 rounded-full object-cover"
              />
              <div className="hidden sm:block text-left select-none">
                <p className="text-xs font-extrabold text-[#020c38]">Admin Wearloop</p>
                <p className="text-[9px] text-gray-400 font-bold">@super_admin</p>
              </div>
            </div>
          </div>
        </header>

        {/* MAIN BODY SCROLL VIEWPORT */}
        <div className="flex-1 overflow-y-auto p-8 relative">
          
          {/* TOAST SYSTEM NOTIFICATIONS */}
          {notif && (
            <div className="bg-emerald-50 text-emerald-800 text-xs font-bold px-5 py-3.5 border border-emerald-200 rounded-2xl flex items-center gap-2.5 mb-6 animate-fadeIn shadow-xs">
              <span className="material-symbols-outlined text-base text-emerald-600 font-bold">check_circle</span>
              <span>{notif}</span>
            </div>
          )}

          {/* TAB 1: OVERVIEW CLIENT STATS */}
          {activeTab === "overview" && (
            <div className="space-y-8 animate-fadeIn">
              
              {/* Dynamic Welcome Heading */}
              <div>
                <h2 className="text-2xl font-black text-[#020c38] font-poppins">Selamat Datang, Super Admin!</h2>
                <p className="text-xs text-gray-400 mt-1 font-sans">
                  Kelola dan pantau seluruh transaksi, kelaikan sterilisasi baju, sirkulasi circular economy WearLoop.
                </p>
              </div>

              {/* FIVE METRIC CARD ROW EXACTLY MATCHING USER TEMPLATE */}
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                
                {/* Metric User */}
                <div className="bg-white p-5 rounded-2xl border border-gray-150 text-left space-y-3 shadow-xs">
                  <div className="flex justify-between items-start">
                    <div className="p-3 bg-blue-50 text-[#2541ff] rounded-xl">
                      <span className="material-symbols-outlined text-base block font-bold">group</span>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] text-[#2541ff] font-extrabold uppercase tracking-wider">Total User</p>
                      <h3 className="text-lg font-black text-[#020c38] mt-1 font-mono">{registeredUsers.length}</h3>
                    </div>
                  </div>
                  <div className="text-[9.5px] text-gray-500 font-semibold border-t border-slate-100 pt-2 flex items-center gap-1">
                    <span className="text-emerald-600 font-bold">&#x2191; 12.5%</span>
                    <span>dari bulan lalu</span>
                  </div>
                </div>

                {/* Metric Products */}
                <div className="bg-white p-5 rounded-2xl border border-gray-150 text-left space-y-3 shadow-xs">
                  <div className="flex justify-between items-start">
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                      <span className="material-symbols-outlined text-base block font-bold">apparel</span>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] text-purple-600 font-extrabold uppercase tracking-wider">Total Produk</p>
                      <h3 className="text-lg font-black text-[#020c38] mt-1 font-mono">{products.length}</h3>
                    </div>
                  </div>
                  <div className="text-[9.5px] text-gray-500 font-semibold border-t border-slate-100 pt-2 flex items-center gap-1">
                    <span className="text-emerald-600 font-bold">&#x2191; 8.3%</span>
                    <span>curated item in stock</span>
                  </div>
                </div>

                {/* Metric Orders */}
                <div className="bg-white p-5 rounded-2xl border border-gray-150 text-left space-y-3 shadow-xs">
                  <div className="flex justify-between items-start">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                      <span className="material-symbols-outlined text-base block font-bold">shopping_bag</span>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] text-emerald-600 font-extrabold uppercase tracking-wider">Total Pesanan</p>
                      <h3 className="text-lg font-black text-[#020c38] mt-1 font-mono">{orders.length}</h3>
                    </div>
                  </div>
                  <div className="text-[9.5px] text-gray-500 font-semibold border-t border-slate-100 pt-2 flex items-center gap-1">
                    <span className="text-emerald-600 font-bold">&#x2191; 15.2%</span>
                    <span>orders database</span>
                  </div>
                </div>

                {/* Metric Vol Sales GMV */}
                <div className="bg-white p-5 rounded-2xl border border-gray-150 text-left space-y-3 shadow-xs col-span-2 lg:col-span-1">
                  <div className="flex justify-between items-start">
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                      <span className="material-symbols-outlined text-base block font-bold">payments</span>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] text-amber-600 font-extrabold uppercase tracking-wider">Gross Sales GMV</p>
                      <h3 className="text-sm font-black text-emerald-700 mt-1 font-mono">Rp {grossSalesVolume.toLocaleString("id-ID")}</h3>
                    </div>
                  </div>
                  <div className="text-[9.5px] text-gray-500 font-semibold border-t border-slate-100 pt-2 flex items-center gap-1">
                    <span className="text-emerald-600 font-bold">&#x2191; 18.7%</span>
                    <span>omset sirkular</span>
                  </div>
                </div>

                {/* Metric Reviews */}
                <div className="bg-white p-5 rounded-2xl border border-gray-150 text-left space-y-3 shadow-xs">
                  <div className="flex justify-between items-start">
                    <div className="p-3 bg-rose-50 text-rose-500 rounded-xl">
                      <span className="material-symbols-outlined text-base block font-bold">star</span>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] text-rose-500 font-extrabold uppercase tracking-wider">Rating Toko</p>
                      <h3 className="text-lg font-black text-[#020c38] mt-1 font-mono">{ratingRate}/5</h3>
                    </div>
                  </div>
                  <div className="text-[9.5px] text-gray-500 font-semibold border-t border-slate-100 pt-2">
                    dari <span className="font-extrabold">{reviews.length} ulasan</span>
                  </div>
                </div>

              </div>

              {/* CHARTS GRAPH & LOGS BENTO GRID */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Graph Area */}
                <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-gray-150 text-left space-y-4 shadow-sm">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-sm font-black text-[#020c38] font-poppins">Laporan Transaksi Mingguan</h3>
                      <p className="text-[10px] text-gray-400 mt-1">Siklus pertumbuhan total penjualan circular platform WearLoop secara real-time.</p>
                    </div>
                    <div className="text-[9px] bg-blue-50 text-[#2541ff] font-extrabold px-3 py-1 rounded-full uppercase">
                      7 Hari Terakhir
                    </div>
                  </div>

                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={mainSalesData}>
                        <defs>
                          <linearGradient id="adminSales" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2541ff" stopOpacity={0.25}/>
                            <stop offset="95%" stopColor="#2541ff" stopOpacity={0.01}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="name" fontSize={9} stroke="#64748b" tickLine={false} axisLine={false} />
                        <YAxis 
                          fontSize={9} 
                          stroke="#64748b" 
                          tickLine={false} 
                          axisLine={false}
                          tickFormatter={(v) => `Rp ${v >= 1000000 ? (v / 1000000).toFixed(1) + "jt" : v.toLocaleString()}`} 
                        />
                        <Tooltip formatter={(value) => [`Rp ${Number(value).toLocaleString("id-ID")}`, "Volume Sales"]} />
                        <Area type="monotone" dataKey="penjualan" stroke="#2541ff" strokeWidth={2.5} fillOpacity={1} fill="url(#adminSales)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Users statistics donut chart and system status list */}
                <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-gray-150 text-left space-y-5 shadow-sm">
                  <h3 className="text-sm font-black text-[#020c38] font-poppins">Rasio Pengguna</h3>
                  
                  <div className="relative w-40 h-40 mx-auto">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={userDonutData}
                          innerRadius={50}
                          outerRadius={70}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {userDonutData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-xl font-black text-[#020c38] font-mono leading-none">{registeredUsers.length}</span>
                      <span className="text-[9px] text-gray-400 font-extrabold uppercase tracking-wide mt-1">Total User</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-4 space-y-2.5">
                    {userDonutData.map((e, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: e.color }}></span>
                          <span className="text-slate-500 font-bold">{e.name}</span>
                        </div>
                        <span className="font-extrabold text-[#020c38] font-mono">{e.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* QUICK INSTRUCTIONS AND BANNER */}
              <div className="bg-[#eff2ff] border border-blue-105 rounded-2xl p-5.5 text-xs text-[#2c46a9] flex items-start gap-4">
                <span className="material-symbols-outlined text-xl text-[#2541ff] font-bold">verified_user</span>
                <div className="space-y-1.5 flex-1 select-none">
                  <h4 className="font-extrabold uppercase text-[10px] tracking-wider text-[#2541ff]">STANDAR ADMINISTRATOR WEARLOOP</h4>
                  <p className="leading-relaxed text-slate-700">
                    Sistem ini terintegrasi penuh. Persetujuan registrasi seller, penayangan katalog, moderasi ulasan bermasalah, dan pelacakan invoice ekspedisi barang preloved vintage akan langsung diperbarui dalam sistem.
                  </p>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: MANAJEMEN USER */}
          {activeTab === "users" && (
            <div className="bg-white border border-gray-150 rounded-3xl p-6 lg:p-8 space-y-6 shadow-xs animate-fadeIn text-left">
              <div>
                <h3 className="text-lg font-black text-[#020c38] font-poppins">Manajemen Akun Pengguna</h3>
                <p className="text-xs text-gray-400 mt-1">Daftar lengkap pengguna terdaftar (pembeli &amp; penjual) di aplikasi WearLoop.</p>
              </div>

              {/* Search user block */}
              <div className="relative max-w-sm">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 select-none">
                  <span className="material-symbols-outlined text-xs">search</span>
                </span>
                <input
                  type="text"
                  value={globalSearch}
                  onChange={(e) => setGlobalSearch(e.target.value)}
                  placeholder="Cari nama, email, toko..."
                  className="block w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-gray-200 rounded-2xl text-[11px] focus:ring-1.5 focus:ring-[#2541ff] outline-none text-slate-800"
                />
              </div>

              {filteredUsers.length === 0 ? (
                <div className="py-16 text-center text-gray-450 text-xs">Tidak ada user ditemukan matching &quot;{globalSearch}&quot;</div>
              ) : (
                <div className="overflow-x-auto ring-1 ring-gray-100 rounded-2xl">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-gray-150 font-extrabold text-[#020c38] opacity-80 text-[10px] uppercase">
                        <th className="p-4">Pengguna</th>
                        <th className="p-4">Role</th>
                        <th className="p-4">Sandi / Password</th>
                        <th className="p-4">Kontak / WA</th>
                        <th className="p-4 font-mono">Bank Detail (Seller)</th>
                        <th className="p-4">Status Akun</th>
                        <th className="p-4 text-right">Tindak Lanjut</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center font-bold text-xs text-slate-700">
                                {u.name[0]}
                              </div>
                              <div>
                                <p className="font-black text-slate-800 text-xs">{u.name}</p>
                                <p className="text-[10px] text-gray-400 font-medium">{u.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 font-bold capitalize">
                            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${
                              u.role === "seller" ? "bg-purple-100 text-purple-700" : "bg-emerald-100 text-emerald-700"
                            }`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="p-4 font-bold text-rose-600 font-mono select-all" title="Klik/drag untuk salin sandi">
                            {u.password || "password123"}
                          </td>
                          <td className="p-4 font-semibold text-slate-600 font-mono">
                            {u.phoneNumber || "-"}
                          </td>
                          <td className="p-4 text-[10.5px]">
                            {u.role === "seller" ? (
                              <div className="bg-gray-50 border border-gray-150/60 p-2 rounded-xl text-slate-600 space-y-0.5 max-w-xs font-mono text-[9px]">
                                <p>Bank: <strong>{u.bankName || "Mandiri"}</strong></p>
                                <p>No: <strong>{u.bankAccountNumber || "xxxx"}</strong></p>
                                <p>A.N: <strong>{u.bankAccountHolder || u.name}</strong></p>
                              </div>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="p-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9.5px] font-extrabold uppercase ${
                              u.isApproved ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-rose-50 text-rose-700 border border-rose-200"
                            }`}>
                              <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                              {u.isApproved ? "Aktif / Approved" : "Suspend / Pending"}
                            </span>
                          </td>
                          <td className="p-4 text-right space-x-1.5">
                            {u.role === "seller" && !u.isApproved ? (
                              <button
                                onClick={() => handleApproveSeller(u.id)}
                                className="bg-[#2541ff] hover:bg-blue-700 text-white font-extrabold text-[9.5px] uppercase tracking-wide px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-xs"
                              >
                                Approve Pendaftaran
                              </button>
                            ) : (
                              <button
                                onClick={() => handleToggleUserSuspend(u.id)}
                                className={`px-3 py-1.5 rounded-xl font-bold text-[9.5px] uppercase transition-all cursor-pointer ${
                                  u.isApproved 
                                    ? "bg-rose-50 text-rose-600 hover:bg-rose-100" 
                                    : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                                }`}
                              >
                                {u.isApproved ? "Suspend" : "Aktifkan Akun"}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: MANAJEMEN PRODUK */}
          {activeTab === "products" && (
            <div className="space-y-8 animate-fadeIn text-left">
              
              {/* CURATION ROW FOR PENDING INCOMING SELLER PRODUCTS */}
              <div className="bg-white border border-gray-150 rounded-3xl p-6 lg:p-8 space-y-6 shadow-xs">
                <div>
                  <h3 className="text-base font-black text-[#020c38] font-poppins">Kurasi Antrean Higienitas Sterilisasi ({pendingProductCuration} Pending)</h3>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Verifikasi bukti dokumentasi sterilisasi pencucian laundry baju preloved dari seller sebelum dinaikkan ke etalase utama.
                  </p>
                </div>

                {products.filter((p) => !p.isApproved && p.status === "posting").length === 0 ? (
                  <div className="py-12 text-center text-gray-400 text-xs flex flex-col items-center gap-3">
                    <span className="material-symbols-outlined text-3xl text-emerald-500 font-bold">verified</span>
                    <span>Antrean steril clear! Seluruh produk buatan seller telah lolos kurasi.</span>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {products
                      .filter((p) => !p.isApproved && p.status === "posting")
                      .map((item) => (
                        <div
                          key={item.id}
                          className="border border-gray-150 rounded-2xl p-5 space-y-4 bg-slate-50/70 text-xs"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-2 border-b border-gray-200 pb-3">
                            <div>
                              <h4 className="font-extrabold text-sm text-[#020c38]">{item.name}</h4>
                              <p className="text-gray-400 font-semibold text-[10.5px] mt-0.5">
                                Seller: <span className="text-[#2541ff] font-extrabold">@{item.sellerName || "Partner"}</span> &bull; Kategori: {item.category} &bull; Harga: Rp {item.price.toLocaleString("id-ID")}
                              </p>
                            </div>
                            
                            <button
                              onClick={() => handleApproveProduct(item.id)}
                              className="bg-[#2541ff] hover:bg-blue-700 text-white font-extrabold text-[9.5px] uppercase tracking-wider px-4 py-2 rounded-xl transition-all cursor-pointer shadow-sm"
                            >
                              Terbitkan Lolos Kurasi Steril
                            </button>
                          </div>

                          <div className="grid grid-cols-3 gap-3">
                            <div className="space-y-1">
                              <span className="text-[8.5px] text-gray-400 font-extrabold block uppercase tracking-wider">1. Bukti Foto Cuci</span>
                              <div className="aspect-square bg-white border border-gray-150 rounded-xl overflow-hidden flex items-center justify-center p-1">
                                <img src={item.washPhoto || item.image} className="max-h-full w-auto object-contain rounded-lg" alt="Wash check" />
                              </div>
                            </div>
                            <div className="space-y-1">
                              <span className="text-[8.5px] text-gray-400 font-extrabold block uppercase tracking-wider">2. Bukti Foto Semprot Pewangi</span>
                              <div className="aspect-square bg-white border border-gray-150 rounded-xl overflow-hidden flex items-center justify-center p-1">
                                <img src={item.perfumePhoto || item.image} className="max-h-full w-auto object-contain rounded-lg" alt="Smell check" />
                              </div>
                            </div>
                            <div className="space-y-1">
                              <span className="text-[8.5px] text-gray-400 font-extrabold block uppercase tracking-wider">3. Foto Full Item</span>
                              <div className="aspect-square bg-white border border-gray-150 rounded-xl overflow-hidden flex items-center justify-center p-1">
                                <img src={item.fullPhoto || item.image} className="max-h-full w-auto object-contain rounded-lg" alt="Visual look" />
                              </div>
                            </div>
                          </div>

                          <div className="bg-white p-3 border border-gray-150 rounded-xl text-[10.5px] text-slate-500 leading-normal">
                            <strong className="text-slate-700">Keterangan Deskripsi Penjual:</strong> {item.description}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* DIRECT ADD PRODUCT FORM FOR ADMIN INITIATIVE */}
              <div className="bg-white border border-gray-150 rounded-3xl p-6 lg:p-8 space-y-6 shadow-xs">
                <div>
                  <h3 className="text-base font-black text-[#020c38] font-poppins">Tambah Garmen Official WearLoop</h3>
                  <p className="text-[11px] text-gray-400 mt-1">Publikasi produk garmen vintage langsung dari kantor pusat WearLoop (Auto-Approved).</p>
                </div>

                <form onSubmit={handleAddDirectCatalog} className="space-y-6 text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Nama Produk Garmen</label>
                      <input
                        type="text"
                        required
                        value={prodName}
                        onChange={(e) => setProdName(e.target.value)}
                        placeholder="Contoh: Crewneck Nike Classic Vintage"
                        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Merek Brand</label>
                      <select
                        value={prodBrand}
                        onChange={(e) => setProdBrand(e.target.value)}
                        className="w-full px-3.5 py-2.5 border border-gray-200 bg-white rounded-xl text-xs"
                      >
                        {brands.map(b => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Harga Jual (Rp)</label>
                      <input
                        type="number"
                        required
                        value={prodPrice}
                        onChange={(e) => setProdPrice(e.target.value)}
                        placeholder="Contoh: 145000"
                        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Pilih Kategori</label>
                      <select
                        value={prodCategory}
                        onChange={(e) => setProdCategory(e.target.value)}
                        className="w-full px-3.5 py-2.5 border border-gray-200 bg-white rounded-xl text-xs"
                      >
                        {categories.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Ukuran Garmen</label>
                      <select
                        value={prodSize}
                        onChange={(e) => setProdSize(e.target.value)}
                        className="w-full px-3.5 py-2.5 border border-gray-200 bg-white rounded-xl text-xs"
                      >
                        <option value="S">Size S</option>
                        <option value="M">Size M</option>
                        <option value="L">Size L</option>
                        <option value="XL">Size XL</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Kondisi Barang</label>
                      <select
                        value={prodCondition}
                        onChange={(e) => setProdCondition(e.target.value)}
                        className="w-full px-3.5 py-2.5 border border-gray-200 bg-white rounded-xl text-xs"
                      >
                        <option value="Like New">Like New (10/10)</option>
                        <option value="Very Good">Very Good (9/10)</option>
                        <option value="Good">Good Condition (8/10)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Warna Dominan</label>
                      <input
                        type="text"
                        value={prodColor}
                        onChange={(e) => setProdColor(e.target.value)}
                        placeholder="Contoh: Navy Blue, Sage Green"
                        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl outline-none"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Deskripsi &amp; Detail Garmen</label>
                      <input
                        type="text"
                        value={prodDesc}
                        onChange={(e) => setProdDesc(e.target.value)}
                        placeholder="Keterangan kondisi jahitan, kepekatan warna, dll..."
                        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl outline-none"
                      />
                    </div>
                  </div>

                  {/* Sanitasi QC & Bukti Sterilisasi File uploaders like in Seller */}
                  <div className="space-y-3">
                    <span className="text-[10px] font-extrabold uppercase text-[#2541ff] tracking-wider block border-b border-gray-100 pb-1">
                      Dokumentasi QC Higienitas &amp; Sterilisasi Lab Baju
                    </span>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {/* Wash photo */}
                      <div className="bg-slate-50 p-3 rounded-2xl border border-gray-200 flex flex-col justify-between">
                        <div>
                          <span className="text-[9.5px] font-extrabold uppercase text-gray-400 block mb-1">Foto Proses Cuci</span>
                          {washPhoto ? (
                            <img src={washPhoto} alt="Cuci" className="w-full h-20 object-cover rounded-xl mb-2" />
                          ) : (
                            <div className="w-full h-20 bg-gray-100 rounded-xl mb-2 flex items-center justify-center text-gray-400 text-[9px]">Belum ada foto</div>
                          )}
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              compressAndSetImage(file, setWashPhoto);
                            }
                          }}
                          className="w-full text-[9px] text-gray-400 file:mr-2 file:py-0.5 file:px-1.5 file:rounded file:border-0 file:text-[9px] file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                        />
                      </div>

                      {/* Perfume photo */}
                      <div className="bg-slate-50 p-3 rounded-2xl border border-gray-200 flex flex-col justify-between">
                        <div>
                          <span className="text-[9.5px] font-extrabold uppercase text-gray-400 block mb-1">Foto Parfumasi</span>
                          {perfumePhoto ? (
                            <img src={perfumePhoto} alt="Parfum" className="w-full h-20 object-cover rounded-xl mb-2" />
                          ) : (
                            <div className="w-full h-20 bg-gray-100 rounded-xl mb-2 flex items-center justify-center text-gray-400 text-[9px]">Belum ada foto</div>
                          )}
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              compressAndSetImage(file, setPerfumePhoto);
                            }
                          }}
                          className="w-full text-[9px] text-gray-400 file:mr-2 file:py-0.5 file:px-1.5 file:rounded file:border-0 file:text-[9px] file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                        />
                      </div>

                      {/* Full look photo */}
                      <div className="bg-slate-50 p-3 rounded-2xl border border-gray-200 flex flex-col justify-between">
                        <div>
                          <span className="text-[9.5px] font-extrabold uppercase text-gray-400 block mb-1">Foto Sisi Depan</span>
                          {fullPhoto ? (
                            <img src={fullPhoto} alt="Full" className="w-full h-20 object-cover rounded-xl mb-2" />
                          ) : (
                            <div className="w-full h-20 bg-gray-100 rounded-xl mb-2 flex items-center justify-center text-gray-400 text-[9px]">Belum ada foto</div>
                          )}
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              compressAndSetImage(file, setFullPhoto);
                            }
                          }}
                          className="w-full text-[9px] text-gray-400 file:mr-2 file:py-0.5 file:px-1.5 file:rounded file:border-0 file:text-[9px] file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                        />
                      </div>

                      {/* Detail photo */}
                      <div className="bg-slate-50 p-3 rounded-2xl border border-gray-200 flex flex-col justify-between">
                        <div>
                          <span className="text-[9.5px] font-extrabold uppercase text-gray-400 block mb-1">Foto Tag/Bahan</span>
                          {detailPhoto ? (
                            <img src={detailPhoto} alt="Detail" className="w-full h-20 object-cover rounded-xl mb-2" />
                          ) : (
                            <div className="w-full h-20 bg-gray-100 rounded-xl mb-2 flex items-center justify-center text-gray-400 text-[9px]">Belum ada foto</div>
                          )}
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              compressAndSetImage(file, setDetailPhoto);
                            }
                          }}
                          className="w-full text-[9px] text-gray-400 file:mr-2 file:py-0.5 file:px-1.5 file:rounded file:border-0 file:text-[9px] file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full bg-[#2541ff] hover:bg-blue-700 text-white font-extrabold text-[10px] uppercase tracking-wider py-3 rounded-xl transition-all cursor-pointer font-sans"
                    >
                      Tambah &amp; Publikasi Produk Official
                    </button>
                  </div>
                </form>
              </div>

              {/* MASTER CATALOG TABLE DATABASE MANAGEMENT */}
              <div className="bg-white border border-gray-150 rounded-3xl p-6 lg:p-8 space-y-6 shadow-xs">
                <div>
                  <h3 className="text-base font-black text-[#020c38] font-poppins">Daftar Inventori Garmen WearLoop ({products.length} Items)</h3>
                  <p className="text-xs text-gray-400 mt-1">Ubah keaktifan penayangan (Online/Offline) atau hapus item ilegal/bermasalah.</p>
                </div>

                {/* Filter search bar */}
                <div className="relative max-w-sm">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 select-none">
                    <span className="material-symbols-outlined text-xs">search</span>
                  </span>
                  <input
                    type="text"
                    value={globalSearch}
                    onChange={(e) => setGlobalSearch(e.target.value)}
                    placeholder="Search nama, merek, kategori..."
                    className="block w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-gray-200 rounded-2xl text-[11px] focus:ring-1.5 focus:ring-[#2541ff] outline-none text-slate-800"
                  />
                </div>

                {filteredProducts.length === 0 ? (
                  <div className="py-12 text-center text-gray-400 text-xs">Produk tidak ada matching.</div>
                ) : (
                  <div className="overflow-x-auto ring-1 ring-gray-100 rounded-2xl">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-slate-50 border-b border-gray-150 font-extrabold text-[#020c38] opacity-80 text-[10px] uppercase">
                          <th className="p-4">Info Produk</th>
                          <th className="p-4">Kategori Garmen</th>
                          <th className="p-4 font-mono text-center">Harga Jual</th>
                          <th className="p-4">Pemilik (Seller)</th>
                          <th className="p-4">Status Kurasi</th>
                          <th className="p-4 text-right">Tindakan Cepat</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {filteredProducts.map((p) => (
                          <tr key={p.id} className="hover:bg-slate-50/50 transition-all">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <img src={p.image} className="w-10 h-10 object-cover rounded-xl border border-gray-200" alt={p.name} />
                                <div className="min-w-0">
                                  <p className="font-extrabold text-slate-800 truncate max-w-xs">{p.name}</p>
                                  <p className="text-[10px] text-gray-400 font-extrabold uppercase mt-0.5 tracking-wide">
                                    Size {p.size} &bull; {p.brand} &bull; {p.condition}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 font-semibold text-slate-600">{p.category}</td>
                            <td className="p-4 font-black font-mono text-[#2541ff] text-right">
                              Rp {p.price.toLocaleString("id-ID")}
                            </td>
                            <td className="p-4 font-bold text-slate-700">
                              @{p.sellerName || "Official Wearloop"}
                            </td>
                            <td className="p-4">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[9px] font-black uppercase ${
                                p.isApproved ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-amber-50 text-amber-700 border border-amber-100"
                              }`}>
                                {p.isApproved ? "Lolosed" : "Pending"}
                              </span>
                            </td>
                            <td className="p-4 text-right space-x-1.5">
                              <button
                                type="button"
                                onClick={() => handleToggleProductStatus(p.id)}
                                className={`px-2.5 py-1.5 rounded-xl font-extrabold text-[9px] uppercase tracking-wide cursor-pointer select-none transition-all ${
                                  p.status === "inactive" 
                                    ? "bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200" 
                                    : "bg-blue-50 text-[#2c46a9] hover:bg-blue-100 border border-blue-200"
                                }`}
                              >
                                {p.status === "inactive" ? "Aktifkan" : "Hold Offline"}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteProduct(p.id)}
                                className="px-2.5 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 rounded-xl text-[9px] font-extrabold uppercase tracking-wide transition-all cursor-pointer"
                              >
                                Hapus
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 4: MANAJEMEN KATEGORI */}
          {activeTab === "categories" && (
            <div className="bg-white border border-gray-150 rounded-3xl p-6 lg:p-8 space-y-6 shadow-xs animate-fadeIn text-left">
              <div>
                <h3 className="text-lg font-black text-[#020c38] font-poppins">Manajemen Kategori Garmen</h3>
                <p className="text-xs text-gray-400 mt-1">Atur kategori baju preloved yang didukung dalam landing page katalog WearLoop.</p>
              </div>

              {/* Add category text block form */}
              <form onSubmit={handleAddCategory} className="space-y-4 max-w-lg bg-slate-50 p-6 border border-gray-200 rounded-3xl">
                <div>
                  <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Nama Kategori Garmen Baru</label>
                  <input
                    type="text"
                    required
                    value={newCatInput}
                    onChange={(e) => setNewCatInput(e.target.value)}
                    placeholder="Contoh: Sweater, Denim, Sneakers"
                    className="w-full px-3.5 py-2.5 border border-gray-200 bg-white rounded-xl outline-none text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1.5">Foto Sampul Kategori (Tampil di Bento Grid Landing Page)</label>
                  <div className="flex items-center gap-4">
                    {newCatPhoto ? (
                      <img src={newCatPhoto} alt="Category preview" className="w-16 h-16 object-cover rounded-2xl border border-gray-200 shadow-sm" />
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 rounded-2xl border border-gray-200 flex items-center justify-center text-[10px] text-gray-400">Preview</div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const r = new FileReader();
                          r.onloadend = () => {
                            if (typeof r.result === "string") setNewCatPhoto(r.result);
                          };
                          r.readAsDataURL(file);
                        }
                      }}
                      className="text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-[10px] file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-[#2541ff] hover:bg-blue-700 text-white font-extrabold text-[10px] uppercase tracking-wider py-3 rounded-2xl transition-all cursor-pointer shadow-xs whitespace-nowrap"
                  >
                    Tambah Garmen Kategori Baru
                  </button>
                </div>
              </form>

              {/* list grids of categories with delete icon */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {categoriesList.map((cat) => (
                  <div key={cat.name} className="p-4 bg-slate-50/70 border border-gray-200 rounded-2xl flex items-center justify-between shadow-xs">
                    <div className="flex items-center gap-3">
                      <img src={cat.image} alt={cat.name} className="w-10 h-10 object-cover rounded-xl border border-gray-200 shrink-0" />
                      <div className="text-left">
                        <span className="text-xs font-extrabold text-[#020c38] block">{cat.name}</span>
                        <span className="text-[10px] text-gray-400 block">{cat.count || "0+"} Items</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteCategory(cat.name)}
                      className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer shrink-0 p-1"
                      title="Hapus Kategori"
                    >
                      <span className="material-symbols-outlined text-sm font-bold">delete</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: MANAJEMEN BRAND DELETED */}

          {/* TAB 6: CHAT LIVE REAL-TIME SUPPORT */}
          {activeTab === "chats" && (
            <div className="bg-white border border-gray-150 rounded-3xl p-6 lg:p-8 space-y-6 shadow-xs animate-fadeIn text-left">
              <div>
                <h3 className="text-lg font-semibold text-[#020c38] font-poppins">Customer Live Service Chat</h3>
                <p className="text-xs text-gray-450 mt-1">Komunikasi dua arah timbal-balik (one-on-one) dengan seluruh kustomer Wearloop.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[500px]">
                
                {/* Side tickets list */}
                <div className="lg:col-span-4 border border-gray-200 rounded-2xl p-4 space-y-3.5 overflow-y-auto font-poppins">
                  <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest mb-2 border-b pb-1.5">Active Ticket Logs</p>
                  
                  {adminRooms.map((r) => {
                    const isSelected = r.id === activeSelectedId;
                    const lastMessageObj = r.messages[r.messages.length - 1];
                    return (
                      <button
                        key={r.id}
                        onClick={() => setSelectedChatId(r.id)}
                        className={`w-full p-3 rounded-xl transition-all text-left flex gap-3 border shadow-xs cursor-pointer ${
                          isSelected 
                            ? "bg-blue-50/60 border-[#2c46a9] text-[#020c38]" 
                            : "bg-white border-gray-150 hover:bg-slate-50 text-slate-800"
                        }`}
                      >
                        <div className="w-8.5 h-8.5 rounded-full bg-[#2c46a9]/10 flex items-center justify-center text-xs font-bold text-[#2c46a9] shrink-0 border border-[#2c46a9]/20">
                          {r.buyerName.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex justify-between items-center gap-1.5">
                            <span className="text-xs font-semibold truncate">{r.buyerName}</span>
                            <span className="text-[8px] text-slate-400 font-mono shrink-0">{r.lastUpdated}</span>
                          </div>
                          <p className="text-[9px] text-[#2c46a9] font-semibold uppercase mt-0.5 tracking-wide">Buyer Channel</p>
                          <p className="text-[10px] text-gray-500 truncate mt-1 leading-normal">
                            {lastMessageObj ? `"${lastMessageObj.text}"` : "(Belum ada pesan)"}
                          </p>
                        </div>
                      </button>
                    );
                  })}

                  {adminRooms.length === 0 && (
                    <div className="text-center py-10 text-xs text-gray-400 font-semibold">
                      Belum ada chat kustomer masuk ke Admin.
                    </div>
                  )}
                </div>

                {/* Simulated conversations viewport */}
                <div className="lg:col-span-8 border border-gray-200 rounded-2xl flex flex-col overflow-hidden bg-slate-50/70 p-4 relative font-poppins">
                  
                  {activeChatRoom ? (
                    <>
                      {/* Chatroom user header */}
                      <div className="bg-white border border-gray-150 p-3 rounded-xl flex items-center justify-between mb-4 shadow-xs select-none">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#2c46a9]/10 flex items-center justify-center text-xs font-bold text-[#2c46a9] shrink-0">
                            {activeChatRoom.buyerName.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-[#020c38]">{activeChatRoom.buyerName}</p>
                            <p className="text-[9px] text-[#2c46a9] font-semibold">Buyer Support Ticket</p>
                          </div>
                        </div>
                        <span className="text-[9.5px] bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full font-semibold border border-emerald-250 animate-pulse">ACTIVE CS</span>
                      </div>

                      {/* Message stack scroll */}
                      <div className="flex-1 overflow-y-auto space-y-3 px-1 mb-4">
                        {activeChatRoom.messages.map((m) => {
                          const isAdmin = m.senderId === "admin";
                          return (
                            <div key={m.id} className={`flex ${isAdmin ? "justify-end" : "justify-start"} animate-fadeIn`}>
                              <div className={`max-w-md px-4 py-2.5 rounded-2xl text-[11px] leading-relaxed relative font-medium ${
                                isAdmin 
                                  ? "bg-[#2c46a9] text-white rounded-tr-none shadow-xs" 
                                  : "bg-white border border-gray-150 text-slate-800 rounded-tl-none shadow-xs"
                              }`}>
                                <p className="whitespace-pre-wrap">{m.text}</p>
                                <span className={`text-[8px] font-mono block mt-1 text-right ${isAdmin ? "text-white/60" : "text-gray-400"}`}>
                                  {m.createdAt}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Input reply form box */}
                      <form onSubmit={handleSendReply} className="flex gap-2 bg-white border border-gray-200 rounded-2xl p-1.5 shrink-0 shadow-xs">
                        <input
                          type="text"
                          value={replyInput}
                          onChange={(e) => setReplyInput(e.target.value)}
                          placeholder={`Balas pesan support untuk ${activeChatRoom.buyerName}...`}
                          className="flex-1 bg-transparent border-0 outline-none select-none text-[11px] text-slate-800 px-3 py-1.5 font-medium"
                        />
                        <button
                          type="submit"
                          className="bg-[#2c46a9] hover:bg-[#020c38] text-white font-semibold text-[10px] uppercase tracking-wide px-4 py-2 rounded-xl transition-all cursor-pointer shrink-0"
                        >
                          Kirim
                        </button>
                      </form>
                    </>
                  ) : (
                    <div className="flex-grow flex flex-col items-center justify-center text-center p-6 text-gray-400">
                      <span className="material-symbols-outlined text-4xl mb-2 text-gray-300">chat_bubble</span>
                      <p className="text-xs font-semibold">Pilih chat tiket di sebelah kiri untuk berinteraksi langsung secara live.</p>
                    </div>
                  )}

                </div>

              </div>
            </div>
          )}

          {activeTab === "reports" && (
            <div className="bg-white border border-gray-150 rounded-3xl p-6 lg:p-8 space-y-6 shadow-xs animate-fadeIn text-left text-xs text-[#020c38]">
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div>
                  <h3 className="text-lg font-black font-poppins">Laporan &amp; Pengiriman Penjualan</h3>
                  <p className="text-xs text-gray-400 mt-1">Supervisor transaksi, penentuan delivery status kurir, log resi &amp; escrow fund.</p>
                </div>
                <div className="bg-[#eff2ff] border border-blue-105 rounded-xl p-3 text-[10.5px] font-semibold text-[#2c46a9] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm font-bold">payments</span>
                  <span>Gross GMV: <strong>Rp {grossSalesVolume.toLocaleString("id-ID")}</strong> ({totalOrdersCount} Transaksi)</span>
                </div>
              </div>

              {/* Seller Sales Report Block */}
              <div className="bg-[#f8fafc] border border-gray-150 rounded-2xl p-5 space-y-3">
                <div className="border-b border-gray-150 pb-2">
                  <span className="text-[11px] font-extrabold uppercase text-[#2541ff] tracking-wider block">Ringkasan Laporan Penjualan Seller</span>
                  <p className="text-[10px] text-gray-450 mt-0.5">List seluruh mitra seller thrifting aktif beserta rekam total nilai transaksi bruto yang sah.</p>
                </div>
                
                <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-xs">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50 border-b border-gray-150 text-[9.5px] uppercase font-bold text-slate-500">
                        <th className="p-3">Nama Toko &amp; Pemilik</th>
                        <th className="p-3">Email Kontak</th>
                        <th className="p-3 text-center">Jumlah Transaksi</th>
                        <th className="p-3 text-right">Total Transaksi Bruto</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
                      {sellerSalesReport.map(sel => (
                        <tr key={sel.id} className="hover:bg-slate-50/50 transition-colors text-[11px]">
                          <td className="p-3">
                            <span className="font-extrabold text-[#020c38] block">{sel.shopName}</span>
                            <span className="text-[10px] text-gray-400 font-normal">{sel.name}</span>
                          </td>
                          <td className="p-3 font-mono text-[10px] text-slate-500">
                            {sel.email}
                          </td>
                          <td className="p-3 text-center font-bold text-[#2541ff] font-mono">
                            {sel.totalTransactions} x
                          </td>
                          <td className="p-3 text-right font-black text-emerald-700 font-mono">
                            Rp {sel.totalSalesRevenue.toLocaleString("id-ID")}
                          </td>
                        </tr>
                      ))}
                      {sellerSalesReport.length === 0 && (
                        <tr>
                          <td colSpan={4} className="p-6 text-center text-gray-400 text-[10.5px]">
                            Belum ada seller yang terdaftar atau melakukan transaksi.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Search user block */}
              <div className="relative max-w-sm">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 select-none">
                  <span className="material-symbols-outlined text-xs">search</span>
                </span>
                <input
                  type="text"
                  value={globalSearch}
                  onChange={(e) => setGlobalSearch(e.target.value)}
                  placeholder="Cari ID transaksi pembeli, kurir..."
                  className="block w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-gray-200 rounded-2xl text-[11px] focus:ring-1.5 focus:ring-[#2541ff] outline-none text-slate-800"
                />
              </div>

              {filteredOrders.length === 0 ? (
                <div className="py-20 text-center text-gray-450">
                  <span className="material-symbols-outlined text-4xl block mb-2 font-black text-gray-200">folder_open</span>
                  No orders matched in the system database.
                </div>
              ) : (
                <div className="overflow-x-auto ring-1 ring-gray-100 rounded-2xl">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50 border-b border-gray-150 font-extrabold text-[#020c38] opacity-80 text-[10px] uppercase">
                        <th className="p-4">ID &amp; Pembeli</th>
                        <th className="p-4">Alamat Kirim</th>
                        <th className="p-4 font-normal">Garmen Checkout Item</th>
                        <th className="p-4 font-mono text-center">Total Nilai</th>
                        <th className="p-4">Status &amp; Kurir</th>
                        <th className="p-4 text-right">Ubah Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredOrders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-slate-50/50 transition-all">
                          <td className="p-4">
                            <span className="font-mono bg-blue-50 text-[#2541ff] font-extrabold px-2 py-0.5 rounded-[5px] text-[9.5px] block w-max mb-1">{ord.id}</span>
                            <span className="font-black text-slate-800 text-xs">{ord.buyerName}</span>
                            <span className="text-[10px] text-gray-400 font-medium block">{ord.buyerPhone}</span>
                          </td>
                          <td className="p-4 text-gray-500 font-semibold max-w-[150px] truncate" title={ord.address}>
                            {ord.address} <span className="block text-[9.5px] text-gray-400">Kode Pos: {ord.postalCode}</span>
                          </td>
                          <td className="p-4 space-y-1 text-[11px]">
                            {ord.items.map((it) => (
                              <div key={it.product.id} className="font-bold text-slate-700">
                                {it.product.name} <span className="text-gray-400 font-medium">(x{it.quantity})</span>
                              </div>
                            ))}
                          </td>
                          <td className="p-4 font-black text-emerald-700 font-mono text-right text-xs">
                            Rp {ord.totalPrice.toLocaleString("id-ID")}
                          </td>
                          <td className="p-4">
                            <span className="font-extrabold text-blue-900 block mb-1 font-mono uppercase text-[9.5px]">{ord.courier}</span>
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${
                              ord.status === "pending_payment" ? "bg-amber-50 text-amber-600 border border-amber-200" :
                              ord.status === "paid" ? "bg-blue-50 text-[#2c46a9] border border-blue-200" :
                              ord.status === "packing" ? "bg-purple-50 text-purple-700 border border-purple-200" :
                              ord.status === "with_courier" ? "bg-cyan-50 text-cyan-600 border border-cyan-200" :
                              ord.status === "in_transit" ? "bg-indigo-50 text-indigo-700 border border-indigo-200" :
                              ord.status === "shipped" ? "bg-green-50 text-green-700 border border-green-200" :
                              ord.status === "completed" ? "bg-green-100 text-green-800 border border-green-300 animate-pulse" :
                              "bg-red-50 text-red-750 border border-red-200"
                            }`}>
                              {ord.status === "pending_payment" && "Menunggu Pembayaran"}
                              {ord.status === "paid" && "Pembayaran Lunas"}
                              {ord.status === "packing" && "Proses Packing"}
                              {ord.status === "with_courier" && "Diantar Kurir"}
                              {ord.status === "in_transit" && "Di Perjalanan"}
                              {ord.status === "shipped" && "Dikirim"}
                              {ord.status === "completed" && "Selesai"}
                              {ord.status === "cancelled" && "Dibatalkan"}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <select
                              value={ord.status}
                              onChange={(e) => {
                                const nextStatus = e.target.value as any;
                                onUpdateOrdersList((prev) =>
                                  prev.map((o) => (o.id === ord.id ? { ...o, status: nextStatus } : o))
                                );
                                showNotif(`Status Pesanan ${ord.id} Berhasil Diubah ke ${nextStatus.toUpperCase()}!`);
                              }}
                              className="px-2 py-1 bg-[#f8fafc] border border-gray-200 rounded-xl text-[10px] font-bold text-slate-700 cursor-pointer outline-none focus:border-blue-500"
                            >
                              <option value="pending_payment">Tunda Pembayaran</option>
                              <option value="paid">Sudah Dibayar</option>
                              <option value="packing">Proses Packing</option>
                              <option value="with_courier">Diantar Kurir</option>
                              <option value="in_transit">Di Perjalanan / Transit</option>
                              <option value="shipped">Sudah Dikirim</option>
                              <option value="completed">Selesai</option>
                              <option value="cancelled">Dibatalkan</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 8: MANAJEMEN RATING & REVIEW MODERATOR */}
          {activeTab === "ratings" && (
            <div className="bg-white border border-gray-150 rounded-3xl p-6 lg:p-8 space-y-6 shadow-xs animate-fadeIn text-left">
              <div>
                <h3 className="text-lg font-black text-[#020c38] font-poppins">Manajemen Rating &amp; Review Garmen</h3>
                <p className="text-xs text-gray-400 mt-1">Pantau, sunting, serta hapus ulasan negatif/tidak valid demi stabilitas reputasi etalase.</p>
              </div>

              {/* star level analysis breakdown card */}
              <div className="bg-[#f8fafc] p-6.5 rounded-2xl border border-gray-150 flex flex-col md:flex-row gap-6 items-center">
                <div className="text-center md:border-r border-gray-200 pr-0 md:pr-10 select-none">
                  <div className="flex items-baseline justify-center gap-1">
                    <h2 className="text-3xl font-black text-[#020c38] font-mono leading-none">4.8</h2>
                    <span className="text-slate-400 font-bold block text-sm">/ 5.0</span>
                  </div>
                  <div className="flex text-amber-400 text-xs mt-1 justify-center gap-0.5 font-bold">
                    <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                  </div>
                  <p className="text-[10px] text-gray-400 font-extrabold uppercase mt-2 tracking-wide">
                    {reviews.length} total rating terkelola
                  </p>
                </div>

                <div className="flex-1 space-y-2.5 w-full text-xs">
                  {/* Bar 5 star */}
                  <div className="flex items-center gap-3">
                    <span className="font-extrabold w-2">5</span>
                    <span className="text-amber-400 text-[9px]">★</span>
                    <div className="flex-1 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#2541ff] h-full w-[85%]"></div>
                    </div>
                    <span className="text-slate-400 text-[10px] w-12 text-right">85%</span>
                  </div>
                  {/* Bar 4 star */}
                  <div className="flex items-center gap-3">
                    <span className="font-extrabold w-2">4</span>
                    <span className="text-amber-400 text-[9px]">★</span>
                    <div className="flex-1 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#2541ff] h-full w-[10%]"></div>
                    </div>
                    <span className="text-slate-400 text-[10px] w-12 text-right">10%</span>
                  </div>
                  {/* Bar 3 star */}
                  <div className="flex items-center gap-3">
                    <span className="font-extrabold w-2">3</span>
                    <span className="text-amber-400 text-[9px]">★</span>
                    <div className="flex-1 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#2541ff] h-full w-[5%]"></div>
                    </div>
                    <span className="text-slate-400 text-[10px] w-12 text-right">5%</span>
                  </div>
                </div>
              </div>

              {/* lists reviews with deleting capabilities */}
              <div className="space-y-4">
                <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest border-b pb-1.5 mb-2">Review Moderator Queue</p>
                {reviews.map((r) => (
                  <div key={r.id} className="p-4 bg-white border border-gray-150 rounded-2xl flex items-start gap-4 shadow-xs">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center font-bold text-xs shrink-0 select-none text-[#2c46a9]">
                      {r.buyerName[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap justify-between items-start gap-1">
                        <div>
                          <p className="font-semibold text-slate-800 text-xs">{r.buyerName}</p>
                          <p className="text-[9.5px] text-gray-450 mt-0.5">Produk: <span className="text-[#2c46a9] font-semibold">#{r.productName}</span></p>
                        </div>
                        <span className="text-[9px] text-gray-400 font-mono font-semibold">{r.createdAt}</span>
                      </div>
                      
                      <div className="flex items-center gap-2.5 mt-1.5">
                        <div className="flex text-yellow-500 text-[11px] gap-0.5 leading-none select-none">
                          {Array.from({ length: r.rating }).map((_, idx) => (
                            <span key={idx}>★</span>
                          ))}
                        </div>
                        <span className={`text-[8px] px-2 py-0.5 rounded-full font-semibold border ${
                          r.isApproved 
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                            : "bg-amber-50 text-amber-700 border-amber-100 animate-pulse"
                        }`}>
                          {r.isApproved ? "Approved & Live" : "Menunggu Persetujuan Admin"}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-600 mt-2.5 leading-relaxed italic font-medium">&quot;{r.reviewText}&quot;</p>
                    </div>

                    <div className="flex flex-col gap-1.5 shrink-0">
                      {!r.isApproved && (
                        <button
                          onClick={() => handleApproveReview(r.id)}
                          className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-xl text-[9px] font-semibold uppercase tracking-wide cursor-pointer transition-all text-center"
                        >
                          Approve Live
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteReview(r.id)}
                        className="bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-100 px-3 py-1.5 rounded-xl text-[9px] font-semibold uppercase tracking-wide cursor-pointer transition-all text-center"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </main>
    </div>
  );
}
