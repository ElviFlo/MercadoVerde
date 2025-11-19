export default function Testimonials() {
  return(
    <main className="flex flex-col items-center gap-18 bg-[#EFF8F3] p-16">
      <div className="flex flex-col justify-between items-center gap-4">
        <h2 className="text-5xl">Testimonials</h2>
        <p className="text-xl text-[#666D68] font-normal">Some quotes from our happy customers</p>
      </div>
      <section className="grid grid-cols-3 gap-12 w-full max-w-4xl">
        <div className="flex flex-col items-center text-center bg-white p-6 rounded-2xl shadow-md">
          <img src="/cris.jpg" alt="Customer 1" className="size-24 rounded-full mx-auto mb-4" />
          <div className="text-[#028414CF]">
            <i className="ti ti-star-filled"></i>
            <i className="ti ti-star-filled"></i>
            <i className="ti ti-star-filled"></i>
            <i className="ti ti-star-filled"></i>
            <i className="ti ti-star"></i>
          </div>
          <p className="font-bold">"Looks very natural, there are variety”</p>
          <span className="opacity-60">Cris</span>
        </div>
        <div className="flex flex-col items-center text-center bg-white p-6 rounded-2xl shadow-md">
          <img src="/mark.jpeg" alt="Customer 2" className="size-24 rounded-full mx-auto mb-4" />
          <div className="text-[#028414CF]">
            <i className="ti ti-star-filled"></i>
            <i className="ti ti-star-filled"></i>
            <i className="ti ti-star-filled"></i>
            <i className="ti ti-star-filled"></i>
            <i className="ti ti-star-half-filled"></i>
          </div>
          <p className="font-bold">"All products are excellent”</p>
          <span className="opacity-60">Mark</span>
        </div>
        <div className="flex flex-col items-center text-center bg-white p-6 rounded-2xl shadow-md">
          <img src="/claire.jpg" alt="Customer 3" className="size-24 rounded-full mx-auto mb-4" />
          <div className="text-[#028414CF]">
            <i className="ti ti-star-filled"></i>
            <i className="ti ti-star-filled"></i>
            <i className="ti ti-star-filled"></i>
            <i className="ti ti-star-filled"></i>
            <i className="ti ti-star"></i>
          </div>
          <p className="font-bold">"The site just looks incredible”</p>
          <span className="opacity-60">Claire</span>
        </div>
      </section>
    </main>
  )

}
