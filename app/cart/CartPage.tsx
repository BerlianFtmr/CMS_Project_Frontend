"use client";

import styles from "./CartPage.module.css";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const {
    cartItems,
    increaseQty,
    decreaseQty,
    removeItem,
    clearCart,
  } = useCart();

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.qty,
    0
  );

  const isEmpty = cartItems.length === 0;

  return (
    <div className={styles.container}>
      {/* LEFT */}
      <div className={styles.left}>
        {isEmpty ? (
          <>
            <div className={styles.iconWrapper}>
              <span className={`material-symbols-outlined ${styles.bigIcon}`}>
                menu_book
              </span>
            </div>

            <h1 className={styles.title}>Your cart is feeling a bit light</h1>
            <p className={styles.subtitle}>
              Explore our library and find your next great story.
            </p>

            <Link href="/" className={styles.browseBtn}>
              <span>Start Browsing</span>
              <span className="material-symbols-outlined">auto_stories</span>
            </Link>
          </>
        ) : (
          cartItems.map((item) => (
            <div key={item.id} className={styles.cartItem}>
              <div
                className={styles.bookCover}
                style={{ backgroundImage: `url(${item.cover})` }}
              />

              <div className={styles.itemInfo}>
                <p className={styles.bookTitle}>{item.title}</p>
                <p className={styles.bookMeta}>
                  {item.author} • Rp{item.price.toLocaleString()}
                </p>

                <div className={styles.qtyControl}>
                  <button
                    className={styles.qtyBtn}
                    onClick={() => decreaseQty(item.id)}
                  >
                    −
                  </button>
                  <span className={styles.qty}>{item.qty}</span>
                  <button
                    className={styles.qtyBtn}
                    onClick={() => increaseQty(item.id)}
                  >
                    +
                  </button>
                </div>

                <button
                  className={styles.removeBtn}
                  onClick={() => removeItem(item.id)}
                >
                  Remove
                </button>
              </div>

              <div className={styles.itemTotal}>
                Rp{(item.price * item.qty).toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>

      {/* RIGHT */}
      <div className={styles.right}>
        <div className={styles.summary}>
          <h2>Order Summary</h2>

          <div className={styles.summaryRow}>
            <span>Subtotal</span>
            <span>Rp{subtotal.toLocaleString()}</span>
          </div>

          <div className={styles.summaryRow}>
            <span>Shipping</span>
            <span>—</span>
          </div>

          <div className={styles.divider} />

          <div className={styles.totalRow}>
            <span>Total</span>
            <strong>Rp{subtotal.toLocaleString()}</strong>
          </div>

          {!isEmpty && (
            <div className={styles.actionButtons}>
              <button
                className={styles.buyBtn}
                onClick={() => alert("Belum dibikin ajg")}
              >
                Buy
              </button>

              <button
                className={styles.clearCartBtn}
                onClick={clearCart}
              >
                Clear All
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
