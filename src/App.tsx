import React, { useState, useEffect } from "react";
import { Page, Product, FilterState, User, Order, ChatRoom, ChatMessage, ProductFeedback, CategoryData } from "./types";
import { PRODUCTS, CATEGORIES_DATA } from "./data";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Beranda from "./components/Beranda";
import Produk from "./components/Produk";
import CaraKerja from "./components/CaraKerja";
import AboutUs from "./components/AboutUs";
import CartDrawer from "./components/CartDrawer";
import SellModal from "./components/SellModal";
import DetailBarang from "./components/DetailBarang";
import TokoProfile from "./components/TokoProfile";

// Newly Created Premium Workspace Portals
import Login from "./components/Login";
import CartPage, { CartItem } from "./components/CartPage";
import SellerDashboard from "./components/SellerDashboard";
import AdminDashboard from "./components/AdminDashboard";
import BuyerDashboard from "./components/BuyerDashboard";
import CustomAlert from "./components/CustomAlert";
import ChatWidget from "./components/ChatWidget";

// Safe storage helper to prevent crash in restricted iframe cookies or sandboxing environments
const safeStorage = {
  getItem(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.warn("Storage access denied:", e);
      return null;
    }
  },
  setItem(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn("Storage write denied:", e);
    }
  },
  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn("Storage delete denied:", e);
    }
  }
};

