import React, { useState } from "react";
import { Product } from "../types";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQty: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onSuccessCheckout: () => void;
  setActivePage: (p: any) => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  onSuccessCheckout,
  setActivePage,
}: CartDrawerProps) {
  const [checkoutMode, setCheckoutMode] = useState(false);
  const [successMode, setSuccessMode] = useState(false);

  // Form Fields
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState("BCA");

  if (!isOpen) return null;

  const subtotal = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
  
  // Free shipping over 200k, otherwise 15k flat rate
  const shippingCharge = subtotal > 200000 ? 0 : 15000;
  const grandTotal = subtotal + shippingCharge;

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !address) {
      alert("Tolong lengkapi semua data pengiriman Anda!");
      return;
    }
    setSuccessMode(true);
  };

  const finishCheckout = () => {
    setSuccessMode(false);
    setCheckoutMode(false);
    onClearCart();
    onSuccessCheckout();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-poppins text-[#020c38] select-none">
      {/* Background overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      ></div>

      <div className="absolute inset-y-0 right-0 max-w-full flex">
        {/* Sliding Panel */}
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col h-full transform transition-transform duration-300">
          
          {/* Header Title area */}
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-[#2c46a9]">
                shopping_bag
              </span>
              Keranjang Belanja
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-red-500 font-bold p-1 rounded-full hover:bg-slate-50 flex items-center justify-center transition-colors"
            >
              <span className="material-symbols-outlined text-[24px]">close</span>
            </button>
          </div>

          {/* Render Body of active state (Success vs. Checkout vs. Item List) */}
          {successMode ? (
            <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col items-center justify-start text-center bg-[#fafbfc]">
              <div className="w-16 h-16 bg-green-50 border border-green-500 rounded-full flex items-center justify-center text-green-500 mb-4 animate-bounce">
                <span className="material-symbols-outlined text-3xl font-bold">check</span>
              </div>
              <h3 className="font-bold text-lg mb-1 text-gray-900">Pesanan Berhasil Dibuat!</h3>
              
              <div className="bg-blue-50 border border-blue-105 rounded-2xl p-4 mt-3 mb-4 w-full text-left font-poppins text-xs text-blue-900 leading-relaxed font-semibold">
                Hallo <strong>{fullName}</strong>, pesanan kamu telah diinformasikan kepada penjual. Berikut adalah detail pesanan kamu:
              </div>

              {/* SLIP RECEIPT IN MINI SIDEBAR */}
              <div className="bg-white border text-gray-700 border-gray-150 rounded-2xl p-4 w-full text-left font-mono text-xs space-y-3 mb-6">
                <p className="font-black text-center border-b border-gray-150 pb-1.5 font-poppins text-gray-800 tracking-wider">STRUK WEARLOOP</p>
                <div className="space-y-1 text-[11px]">
                  {cartItems.map((item, index) => (
                    <div key={index} className="flex justify-between items-start gap-4">
                      <span className="truncate flex-1">
                        {item.product.name} x{item.quantity}
                      </span>
                      <span className="font-bold shrink-0">
                        Rp {(item.product.price * item.quantity).toLocaleString("id-ID")}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-150 pt-2 space-y-1 text-[11px]">
                  <div className="flex justify-between">
                    <span>Penerima:</span>
                    <span className="font-sans font-medium">{fullName} ({phone})</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ongkos Kirim:</span>
                    <span>Rp {shippingCharge.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between font-bold text-xs text-[#020c38] border-t border-gray-100 pt-1.5">
                    <span>Total Bayar:</span>
                    <span>Rp {grandTotal.toLocaleString("id-ID")}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={finishCheckout}
                className="w-full bg-[#020c38] hover:bg-[#2c46a9] text-white py-3.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer shadow-sm"
              >
                Selesai & Lanjut Belanja
              </button>
            </div>
          ) : checkoutMode ? (
            <form onSubmit={handleCheckoutSubmit} className="flex-1 overflow-y-auto p-6 flex flex-col justify-between bg-[#fafbfc]">
              <div className="space-y-6 text-left">
                <div className="flex items-center gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => setCheckoutMode(false)}
                    className="text-[#2c46a9] hover:underline text-xs font-semibold flex items-center gap-1"
                  >
                    ← Kembali ke Detail Keranjang
                  </button>
                </div>
                <h3 className="font-bold text-base text-gray-800 border-b border-gray-100 pb-2">
                  Formulir Pengiriman & Pembayaran
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
                      Nama Penerima Lengkap *
                    </label>
                    <input
                      required
                      type="text"
                      className="w-full h-11 border border-gray-200 rounded-xl px-4 text-xs font-poppins focus:border-[#2c46a9] focus:outline-none bg-white transition-all"
                      placeholder="e.g. John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
                      Nomor Handphone (Aktif WA) *
                    </label>
                    <input
                      required
                      type="tel"
                      className="w-full h-11 border border-gray-200 rounded-xl px-4 text-xs font-poppins focus:border-[#2c46a9] focus:outline-none bg-white transition-all"
                      placeholder="e.g. 081234567890"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
                      Alamat Pengiriman Lengkap *
                    </label>
                    <textarea
                      required
                      rows={3}
                      className="w-full border border-gray-200 rounded-xl p-4 text-xs font-poppins focus:border-[#2c46a9] focus:outline-none bg-white transition-all resize-none"
                      placeholder="Tuliskan nama jalan, blok, nomor rumah, kecamatan, kota & kode pos..."
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
                      Metode Pembayaran *
                    </label>
                    <select
                      className="w-full h-11 border border-gray-200 rounded-xl px-4 text-xs font-poppins bg-white focus:border-[#2c46a9] focus:outline-none"
                      value={payment}
                      onChange={(e) => setPayment(e.target.value)}
                    >
                      <option value="BCA Transfer">BCA Transfer (Virtual Account)</option>
                      <option value="Mandiri VA">Mandiri Virtual Account</option>
                      <option value="GoPay / QRIS">GoPay / QRIS Instan</option>
                      <option value="OVO/Dana">OVO / Dana Wallet</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Total and actions */}
              <div className="border-t border-gray-200 pt-5 mt-8 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Subtotal</span>
                    <span>Rp {subtotal.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Ongkos Kirim</span>
                    <span>{shippingCharge === 0 ? "Gratis (Promo)" : `Rp ${shippingCharge.toLocaleString("id-ID")}`}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-gray-800">
                    <span>Total Pembayaran</span>
                    <span className="text-[#2c46a9]">Rp {grandTotal.toLocaleString("id-ID")}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#2c46a9] hover:bg-[#020c38] text-white py-3.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer shadow-sm text-center"
                >
                  Proses Selesaikan Pembayaran
                </button>
              </div>
            </form>
          ) : (
            <div className="flex-1 flex flex-col justify-between h-[calc(100vh-70px)]">
              {/* Product list array scroll area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cartItems.length === 0 ? (
                  <div className="py-24 text-center">
                    <span className="material-symbols-outlined text-gray-200 text-5xl mb-4">
                      shopping_cart_off
                    </span>
                    <p className="text-gray-400 text-sm font-medium">
                      Keranjang kamu masih kosong.
                    </p>
                    <button
                      onClick={onClose}
                      className="mt-4 text-xs font-semibold text-[#2c46a9] hover:underline"
                    >
                      Mulai belanja thrift &rarr;
                    </button>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-center gap-4 bg-white border border-gray-100 rounded-2xl p-3 shadow-xs hover:border-gray-200 transition-colors"
                    >
                      <div className="w-16 h-16 bg-slate-50 flex items-center justify-center rounded-xl p-1 shrink-0 overflow-hidden">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <h4 className="font-bold text-xs truncate text-gray-900 leading-snug">
                          {item.product.name}
                        </h4>
                        <p className="text-[10px] text-gray-400 font-medium">
                          Size {item.product.size} &bull; {item.product.condition}
                        </p>
                        <p className="text-xs font-extrabold text-[#2c46a9] mt-0.5">
                          Rp {item.product.price.toLocaleString("id-ID")}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2.5">
                        {/* Quantity controls */}
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden h-7 bg-white shrink-0">
                          <button
                            onClick={() => onUpdateQty(item.product.id, item.quantity - 1)}
                            className="px-2 hover:bg-slate-50 text-gray-500 font-bold text-sm"
                          >
                            -
                          </button>
                          <span className="px-2 text-xs font-bold text-gray-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQty(item.product.id, item.quantity + 1)}
                            className="px-2 hover:bg-slate-50 text-gray-500 font-bold text-sm"
                          >
                            +
                          </button>
                        </div>

                        {/* Remove item button */}
                        <button
                          onClick={() => onRemoveItem(item.product.id)}
                          className="text-gray-300 hover:text-red-500 p-0.5 flex items-center transition-colors"
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            delete
                          </span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Total checkout details summary footer inside the sliding menu */}
              {cartItems.length > 0 && (
                <div className="p-6 border-t border-gray-100 bg-gray-50/50 sticky bottom-0">
                  <div className="space-y-2 mb-5">
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Subtotal</span>
                      <span>Rp {subtotal.toLocaleString("id-ID")}</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Ongkos Kirim</span>
                      <span className="flex items-center gap-1">
                        {shippingCharge === 0 ? (
                          <>
                            <span className="line-through text-gray-300 text-[10px]">Rp 15.000</span>
                            <span className="text-green-600 font-semibold">Gratis</span>
                          </>
                        ) : (
                          `Rp ${shippingCharge.toLocaleString("id-ID")}`
                        )}
                      </span>
                    </div>
                    {subtotal <= 200000 && (
                      <p className="text-[10px] text-gray-400 text-left bg-blue-50/50 p-2.5 rounded-lg border border-blue-100/30">
                        💡 Belanja <strong>Rp {(201000 - subtotal).toLocaleString("id-ID")}</strong> lagi untuk menikmati <strong>Gratis Ongkir</strong> seluruh Indonesia!
                      </p>
                    )}
                    <div className="flex justify-between text-sm font-bold text-gray-800 pt-1 border-t border-gray-100/50">
                      <span>Total Biaya</span>
                      <span className="text-[#2c46a9]">Rp {grandTotal.toLocaleString("id-ID")}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setActivePage("cart");
                      onClose();
                    }}
                    className="w-full bg-[#2c46a9] hover:bg-[#020c38] text-white py-3.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer shadow-sm text-center"
                  >
                    Lihat Keranjang
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
