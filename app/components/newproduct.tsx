"use client";
import { useState } from "react";
import "./new_product/module.css";

type Product = {
  title: string;
  price: string;
  image: string;
};

export default function NewProduct() {
  const [products, setProducts] = useState<Product[]>([]);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<string>("");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const preview = URL.createObjectURL(e.target.files[0]);
      setImage(preview);
    }
  };

  const handleAddProduct = () => {
    if (!title || !price || !image) return;

    setProducts([...products, { title, price, image }]);

    setTitle("");
    setPrice("");
    setImage("");
  };

  return (
    <section className="newproduct-container">
      <h2 className="newproduct-heading">NEW PRODUCT!!</h2>

      {/* Form Upload */}
      <div className="newproduct-form">
        <input
          type="text"
          placeholder="Judul Buku"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="text"
          placeholder="Harga"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <input type="file" accept="image/*" onChange={handleImageUpload} />

        <button onClick={handleAddProduct}>Tambah Produk</button>
      </div>

      {/* List Produk */}
      <div className="newproduct-grid">
        {products.map((item, index) => (
          <div key={index} className="newproduct-card">
            <img src={item.image} alt={item.title} />
            <h4>{item.title}</h4>
            <p>{item.price}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