export default function App() {
  const [activePage, setActivePage] = useState<Page>("beranda");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedShopName, setSelectedShopName] = useState<string>("Budi Vintage");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Initialize default PRODUCTS with persistence, merging latest seed products to guarantee Featured Products load perfectly
  const [products, setProducts] = useState<Product[]>(() => {
    const cached = safeStorage.getItem("wearloop_products");
    let loaded: Product[] = [];
    if (cached) {
      try {
        loaded = JSON.parse(cached);
      } catch (e) {
        console.error("Failed to parse wearloop_products from localStorage:", e);
      }
    }
    
    // Process the latest list from PRODUCTS
    const defaultList = PRODUCTS.map((p) => ({
      ...p,
      isApproved: p.isApproved === undefined ? true : p.isApproved,
      status: p.status === undefined ? "active" : p.status,
      sellerId: p.sellerId || "seller-1",
      sellerName: p.sellerName || "Wearloop Partner",
    }));

    if (!loaded || loaded.length === 0) {
      return defaultList;
    }

    // Merge: Keep all items from cache, but if a default item exists, merge it to keep properties/isFeatured up-to-date
    const merged = [...loaded];
    defaultList.forEach((defP) => {
      const idx = merged.findIndex((p) => p.id === defP.id);
      if (idx === -1) {
        merged.push(defP);
      } else {
        merged[idx] = {
          ...defP,
          ...merged[idx],
          isFeatured: defP.isFeatured, // Sync isFeatured so it matches the latest designs
          isApproved: merged[idx].isApproved !== undefined ? merged[idx].isApproved : defP.isApproved,
          status: merged[idx].status || defP.status,
          image: defP.image || merged[idx].image, // Sync updated images from the data layer
        };
      }
    });

    return merged;
  });
  
  const [categoriesData, setCategoriesData] = useState<CategoryData[]>(() => {
    const cached = safeStorage.getItem("wearloop_categories");
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        console.error("Failed to parse wearloop_categories from localStorage:", e);
      }
    }
    return CATEGORIES_DATA;
  });

  const [likes, setLikes] = useState<Record<string, boolean>>(() => {
    const cached = safeStorage.getItem("wearloop_likes");
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        console.error("Failed to parse wearloop_likes from localStorage:", e);
      }
    }
    return {
      "1": true, // Pre-like first item as a realistic sample
    };
  });

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const cached = safeStorage.getItem("wearloop_cart_items");
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        console.error("Failed to parse wearloop_cart_items from localStorage:", e);
      }
    }
    return [];
  });

  const [cartOpen, setCartOpen] = useState(false);
  const [sellModalOpen, setSellModalOpen] = useState(false);

  // Authenticated states
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const cached = safeStorage.getItem("wearloop_current_user");
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        console.error("Failed to parse wearloop_current_user from localStorage:", e);
      }
    }
    return null;
  });
  
  // Seed initial users list with active accounts for Buyer, Seller, Admin, and a pending seller
  const [registeredUsers, setRegisteredUsers] = useState<User[]>(() => {
    const cached = safeStorage.getItem("wearloop_users");
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        console.error("Failed to parse wearloop_users from localStorage:", e);
      }
    }
    return [
      {
        id: "buyer-1",
        email: "buyer@wearloop.com",
        name: "Dinar Setyawan (Demo Buyer)",
        role: "buyer",
        phoneNumber: "08123456789",
        isApproved: true,
        password: "password123",
      },
      {
        id: "seller-1",
        email: "seller@wearloop.com",
        name: "Budi Susanto",
        role: "seller",
        phoneNumber: "08987654321",
        isApproved: true,
        shopName: "Budi Vintage",
        shopDesc: "Original varsity and retro jackets",
        bankName: "BCA",
        bankAccountNumber: "8620891230",
        bankAccountHolder: "Budi Susanto",
        password: "password123",
      },
      {
        id: "seller-pending",
        email: "pending@wearloop.com",
        name: "Ahmad Dani",
        role: "seller",
        phoneNumber: "0855223344",
        isApproved: false, // Ahmed must be approved by Admin dashboard first!
        shopName: "Dani Vintage Hub",
        shopDesc: "Jakarta retro thrifting specialist",
        bankName: "Mandiri",
        bankAccountNumber: "1234567890",
        bankAccountHolder: "Ahmad Dani",
        password: "password123",
      },
      {
        id: "admin-1",
        email: "admin@wearloop.com",
        name: "Super Admin",
        role: "admin",
        isApproved: true,
        password: "admin123",
      },
    ];
  });

  // Initial order tracking structure
  const [orders, setOrders] = useState<Order[]>(() => {
    const cached = safeStorage.getItem("wearloop_orders");
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        console.error("Failed to parse wearloop_orders from localStorage:", e);
      }
    }
    return [];
  });

  // Global Moderator Product Reviews state
  const [reviews, setReviews] = useState<ProductFeedback[]>(() => {
    const cached = safeStorage.getItem("wearloop_reviews");
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        console.error("Failed to parse wearloop_reviews from localStorage:", e);
      }
    }
    return [
      {
        id: "rev-1",
        productId: "1",
        productName: "Heritage Corduroy Shirt",
        buyerName: "Dimas Saputra",
        rating: 5,
        reviewText: "Baju wangi banget, kondisinya bagai baru! Sterilisasi laundry bergaransi super memuaskan.",
        createdAt: "15/05/2026",
        isApproved: true,
      },
      {
        id: "rev-2",
        productId: "2",
        productName: "Vintage Racing Jacket",
        buyerName: "Rani Amalia",
        rating: 5,
        reviewText: "Bahannya tebal dan harum sekali saat paket dibuka. Penjual sangat fast response!",
        createdAt: "10/05/2026",
        isApproved: true,
      },
      {
        id: "rev-3",
        productId: "3",
        productName: "Cargo Pants Black",
        buyerName: "Zaka Pratama",
        rating: 4,
        reviewText: "Ukuran pas sekali sesuai deskripsi. Pengiriman cepat dan wanginya awet seharian.",
        createdAt: "02/05/2026",
        isApproved: true,
      },
    ];
  });

  // --- FLOATING CHAT SYSTEM STATE ---
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>(() => {
    const cached = safeStorage.getItem("wearloop_chat_rooms");
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        console.error("Failed to parse wearloop_chat_rooms from localStorage:", e);
      }
    }
    return [
      {
        id: "room_buyer_admin_seed",
        sellerId: "admin",
        sellerName: "Super Admin",
        buyerId: "buyer-1",
        buyerName: "Dinar Setyawan (Demo Buyer)",
        lastUpdated: new Date().toLocaleDateString("id-ID"),
        messages: [
          {
            id: "m_adm_1",
            senderId: "buyer-1",
            senderName: "Dinar Setyawan (Demo Buyer)",
            text: "Halo Admin, saya mengalami kendala saat konfirmasi pembayaran, apa transaksinya sudah verifikasi?",
            createdAt: "10:32",
          },
          {
            id: "m_adm_2",
            senderId: "admin",
            senderName: "Super Admin",
            text: "Halo Kak Dinar! Terima kasih sudah menghubungi CS Wearloop. Kami cek transaksi Anda sudah lunas dan telah kami approve untuk diteruskan ke mitra seller kami.",
            createdAt: "10:34",
          },
        ],
      },
      {
        id: "room_buyer_seller_1",
        sellerId: "seller-1",
        sellerName: "Budi Vintage",
        buyerId: "buyer-1",
        buyerName: "Dinar Setyawan (Demo Buyer)",
        lastUpdated: new Date().toLocaleDateString("id-ID"),
        productName: "Heritage Corduroy Shirt",
        productImage: "https://i.postimg.cc/QdM2s46R/item2.png",
        messages: [
          {
            id: "m1",
            senderId: "buyer-1",
            senderName: "Dinar Setyawan (Demo Buyer)",
            text: "Halo Kak Budi, apakah kemeja corduroy heritagenya masih ada? Lebarnya berapa ya?",
            createdAt: "10:24",
          },
          {
            id: "m2",
            senderId: "seller-1",
            senderName: "Budi Vintage",
            text: "Halo Kak Dinar! Masih ready kok. Untuk lebar dadanya 54cm dan panjangnya 70cm ya Kak. Bersih wangi siap pakai 😁",
            createdAt: "10:27",
          },
        ],
      },
      {
        id: "room_b1_seller-1",
        sellerId: "seller-1",
        sellerName: "Budi Vintage",
        buyerId: "b1",
        buyerName: "Dinda Ramadhani",
        lastUpdated: "10:30",
        productName: "Hoodie Vintage Nike Size M",
        productImage: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=200&auto=format&fit=crop",
        messages: [
          { id: "m1", senderId: "b1", senderName: "Dinda Ramadhani", text: "Kak, kalo Nike hoodie ini ready warna lain?", createdAt: "10:28" },
          { id: "m2", senderId: "seller-1", senderName: "Budi Vintage", text: "Hai kak Dinda! 😊 Untuk hoodie ini ready warna hitam, abu-abu, dan navy ya kak.", createdAt: "10:29" },
          { id: "m3", senderId: "b1", senderName: "Dinda Ramadhani", text: "kalau ukuran M masih ada kak?", createdAt: "10:29" },
          { id: "m4", senderId: "seller-1", senderName: "Budi Vintage", text: "Masih ada kak, stock M ready ya. Mau saya bantu buatkan pesanan?", createdAt: "10:30" },
          { id: "m5", senderId: "b1", senderName: "Dinda Ramadhani", text: "iya kak, boleh. tolong ya Pemilik Toko 🙏", createdAt: "10:30" },
        ]
      },
      {
        id: "room_b2_seller-1",
        sellerId: "seller-1",
        sellerName: "Budi Vintage",
        buyerId: "b2",
        buyerName: "Rizky Putra",
        lastUpdated: "09:15",
        productName: "Cargo Pants Black Size L",
        productImage: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=200&auto=format&fit=crop",
        messages: [
          { id: "m1", senderId: "b2", senderName: "Rizky Putra", text: "Apakah bisa dikirim hari ini kak?", createdAt: "09:15" }
        ]
      },
      {
        id: "room_b3_seller-1",
        sellerId: "seller-1",
        sellerName: "Budi Vintage",
        buyerId: "b3",
        buyerName: "Salsa Aulia",
        lastUpdated: "Kemarin",
        productName: "Varsity Jacket Vintage Red",
        productImage: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=200&auto=format&fit=crop",
        messages: [
          { id: "m1", senderId: "b3", senderName: "Salsa Aulia", text: "Minta foto detail bagian belakangnya dong", createdAt: "Kemarin" }
        ]
      },
      {
        id: "room_b4_seller-1",
        sellerId: "seller-1",
        sellerName: "Budi Vintage",
        buyerId: "b4",
        buyerName: "Bimo Pratama",
        lastUpdated: "Kemarin",
        productName: "Vintage Band Tee Size XL",
        productImage: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=200&auto=format&fit=crop",
        messages: [
          { id: "m1", senderId: "b4", senderName: "Bimo Pratama", text: "Ukuran L masih ada kak?", createdAt: "Kemarin" }
        ]
      }
    ];
  });

  const [chatWidgetOpen, setChatWidgetOpen] = useState(false);
  const [activeChatRoomId, setActiveChatRoomId] = useState<string | null>(null);

  // Auto-sync state variables to safeStorage when changed
  useEffect(() => {
    safeStorage.setItem("wearloop_products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    safeStorage.setItem("wearloop_categories", JSON.stringify(categoriesData));
  }, [categoriesData]);

  useEffect(() => {
    safeStorage.setItem("wearloop_likes", JSON.stringify(likes));
  }, [likes]);

  useEffect(() => {
    safeStorage.setItem("wearloop_cart_items", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (currentUser) {
      safeStorage.setItem("wearloop_current_user", JSON.stringify(currentUser));
    } else {
      safeStorage.removeItem("wearloop_current_user");
    }
  }, [currentUser]);

  useEffect(() => {
    safeStorage.setItem("wearloop_users", JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  useEffect(() => {
    safeStorage.setItem("wearloop_orders", JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    safeStorage.setItem("wearloop_reviews", JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    safeStorage.setItem("wearloop_chat_rooms", JSON.stringify(chatRooms));
  }, [chatRooms]);

  // Auto-guarantee a Super Admin chat room exists for any logged-in user
  useEffect(() => {
    if (currentUser && currentUser.role !== "admin") {
      const adminRoomId = `room_${currentUser.id}_admin`;
      const hasAdminRoom = chatRooms.some((r) => r.id === adminRoomId);
      if (!hasAdminRoom) {
        const adminRoom: ChatRoom = {
          id: adminRoomId,
          sellerId: "admin",
          sellerName: "Super Admin",
          buyerId: currentUser.id,
          buyerName: currentUser.name,
          lastUpdated: new Date().toLocaleTimeString("id", { hour: "2-digit", minute: "2-digit" }),
          messages: [
            {
              id: `msg_init_${Date.now()}`,
              senderId: "admin",
              senderName: "Super Admin",
              text: `Halo ${currentUser.name}! Hubungi kami (Admin) jika ada kendala di platform Wearloop. Bagaimana kami bisa membantu Anda hari ini?`,
              createdAt: "08:00",
            },
          ],
        };
        setChatRooms((prev) => [adminRoom, ...prev]);
      }
    }
  }, [currentUser, chatRooms]);

  const handleOpenChatWithSeller = (product: Product) => {
    if (!currentUser) {
      showAlert(
        "Ingin Bertanya Garmen?",
        "Silakan masuk akun Anda terlebih dahulu untuk memulai obrolan langsung (Chat) dengan toko mitra!",
        "warning",
        () => {
          setActivePage("login");
        }
      );
      return;
    }

    const roomId = `room_${currentUser.id}_${product.sellerId}_${product.id}`;
    const roomExists = chatRooms.find((r) => r.id === roomId);

    if (!roomExists) {
      const newRoom: ChatRoom = {
        id: roomId,
        productId: product.id,
        productName: product.name,
        productImage: product.image,
        sellerId: product.sellerId,
        sellerName: product.sellerName,
        buyerId: currentUser.id,
        buyerName: currentUser.name,
        lastUpdated: new Date().toLocaleTimeString("id", { hour: "2-digit", minute: "2-digit" }),
        messages: [
          {
            id: `msg_init_${Date.now()}`,
            senderId: currentUser.id,
            senderName: currentUser.name,
            text: `Halo Kak ${product.sellerName}! Saya tertarik dengan produk "${product.name}". Apakah item ini masih tersedia?`,
            createdAt: new Date().toLocaleTimeString("id", { hour: "2-digit", minute: "2-digit" }),
          },
        ],
      };

      setChatRooms((prev) => [newRoom, ...prev]);
      setActiveChatRoomId(roomId);
    } else {
      setActiveChatRoomId(roomId);
    }

    setChatWidgetOpen(true);
  };

  const handleOpenChatWithAdmin = () => {
    if (!currentUser) {
      setChatWidgetOpen(true);
      return;
    }

    const roomId = `room_${currentUser.id}_admin`;
    const roomExists = chatRooms.find((r) => r.id === roomId);

    if (!roomExists) {
      const newRoom: ChatRoom = {
        id: roomId,
        sellerId: "admin",
        sellerName: "Super Admin",
        buyerId: currentUser.id,
        buyerName: currentUser.name,
        lastUpdated: new Date().toLocaleTimeString("id", { hour: "2-digit", minute: "2-digit" }),
        messages: [
          {
            id: `msg_init_${Date.now()}`,
            senderId: "admin",
            senderName: "Super Admin",
            text: `Halo Kak ${currentUser.name}! Hubungi kami (Admin) jika ada kendala di platform Wearloop. Bagaimana kami bisa membantu Anda hari ini?`,
            createdAt: new Date().toLocaleTimeString("id", { hour: "2-digit", minute: "2-digit" }),
          },
        ],
      };

      setChatRooms((prev) => [newRoom, ...prev]);
      setActiveChatRoomId(roomId);
    } else {
      setActiveChatRoomId(roomId);
    }

    setChatWidgetOpen(true);
  };

  const handleSendMessageWidget = (roomId: string, messageText: string, customSenderId?: string, customSenderName?: string) => {
    const senderId = customSenderId || (currentUser ? currentUser.id : "guest");
    const senderName = customSenderName || (currentUser ? currentUser.name : "Tamu");
    const timeStr = new Date().toLocaleTimeString("id", { hour: "2-digit", minute: "2-digit" });
    
    const newMsg: ChatMessage = {
      id: String(Date.now() + Math.random()),
      senderId,
      senderName,
      text: messageText,
      createdAt: timeStr,
    };

    setChatRooms((prev) =>
      prev.map((room) => {
        if (room.id === roomId) {
          return {
            ...room,
            lastUpdated: timeStr,
            messages: [...room.messages, newMsg],
          };
        }
        return room;
      })
    );
  };

  // Active filter state for the Produk tab
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: "",
    minPrice: "",
    maxPrice: "",
    categories: [],
    sizes: [],
    conditions: [],
    sortBy: "newest",
  });

  // Simple floating notifications/toasts
  const [toasts, setToasts] = useState<{ id: string; message: string; type: "success" | "info" }[]>([]);

  const addToast = (message: string, type: "success" | "info" = "success") => {
    const id = String(Date.now() + Math.random());
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  // Custom warning dialog configs
  const [alertConfig, setAlertConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: "info" | "warning" | "success" | "error";
    onConfirm?: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    type: "warning",
  });

  const showAlert = (
    title: string,
    message: string,
    type: "info" | "warning" | "success" | "error" = "warning",
    onConfirm?: () => void
  ) => {
    setAlertConfig({
      isOpen: true,
      title,
      message,
      type,
      onConfirm,
    });
  };

  // Add to cart logical handler - with mandatory login check as requested
  const handleAddToCart = (product: Product) => {
    if (!currentUser) {
      showAlert(
        "Wah, Belum Masuk Akun!",
        "Silakan masuk akun atau daftar terlebih dahulu untuk menyimpan barang kece-mu masuk ke keranjang belanja Wearloop!",
        "warning",
        () => {
          setActivePage("login");
        }
      );
      return;
    }

    const isSoldOut = (product.stock !== undefined && product.stock <= 0) || product.status === "inactive";
    if (isSoldOut) {
      showAlert(
        "Maaf, barang sudah habis",
        "Mohon maaf, pakaian preloved estetik ini telah habis terjual ke pembeli lain sehingga stok kosong.",
        "warning"
      );
      return;
    }

    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      const currentQtyInCart = existing ? existing.quantity : 0;
      const maxStock = product.stock !== undefined ? product.stock : 1;

      if (currentQtyInCart + 1 > maxStock) {
        showAlert(
          "Maaf, barang sudah habis",
          `Mohon maaf, Anda tidak dapat memesan melebihi batas stok tersedia (${maxStock} pakaian).`,
          "warning"
        );
        return prev;
      }

      if (existing) {
        addToast(`Kuantitas ${product.name} ditambah di keranjang!`, "success");
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      addToast(`${product.name} dimasukkan ke keranjang belanja!`, "success");
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleUpdateQty = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => {
      const match = prev.find((item) => item.product.id === productId);
      if (match) {
        addToast(`${match.product.name} dihapus dari keranjang.`, "info");
      }
      return prev.filter((item) => item.product.id !== productId);
    });
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleToggleLike = (productId: string) => {
    setLikes((prev) => {
      const wasLiked = !!prev[productId];
      const next = { ...prev, [productId]: !wasLiked };
      const product = products.find((p) => p.id === productId);
      if (product) {
        addToast(
          wasLiked
            ? `${product.name} dihapus dari daftar favorit.`
            : `${product.name} ditambahkan ke daftar favorit!`,
          wasLiked ? "info" : "success"
        );
      }
      return next;
    });
  };

  // Pre-select category function (called when category is clicked on homepage)
  const handleSelectCategory = (catName: string) => {
    setFilters((prev) => ({
      ...prev,
      categories: [catName],
    }));
  };

  // Add customized self-listed product to general list
  const handleAddProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
    addToast(`"${newProduct.name}" lolos kurasi & ditampilkan di toko!`, "success");
    setActivePage("produk");
  };

  // Count helper
  const totalCartQty = cartItems.reduce((acc, current) => acc + current.quantity, 0);

  const showHeaderFooter = !["login", "dashboard-seller", "dashboard-admin"].includes(activePage);

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between selection:bg-[#2c46a9] selection:text-white relative">
      {/* Navbar segment */}
      {showHeaderFooter && (
        <Navbar
          activePage={activePage}
          setActivePage={(p) => {
            setActivePage(p);
            // If moving between pages, sync initial queries if beneficial
            if (p === "produk") {
              setFilters((f) => ({ ...f, searchQuery: searchQuery }));
            }
          }}
          cartCount={totalCartQty}
          onOpenCart={() => setCartOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={(q) => {
            setSearchQuery(q);
            setFilters((f) => ({ ...f, searchQuery: q }));
          }}
          currentUser={currentUser}
          chatRooms={chatRooms}
          onLogout={() => {
            setCurrentUser(null);
            addToast("Anda telah keluar dari akun.", "info");
            setActivePage("beranda");
          }}
          onOpenChatRoom={(roomId) => {
            setActiveChatRoomId(roomId);
            setChatWidgetOpen(true);
          }}
        />
      )}

      {/* Render current page */}
      <div className="flex-grow">
        {activePage === "beranda" && (
          <Beranda
            products={products}
            onAddToCart={handleAddToCart}
            onSelectCategory={handleSelectCategory}
            setActivePage={setActivePage}
            likes={likes}
            onToggleLike={handleToggleLike}
            onSelectProduct={setSelectedProduct}
            categoriesData={categoriesData}
          />
        )}

        {activePage === "produk" && (
          <Produk
            products={products}
            onAddToCart={handleAddToCart}
            likes={likes}
            onToggleLike={handleToggleLike}
            initialFilters={filters}
            setInitialFilters={setFilters}
            onSelectProduct={setSelectedProduct}
            setActivePage={setActivePage}
          />
        )}

        {activePage === "cara-kerja" && (
          <CaraKerja
            setActivePage={setActivePage}
            onOpenSellModal={() => setSellModalOpen(true)}
            showAlert={showAlert}
          />
        )}

        {activePage === "tentang-kami" && (
          <AboutUs 
            setActivePage={setActivePage}
            onShowNewsletterToast={(email) => {
              addToast(`Terima kasih! "${email}" terdaftar sukses di newsletter Wearloop.`, "success");
            }}
            showAlert={showAlert}
          />
        )}

        {activePage === "detail" && (
          <DetailBarang
            product={selectedProduct}
            onAddToCart={handleAddToCart}
            likes={likes}
            onToggleLike={handleToggleLike}
            products={products}
            onSelectProduct={setSelectedProduct}
            setActivePage={setActivePage}
            showAlert={showAlert}
            onOpenChatWithSeller={handleOpenChatWithSeller}
            reviews={reviews}
            onUpdateReviews={setReviews}
            currentUser={currentUser}
            onVisitShop={(shopName) => {
              setSelectedShopName(shopName);
              setActivePage("toko");
            }}
          />
        )}

        {activePage === "toko" && (
          <TokoProfile
            shopName={selectedShopName}
            products={products}
            registeredUsers={registeredUsers}
            setActivePage={setActivePage}
            onSelectProduct={setSelectedProduct}
            onAddToCart={handleAddToCart}
            likes={likes}
            onToggleLike={handleToggleLike}
          />
        )}

        {activePage === "login" && (
          <Login
            onLoginSuccess={(user) => {
              setCurrentUser(user);
              if (user.role === "admin") {
                setActivePage("dashboard-admin");
              } else if (user.role === "seller") {
                setActivePage("dashboard-seller");
              } else {
                setActivePage("dashboard-buyer");
              }
              addToast(`Selamat datang kembali, ${user.name}!`, "success");
            }}
            registeredUsers={registeredUsers}
            onRegisterUser={(newUser) => {
              setRegisteredUsers((prev) => [...prev, newUser]);
              addToast(`Registrasi sukses! Silakan login sebagai ${newUser.name}.`, "success");
            }}
            setActivePage={setActivePage}
          />
        )}

        {activePage === "dashboard-buyer" && (
          <BuyerDashboard
            currentUser={currentUser}
            orders={orders}
            setActivePage={setActivePage}
            onLogout={() => {
              setCurrentUser(null);
              setActivePage("beranda");
            }}
            showAlert={showAlert}
            products={products}
            likes={likes}
            onToggleLike={handleToggleLike}
            onAddToCart={handleAddToCart}
            onOpenChatWithSeller={handleOpenChatWithSeller}
            onOpenChatWithAdmin={handleOpenChatWithAdmin}
            onOpenInbox={() => setChatWidgetOpen(true)}
          />
        )}

        {activePage === "dashboard-seller" && (
          <SellerDashboard
            currentUser={currentUser}
            products={products}
            orders={orders}
            onAddProduct={(newProd) => {
              setProducts((prev) => [newProd, ...prev]);
              addToast(`Produk "${newProd.name}" berhasil diunggah!`, "success");
            }}
            onUpdateProductsList={setProducts}
            onUpdateOrdersList={setOrders}
            onUpdateUserBank={(updatedUsr) => {
              setCurrentUser(updatedUsr);
              setRegisteredUsers((prev) =>
                prev.map((u) => (u.id === updatedUsr.id ? updatedUsr : u))
              );
              addToast("Informasi toko & bank berhasil disimpan!", "success");
            }}
            setActivePage={setActivePage}
            chatRooms={chatRooms}
            onSendMessage={handleSendMessageWidget}
            onLogout={() => {
              setCurrentUser(null);
              addToast("Anda telah keluar dari dashboard seller.", "info");
              setActivePage("login");
            }}
            onOpenChatWithAdmin={handleOpenChatWithAdmin}
          />
        )}

        {activePage === "dashboard-admin" && (
          <AdminDashboard
            currentUser={currentUser}
            products={products}
            orders={orders}
            registeredUsers={registeredUsers}
            onUpdateProductsList={setProducts}
            onUpdateOrdersList={setOrders}
            onUpdateUsersList={setRegisteredUsers}
            setActivePage={setActivePage}
            allChatRooms={chatRooms}
            onSendMessage={handleSendMessageWidget}
            reviews={reviews}
            onUpdateReviews={setReviews}
            categoriesData={categoriesData}
            onUpdateCategories={setCategoriesData}
          />
        )}

        {activePage === "cart" && (
          <CartPage
            cartItems={cartItems}
            onUpdateQty={handleUpdateQty}
            onRemoveItem={handleRemoveItem}
            onClearCart={handleClearCart}
            currentUser={currentUser}
            registeredUsers={registeredUsers}
            onAddOrder={(newOrder) => {
              // Decrement product stock & set to sold-out (inactive) if stock is 0
              setProducts((prevProducts) =>
                prevProducts.map((p) => {
                  const purchasedItem = newOrder.items.find((it) => it.product.id === p.id);
                  if (purchasedItem) {
                    const currentStock = p.stock !== undefined ? p.stock : 1;
                    const nextStock = Math.max(0, currentStock - purchasedItem.quantity);
                    return {
                      ...p,
                      stock: nextStock,
                      status: nextStock === 0 ? "inactive" : p.status,
                    };
                  }
                  return p;
                })
              );
              setOrders((prev) => [newOrder, ...prev]);
              setCartItems([]); // Clear cart items after successful order checkout
              addToast("Pesanan Anda telah dimasukkan ke eskrow!", "success");
              setActivePage("dashboard-buyer");
            }}
            setActivePage={setActivePage}
          />
        )}
      </div>

      <CustomAlert
        isOpen={alertConfig.isOpen}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        onClose={() => setAlertConfig((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={alertConfig.onConfirm}
      />

      {/* Footer segment */}
      {showHeaderFooter && (
        <Footer
          setActivePage={setActivePage}
          onShowNewsletterToast={(email) => {
            addToast(`Terima kasih! "${email}" terdaftar sukses di newsletter Wearloop.`, "success");
          }}
        />
      )}

      {/* Floating Shopping Cart Drawer */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onSuccessCheckout={() => {
          addToast("Pembayaran checkout berhasil dikonfirmasi! Pesanan diproses.", "success");
        }}
        setActivePage={setActivePage}
      />

      {/* Floating Upload Listing Modal */}
      <SellModal
        isOpen={sellModalOpen}
        onClose={() => setSellModalOpen(false)}
        onAddProduct={handleAddProduct}
      />

      {/* Floating Chat Widget system */}
      <ChatWidget
        isOpen={chatWidgetOpen}
        onClose={() => setChatWidgetOpen(false)}
        onOpen={() => setChatWidgetOpen(true)}
        chatRooms={chatRooms}
        onSendMessage={handleSendMessageWidget}
        currentUser={currentUser}
        activeRoomId={activeChatRoomId}
        setActiveRoomId={setActiveChatRoomId}
        activePage={activePage}
      />

      {/* Floating Toasts Notifications display */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`shadow-lg px-4 py-3 rounded-2xl text-xs font-semibold font-poppins flex items-center gap-2 border pointer-events-auto animate-slide-in relative overflow-hidden bg-white ${
              t.type === "success"
                ? "border-green-100 text-green-700 shadow-green-100/30"
                : "border-blue-100 text-[#2c46a9] shadow-blue-100/30"
            }`}
          >
            {/* Ambient sliding status line indicator */}
            <div
              className={`absolute bottom-0 left-0 h-[3px] bg-current opacity-70 animate-shrink-width`}
              style={{ animationDuration: "3.2s", width: "100%" }}
            />
            <span className="material-symbols-outlined text-[16px]">
              {t.type === "success" ? "check_circle" : "info"}
            </span>
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
