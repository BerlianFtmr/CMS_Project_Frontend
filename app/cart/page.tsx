import Navbar from "@/app/components/Navbar";
import CartPage from "./CartPage";

export default function Cart() {
  return (
    <div className="min-h-screen bg-background-dark">
      <Navbar />
      <main>
        <CartPage />
      </main>
    </div>
  );
}
