import React from "react";
import { Page } from "../types";

interface CaraKerjaProps {
  setActivePage: (page: Page) => void;
  onOpenSellModal: () => void;
  showAlert?: (title: string, message: string, type?: "info" | "success" | "warning" | "error") => void;
}

export default function CaraKerja({ 
  setActivePage, 
  onOpenSellModal,
  showAlert 
}: CaraKerjaProps) {

  const [showDonationModal, setShowDonationModal] = React.useState(false);
  const [donationForm, setDonationForm] = React.useState({
    nama: "",
    asal: "Bandung",
    alamatJemput: "",
    barangSumbang: "",
  });

  const handleLanjutkanDonasi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!donationForm.nama.trim() || !donationForm.alamatJemput.trim() || !donationForm.barangSumbang.trim()) {
      alert("Harap lengkapi semua bidang isian formulir donasi!");
      return;
    }

    const message = `Halo Admin Wearloop, saya akan sumbangsih pakaian, berikut data diri dan barang yang akan saya sumbangsihkan:

Nama: ${donationForm.nama}
Asal: ${donationForm.asal} (Hanya Bandung Saat Ini)
Alamat Jemput: ${donationForm.alamatJemput}
Detail Pakaian & Foto Barang: ${donationForm.barangSumbang}`;

    const encodedText = encodeURIComponent(message);
    window.open(`https://wa.me/6281947175795?text=${encodedText}`, "_blank");
    setShowDonationModal(false);
  };

  return (
    <div className="font-poppins select-none animate-fade-in text-left bg-white relative">
      
      {/* ========================= */}
      {/* HERO SECTION DEKORATIF */}
      {/* ========================= */}
      <header className="relative overflow-hidden bg-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-14 pt-10 pb-6 grid lg:grid-cols-2 items-center gap-12">
          
          {/* LEFT CONTENT */}
          <div className="relative z-20 space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#eef2ff] border border-[#dfe5ff]">
              <span className="font-poppins text-[11px] font-bold uppercase tracking-wide text-[#2c46a9]">
                Informasi Sistem Wearloop
              </span>
            </div>
            
            {/* Heading */}
            <h1 className="font-bebas leading-[0.88] tracking-tight text-[#020c38] text-[68px] sm:text-[78px] lg:text-[110px] uppercase font-normal">
              Cara Kerja,<br />
              <span className="text-[#2c46a9]">Wearloop</span>
            </h1>
            
            {/* Description */}
            <p className="max-w-[480px] font-poppins text-sm md:text-[16px] leading-[1.8] text-[#4b5563] font-medium">
              Platform thrifting terpercaya untuk kamu yang ingin tampil keren, hemat, dan tetap berkelanjutan (sustainable).
            </p>
            
            {/* Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => setActivePage("produk")}
                className="bg-[#2c46a9] hover:bg-[#020c38] hover:translate-y-[-2px] transition-all duration-300 text-white px-5 py-4 rounded-2xl font-poppins font-bold flex items-center gap-3 cursor-pointer shadow-md text-xs uppercase tracking-wider"
              >
                <span className="material-symbols-outlined font-black">shopping_bag</span>
                Mulai Belanja
              </button>

              <button
                onClick={() => setActivePage("login")}
                className="bg-white border-2 border-[#2c46a9] text-[#2c46a9] hover:bg-[#f5f7ff] hover:translate-y-[-2px] transition-all duration-300 px-5 py-3.5 rounded-2xl font-poppins font-semibold flex items-center gap-3 cursor-pointer text-xs uppercase tracking-wider"
              >
                <span className="material-symbols-outlined font-semibold">storefront</span>
                Mulai Jualan
              </button>
            </div>
          </div>

          {/* RIGHT HERO BANNER WRAPPED IMAGE */}
          <div className="relative flex justify-end w-full lg:scale-105">
            {/* IMAGE */}
            <img
              src="https://i.postimg.cc/DzsM8P6M/Chat-GPT-Image-29-Mei-2026-08-55-26.png"
              className="relative z-10 w-full max-w-[620px] object-contain"
              alt="Wearloop aesthetic models"
            />
            
            {/* ARRIVAL FLOATING CARD */}
            <div className="absolute left-4 top-[35%] z-20 bg-[#2c46a9] text-white rounded-2xl px-5 py-3.5 shadow-2xl animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white font-bold">
                  <span className="material-symbols-outlined text-[18px]">checkroom</span>
                </div>
                <div>
                  <p className="font-poppins text-xs font-extrabold leading-none">Platform</p>
                  <p className="font-poppins text-[10px] text-white/80 mt-1 leading-none">Thrifting Terpercaya</p>
                </div>
              </div>
            </div>

            {/* TRUSTED STATUS FLOATING CARD */}
            <div className="absolute right-0 bottom-12 bg-white rounded-2xl px-5 py-4 shadow-xl flex items-center gap-3 z-20 border border-gray-50">
              <div className="w-10 h-10 rounded-full bg-[#2c46a9] flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  star
                </span>
              </div>
              <div className="text-left leading-none">
                <p className="font-poppins font-bold text-[#111827] text-xs">Trusted Seller</p>
                <p className="font-poppins text-[10px] text-gray-500 mt-1">4.9/5 Rating Toko</p>
              </div>
            </div>
          </div>

        </div>
      </header>

      {/* ========================= */}
      {/* CARA MENJUAL DI WEARLOOP */}
      {/* ========================= */}
      <section className="relative py-20 bg-[#f8f9ff] overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-14">
          <div className="grid lg:grid-cols-[340px_1fr] gap-12 items-start">
            
            {/* LEFT CONTAINER */}
            <div className="space-y-4">
              {/* BADGE */}
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#eef2ff] border border-[#dfe5ff]">
                <span className="font-poppins text-[10px] font-bold uppercase tracking-wider text-[#2c46a9]">
                  Cara Menjual di Wearloop
                </span>
              </div>

              {/* TITLE */}
              <h2 className="font-bebas leading-[1] text-[48px] lg:text-[62px] text-[#020c38] uppercase font-normal">
                JUAL MUDAH,<br />
                <span className="text-[#2c46a9]">CEPAT & AMAN</span>
              </h2>

              {/* DESC */}
              <p className="font-poppins text-[13.5px] leading-[1.8] text-[#4b5563] font-medium">
                Ubah pakaian yang tidak terpakai menjadi uang segar dengan langkah-langkah sangat transparan dan aman di platform Wearloop.
              </p>

              {/* BUTTON */}
              <div className="pt-2">
                <button
                  onClick={() => setActivePage("login")}
                  className="bg-[#2c46a9] hover:bg-[#020c38] transition-all duration-300 text-white px-5 py-4 rounded-xl font-poppins font-semibold text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_12px_24px_rgba(44,70,169,0.2)] cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">storefront</span>
                  Mulai Jual Sekarang
                </button>
              </div>
            </div>

            {/* RIGHT SIDE STEPS (4 CARDS) */}
            <div className="grid md:grid-cols-4 gap-5 relative">
              {[
                {
                  id: "1",
                  icon: "checkroom",
                  title: "Daftarkan Produk",
                  desc: "Foto pakaian preloved Anda, isikan deskripsi asli, ukuran detail, dan harga yang pas.",
                },
                {
                  id: "2",
                  icon: "inventory_2",
                  title: "Kirim ke Wearloop",
                  desc: "Kirim item Anda ke alamat kurasi gudang steril steril kami agar lolos QC fisik.",
                },
                {
                  id: "3",
                  icon: "search",
                  title: "Produk Ditampilkan",
                  desc: "Setelah lolos sanitasi & standardisasi, item Anda tayang live otomatis bagi peminat.",
                },
                {
                  id: "4",
                  icon: "account_balance_wallet",
                  title: "Dapatkan Penghasilan",
                  desc: "Pembeli melunasi via VA / Escrow, lalu dana diteruskan langsung ke rekening bank pribadi Anda.",
                },
              ].map((card, idx) => (
                <div
                  key={card.id}
                  className="relative bg-white rounded-[28px] px-6 py-8 border border-slate-100 shadow-[0_8px_30px_rgba(17,24,39,0.02)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg hover:border-blue-150 flex flex-col justify-between"
                >
                  {/* Step Code */}
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#2c46a9] flex items-center justify-center text-white font-poppins font-bold text-xs shadow-md">
                    {card.id}
                  </div>

                  <div className="w-16 h-16 rounded-full bg-[#f6f8ff] flex items-center justify-center mx-auto mt-2">
                    <span className="material-symbols-outlined text-[32px] text-[#2c46a9]">
                      {card.icon}
                    </span>
                  </div>

                  <div className="text-center mt-5">
                    <h3 className="font-poppins font-bold text-[14px] text-[#111827]">
                      {card.title}
                    </h3>
                    <p className="mt-2.5 font-poppins text-[11px] leading-[1.7] text-[#6b7280]">
                      {card.desc}
                    </p>
                  </div>

                  {/* ARROW DIRECTION DECORATION BETWEEN CARDS */}
                  {idx < 3 && (
                    <div className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 text-[#2c46a9]/30 z-20">
                      <span className="material-symbols-outlined text-[20px] font-black">
                        arrow_forward
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>

          </div>

          {/* BOTTOM operational values panel */}
          <div className="mt-12 bg-[#2c46a9] rounded-[28px] px-8 py-6 flex flex-wrap justify-between gap-6 shadow-xl text-white font-poppins border border-[#405eff]">
            
            {[
              { icon: "local_shipping", text: "Gratis Ongkir ke Gudang", desc: "S&K konfirmasi berlaku" },
              { icon: "timer", text: "Proses Cepat & Higienis", desc: "Sterilisasi 1 x 24 Jam" },
              { icon: "payments", text: "Pembayaran Mingguan Terbuka", desc: "Transfer real-time aman" },
              { icon: "support_agent", text: "Tim Admin Siap Bantu", desc: "Responsif 24/7" },
            ].map((v, i) => (
              <div key={i} className="flex items-center gap-3.5 text-left">
                <div className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-white text-xl">{v.icon}</span>
                </div>
                <div>
                  <h4 className="font-semibold text-[13px] leading-tight">{v.text}</h4>
                  <p className="text-[10px] text-white font-medium mt-0.5">{v.desc}</p>
                </div>
              </div>
            ))}

          </div>

        </div>
      </section>

      {/* ========================= */}
      {/* CARA MEMBELI DI WEARLOOP */}
      {/* ========================= */}
      <section className="relative py-20 bg-white overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-14">
          <div className="grid lg:grid-cols-[340px_1fr] gap-12 items-start">
            
            {/* LEFT AREA DESCRIPTION */}
            <div className="space-y-4">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#eef2ff] border border-[#dfe5ff]">
                <span className="font-poppins text-[10px] font-bold uppercase tracking-wider text-[#2c46a9]">
                  Cara Membeli di Wearloop
                </span>
              </div>

              <h2 className="font-bebas leading-[1] text-[48px] lg:text-[62px] text-[#020c38] uppercase font-normal">
                BELANJA HEMAT,<br />
                <span className="text-[#2c46a9]">DAN BERKUALITAS</span>
              </h2>

              <p className="font-poppins text-[13.5px] leading-[1.8] text-[#4b5563] font-medium">
                Nikmati pemesanan pakaian preloved premium dengan visual kondisi real, jaminan laundry steril wangi, serta transfer eskrow bank terlindungi.
              </p>

              <div className="pt-2">
                <button
                  onClick={() => setActivePage("produk")}
                  className="bg-[#2c46a9] hover:bg-[#020c38] transition-all duration-300 text-white px-5 py-4 rounded-xl font-poppins font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_12px_24px_rgba(44,70,169,0.2)] cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">shopping_bag</span>
                  Mulai Belanja Sekarang
                </button>
              </div>
            </div>

            {/* RIGHT ROADMAP (4 CARDS) */}
            <div className="grid md:grid-cols-4 gap-5 relative">
              {/* DASHED LINE BETWEEN ITEMS */}
              <div className="hidden md:block absolute left-[12%] right-[12%] top-[60px] border-t-2 border-dashed border-[#bfd0ff] z-0 pointer-events-none" />

              {[
                {
                  id: "1",
                  icon: "search",
                  title: "Cari & Pilih Produk",
                  desc: "Jelajahi pakaian vintage terkurasi, gunakan filter filter kategori, ukuran, dan kondisi unik.",
                },
                {
                  id: "2",
                  icon: "shopping_cart",
                  title: "Checkout Pesanan",
                  desc: "Isikan data nama penerima, no WhatsApp aktif, kurir JNE/JNT, dan kode pos pengantaran.",
                },
                {
                  id: "3",
                  icon: "credit_card",
                  title: "Transfer & Bayar",
                  desc: "Lakukan pelunasan nominal transaksi ke rekening pribadi seller yang tertera jelas.",
                },
                {
                  id: "4",
                  icon: "inventory_2",
                  title: "Paket Tiba Steril",
                  desc: "Baju dicuci dry clean steril, dibungkus plastik eksklusif, dan meluncur cepat ke lokasi.",
                },
              ].map((card, idx) => (
                <div
                  key={card.id}
                  className="relative z-15 bg-[#fbfbff] rounded-[28px] px-6 py-8 border border-[#eef1ff] shadow-[0_8px_30px_rgba(17,24,39,0.01)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-md hover:bg-white flex flex-col justify-between"
                >
                  {/* Number tag */}
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#2c46a9] flex items-center justify-center text-white font-poppins font-bold text-xs shadow-md">
                    {card.id}
                  </div>

                  <div className="w-16 h-16 rounded-full bg-white border border-slate-50 flex items-center justify-center mx-auto mt-2 shadow-xs">
                    <span className="material-symbols-outlined text-[30px] text-[#2c46a9]">
                      {card.icon}
                    </span>
                  </div>

                  <div className="text-center mt-5">
                    <h3 className="font-poppins font-bold text-[14px] text-[#111827]">
                      {card.title}
                    </h3>
                    <p className="mt-2.5 font-poppins text-[11px] leading-[1.7] text-[#6b7280]">
                      {card.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* BELOW INFO GRID MATCHING HTML SHEET */}
          <div className="mt-12 bg-[#2c46a9] rounded-[28px] px-8 py-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-white text-left font-poppins border border-[#405eff]">
            {[
              { icon: "verified_user", text: "Kualitas Terjamin", desc: "Produk sudah diverifikasi handal" },
              { icon: "sell", text: "Harga Transparan", desc: "Sesuai standardisasi nilai baju" },
              { icon: "checkroom", text: "Ribuan Pilihan Variatif", desc: "Katalog update berkala" },
              { icon: "local_shipping", text: "Pengiriman Terjamin", desc: "Aman, bergaransi retur" },
            ].map((col, idx) => (
              <div key={idx} className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-white text-lg">{col.icon}</span>
                </div>
                <div>
                  <h4 className="font-semibold text-[13px] leading-tight">{col.text}</h4>
                  <p className="text-[10px] text-white font-medium mt-0.5">{col.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================= */}
      {/* SOCIAL DONASI & SUSTAINABLE IMPACT */}
      {/* ========================= */}
      <section className="relative py-20 bg-[#f8f9ff] overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-14">
          <div className="grid lg:grid-cols-[340px_1fr] gap-12 items-center">
            
            {/* LEFT MESSAGE PANEL */}
            <div className="space-y-4">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#eef2ff] border border-[#dfe5ff]">
                <span className="font-poppins text-[10px] font-bold uppercase tracking-wider text-[#2c46a9]">
                  Distribusi & Donasi
                </span>
              </div>

              <h2 className="font-bebas leading-[1] text-[48px] lg:text-[62px] text-[#020c38] uppercase font-normal">
                BERBAGI UNTUK<br />
                <span className="text-[#2c46a9]">KEBAIKAN SOSIAL</span>
              </h2>

              <p className="font-poppins text-[13.5px] leading-[1.8] text-[#4b5563] font-medium">
                Setiap item yang tidak terjual dalam kurun waktu kurasi seller dapat dialihkan secara sukarela menjadi bantuan kemanusiaan steril.
              </p>

              <div className="pt-2">
                <button
                  onClick={() => setShowDonationModal(true)}
                  className="bg-[#2c46a9] hover:bg-[#020c38] transition-all duration-300 text-white px-5 py-4 rounded-xl font-poppins font-semibold text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_12px_24px_rgba(44,70,169,0.2)] cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">favorite</span>
                  Sumbang Sosial
                </button>
              </div>
            </div>

            {/* RIGHT IMAGES BLOCK WITH REVIEWS FLOAT OVER */}
            <div className="relative">
              <div className="grid md:grid-cols-2 gap-5">
                <div className="relative overflow-hidden rounded-[30px] h-[340px] shadow-sm border border-gray-100">
                  <img
                    src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=1200&auto=format&fit=crop"
                    className="w-full h-full object-cover"
                    alt="Sustainable Thrifting community"
                  />
                </div>

                <div className="relative overflow-hidden rounded-[30px] h-[340px] shadow-sm border border-gray-100">
                  <img
                    src="https://images.unsplash.com/photo-1529390079861-591de354faf5?q=80&w=1200&auto=format&fit=crop"
                    className="w-full h-full object-cover"
                    alt="Volunteering charity"
                  />
                </div>
              </div>

              {/* OVERLAY CARD HIGHLIGHT */}
              <div className="lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:bottom-[-40px] mt-6 lg:mt-0 bg-white rounded-[28px] px-6 py-5 shadow-xl border border-blue-50 flex items-start gap-4 max-w-[500px] w-full text-left">
                <div className="w-14 h-14 rounded-full bg-[#fff1f2] flex items-center justify-center shrink-0 text-[#ff4d6d]">
                  <span className="material-symbols-outlined text-[28px] font-bold">
                    favorite
                  </span>
                </div>

                <div>
                  <h3 className="font-poppins font-bold text-[15px] text-[#111827]">
                    Distribusi ke Panti Sosial
                  </h3>
                  <p className="mt-1.5 font-poppins text-[11.5px] leading-[1.6] text-[#6b7280]">
                    Pakaian layak pakai terdaftar disalurkan merata ke panti-panti asuhan di DKI Jakarta, membawa kegembiraan & harapan baru bagi sesama.
                  </p>
                </div>
              </div>

            </div>

          </div>

          {/* THREE FLOATING PROCESS STEP CARDS AT THE BOTTOM */}
          <div className="mt-20 bg-[#2c46a9] rounded-[30px] px-8 py-8 flex flex-wrap lg:flex-nowrap items-center justify-between gap-6 text-white font-poppins border border-[#405eff]">
            
            <div className="flex items-center gap-4 text-left max-w-sm">
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-[#2c46a9] shrink-0 font-extrabold shadow-sm">
                <span className="material-symbols-outlined text-2xl font-bold">volunteer_activism</span>
              </div>
              <div>
                <p className="font-bold text-[14px]">Anda Menyumbang</p>
                <p className="text-[11px] text-[#9db1ff] font-medium mt-0.5 leading-relaxed">
                  Sebagian komisi transaksi seller dialokasikan langsung bagi pengadaan detergen dryclean medis.
                </p>
              </div>
            </div>

            <div className="hidden lg:flex text-[#9db1ff] shrink-0">
              <span className="material-symbols-outlined text-3xl">trending_flat</span>
            </div>

            <div className="flex items-center gap-4 text-left max-w-sm">
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-[#2c46a9] shrink-0 font-extrabold shadow-sm">
                <span className="material-symbols-outlined text-2xl font-bold">diversity_3</span>
              </div>
              <div>
                <p className="font-bold text-[14px]">Kami Salurkan</p>
                <p className="text-[11px] text-[#9db1ff] font-medium mt-0.5 leading-relaxed">
                  Tim operasional sirkuler Wearloop mendata panti asuhan penerima secara transparan & tepercaya.
                </p>
              </div>
            </div>

            <div className="hidden lg:flex text-[#9db1ff] shrink-0">
              <span className="material-symbols-outlined text-3xl">trending_flat</span>
            </div>

            <div className="flex items-center gap-4 text-left max-w-sm">
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-[#2c46a9] shrink-0 font-extrabold shadow-sm">
                <span className="material-symbols-outlined text-2xl font-bold">sentiment_satisfied</span>
              </div>
              <div>
                <p className="font-bold text-[14px]">Mereka Gembira</p>
                <p className="text-[11px] text-white font-medium mt-0.5 leading-relaxed">
                  Bantuan busana berkualitas terverifikasi steril siap dipakai dengan asri, bersih, dan harum.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ======================================= */}
      {/* STATEFUL DIALOG MODAL SUMBANG SOSIAL   */}
      {/* ======================================= */}
      {showDonationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 font-poppins animate-fade-in backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl relative border border-gray-100 flex flex-col gap-5 text-left max-h-[90vh] overflow-y-auto">
            <div>
              <h3 className="text-xl font-semibold text-[#020c38] tracking-tight">
                Program Sumbang Sosial Wearloop
              </h3>
              <p className="text-xs text-gray-400 mt-1 font-medium">
                Penyaluran pakaian terpercaya, steril, dan berkah.
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
              <p className="text-[11px] leading-relaxed text-amber-800 font-medium">
                <strong>PENTING:</strong> Sistem kurasi, pencucian steril ulang, dan penjemputan donasi pakaian <strong>hanya melayani area Bandung saja</strong> untuk saat ini.
              </p>
            </div>

            <form onSubmit={handleLanjutkanDonasi} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  placeholder="Masukkan nama Anda"
                  className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl border border-gray-200 focus:border-[#2c46a9] focus:ring-1 focus:ring-[#2c46a9] transition-all text-gray-800"
                  value={donationForm.nama}
                  onChange={(e) => setDonationForm({ ...donationForm, nama: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Asal Kota
                </label>
                <input
                  type="text"
                  disabled
                  className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl border border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed font-medium"
                  value="Bandung"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Alamat Lengkap Penjemputan
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Masukkan alamat lengkap penjemputan di Bandung"
                  className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl border border-gray-200 focus:border-[#2c46a9] focus:ring-1 focus:ring-[#2c46a9] transition-all text-gray-800"
                  value={donationForm.alamatJemput}
                  onChange={(e) => setDonationForm({ ...donationForm, alamatJemput: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Isi Barang & Foto Sumbang
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Deskripsikan barang (contoh: 3 Kemeja, 2 Jacket M) & link foto donasi jika ada"
                  className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl border border-gray-200 focus:border-[#2c46a9] focus:ring-1 focus:ring-[#2c46a9] transition-all text-gray-800"
                  value={donationForm.barangSumbang}
                  onChange={(e) => setDonationForm({ ...donationForm, barangSumbang: e.target.value })}
                />
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowDonationModal(false)}
                  className="flex-1 py-3 text-xs sm:text-sm rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-colors cursor-pointer text-center"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 text-xs sm:text-sm rounded-xl bg-[#2c46a9] hover:bg-[#020c38] text-white font-semibold transition-colors cursor-pointer text-center"
                >
                  Lanjutkan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
