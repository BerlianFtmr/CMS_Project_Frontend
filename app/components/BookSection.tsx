"use client";

import React, { useState, useEffect } from 'react';
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

export const defaultBooks: Book[] = [];

interface Book {
  id: number;
  volume?: string;
  title: string;
  author: string;
  rating: number;
  category?: string;
  description: string;
  color: string;
  price: number;
}

interface CartItem {
  id: number;
  title: string;
  author: string;
  price: number;
  qty: number;
  cover: string;
}

interface ExtendedCartContext {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  increaseQty: (id: number) => void;
  decreaseQty: (id: number) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
}

interface BookSectionProps {
  books?: Book[];
}

export default function BookSection({ books = defaultBooks }: BookSectionProps) {
  const cartContext = useCart() as ExtendedCartContext;
  const router = useRouter();
  
  const [allBooks, setAllBooks] = useState<Book[]>(books);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showReview, setShowReview] = useState(false);
  const [newBook, setNewBook] = useState<Partial<Book & { image?: string }>>({
    title: '',
    author: '',
    rating: 0,
    category: '',
    description: '',
    color: '',
    price: 1,
    image: undefined,
  });

  const [bookImages, setBookImages] = useState<{ [key: number]: string }>({});
  const [dragStates, setDragStates] = useState<{ [key: number]: boolean }>({});
  const [localPrice, setLocalPrice] = useState<string>('1');
  const [isDragOverForm, setIsDragOverForm] = useState(false); // State untuk form

  // Reset localPrice ketika modal dibuka
  useEffect(() => {
    if (showAddForm) {
      setLocalPrice(newBook.price?.toString() || '1');
    }
  }, [showAddForm, newBook.price]);

  // 🔥 PERBAIKAN: Handler drag & drop untuk buku cards
  const handleDragOver = (e: React.DragEvent, bookId: number) => {
    e.preventDefault();
    e.stopPropagation();
    setDragStates(prev => ({ ...prev, [bookId]: true }));
  };

  const handleDragEnter = (e: React.DragEvent, bookId: number) => {
    e.preventDefault();
    e.stopPropagation();
    setDragStates(prev => ({ ...prev, [bookId]: true }));
  };

  const handleDragLeave = (e: React.DragEvent, bookId: number) => {
    e.preventDefault();
    e.stopPropagation();
    setDragStates(prev => ({ ...prev, [bookId]: false }));
  };

  const handleDrop = (e: React.DragEvent, bookId: number) => {
    e.preventDefault();
    e.stopPropagation();
    setDragStates(prev => ({ ...prev, [bookId]: false }));

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          setBookImages(prev => ({ ...prev, [bookId]: reader.result as string }));
        };
        reader.readAsDataURL(file);
      } else {
        alert('Please drop a valid image file.');
      }
    }
  };

  // 🔥 PERBAIKAN: Handler drag & drop untuk modal form
  const handleFormDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOverForm(true);
  };

  const handleFormDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOverForm(true);
  };

  const handleFormDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOverForm(false);
  };

  const handleFormDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOverForm(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          setNewBook({ ...newBook, image: reader.result as string });
        };
        reader.readAsDataURL(file);
      } else {
        alert('Please drop a valid image file.');
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setNewBook({ ...newBook, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please select a valid image file.');
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Hanya izinkan angka, dan izinkan string kosong sementara
    if (value === '' || /^[0-9]*$/.test(value)) {
      setLocalPrice(value);
      
      // Update newBook.price hanya jika value tidak kosong
      if (value !== '') {
        const numValue = parseInt(value, 10);
        if (!isNaN(numValue) && numValue > 0) {
          setNewBook({ ...newBook, price: numValue });
        }
      }
    }
  };

  const handlePriceBlur = () => {
    // Jika kosong atau 0, set ke 1
    if (!localPrice || localPrice === '0') {
      setLocalPrice('1');
      setNewBook({ ...newBook, price: 1 });
    }
  };

  const handlePriceKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Blokir tombol panah atas/bawah
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
    }
    
    // Blokir karakter "e", "+", "-", "."
    if (['e', 'E', '+', '-', '.'].includes(e.key)) {
      e.preventDefault();
    }
  };

  const addBook = async () => {
    if (!newBook.title || !newBook.author) {
      alert('Title and Author are required!');
      return;
    }

    // Validasi price akhir
    if (!newBook.price || newBook.price < 1) {
      alert('Price must be at least 1!');
      return;
    }

    const bookToAdd: Book = {
      id: Date.now(),
      volume: newBook.volume || '',
      title: newBook.title,
      author: newBook.author,
      rating: newBook.rating || 0,
      category: newBook.category || '',
      description: newBook.description || '',
      color: newBook.color || '',
      price: newBook.price || 1,
    };

    setAllBooks([...allBooks, bookToAdd]);
    if (newBook.image) {
      setBookImages(prev => ({ ...prev, [bookToAdd.id]: newBook.image! }));
    }
    
    // Reset form
    setNewBook({ 
      title: '', 
      author: '', 
      rating: 0, 
      category: '', 
      description: '', 
      color: '', 
      price: 1, 
      image: undefined 
    });
    setLocalPrice('1');
    setShowAddForm(false);
    setIsDragOverForm(false);
  };

  const deleteBook = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setAllBooks(allBooks.filter(book => book.id !== id));
    setBookImages(prev => {
      const newImages = { ...prev };
      delete newImages[id];
      return newImages;
    });
  };

  const openReview = (book: Book) => {
    setSelectedBook(book);
    setShowReview(true);
  };

  const handleAddToCart = (book: Book, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    
    cartContext.addToCart({
      id: book.id,
      title: book.title,
      author: book.author,
      price: book.price,
      qty: 1,
      cover: bookImages[book.id] || `https://via.placeholder.com/150x200?text=${encodeURIComponent(book.title)}`,
    });
    
    alert(`"${book.title}" telah ditambahkan ke keranjang!`);
  };

  const handleBuyNow = (book: Book) => {
    cartContext.addToCart({
      id: book.id,
      title: book.title,
      author: book.author,
      price: book.price,
      qty: 1,
      cover: bookImages[book.id] || `https://via.placeholder.com/150x200?text=${encodeURIComponent(book.title)}`,
    });
    
    setShowReview(false);
    router.push('/cart');
  };

  return (
    <>
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-left justify-between mb-12">
            <div>
              <h2 className="text-lg md:text-5xl font-bold text-gray-900 mb-2">
                Our Books
              </h2>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <span className="text-6xl font-black text-gray-200">{allBooks.length}</span>
              <div>
                <p className="text-sm text-gray-500">Total Books</p>
                <p className="text-2xl font-bold text-gray-900">{allBooks.length}+</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <TambahBukuCard onClick={() => setShowAddForm(true)} />

            {allBooks.map((book, index) => (
              <div
                key={book.id}
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden border border-gray-100"
              >
                {/* 🔥 PERBAIKAN: Tambahkan event handler ke parent div */}
                <div
                  className={`relative h-48 overflow-hidden ${dragStates[book.id] ? 'border-2 border-dashed border-blue-500 bg-blue-50/20' : ''}`}
                  onDragOver={(e) => handleDragOver(e, book.id)}
                  onDragEnter={(e) => handleDragEnter(e, book.id)}
                  onDragLeave={(e) => handleDragLeave(e, book.id)}
                  onDrop={(e) => handleDrop(e, book.id)}
                  style={{
                    backgroundImage: bookImages[book.id] 
                      ? `url(${bookImages[book.id]})` 
                      : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  {/* Gradient background fallback */}
                  {!bookImages[book.id] && (
                    <div className={`absolute inset-0 bg-gradient-to-br ${book.color || 'from-gray-400 to-gray-600'}`}>
                      {/* Tampilkan DropZone area ketika tidak ada gambar */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center text-white/90 p-4">
                          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
                            <svg 
                              className="w-6 h-6" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24" 
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={1.5} 
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                              />
                            </svg>
                          </div>
                          <p className="text-sm font-medium">Drag & Drop files here</p>
                          <p className="text-xs opacity-80">or</p>
                          <p className="text-sm font-medium">Browse Files</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tombol X untuk buku pertama */}
                  {index === 0 && allBooks.length > 0 && (
                    <button
                      onClick={(e) => deleteBook(book.id, e)}
                      className="absolute top-3 left-3 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors z-10"
                    >
                      ×
                    </button>
                  )}

                  {book.volume && (
                    <div className="absolute top-4 left-4 bg-black/80 text-white px-3 py-1 rounded-full text-sm font-bold z-10">
                      {book.volume}
                    </div>
                  )}
                  
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <h3 className="text-xl font-bold text-white">{book.title}</h3>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-500">{book.author}</p>
                      {book.category && <p className="text-xs text-gray-400">{book.category}</p>}
                    </div>
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-yellow-400 fill-yellow-400" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                      <span className="ml-1 font-bold text-gray-900">{book.rating}</span>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-6 line-clamp-3">
                    {book.description}
                  </p>

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => openReview(book)}
                        className="px-4 py-2 border-2 border-gray-900 text-gray-900 rounded-lg font-semibold hover:bg-gray-900 hover:text-white transition-all duration-300 text-sm"
                      >
                        Read Preview
                      </button>
                      
                      {/* TOMBOL ADD TO CART HANYA UNTUK BUKU KE-2 DAN SETERUSNYA */}
                      {index !== 0 && (
                        <button 
                          onClick={(e) => handleAddToCart(book, e)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all duration-300 text-sm flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          Add to Cart
                        </button>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">Rp {book.price.toLocaleString('id-ID')}</p>
                      <p className="text-xs text-gray-500">Paperback</p>
                    </div>
                  </div>
                </div>

                <div className="absolute inset-0 border-2 border-transparent group-hover:border-purple-400 rounded-2xl pointer-events-none transition-all duration-300"></div>
              </div>
            ))}
          </div>

          {/* 🔥 PERBAIKAN: Modal Form dengan drag & drop yang benar */}
          {showAddForm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white p-6 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                <h3 className="text-xl font-bold mb-6 text-center">Tambah Buku Baru</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Book Cover
                    </label>
                    <div
                      className={`
                        w-full min-h-[200px] border-2 border-dashed rounded-xl
                        flex flex-col items-center justify-center text-center p-6
                        transition-all duration-300 cursor-pointer
                        ${isDragOverForm 
                          ? 'border-blue-500 bg-blue-50/50' 
                          : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50/50'
                        }
                        ${newBook.image ? 'p-2' : 'p-6'}
                      `}
                      onClick={() => document.getElementById('fileInput')?.click()}
                      onDragOver={handleFormDragOver}
                      onDragEnter={handleFormDragEnter}
                      onDragLeave={handleFormDragLeave}
                      onDrop={handleFormDrop}
                    >
                      {newBook.image ? (
                        <div className="relative w-full h-full">
                          <img 
                            src={newBook.image} 
                            alt="Preview" 
                            className="w-full h-full object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setNewBook({ ...newBook, image: undefined });
                            }}
                            className="absolute top-3 right-3 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center gap-3">
                          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                            <svg 
                              className="w-8 h-8 text-gray-400" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24" 
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={1.5} 
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                              />
                            </svg>
                          </div>
                          
                          <div className="space-y-1">
                            <p className="text-gray-600 font-medium text-base">
                              Drag & Drop files here
                            </p>
                            <p className="text-gray-400 text-sm">or</p>
                            <p className="text-blue-500 font-medium text-base">
                              Browse Files
                            </p>
                          </div>
                          
                          <p className="text-gray-400 text-xs mt-2">
                            Supports: JPG, PNG, GIF, SVG (Max 5MB)
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <input
                      id="fileInput"
                      type="file"
                      accept="image/*"
                      onChange={handleFileInputChange}
                      className="hidden"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      placeholder="Title"
                      value={newBook.title}
                      onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Author
                    </label>
                    <input
                      type="text"
                      placeholder="Author"
                      value={newBook.author}
                      onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Fiction, Science, Romance"
                      value={newBook.category}
                      onChange={(e) => setNewBook({ ...newBook, category: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      placeholder="Description"
                      value={newBook.description}
                      onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price (Rp)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={localPrice}
                        onChange={handlePriceChange}
                        onBlur={handlePriceBlur}
                        onKeyDown={handlePriceKeyDown}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition pr-10"
                        style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }}
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        IDR
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Minimum price: Rp 1
                    </p>
                  </div>
                  
                  <div className="pt-4">
                    <div className="flex justify-end gap-3">
                      <button 
                        onClick={() => {
                          setShowAddForm(false);
                          setLocalPrice('1');
                          setIsDragOverForm(false);
                        }} 
                        className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={addBook} 
                        className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                      >
                        Add Book
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* View All Button */}
          <div className="text-center mt-12">
            <button className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-gray-900 to-black text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105 group">
              <span>View All {allBooks.length}+ Books</span>
              <span className="group-hover:translate-x-2 transition-transform">→</span>
            </button>
          </div>
        </div>
      </section>

      {/* Halaman Read Review */}
      {showReview && selectedBook && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-6xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="flex flex-col lg:flex-row">
              {/* Gambar di sisi kiri */}
              <div className="lg:w-2/5 p-8">
                <div 
                  className="w-full h-96 rounded-xl bg-cover bg-center"
                  style={{
                    backgroundImage: bookImages[selectedBook.id] 
                      ? `url(${bookImages[selectedBook.id]})` 
                      : `linear-gradient(to bottom right, ${selectedBook.color || 'from-gray-400 to-gray-600'})`
                  }}
                />
                <div className="mt-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <p className="text-3xl font-bold">Rp {selectedBook.price.toLocaleString('id-ID')}</p>
                      <p className="text-gray-500">Paperback</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                      <button 
                        onClick={() => handleAddToCart(selectedBook)}
                        className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Add to Cart
                      </button>
                      <button 
                        onClick={() => handleBuyNow(selectedBook)}
                        className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Deskripsi di sisi kanan */}
              <div className="lg:w-3/5 p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">{selectedBook.title}</h3>
                    <p className="text-xl text-gray-600 mb-4">by {selectedBook.author}</p>
                  </div>
                  <button 
                    onClick={() => setShowReview(false)}
                    className="text-gray-400 hover:text-gray-600 text-3xl hover:bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>

                <div className="flex items-center mb-6">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg 
                        key={i} 
                        className={`w-6 h-6 ${i < selectedBook.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    ))}
                    <span className="ml-2 text-lg font-bold">{selectedBook.rating}/5</span>
                  </div>
                  {selectedBook.category && (
                    <span className="ml-4 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {selectedBook.category}
                    </span>
                  )}
                </div>

                <div className="mb-8">
                  <h4 className="text-xl font-bold mb-4">Description</h4>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedBook.description}
                  </p>
                </div>

                <div className="border-t pt-6">
                  <h4 className="text-xl font-bold mb-4">Book Details</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-600">Format</p>
                      <p className="font-semibold">Paperback</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Pages</p>
                      <p className="font-semibold">320 pages</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Language</p>
                      <p className="font-semibold">English</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Publisher</p>
                      <p className="font-semibold">Penguin Books</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

interface TambahBukuCardProps {
  onClick?: () => void;
}

const TambahBukuCard: React.FC<TambahBukuCardProps> = ({ onClick }) => {
  return (
    <div
      onClick={onClick}
      className="
        w-full h-48
        border-2 border-dashed border-gray-300
        rounded-2xl
        flex flex-col items-center justify-center
        cursor-pointer
        hover:border-gray-400
        hover:bg-gray-50/50
        transition-all duration-300
        group
      "
    >
      <div className="w-14 h-14 rounded-full bg-gray-100 group-hover:bg-gray-200 transition-colors flex items-center justify-center mb-3">
        <span className="text-2xl font-bold text-gray-600 group-hover:text-gray-800">+</span>
      </div>
      <span className="text-gray-600 font-medium group-hover:text-gray-800">Tambah Buku</span>
    </div>
  );
};