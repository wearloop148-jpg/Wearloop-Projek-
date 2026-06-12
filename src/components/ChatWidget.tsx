import React, { useState, useRef, useEffect } from "react";
import { ChatRoom, User, ChatMessage } from "../types";

interface ChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  chatRooms: ChatRoom[];
  onSendMessage: (roomId: string, messageText: string) => void;
  currentUser: User | null;
  activeRoomId: string | null;
  setActiveRoomId: (id: string | null) => void;
  activePage?: string;
}

export default function ChatWidget({
  isOpen,
  onClose,
  onOpen,
  chatRooms,
  onSendMessage,
  currentUser,
  activeRoomId,
  setActiveRoomId,
  activePage,
}: ChatWidgetProps) {
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Local state for guest customer service logs (before login)
  const [guestMessages, setGuestMessages] = useState<ChatMessage[]>([
    {
      id: "g1",
      senderId: "admin",
      senderName: "Wearloop Support CS",
      text: "Halo! Selamat datang di Wearloop Customer Service (CS) Support. Silakan Login ke akun Anda untuk bertransaksi dan berkirim pesan dengan seller.",
      createdAt: "10:00",
    }
  ]);

  // Chat is enabled on any page so buyers can read and communicate with sellers seamlessly across all views.

  // Filter chat rooms that belong to currentUser (either they are buyer or seller)
  const myRooms = currentUser
    ? chatRooms.filter((r) => r.buyerId === currentUser.id || r.sellerId === currentUser.id)
    : [];

  const activeRoom = currentUser
    ? (myRooms.find((r) => r.id === activeRoomId) || (myRooms.length > 0 ? myRooms[0] : null))
    : null;

  useEffect(() => {
    if (currentUser && activeRoom && !activeRoomId) {
      setActiveRoomId(activeRoom.id);
    }
  }, [currentUser, activeRoom, activeRoomId, setActiveRoomId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeRoom?.messages, guestMessages.length]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    if (currentUser) {
      if (!activeRoom) return;
      onSendMessage(activeRoom.id, inputText.trim());
      setInputText("");
    } else {
      // Guest chat flow to Wearloop CS Support
      const userText = inputText.trim();
      const userMsg: ChatMessage = {
        id: `guest-u-${Date.now()}`,
        senderId: "guest",
        senderName: "Tamu",
        text: userText,
        createdAt: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      };
      setGuestMessages(prev => [...prev, userMsg]);
      setInputText("");

      // CS response template after a short organic timeout
      setTimeout(() => {
        let replyText = "Halo! Terima kasih atas pertanyaannya. Admin kami akan segera membalas pesan Anda. Harap Login terlebih dahulu jika ingin menghubungi supplier/penjual garmen ini.";
        if (userText.toLowerCase().includes("cuci") || userText.toLowerCase().includes("bersih")) {
          replyText = "Wearloop menjamin higenitas tinggi sirkular garmen dengan sertifikasi QC cuci sterilisasi sabun antiseptik & diberi parfum sebelum diposting.";
        } else if (userText.toLowerCase().includes("bayar") || userText.toLowerCase().includes("rekening")) {
          replyText = "Metode pembayaran di Wearloop menggunakan transfer langsung ke rekening bank terdaftar seller pilihan Anda.";
        } else if (userText.toLowerCase().includes("daftar") || userText.toLowerCase().includes("seller")) {
          replyText = "Ingin mendaftar sebagai seller garmen? Silakan klik tombol 'Daftar Sebagai Seller & Toko' di halaman Login utama.";
        }

        setGuestMessages(prev => [
          ...prev,
          {
            id: `guest-a-${Date.now()}`,
            senderId: "admin",
            senderName: "Wearloop Support CS",
            text: replyText,
            createdAt: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
          }
        ]);
      }, 500);
    }
  };

  const currentDisplayMessages = currentUser 
    ? (activeRoom ? activeRoom.messages : []) 
    : guestMessages;

  return (
    <div className="fixed bottom-6 right-6 z-50 font-poppins selection:bg-[#2c46a9] select-none text-[#020c38]" id="chat-widget-root">
      {isOpen ? (
        // EXPANDED CHAT PANEL
        <div className="w-[360px] md:w-[400px] h-[500px] bg-white rounded-3xl border border-blue-100 shadow-2xl flex flex-col overflow-hidden transition-all animate-fade-in text-left">
          {/* HEADER BAR */}
          <div className="bg-[#2c46a9] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">
                {currentUser && activeRoom
                  ? (currentUser.role === "buyer" ? activeRoom.sellerName : activeRoom.buyerName).charAt(0).toUpperCase()
                  : "W"}
              </div>
              <div>
                <h4 className="font-extrabold text-sm truncate max-w-[180px]">
                  {currentUser && activeRoom
                    ? (currentUser.role === "buyer" ? activeRoom.sellerName : activeRoom.buyerName)
                    : "Wearloop CS Support"}
                </h4>
                <p className="text-[10px] text-blue-200 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Pusat Bantuan Online
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white p-1 hover:bg-white/10 rounded-full cursor-pointer"
                title="Minimalkan Chat"
              >
                <span className="material-symbols-outlined text-[20px]">keyboard_arrow_down</span>
              </button>
            </div>
          </div>

          {/* TWO PANEL SPLIT FOR MULTIPLE CHAT ROOMS */}
          <div className="flex-1 flex overflow-hidden">
            {/* LEFT TAB FOR OTHER CHATS IF MORE THAN ONE */}
            {currentUser && myRooms.length > 1 && (
              <div className="w-16 border-r border-gray-50 flex flex-col items-center py-3 gap-3 bg-gray-55/40 shrink-0">
                {myRooms.map((room) => {
                  const labelLetter = (currentUser.role === "buyer" ? room.sellerName : room.buyerName).charAt(0).toUpperCase();
                  const isActive = room.id === activeRoom?.id;
                  return (
                    <button
                      key={room.id}
                      onClick={() => setActiveRoomId(room.id)}
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center font-extrabold text-xs transition-all relative ${
                        isActive
                          ? "bg-[#2c46a9] text-white shadow-md shadow-blue-200"
                          : "bg-gray-100 hover:bg-slate-200 text-gray-500"
                      }`}
                      title={currentUser.role === "buyer" ? room.sellerName : room.buyerName}
                    >
                      {labelLetter}
                      <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border border-white"></span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* MESSAGE CHATTER FLOW AREA */}
            <div className="flex-grow flex flex-col justify-between overflow-hidden bg-slate-50/50">
              
              {/* Product mini attachment bar */}
              {currentUser && activeRoom && activeRoom.productName && (
                <div className="px-4 py-2 border-b border-gray-100 bg-white flex items-center gap-2 text-xs text-left shadow-xs">
                  {activeRoom.productImage && (
                    <img
                      src={activeRoom.productImage}
                      alt={activeRoom.productName}
                      className="w-7 h-7 object-contain rounded bg-gray-50 border p-0.5"
                    />
                  )}
                  <div className="min-w-0">
                    <span className="text-[9px] text-gray-400 font-bold block uppercase leading-none">Menanyakan Produk</span>
                    <span className="font-extrabold text-gray-700 truncate block leading-tight">{activeRoom.productName}</span>
                  </div>
                </div>
              )}

              {/* Message scroll list */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
                {currentDisplayMessages.length > 0 ? (
                  currentDisplayMessages.map((msg) => {
                    const isMe = currentUser ? msg.senderId === currentUser.id : msg.senderId === "guest";
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-[20px] px-3.5 py-2.5 text-xs font-semibold leading-relaxed ${
                            isMe
                              ? "bg-[#2c46a9] text-white rounded-br-none shadow-sm"
                              : "bg-white text-gray-800 border border-slate-100 rounded-bl-none shadow-xs"
                          }`}
                        >
                          {msg.text}
                        </div>
                        <span className="text-[9px] text-gray-400 font-bold mt-1 px-1 font-mono">
                          {msg.createdAt}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <div className="h-full flex items-center justify-center text-center p-6 flex-col text-gray-300">
                    <span className="material-symbols-outlined text-4xl">chat</span>
                    <p className="text-[11px] font-bold mt-2 text-gray-400">Belum ada obrolan garmen</p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* INPUT MESSAGE CONTROLS FOOTER */}
              {(activeRoom || !currentUser) && (
                <form
                  onSubmit={handleSend}
                  className="p-3 bg-white border-t border-gray-100 flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={currentUser ? "Tulis balasan pesan untuk seller..." : "Tulis pertanyaan ke Customer Service..."}
                    className="flex-grow text-xs px-4 py-2.5 border border-gray-100 rounded-full focus:outline-none focus:border-[#2c46a9] bg-gray-50/50"
                  />
                  <button
                    type="submit"
                    className="w-9 h-9 bg-[#2c46a9] hover:bg-[#020c38] text-white rounded-full flex items-center justify-center cursor-pointer shadow-md transition-all shrink-0"
                  >
                    <span className="material-symbols-outlined text-sm font-bold">send</span>
                  </button>
                </form>
              )}

            </div>
          </div>
        </div>
      ) : (
        // FLOATING CIRCULAR CHAT TRIGGER BUTTON WITH EXPLICIT TEXT FOR CS
        <button
          onClick={onOpen}
          className="h-14 w-14 bg-[#2c46a9] hover:bg-[#020c38] text-white rounded-full flex items-center justify-center shadow-2xl scale-100 hover:scale-105 active:scale-95 transition-all cursor-pointer relative border border-white/20 font-poppins"
          title="Hubungi Customer Service Wearloop"
        >
          <span className="material-symbols-outlined text-[24px]">chat</span>
          
          {/* Badge indicator count of active threads */}
          {myRooms.length > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-bounce leading-none">
              {myRooms.length}
            </span>
          )}
        </button>
      )}
    </div>
  );
}
