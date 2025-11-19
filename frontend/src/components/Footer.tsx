export default function Footer() {
  return(
    <footer className="flex flex-col justify-center items-center bg-black border-t-2 py-4 px-6 pt-10 gap-8 h-[460px] text-white">

      <div className="flex justify-between items-center gap-56 border-t-2 border-white p-6">

        {/*Logo and description*/}
        <div className="flex flex-col items-center gap-6 text-center text-white">
          <img src="/footer-logo.png" alt="Mercado Verde Logo" className="w-88" />
          <p className="mb-2">Plants made for your space, your soul, and your wellbeing.</p>
        </div>

        {/* Very Useful Links */}
        <div className="flex justify-between gap-20">
          <div className="flex flex-col gap-4">
            <h3 className="text-[#53D15E] text-xl mb-2">Discovery</h3>
            <span className="cursor-pointer">New season</span>
            <span className="cursor-pointer">Most searched</span>
            <span className="cursor-pointer">Most selled</span>
          </div><div className="flex flex-col gap-4">
            <h3 className="text-[#53D15E] text-xl mb-2">About</h3>
            <span className="cursor-pointer">Help</span>
            <span className="cursor-pointer">Shipping</span>
            <span className="cursor-pointer">Affiliate</span>
          </div><div className="flex flex-col gap-4">
            <h3 className="text-[#53D15E] text-xl mb-2">Information</h3>
            <span className="cursor-pointer">Contact us</span>
            <span className="cursor-pointer">Privacy Policies</span>
            <span className="cursor-pointer">Terms & Conditions</span>
          </div>
        </div>

      </div>

      {/* Non realistic Copyright text */}
      <p className="text-center text-gray-400">&copy; 2025 Mercado Verde. All rights reserved.</p>
    </footer>
  )
}
