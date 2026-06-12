import React, { useState } from "react";
import { User, Page } from "../types";

interface LoginProps {
  onLoginSuccess: (user: User) => void;
  registeredUsers: User[];
  onRegisterUser: (user: User) => void;
  setActivePage: (p: Page) => void;
}

export default function Login({
  onLoginSuccess,
  registeredUsers,
  onRegisterUser,
  setActivePage,
}: LoginProps) {
  const [activeTab, setActiveTab] = useState<"buyer" | "seller" | "admin">("buyer");
  const [isRegistering, setIsRegistering] = useState(false);

  // Form Fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  // Seller specific register fields
  const [shopName, setShopName] = useState("");
  const [shopDesc, setShopDesc] = useState("");
  const [bankName, setBankName] = useState("BCA");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [bankAccountHolder, setBankAccountHolder] = useState("");

  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showNotification = (message: string, type: "success" | "error" = "success") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  const handleDemoAccount = (role: "buyer" | "seller" | "admin") => {
    setActiveTab(role);
    setIsRegistering(false);
    if (role === "buyer") {
      setEmail("buyer@wearloop.com");
      setPassword("password123");
    } else if (role === "seller") {
      setEmail("seller@wearloop.com");
      setPassword("password123");
    } else {
      setEmail("admin@wearloop.com");
      setPassword("password123");
    }
    showNotification(`Dimuat akun demo: ${role === "buyer" ? "buyer@wearloop.com" : role === "seller" ? "seller@wearloop.com" : "admin@wearloop.com"}`, "success");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      showNotification("Email dan password wajib diisi!", "error");
      return;
    }

    if (isRegistering) {
      // Handle Register
      if (!name) {
        showNotification("Nama lengkap wajib diisi!", "error");
        return;
      }

      const userExists = registeredUsers.some((u) => u.email.toLowerCase() === email.toLowerCase());
      if (userExists) {
        showNotification("Email sudah terdaftar!", "error");
        return;
      }

      // Check Seller specific registration requirements
      if (activeTab === "seller") {
        if (!shopName || !bankAccountNumber || !bankAccountHolder) {
          showNotification("Mohon melengkapi Detail toko dan informasi rekening bank!", "error");
          return;
        }
      }

      const newUser: User = {
        id: "user-" + Date.now(),
        email: email.toLowerCase(),
        name,
        role: activeTab === "admin" ? "buyer" : activeTab, // Safeguard admin role creation
        phoneNumber: phone || "0812345678" + Math.floor(Math.random() * 10),
        isApproved: activeTab === "buyer", // Buyers are auto-approved, sellers must wait
        shopName: activeTab === "seller" ? shopName : undefined,
        shopDesc: activeTab === "seller" ? shopDesc : undefined,
        bankName: activeTab === "seller" ? bankName : undefined,
        bankAccountNumber: activeTab === "seller" ? bankAccountNumber : undefined,
        bankAccountHolder: activeTab === "seller" ? bankAccountHolder : undefined,
        password: password, // Store entered password
      };

      onRegisterUser(newUser);

      if (activeTab === "seller") {
        showNotification("Pendaftaran Seller Berhasil! Akun Anda sedang MENUNGGU PERSETUJUAN (APPROVED) dari Admin agar bisa login.", "success");
        setIsRegistering(false);
        // Clean fields
        setPassword("");
      } else {
        showNotification("Akun Buyer berhasil didaftarkan! Silakan login sekarang.", "success");
        setIsRegistering(false);
        setPassword("");
      }
    } else {
      // Handle Login
      const user = registeredUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());

      if (!user) {
        showNotification("Email atau password tidak ditemukan di sistem!", "error");
        return;
      }

      // If user is Seller, ensure they are approved by Admin
      if (user.role === "seller" && !user.isApproved) {
        showNotification("⚠️ Akun Seller Anda BELUM DISETUJUI oleh Admin. Hubungi Admin (admin@wearloop.com) untuk aktivasi akun.", "error");
        return;
      }

      onLoginSuccess(user);
      showNotification(`Login Sukses! Selamat datang kembali, ${user.name}.`, "success");

      // Redirect based on role
      if (user.role === "admin") {
        setActivePage("dashboard-admin");
      } else if (user.role === "seller") {
        setActivePage("dashboard-seller");
      } else {
        setActivePage("beranda");
      }
    }
  };

  return (
    <div className="font-sora min-h-[90vh] bg-[#eaf2ff] flex items-center justify-center p-4 md:p-8 text-left selection:bg-[#2c46a9] selection:text-white">
      <div className="w-full max-w-[1160px] grid lg:grid-cols-12 gap-6 bg-transparent">
        
        {/* LEFT DECORATIVE SIDE PANEL */}
        <div className="lg:col-span-5 bg-white min-h-[500px] lg:h-[630px] rounded-[32px] p-8 md:p-10 shadow-lg flex flex-col justify-between relative overflow-hidden">
          {/* Ambient vector illustrations */}
          <div className="absolute top-8 left-10 text-[#2c46a9] opacity-30 text-2xl font-bold">✦</div>
          <div className="absolute top-28 right-12 text-[#2c46a9] opacity-20 text-3xl font-bold">✦</div>
          <div className="absolute bottom-32 left-8 text-[#2c46a9] opacity-20 text-xl font-bold">✦</div>

          <div className="z-10">
            <br />
            <p className="text-[#2c46a9] font-bold tracking-wider text-xs uppercase mb-2">Welcome to</p>
            <h1 className="text-[#020c38] font-extrabold text-3xl md:text-4xl leading-snug">
              WEAR YOUR STYLE,
              <br />
              <span className="text-[#2c46a9] relative">
                JOIN THE LOOP
                <span className="absolute left-0 bottom-0 w-full h-1 bg-[#2c46a9]/20 rounded-full"></span>
              </span>
            </h1>
            <p className="text-gray-500 mt-6 text-xs leading-relaxed max-w-sm">
              Wearloop adalah platform terpercaya kurasi fiting busana vintage preloved bersertifikat sterilisasi tinggi pertama di Indonesia.
            </p>
          </div>

          <div className="mt-6 flex justify-center items-center">
            <img
              src="https://i.postimg.cc/3NvFpY37/image.png"
              className="w-full max-w-[340px] select-none pointer-events-none"
              alt="Role Illustration"
            />
          </div>

          <div className="text-[10px] text-gray-400 font-semibold text-center md:text-left z-10 border-t border-gray-100 pt-4">
            Wearloop &bull; Thrift It, Wear It, Loop It.
          </div>
        </div>

        {/* RIGHT INTERACTIVE LOGIN/REGISTER PORTAL */}
        <div className="lg:col-span-7 min-h-[500px] lg:h-[630px] bg-white rounded-[32px] p-6 md:p-10 shadow-lg flex flex-col justify-between overflow-y-auto">
          
          <div>
            {/* Upper brand header */}
            <div className="flex justify-between items-center mb-6">
              <img
                src="https://i.postimg.cc/zv1Rs5Sc/logo.png"
                className="w-[120px] h-auto object-contain cursor-pointer"
                alt="Wearloop Logo"
                onClick={() => setActivePage("beranda")}
              />
              <button 
                onClick={() => setActivePage("beranda")}
                className="text-xs font-bold text-[#2c46a9] bg-blue-50 hover:bg-[#2c46a9] hover:text-white px-3 py-1.5 rounded-xl transition-all flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-xs">arrow_back</span>
                Kembali ke Toko
              </button>
            </div>

            {/* Notification Bar */}
            {notification && (
              <div
                className={`mb-4 p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 border animate-fade-in ${
                  notification.type === "success"
                    ? "bg-green-50 border-green-200 text-green-700"
                    : "bg-red-50 border-red-200 text-red-700"
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">
                  {notification.type === "success" ? "check_circle" : "error"}
                </span>
                <span className="leading-relaxed">{notification.message}</span>
              </div>
            )}

            <div className="mb-4">
              <h2 className="text-2xl font-black text-[#020c38]">
                {isRegistering ? `Daftar Akun ${activeTab === "buyer" ? "Pembeli" : "Penjual"}` : "Welcome Back!"}
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                {isRegistering
                  ? "Lengkapi formulir di bawah ini untuk memulai registrasi baru Anda."
                  : "Pilih peran Anda untuk melanjutkan ke platform terpadu Wearloop."}
              </p>
            </div>

            {/* ROLE TAB SELECTOR */}
            {!isRegistering && (
              <div className="bg-gray-100 p-1 rounded-2xl flex gap-1 mb-5">
                {[
                  { id: "buyer", icon: "shopping_bag", label: "Buyer" },
                  { id: "seller", icon: "storefront", label: "Seller" },
                  { id: "admin", icon: "admin_panel_settings", label: "Admin" },
                ].map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setActiveTab(item.id as any);
                        setEmail("");
                        setPassword("");
                      }}
                      className={`flex-grow py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                        isActive
                          ? "bg-white text-[#2c46a9] shadow-sm"
                          : "text-gray-500 hover:text-gray-800"
                      }`}
                    >
                      <span className="material-symbols-outlined text-base">
                        {item.icon}
                      </span>
                      {item.label}
                    </button>
                  );
                })}
              </div>
            )}

            {/* FORM BODY */}
            <form onSubmit={handleSubmit} className="space-y-3">
              
              {isRegistering && (
                <div>
                  <label className="block mb-1 text-xs font-bold text-[#020c38]">
                    Nama Lengkap
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">
                      person
                    </span>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Masukkan nama lengkap Anda"
                      className="w-full pl-11 pr-4 py-2.5 rounded-xl text-xs border border-gray-200 focus:border-[#2c46a9] focus:ring-1 focus:ring-[#2c46a9] outline-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block mb-1 text-xs font-bold text-[#020c38]">
                  Alamat Email
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">
                    mail
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Masukkan alamat email Anda"
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl text-xs border border-gray-200 focus:border-[#2c46a9] focus:ring-1 focus:ring-[#2c46a9] outline-none"
                  />
                </div>
              </div>

              {isRegistering && (
                <div>
                  <label className="block mb-1 text-xs font-bold text-[#020c38]">
                    No. WhatsApp Aktif (untuk Konfirmasi Transaksi)
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">
                      phone_iphone
                    </span>
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Contoh: 0812XXXXXXXX"
                      className="w-full pl-11 pr-4 py-2.5 rounded-xl text-xs border border-gray-200 focus:border-[#2c46a9] focus:ring-1 focus:ring-[#2c46a9] outline-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block mb-1 text-xs font-bold text-[#020c38]">
                  Password
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">
                    lock
                  </span>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={isRegistering ? "Buat password minimal 6 karakter" : "Masukkan password Anda"}
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl text-xs border border-gray-200 focus:border-[#2c46a9] focus:ring-1 focus:ring-[#2c46a9] outline-none"
                  />
                </div>
              </div>

              {/* REGISTER SELLER SPECIFIC SUBSECTION */}
              {isRegistering && activeTab === "seller" && (
                <div className="border border-blue-100 bg-blue-50/20 p-4 rounded-2xl space-y-3 mt-4">
                  <h3 className="text-xs font-black text-[#2c46a9] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[15px]">storefront</span>
                    Detail Toko &amp; Rekening Pembayaran Langsung
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block mb-1 text-[10px] font-bold text-[#020c38]">
                        Nama Toko (Shop Name)
                      </label>
                      <input
                        type="text"
                        required
                        value={shopName}
                        onChange={(e) => setShopName(e.target.value)}
                        placeholder="Nama Wearloop Shop Anda"
                        className="w-full px-3 py-2 rounded-lg text-[11px] border border-gray-200 focus:border-[#2c46a9] focus:ring-1 focus:ring-[#2c46a9] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-[10px] font-bold text-[#020c38]">
                        Deskripsi Toko Singkat
                      </label>
                      <input
                        type="text"
                        value={shopDesc}
                        onChange={(e) => setShopDesc(e.target.value)}
                        placeholder="Thrift apparel berkualitas"
                        className="w-full px-3 py-2 rounded-lg text-[11px] border border-gray-200 focus:border-[#2c46a9] outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 border-t border-gray-100 pt-3">
                    <div>
                      <label className="block mb-1 text-[10px] font-bold text-[#020c38]">
                        Bank Mandiri/BCA/dll
                      </label>
                      <select
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        className="w-full px-2 py-2 rounded-lg text-[11px] border border-gray-200 bg-white"
                      >
                        <option value="BCA">BCA</option>
                        <option value="Mandiri">Mandiri</option>
                        <option value="BNI">BNI</option>
                        <option value="BRI">BRI</option>
                        <option value="BSI">BSI</option>
                      </select>
                    </div>

                    <div className="col-span-2">
                      <label className="block mb-1 text-[10px] font-bold text-[#020c38]">
                        Nomor Rekening
                      </label>
                      <input
                        type="text"
                        required={activeTab === "seller"}
                        value={bankAccountNumber}
                        onChange={(e) => setBankAccountNumber(e.target.value)}
                        placeholder="8620XXXXXX"
                        className="w-full px-3 py-2 rounded-lg text-[11px] border border-gray-200 focus:border-[#2c46a9] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-1 text-[10px] font-bold text-[#020c38]">
                      Nama Pemilik Rekening (Sesuai Buku Tabungan)
                    </label>
                    <input
                      type="text"
                      required={activeTab === "seller"}
                      value={bankAccountHolder}
                      onChange={(e) => setBankAccountHolder(e.target.value)}
                      placeholder="Contoh: Budi Santoso"
                      className="w-full px-3 py-2 rounded-lg text-[11px] border border-gray-200 focus:border-[#2c46a9] outline-none"
                    />
                    <p className="text-[9px] text-gray-400 font-semibold mt-1">
                      ⚠️ Rekening ini akan ditampilkan kepada Pembeli saat mereka melakukan checkout. Dana akan langsung ditransfer ke rekening pribadi Anda.
                    </p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-[#2c46a9] hover:bg-[#020c38] text-white font-bold py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                {isRegistering ? "Daftar Akun Sekarang" : `Masuk sebagai ${activeTab.toUpperCase()}`}
              </button>
            </form>

            {/* REGISTER ACTION TRIGGERS */}
            {activeTab !== "admin" && (
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">
                  {isRegistering
                    ? "Sudah memiliki akun?"
                    : `Belum memiliki akun ${activeTab === "buyer" ? "Pembeli" : "Penjual"}?`}
                  <button
                    type="button"
                    onClick={() => {
                      setIsRegistering(!isRegistering);
                      setName("");
                      setPhone("");
                      setShopName("");
                      setShopDesc("");
                      setBankAccountNumber("");
                      setBankAccountHolder("");
                    }}
                    className="text-[#2c46a9] font-black hover:underline ml-1"
                  >
                    {isRegistering ? "Login sekarang" : "Daftar / Buat Akun Baru"}
                  </button>
                </p>
              </div>
            )}
          </div>

          {/* QUICK DEMO PROFILE LOADERS */}
          <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2">
            <span className="text-[10px] text-gray-400 font-extrabold uppercase">
              ⚡ Quick Login Demo:
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleDemoAccount("buyer")}
                className="bg-blue-50 text-[#2c46a9] hover:bg-[#2c46a9] hover:text-white px-2.5 py-1 text-[10px] rounded-lg font-bold transition-all"
              >
                Buyer
              </button>
              <button
                type="button"
                onClick={() => handleDemoAccount("seller")}
                className="bg-purple-50 text-purple-700 hover:bg-purple-700 hover:text-white px-2.5 py-1 text-[10px] rounded-lg font-bold transition-all"
              >
                Seller (BCA)
              </button>
              <button
                type="button"
                onClick={() => handleDemoAccount("admin")}
                className="bg-red-50 text-red-700 hover:bg-red-700 hover:text-white px-2.5 py-1 text-[10px] rounded-lg font-bold transition-all"
              >
                Admin
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
