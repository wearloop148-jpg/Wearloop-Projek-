import React from "react";
import { Page } from "../types";

interface AboutUsProps {
  setActivePage: (page: Page) => void;
  onShowNewsletterToast?: (email: string) => void;
  showAlert?: (title: string, message: string, type?: "error" | "success" | "info" | "warning", onConfirm?: () => void) => void;
}

export default function AboutUs({ setActivePage, onShowNewsletterToast, showAlert }: AboutUsProps) {
  return (
    <div className="bg-white text-slate-800 font-poppins selection:bg-[#2c46a9] selection:text-white animate-fade-in text-left">
      {/* BEGIN: HeroSection */}
      <section className="relative overflow-hidden pt-12 pb-20">
        <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-12 items-center gap-8">
          <div className="col-span-12 lg:col-span-5 relative z-10 text-left">
            <span
              className="inline-flex items-center gap-2 bg-[#F0F5FF] text-[#0F172A] px-4 py-1.5 rounded-full text-xs font-semibold mb-6 tracking-wide"
            >
              ABOUT WEARLOOP <span className="text-sm font-bold">+</span>
            </span>
            <h1
              className="font-bebas text-[72px] sm:text-[90px] md:text-[100px] leading-[0.88] tracking-normal uppercase"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              <span className="text-[#020c38] font-normal">THRIFT IT.</span><br />
              <span className="text-[#2c46a9] font-normal">WEAR IT.</span><br />
              <span className="text-[#020c38] font-normal">LOVE IT.</span>
            </h1>

            <p className="mt-5 mb-6 text-sm md:text-base font-medium text-[#525a75] leading-relaxed max-w-md">
              <strong className="font-semibold text-[#020c38]">Wearloop</strong> hadir untuk membuat
              thrifting jadi lebih aman, mudah, dan menyenangkan.
            </p>
            <button
              onClick={() => setActivePage("produk")}
              className="bg-[#2c46a9] text-white px-8 py-3.5 rounded-lg font-semibold flex items-center justify-center gap-3 hover:bg-blue-700 transition cursor-pointer text-xs uppercase tracking-wider"
            >
              Shop Now
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                ></path>
              </svg>
            </button>
          </div>
          <div className="col-span-12 lg:col-span-7 relative flex justify-center">
            {/* Background decorative image */}
            <img
              alt="Hero Image Wearloop"
              className="w-full max-w-[620px] h-auto object-contain pointer-events-none"
              src="https://i.postimg.cc/YSGY4GTN/Chat-GPT-Image-5-Jun-2026-13-39-36.png"
            />
            {/* Trusted Seller Badge Overlay */}
            <div
              className="absolute right-4 bottom-8 bg-white p-4 rounded-xl shadow-lg flex items-center gap-3 border border-gray-100 select-none"
            >
              <div className="bg-blue-50 p-2 rounded-lg text-[#2c46a9]">
                <span className="material-symbols-outlined text-[18px]">verified</span>
              </div>
              <div className="leading-tight text-left">
                <div className="text-[11px] font-semibold text-slate-800">Trusted Seller</div>
                <div className="text-[10px] text-gray-500 font-medium">4.9/5 Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* END: HeroSection */}

      {/* BEGIN: StatsAndImpact */}
      <section className="py-20 bg-[#f8fafc]">
        <div className="max-w-[1280px] mx-auto px-6">
          {/* Heading */}
          <div className="text-center mb-12">
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2c46a9]/10 text-[#2c46a9] text-xs font-semibold tracking-wide uppercase"
            >
              ABOUT WEARLOOP
            </span>

            <h2
              className="mt-4 text-3xl md:text-4xl lg:text-5xl font-bold text-[#020c38] leading-tight tracking-tight"
            >
              Masa Depan{" "}
              <span className="text-[#2c46a9]">Fashion Berkelanjutan</span>
            </h2>

            <p
              className="max-w-3xl mx-auto mt-4 text-xs md:text-sm leading-relaxed text-slate-500 font-medium"
            >
              Wearloop hadir untuk menciptakan ekosistem jual beli dan donasi
              pakaian bekas yang aman, terpercaya, serta mendukung gaya hidup
              berkelanjutan bagi generasi masa kini.
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* CARD 1 */}
            <div
              className="group relative overflow-hidden rounded-3xl bg-[#020c38] p-8 border border-white/10 shadow-lg hover:-translate-y-1 transition-all duration-350"
            >
              <div
                className="absolute -top-16 -right-16 w-48 h-48 bg-blue-500/20 blur-[80px]"
              ></div>

              <div className="relative z-10 text-left">
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#2563eb] to-[#3b82f6] flex items-center justify-center text-white"
                  >
                    <span className="material-symbols-outlined text-lg">
                      insights
                    </span>
                  </div>

                  <div>
                    <span className="text-blue-300 text-[10px] uppercase font-semibold tracking-widest block leading-none">
                      MARKET INSIGHT
                    </span>

                    <h3 className="text-white text-base font-semibold mt-1">
                      Thrift Analytics
                    </h3>
                  </div>
                </div>

                <p className="text-white/70 leading-relaxed text-xs font-medium">
                  Industri thrift berkembang pesat di Indonesia melalui media
                  sosial dan komunitas digital yang terus tumbuh.
                </p>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                    <div className="text-xl font-bold text-[#36A3FF] font-mono">
                      1.7B+
                    </div>

                    <p className="text-[10px] text-white/60 mt-1 font-medium">TikTok Views</p>
                  </div>

                  <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                    <div className="text-xl font-bold text-[#36A3FF] font-mono">
                      800M+
                    </div>

                    <p className="text-[10px] text-white/60 mt-1 font-medium">Instagram Posts</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 2 */}
            <div
              className="group relative overflow-hidden rounded-3xl bg-[#020c38] p-8 border border-white/10 shadow-lg hover:-translate-y-1 transition-all duration-350"
            >
              <div
                className="absolute -bottom-16 -left-16 w-48 h-48 bg-blue-500/20 blur-[80px]"
              ></div>

              <div className="relative z-10 text-left">
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#2563eb] to-[#3b82f6] flex items-center justify-center text-white"
                  >
                    <span className="material-symbols-outlined text-lg">
                      verified
                    </span>
                  </div>

                  <div>
                    <span className="text-blue-300 text-[10px] uppercase font-semibold tracking-widest block leading-none">
                      WHY WEARLOOP
                    </span>

                    <h3 className="text-white text-base font-semibold mt-1">
                      Keunggulan Kami
                    </h3>
                  </div>
                </div>

                <div className="space-y-3.5">
                  {[
                    "Ekosistem aman antara buyer dan seller.",
                    "Verifikasi kualitas produk sebelum dipasarkan.",
                    "Sterilisasi pakaian untuk menjaga kebersihan.",
                    "Garansi transaksi aman dan terpercaya.",
                    "Mendukung gerakan fashion berkelanjutan.",
                  ].map((text, idx) => (
                    <div key={idx} className="flex gap-2.5 items-start">
                      <span className="material-symbols-outlined text-[#36A3FF] text-[16px] shrink-0 mt-0.5">
                        check_circle
                      </span>

                      <p className="text-white/80 text-xs font-medium leading-relaxed">
                        {text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CARD 3 */}
            <div
              className="group relative overflow-hidden rounded-3xl bg-[#020c38] p-8 border border-white/10 shadow-lg hover:-translate-y-1 transition-all duration-350"
            >
              <div
                className="absolute top-0 right-0 w-48 h-48 bg-blue-500/20 blur-[80px]"
              ></div>

              <div className="relative z-10 text-left">
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#2563eb] to-[#3b82f6] flex items-center justify-center text-white"
                  >
                    <span className="material-symbols-outlined text-lg">
                      public
                    </span>
                  </div>

                  <div>
                    <span className="text-blue-300 text-[10px] uppercase font-semibold tracking-widest block leading-none">
                      ABOUT US
                    </span>

                    <h3 className="text-white text-base font-semibold mt-1">
                      Tentang Wearloop
                    </h3>
                  </div>
                </div>

                <p className="text-white/75 text-xs font-medium leading-relaxed mb-6">
                  Wearloop adalah platform jual beli dan donasi pakaian bekas yang
                  membantu mengurangi limbah tekstil di Indonesia. Kami memberikan
                  kehidupan kedua bagi pakaian layak pakai, menciptakan dampak
                  sosial dan lingkungan yang positif.
                </p>

                <div
                  className="rounded-xl bg-gradient-to-r from-[#2563eb] to-[#3b82f6] p-4 text-left"
                >
                  <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-1">
                    Join Sustainable Movement
                  </h4>

                  <p className="text-white/85 text-[11px] leading-relaxed">
                    Bersama Wearloop, setiap pakaian mendapatkan kesempatan kedua
                    untuk digunakan kembali.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* END: StatsAndImpact */}

      {/* BEGIN: TeamSection */}
      <section className="py-20 bg-white">
        <div className="max-w-[1280px] mx-auto px-6 text-center">
          <div className="text-center mb-14">
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2c46a9]/10 text-[#2c46a9] text-xs font-semibold tracking-wide uppercase"
            >
              OUR TEAMS
            </span>

            <h2 className="mt-4 text-3xl md:text-4xl font-bold text-[#1D2B53]">
              6 Tim Solid di Balik <span className="text-[#2c46a9]">Wearloop</span>
            </h2>

            <p className="mt-3 text-slate-500 text-xs md:text-sm leading-relaxed max-w-xl mx-auto font-medium">
              Kami adalah tim yang berdedikasi untuk memberikan pengalaman
              thrifting terbaik untukmu. Berikut adalah orang-orang hebat yang bekerja setiap hari untuk Wearloop.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Achmad Yusup",
                role: "Chief Technology Officer (CTO)",
                desc: "Mengembangkan arsitektur sistem, keamanan aplikasi, serta memastikan infrastruktur hosting prima.",
                image: "https://i.postimg.cc/cHJVfvv4/image.png",
                icon: "home_storage",
                bgHeight: "220"
              },
              {
                name: "Amelia Sudrajat",
                role: "UI/UX Designer & Front End Developer",
                desc: "Merancang tampilan dan pengalaman pengguna yang intuitif, modern, dan mudah digunakan di segala device.",
                image: "https://i.postimg.cc/8P3K0yjN/image.png",
                icon: "home_storage",
                bgHeight: "210"
              },
              {
                name: "Angeli Kabisat",
                role: "Business & Marketing Strategist",
                desc: "Merancang strategi pemasaran dan pengembangan layanan, menganalisis kebutuhan pengguna secara berkala.",
                image: "https://i.postimg.cc/wv7F2LgV/image.png",
                icon: "home_storage",
                bgHeight: "220"
              },
              {
                name: "Daniel Aretas",
                role: "Backend Developer",
                desc: "Membangun dan mengelola logika sistem, database, API, serta memastikan seluruh fitur Wearloop berjalan lancar.",
                image: "https://i.postimg.cc/Y0BgFW9c/image.png",
                icon: "home_storage",
                bgHeight: "200"
              },
              {
                name: "Nurruh Gustin",
                role: "Business Development",
                desc: "Menyusun strategi pengembangan bisnis, membangun kemitraan, serta memastikan alur operasional Wearloop yang efisien.",
                image: "https://i.postimg.cc/GhcT1rTx/image.png",
                icon: "home_storage",
                bgHeight: "210"
              },
              {
                name: "Indi Nasya Putri",
                role: "Marketing & Promotion Specialist",
                desc: "Mengelola strategi promosi digital, meningkatkan brand awareness, serta menjangkau lebih banyak pengguna potensial.",
                image: "https://i.postimg.cc/HkFLjCjD/image.png",
                icon: "home_storage",
                bgHeight: "210"
              }
            ].map((member, i) => (
              <div
                key={i}
                className="bg-white border border-[#ECEFF6] rounded-3xl overflow-hidden shadow-xs h-[395px] flex flex-col justify-between text-left group hover:shadow-md transition-all duration-300"
              >
                {/* FOTO */}
                <div className="relative h-[200px] bg-[#F7F8FD] flex items-end justify-center overflow-hidden">
                  <div
                    className="absolute left-4 top-4 w-9 h-9 bg-white rounded-xl shadow-xs flex items-center justify-center text-slate-500"
                  >
                    <span className="material-symbols-outlined text-[18px]"> {member.icon} </span>
                  </div>

                  <img
                    src={member.image}
                    alt={member.name}
                    className="h-[180px] md:h-[190px] object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* CONTENT */}
                <div className="border-t border-[#ECEFF6] px-6 py-5 flex-1 flex flex-col">
                  <div>
                    <h3 className="text-base font-bold text-[#2A3568]">{member.name}</h3>

                    <p className="text-xs font-semibold text-[#4e5ea2] mt-0.5">
                      {member.role}
                    </p>
                  </div>

                  <p className="text-xs text-[#5E6785] leading-relaxed mt-3">
                    {member.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* END: TeamSection */}

      {/* BEGIN: VisionMission */}
      <section className="py-20 bg-[#020c38] overflow-hidden relative">
        {/* Background Decoration */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full"
        ></div>

        <div className="max-w-[1280px] mx-auto px-6 relative z-10">
          {/* Title */}
          <div className="text-center mb-12">
            <span
              className="px-4 py-1.5 rounded-full border border-blue-400/30 text-blue-300 text-xs font-semibold tracking-wide uppercase"
            >
              OUR PURPOSE
            </span>

            <h2 className="text-3xl md:text-4xl font-bold text-white mt-4 tracking-tight">
              Visi & Misi <span className="text-[#36A3FF]">Wearloop</span>
            </h2>

            <p className="text-slate-300 text-xs md:text-sm mt-3 max-w-2xl mx-auto font-medium leading-relaxed">
              Membangun masa depan fashion yang lebih berkelanjutan melalui
              pengalaman thrift yang aman, modern, dan terpercaya.
            </p>
          </div>

          {/* Content */}
          <div className="grid grid-cols-12 items-center gap-8 md:gap-4">
            {/* VISI */}
            <div
              className="col-span-12 md:col-span-5 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 hover:border-blue-500/40 transition text-left"
            >
              <div
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mb-5 text-white"
              >
                <span className="material-symbols-outlined text-[22px]">bolt</span>
              </div>

              <span className="text-blue-400 font-semibold tracking-widest text-[10px] uppercase block">
                VISION
              </span>

              <h3 className="text-xl font-bold text-white mt-1.5 mb-3">Visi Kami</h3>

              <p className="text-slate-300 text-xs leading-relaxed font-medium">
                Menjadi platform thrift online terpercaya nomor satu di Indonesia
                yang menghubungkan fashion berkualitas dengan gaya hidup
                berkelanjutan.
              </p>
            </div>

            {/* CENTER */}
            <div className="col-span-12 md:col-span-2 flex justify-center py-4 md:py-0">
              <div className="relative">
                {/* Vertical Glow */}
                <div
                  className="absolute left-1/2 top-[-100px] w-[1.5px] h-[220px] bg-gradient-to-b from-transparent via-blue-500 to-transparent hidden md:block"
                ></div>

                {/* Logo Circle */}
                <div
                  className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-[0_0_40px_rgba(59,130,246,.4)] text-white select-none"
                >
                  <span className="material-symbols-outlined text-white text-3xl font-bold">
                    all_inclusive
                  </span>
                </div>

                <div
                  className="absolute left-1/2 bottom-[-100px] -translate-x-1/2 w-[1.5px] h-[220px] bg-gradient-to-b from-transparent via-blue-500 to-transparent hidden md:block"
                ></div>
              </div>
            </div>

            {/* MISI */}
            <div
              className="col-span-12 md:col-span-5 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 hover:border-blue-500/40 transition text-left"
            >
              <div
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mb-5 text-white"
              >
                <span className="material-symbols-outlined text-[22px]">bookmark</span>
              </div>

              <span className="text-blue-400 font-semibold tracking-widest text-[10px] uppercase block">
                MISSION
              </span>

              <h3 className="text-xl font-bold text-white mt-1.5 mb-3">Misi Kami</h3>

              <p className="text-slate-300 text-xs leading-relaxed font-medium">
                Memberikan akses fashion thrift berkualitas dengan harga terbaik,
                transaksi yang aman, serta pengalaman jual beli yang nyaman bagi
                seluruh pengguna.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* END: VisionMission */}
    </div>
  );
}
