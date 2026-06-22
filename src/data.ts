import { Product } from "./types";

export const PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Hoodie Athletic ",
    category: "Hoodie",
    size: "L",
    condition: "Like New",
    price: 185000,
    originalPrice: 799000,
    discount: "-77%",
    image: "/images/fleece.jpg",
    rating: 4.8,
    isFeatured: true,
    brand: "Nike",
    stock: 1,
    status: "active",
    sellerId: "seller-1",
    sellerName: "Peaky Blinders",
    washPhoto: "/images/Cuci.png",
    perfumePhoto: "/images/Cuci.png",
    fullPhoto: "/images/fleece.jpg",
    detailPhotos: ["/images/fleece.jpg"],
    description: "Hoodie vintage Nike authentic dalam kondisi rasi prima. Kain tebal, karet kencang, warna hitam solid mengkilap, dan bersih steril siap pakai langsung!"
  },
  {
    id: "2",
    name: "Denim Rugged Jacket Classic xl",
    category: "Jacket",
    size: "xl",
    condition: "Very Good",
    price: 195000,
    originalPrice: 899000,
    discount: "-78%",
    image: "/images/jacket.jpg",
    rating: 4.7,
    isFeatured: true,
    brand: "Levi's",
    stock: 1,
    status: "active",
    sellerId: "seller-1",
    sellerName: "Peaky Blinders",
    washPhoto: "/images/WashJacket.png",
    perfumePhoto: "/images/WashJacket.png",
    fullPhoto: "/images/jacket.jpg",
    detailPhotos: ["/images/jacket.jpg"],
    description: "Jaket denim tebal premium, dicuci bersih anti-bakteri, aroma segar bunga sakura. Tampilan maskulin rugged berkelas."
  },
  {
    id: "3",
    name: "Cargo Pants Retro Vintage L",
    category: "Pants",
    size: "L",
    condition: "Like New",
    price: 165000,
    originalPrice: 599000,
    discount: "-72%",
    image: "/images/Celana.jpg",
    rating: 4.9,
    isFeatured: true,
    brand: "Dickies",
    stock: 1,
    status: "active",
    sellerId: "seller-1",
    sellerName: "Peaky Blinders",
    washPhoto: "/images/CuciCelana.png",
    perfumePhoto: "/images/CuciCelana.png",
    fullPhoto: "/images/Celana.jpg",
    detailPhotos: ["images/Celana.jpg"],
    description: "Celana kargo vintage saku samping multifungsi. Bahannya awet tahan banting, warna hijau lumut pekat pudar estetis."
  },
  {
    id: "4",
    name: "New Balance 574 Black Sneaker",
    category: "Sneakers",
    size: "L",
    condition: "Very Good",
    price: 650000,
    originalPrice: 2490000,
    discount: "-74%",
    image: "/images/Sepatu.jpg",
    rating: 5.0,
    isFeatured: true,
    brand: "New Balance",
    stock: 1,
    status: "active",
    sellerId: "seller-1",
    sellerName: "Peaky Blinders",
    washPhoto: "/images/Cucisepatu.png",
    perfumePhoto: "/images/Cucisepatu.png",
    fullPhoto: "/images/Sepatu.jpg",
    detailPhotos: ["/images/Sepatu.jpg"],
    description: "Sepatu ikonik New Balance 574 sol empuk dan anti selip, jahitan rapi kuat, dan telah steril di-laundry khusus sepatu sirkular garmen."
  },
  {
    id: "5",
    name: "Workshirt Blue Cotton M",
    category: "Shirt",
    size: "M",
    condition: "Good",
    price: 125000,
    originalPrice: 420000,
    discount: "-70%",
    image: "/images/Denim.jpg",
    rating: 4.5,
    isFeatured: false,
    brand: "Uniqlo",
    stock: 1,
    status: "active",
    sellerId: "seller-1",
    sellerName: "Peaky Blinders",
    washPhoto: "/images/DenimCuci.png",
    perfumePhoto: "/images/DenimCuci.png",
    fullPhoto: "/images/Denim.jng",
    detailPhotos: ["/images/Denim.jpg"],
    description: "Kemeja Denim premium berkualitas dunia. Dingin dipakai, menyerap keringat dengan baik, warna biru langit tenang."
  },
  {
    id: "6",
    name: "Converse Crewneck",
    category: "Accessories",
    size: "XL",
    condition: "Good",
    price: 145000,
    originalPrice: 499000,
    discount: "-71%",
    image: "/images/Converse.jpg",
    rating: 4.6,
    isFeatured: false,
    brand: "Carhartt",
    stock: 1,
    status: "active",
    sellerId: "seller-1",
    sellerName: "Peaky Blinders",
    washPhoto: "/images/CuciConverse.png",
    perfumePhoto: "/images/CuciConverse.png",
    fullPhoto: "/images/Converse.jpg",
    detailPhotos: ["/images/Converse.jpg"],
    description: "Crewneck adem dan stylish."
  }
];

export const CATEGORIES_DATA = [
  {
    name: "Shirt",
    count: "1+",
    image: "https://i.postimg.cc/BnDDdvSM/hai-(17).png"
  },
  {
    name: "Hoodie",
    count: "2+",
    image: "https://i.postimg.cc/hj0kDxn0/hai-(18).png"
  },
  {
    name: "Jacket",
    count: "1+",
    image: "https://i.postimg.cc/76pKyZGG/hai-(19).png"
  },
  {
    name: "Pants",
    count: "1+",
    image: "https://i.postimg.cc/y8gWD6kR/hai-(20).png"
  },
  {
    name: "Sneakers",
    count: "1+",
    image: "https://i.postimg.cc/Pxxqktsk/hai-(22).png"
  },
  {
    name: "Accessories",
    count: "1+",
    image: "https://i.postimg.cc/J0DSbFJJ/hai-(21).png"
  }
];

export const FAQ_DATA = [
  {
    question: "Apakah semua pakaian di Wearloop sudah bersih?",
    answer: "Ya, betul sekali! Semua item pakaian yang masuk ke gudang Wearloop telah melalui proses pencucian, penyetrikaan, dan penyortiran kualitas (dry cleaning) sehingga siap digunakan langsung oleh pembeli."
  },
  {
    question: "Bagaimana sistem pembayaran untuk transaksi?",
    answer: "Kami bekerjasama dengan payment gateway terpercaya seperti Bank Central Asia (BCA), bank transfer, QRIS, e-wallet, dan kartu kredit. Seluruh pembayaran terenkripsi aman dan dana baru dialokasikan ke penjual setelah barang diterima dengan selamat."
  },
  {
    question: "Bagaimana cara melakukan klaim jika barang cacat atau tidak sesuai?",
    answer: "Kami menawarkan garansi pengembalian 100% apabila barang yang diterima tidak sesuai foto atau memiliki kecacatan yang tidak diinfokan sebelumnya. Anda hanya perlu menyertakan video unboxing dan menghubungi tim CS kami dalam 1x24 jam."
  },
  {
    question: "Apakah saya bisa menjual pakaian panti sosial?",
    answer: "Pakaian yang tidak layak jual atau yang diniatkan didonasikan dapat dikirim ke program sosial kami. Wearloop akan mendistribusikannya secara gratis ke panti asuhan, panti jompo, dan daerah tertinggal."
  }
];

