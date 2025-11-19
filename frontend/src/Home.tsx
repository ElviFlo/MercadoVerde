import Header from "./components/Header.tsx"
import Footer from "./components/Footer.tsx"
import Hero from "./components/Hero.tsx"
import ProductsSection from "./components/ProductsSection.tsx"
import Testimonials from "./components/Testimonials.tsx"

export default function Home() {

  return (
    <main className="flex flex-col justify-between">
      <Header />

      <Hero />

      <ProductsSection />

      <Testimonials />

      <Footer />
    </main>
  )
}

export { default as Cart } from "./cart";
export { default as Catalogue } from "./catalogue";
export { default as Login } from "./login";
export { default as Orders } from "./orders";
export { default as Products } from "./products";
export { default as Signup } from "./signup";
export { default as Thanks } from "./thanks";
