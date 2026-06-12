import React, { useState } from "react";
import { Page, User, ChatRoom } from "../types";

interface NavbarProps {
  activePage: Page;
  setActivePage: (page: Page) => void;
  cartCount: number;
  onOpenCart: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  currentUser: User | null;
  chatRooms?: ChatRoom[];
  onLogout?: () => void;
  onOpenChatRoom?: (roomId: string) => void;
}

export default function Navbar({
  activePage,
  setActivePage,
  cartCount,
  onOpenCart,
  searchQuery,
  setSearchQuery,
  currentUser,
  chatRooms = [],
  onLogout,
  onOpenChatRoom,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Dynamic real notification calculation
  // Notification only appears when user is logged in
  const isUserLoggedIn = !!currentUser;
  
  // Find all rooms where current user is a participant (as buyer or seller)
  const myRooms = isUserLoggedIn 
    ? chatRooms.filter(room => room.buyerId === currentUser.id || room.sellerId === currentUser.id)
    : [];

  // Filter messages not sent by our own user
  const incomingMessages = isUserLoggedIn
    ? myRooms.flatMap(room => {
        const otherMsgs = room.messages.filter(msg => msg.senderId !== currentUser.id);
        if (otherMsgs.length === 0) return [];
        // Just return the very last incoming message from each room to keep it neat
        const lastMsg = otherMsgs[otherMsgs.length - 1];
        return [{
          room,
          lastMsg
        }];
      })
    : [];

  const notificationsCount = isUserLoggedIn ? incomingMessages.length : 0;

  const links: { label: string; value: Page }[] = [
    { label: "Beranda", value: "beranda" },
    { label: "Produk", value: "produk" },
    { label: "Cara Kerja", value: "cara-kerja" },
    { label: "Tentang Kami", value: "tentang-kami" },
  ];

  const handleLinkClick = (page: Page) => {
    setActivePage(page);
    setMobileMenuOpen(false);
  };

  const handleProfileClick = () => {
    if (!currentUser) {
      setActivePage("login");
    } else {
      setProfileDropdownOpen(!profileDropdownOpen);
      setNotifDropdownOpen(false);
    }
  };

  return (
    <nav className="bg-white/95 backdrop-blur-md sticky top-0 z-50 border-b border-gray-50 flex justify-between items-center w-full px-5 md:px-14 py-4 max-w-[1400px] mx-auto select-none">
      {/* Brand Logo */}
      <div className="flex items-center gap-12">
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            handleLinkClick("beranda");
          }}
          className="flex items-center cursor-pointer hover:opacity-90 transition-opacity"
        >
          <img
            src="https://i.postimg.cc/4dS5NfLJ/image-removebg-preview.png"
            alt="Wearloop Logo"
            className="h-12 md:h-14 w-auto object-contain"
          />
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 font-poppins text-[15px]">
          {links.map((link) => {
            const isActive = activePage === link.value;
            return (
              <a
                key={link.value}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(link.value);
                }}
                href={`#${link.value}`}
                className={`transition-all duration-200 cursor-pointer pb-1 relative font-medium ${
                  isActive
                    ? "text-[#2c46a9] font-semibold after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-[#2c46a9]"
                    : "text-gray-600 hover:text-[#2c46a9]"
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* Wishlist Love Heart Button for Logged in Buyer */}
        {currentUser && currentUser.role === "buyer" && (
          <div className="flex flex-col items-center">
            <button
              onClick={() => setActivePage("dashboard-buyer")}
              className="material-symbols-outlined text-red-500 p-2 hover:scale-115 transition-transform hover:bg-[#fff0f0] rounded-full relative leading-none cursor-pointer"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              favorite
            </button>
            <span className="text-[9px] font-bold text-red-400 uppercase tracking-wider block -mt-1 leading-none font-poppins">
              wishlist
            </span>
          </div>
        )}

        {/* Cart Trigger Button */}
        <div className="flex flex-col items-center">
          <button
            onClick={onOpenCart}
            className="material-symbols-outlined text-gray-800 p-2 hover:scale-115 transition-transform hover:bg-gray-50 rounded-full relative leading-none cursor-pointer"
            style={{ fontVariationSettings: "'FILL' 0, 'wght' 400" }}
          >
            shopping_bag
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#2c46a9] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                {cartCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActivePage("cart")}
            className="text-[9px] font-bold text-gray-400 hover:text-[#2c46a9] hover:underline transition-all block -mt-1 uppercase tracking-wider cursor-pointer font-poppins"
          >
            lihat keranjang
          </button>
        </div>

        {/* Notification Icon */}
        <div className="flex flex-col items-center relative">
          <button
            onClick={() => {
              setNotifDropdownOpen(!notifDropdownOpen);
              setProfileDropdownOpen(false);
            }}
            className="material-symbols-outlined text-gray-800 p-2 hover:scale-115 transition-transform hover:bg-gray-50 rounded-full relative leading-none cursor-pointer"
          >
            notifications
            {notificationsCount > 0 && (
              <span className="absolute top-1 right-1 bg-red-500 text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white animate-pulse">
                {notificationsCount}
              </span>
            )}
          </button>
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block -mt-1 leading-none font-poppins">
            Notif
          </span>

          {/* Notifications Dropdown (Real message listing based on seller responses) */}
          {notifDropdownOpen && (
            <div className="absolute right-0 mt-14 w-80 bg-white border border-gray-100 rounded-2xl shadow-xl py-3 px-4 z-50 text-left font-poppins space-y-3">
              <h4 className="text-xs font-black text-gray-800 border-b border-gray-50 pb-2 uppercase tracking-wider flex justify-between items-center">
                <span>Pemberitahuan Chat</span>
                {notificationsCount > 0 && (
                  <span className="bg-red-50 text-red-600 text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                    {notificationsCount} Baru
                  </span>
                )}
              </h4>
              <div className="space-y-2.5 max-h-60 overflow-y-auto">
                {notificationsCount === 0 ? (
                  <div className="text-center py-6 text-gray-400 text-xs font-medium">
                    Tidak ada pemberitahuan pesan baru.
                  </div>
                ) : (
                  incomingMessages.map((item, index) => {
                    const { room, lastMsg } = item;
                    // Determine sender label
                    const otherPartyName = currentUser?.id === room.buyerId ? room.sellerName : room.buyerName;
                    return (
                      <div
                        key={lastMsg.id || index}
                        onClick={() => {
                          setNotifDropdownOpen(false);
                          if (onOpenChatRoom) {
                            onOpenChatRoom(room.id);
                          }
                        }}
                        className="bg-blue-50/50 hover:bg-blue-50 p-2.5 rounded-xl border border-blue-100/50 cursor-pointer transition-colors space-y-1 block text-left"
                      >
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="font-extrabold text-[#2c46a9]">{otherPartyName || "Partner Garmen"}</span>
                          <span className="text-gray-450 font-bold">{lastMsg.createdAt}</span>
                        </div>
                        <p className="text-[11px] text-gray-650 font-semibold leading-relaxed line-clamp-2">
                          "{lastMsg.text}"
                        </p>
                        <span className="text-[9.5px] text-[#2c46a9] font-black flex items-center gap-0.5 pt-1 hover:underline">
                          <span className="material-symbols-outlined text-[13px] font-bold">chat</span> Buka Obrolan &rarr;
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile User Indicator */}
        <div className="relative">
          <button
            onClick={handleProfileClick}
            className={`flex items-center gap-1.5 p-1 px-2.5 rounded-full hover:scale-105 transition-all text-gray-800 cursor-pointer ${
              currentUser 
                ? currentUser.role === "admin"
                  ? "bg-red-50 text-red-600 border border-red-200"
                  : currentUser.role === "seller"
                    ? "bg-purple-50 text-purple-700 border border-purple-200"
                    : "bg-blue-50 text-blue-700 border border-blue-200"
                : "hover:bg-gray-50 bg-slate-50 border border-gray-100"
            }`}
          >
            <span className="material-symbols-outlined select-none" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400" }}>
              {currentUser ? "verified_user" : "account_circle"}
            </span>
            <span className="text-xs font-bold font-poppins hidden sm:inline">
              {currentUser 
                ? currentUser.role === "admin"
                  ? "Admin"
                  : currentUser.shopName || currentUser.name.split(" ")[0]
                : "Masuk Akun"}
            </span>
          </button>

          {/* Profile Dropdown for "Aktivitas Saya" linking to Member Workspace */}
          {profileDropdownOpen && currentUser && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg py-2 z-50 text-left">
              <button
                onClick={() => {
                  setProfileDropdownOpen(false);
                  if (currentUser.role === "admin") {
                    setActivePage("dashboard-admin");
                  } else if (currentUser.role === "seller") {
                    setActivePage("dashboard-seller");
                  } else {
                    setActivePage("dashboard-buyer");
                  }
                }}
                className="w-full text-left px-4 py-2.5 hover:bg-slate-50 text-xs font-semibold text-gray-700 font-poppins flex items-center gap-1.5 cursor-pointer border-b border-gray-50 mb-1"
              >
                <span className="material-symbols-outlined text-base">dashboard</span>
                Aktivitas Saya
              </button>
              {onLogout && (
                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    onLogout();
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-red-50 text-xs font-bold text-red-600 font-poppins flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">logout</span>
                  Keluarkan Akun
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Drawer menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-xl md:hidden z-40 transition-all p-5 flex flex-col gap-4 animate-fade-in">
          {/* Mobile Search */}
          <div className="flex items-center bg-gray-50 rounded-full px-4 py-2 border border-gray-100 w-full mb-2">
            <span className="material-symbols-outlined text-gray-400 text-[20px] mr-2">
              search
            </span>
            <input
              className="bg-transparent border-none focus:outline-none focus:ring-0 text-sm w-full font-poppins"
              placeholder="Search items, brands..."
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activePage !== "produk") {
                  setActivePage("produk");
                }
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-gray-400 p-1 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex flex-col gap-2.5">
            {links.map((link) => {
              const isActive = activePage === link.value;
              return (
                <a
                  key={link.value}
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick(link.value);
                  }}
                  href={`#${link.value}`}
                  className={`p-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[#f5f6ff] text-[#2c46a9] font-bold"
                      : "text-gray-700 hover:bg-gray-50 hover:text-[#2c46a9]"
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
            
            {/* Mobile Account Profile Link */}
            <button
              onClick={() => {
                handleProfileClick();
                setMobileMenuOpen(false);
              }}
              className="p-3 bg-[#2c46a9] text-white rounded-xl text-sm font-bold shadow-xs hover:bg-[#020c38] transition-all text-center flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span className="material-symbols-outlined text-base">manage_accounts</span>
              <span>
                {currentUser 
                  ? `Dashboard (${currentUser.role === "admin" ? "Admin" : currentUser.shopName || "Seller"})` 
                  : "Login / Register Akun"}
              </span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
