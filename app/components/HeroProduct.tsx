"use client";

import styles from "./HeroProduct.module.css";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

export default function HeroProduct() {
  const { addToCart } = useCart();
  const router = useRouter();

  const handleBuyNow = () => {
    addToCart({
      id: 1,
      title: "KOKO GUNTUR THE LEGEND OF UNU",
      author: "UCUP NINUNINU",
      price: 300000,
      cover: "/koko_guntur.JPEG",
      qty: 1,
    });

    router.push("/cart");
  };

  return (
    <section className={styles.hero}>
      <div className={styles.imageWrapper}>
        <img
          src="/koko_guntur.JPEG"
          alt="Koko Guntur The Legend of UNU"
        />
      </div>

      <div className={styles.content}>
        <h1 className={styles.title}>
          KOKO GUNTUR THE LEGEND OF UNU
        </h1>
        <h3 className={styles.author}>BY. UCUP NINUNINU</h3>
        <p className={styles.desc}>best selling products this year</p>
        <p className={styles.price}>Rp 300.000</p>

        <div className={styles.actions}>
          <button className={styles.primary} onClick={handleBuyNow}>
            BUY NOW
          </button>
          <button className={styles.secondary}>
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
}
