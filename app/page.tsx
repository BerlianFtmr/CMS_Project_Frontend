import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Category from "./components/Category";
import BookSection from "./components/BookSection";
import HeroProduct from "./components/HeroProduct"; 

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      <main>
        <HeroProduct />   
        <Category />
        <BookSection />
      </main>
      <Footer />
    </div>
  );
}
