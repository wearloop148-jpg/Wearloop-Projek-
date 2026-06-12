import React, { useState } from "react";
import { Page } from "../types";

interface FooterProps {
  setActivePage: (page: Page) => void;
  onShowNewsletterToast: (email: string) => void;
}

export default function Footer({ setActivePage, onShowNewsletterToast }: FooterProps) {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      alert("Tolong isi email kamu terlebih dahulu!");
      return;
    }
    onShowNewsletterToast(email);
    setEmail("");
  };

  return (
    <div className="w-full bg-white font-poppins antialiased mt-24 select-none border-t border-gray-50">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12 pb-8 pt-4">
        
        {/* Core Link Section */}
        <div className="w-full max-w-7xl mx-auto flex flex-col gap-4">

          {/* Stay in the Loop Newsletter block */}
          <section className="w-full bg-[#020c38] rounded-[24px] px-6 py-5 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-4 mt-0">
            <div className="flex items-center gap-4 z-10 w-full md:w-auto">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-bold text-sm leading-tight tracking-wide">
                  Stay in the Loop
                </h3>
                <p className="text-gray-300 text-[11px] tracking-wide mt-0.5">
                  Dapatkan update item terbaru dan promo spesial setiap minggu.
                </p>
              </div>
            </div>

            <div className="hidden lg:block absolute left-[38%] right-[32%] top-1/2 -translate-y-1/2 h-8 pointer-events-none">
              <svg className="w-full h-full text-white/20" fill="none" viewBox="0 0 200 40">
                <path
                  d="M0,20 Q50,5 100,20 T200,20"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  fill="none"
                />
                <g transform="translate(140, 13) rotate(15)">
                  <svg className="w-3.5 h-3.5 text-white/60" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L14 19v-5.5l8 2.5z" />
                  </svg>
                </g>
              </svg>
            </div>

            <form onSubmit={handleSubscribe} className="w-full md:w-auto max-w-md bg-white rounded-full p-1 flex items-center shadow-inner z-10 border border-gray-100">
              <input
                className="w-full md:w-64 bg-transparent pl-4 pr-2 py-1.5 text-xs text-[#0f172a] focus:outline-none placeholder:text-gray-400 border-none focus:ring-0 font-poppins tracking-wide"
                placeholder="Enter your email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                type="submit"
                className="bg-[#2c46a9] hover:bg-[#1e40af] text-white text-xs font-semibold px-5 py-2 rounded-full transition-colors whitespace-nowrap tracking-wider cursor-pointer"
              >
                Subscribe
              </button>
            </form>
          </section>
        </div>

        <div className="w-full max-w-7xl mx-auto border-t border-gray-100"></div>

        {/* Core Footer Link columns */}
        <footer className="w-full max-w-7xl mx-auto bg-white font-poppins">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 text-left items-start">
            <div className="lg:col-span-3 space-y-4">
              <div className="flex items-center gap-2">
                <img
                  className="w-[160px] h-auto object-contain cursor-pointer"
                  src="https://i.postimg.cc/T11R5GTJ/image-removebg-preview-(1)(1).png"
                  alt="Wearloop Logo"
                  onClick={() => setActivePage("beranda")}
                />
              </div>
              <p className="text-gray-400 text-xs max-w-[250px] leading-relaxed font-medium tracking-wide">
                Platform jual beli thrift terpercaya dengan ribuan item pilihan untuk gaya terbaikmu.
              </p>
              <div className="flex gap-4 pt-2">
                {/* Social links */}
                <a className="text-gray-400 hover:text-[#2563eb] transition-colors" href="#" aria-label="Instagram">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a className="text-gray-400 hover:text-[#2563eb] transition-colors" href="#" aria-label="TikTok">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1 .05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" />
                  </svg>
                </a>
                <a className="text-gray-400 hover:text-[#2563eb] transition-colors" href="#" aria-label="Twitter">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
                <a className="text-gray-400 hover:text-[#2563eb] transition-colors" href="#" aria-label="WhatsApp">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.012 2c-5.522 0-9.997 4.478-9.997 10 0 1.764.457 3.419 1.257 4.858L2 22l5.311-1.393c1.368.745 2.935 1.171 4.601 1.171 5.522 0 9.997-4.478 9.997-10 0-5.522-4.475-10-9.997-10zm5.82 13.882c-.244.686-1.43 1.254-1.968 1.343-.539.088-1.077.176-3.419-.785-2.827-1.157-4.639-4.04-4.781-4.225-.143-.186-1.162-1.543-1.162-2.943 0-1.4.731-2.086 1-2.382.269-.296.584-.37.781-.37.197 0 .393 0 .563.009.186.009.431-.071.674.512.244.582.831 2.028.904 2.174.072.146.121.316.024.512-.097.194-.146.316-.293.486-.146.17-.306.379-.437.51-.146.146-.3.306-.13.593.17.287.757 1.246 1.625 2.019.868.773 1.603 1.012 1.896 1.157.293.146.463.121.636-.073.173-.194.731-.85 1.054-1.272.244-.431.584-.341.979-.194.396.146 2.51 1.186 2.946 1.405.437.219.728.327.834.512.106.185.106 1.071-.138 1.757z" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="lg:col-span-2 text-left">
              <h4 className="font-semibold text-sm text-[#0f172a] mb-4">Shop</h4>
              <ul className="space-y-2.5 text-xs text-gray-400 font-medium">
                {["All Products", "T-Shirt", "Hoodie", "Jacket", "Pants", "Accessories", "Shoes"].map((cat) => (
                  <li key={cat}>
                    <a
                      onClick={(e) => {
                        e.preventDefault();
                        setActivePage("produk");
                      }}
                      className="hover:text-[#2563eb] transition-colors cursor-pointer"
                    >
                      {cat}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-2 text-left">
              <h4 className="font-semibold text-sm text-[#0f172a] mb-4">Information</h4>
              <ul className="space-y-2.5 text-xs text-gray-400 font-medium font-sans">
                <li>
                  <a
                    onClick={(e) => {
                      e.preventDefault();
                      setActivePage("cara-kerja");
                    }}
                    className="hover:text-[#2563eb] transition-colors cursor-pointer"
                  >
                    Cara Kerja
                  </a>
                </li>
                <li>
                  <a
                    onClick={(e) => {
                      e.preventDefault();
                      setActivePage("tentang-kami");
                    }}
                    className="hover:text-[#2563eb] transition-colors cursor-pointer"
                  >
                    Tentang Kami
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#2563eb] transition-colors">
                    Shipping & Returns
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#2563eb] transition-colors">
                    Payment Methods
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#2563eb] transition-colors">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-2 text-left">
              <h4 className="font-semibold text-sm text-[#0f172a] mb-4">Customer Service</h4>
              <ul className="space-y-2.5 text-xs text-gray-400 font-medium">
                <li>
                  <a href="#" className="hover:text-[#2563eb] transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#2563eb] transition-colors">
                    Track Order
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#2563eb] transition-colors">
                    Size Guide
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#2563eb] transition-colors">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-3 space-y-4 text-left">
              <h4 className="font-semibold text-sm text-[#0f172a]">Payment Methods</h4>
              <div className="grid grid-cols-4 gap-2">
                <div className="border border-gray-100 rounded p-1.5 flex items-center justify-center bg-gray-50/50 shadow-sm">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/5/5c/Bank_Central_Asia.svg"
                    alt="BCA"
                    className="h-3 w-auto object-contain"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-gray-100 text-center">
            <p className="text-[11px] text-gray-400 font-medium tracking-wide">
              &copy; 2026 wearloop. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
