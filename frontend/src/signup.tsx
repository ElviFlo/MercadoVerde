import { Link } from "react-router-dom"

export default function Signup() {
  return (
    <main className="flex justify-center items-center min-h-screen bg-[#C6FECE]">

      <section className="flex justify-center items-center h-[520px] absolute">
        {/*Circulito SUPER FACILES DE HACER Y POSICIONAR */}
        <div className="rounded-full size-16 bg-linear-to-b from-[#6EFA5B] to-[#0C5719] absolute -bottom-8 -right-8"></div>

        {/* Totally useful images */}
        <section className="rounded-l-3xl h-full relative">

          {/*Circulito SUPER FACILES DE HACER Y POSICIONAR */}
          <div className="rounded-full size-16 bg-white absolute -top-8 -left-8"></div>

          {/* Back to home */}
          <Link to="/" className="flex items-center gap-2 absolute top-4 left-4 text-white opacity-80 text-3xl z-10">
            <i className="ti ti-chevron-left"></i> <span className="text-sm">Back to home</span>
          </Link>

          <div className="flex justify-center items-center rounded-l-3xl bg-[#028414] shadow-lg w-[425px] h-full relative">
            <img src="/weird-pattern.jpg" alt="Pattern" className="h-full opacity-35 rounded-l-3xl absolute top-0" />
            <div className="bg-white opacity-55 w-64 h-80 rounded-3xl"></div>
            <img src="/signup-img.png" alt="Plantica" className="absolute size-80" />
          </div>
        </section>

        {/* Sign Up */}
        <section className="flex flex-col justify-between items-center text-center h-full gap-12 bg-white text-black p-16 rounded-r-3xl relative">

          <div className="">
            <h2 className="text-xl font-bold text-center uppercase opacity-70"> Sign Up</h2>
            <p className="opacity-70">Join us today! It only takes a few seconds</p>
          </div>
          <div className="flex flex-col gap-4 w-full">
            <div className="flex items-center bg-[#D6FFDE] p-2 py-3 pl-3 rounded-2xl">
              <i className="ti ti-user-circle text-2xl"></i>
              <span className="ml-2">Name</span>
            </div>
            <div className="flex items-center bg-[#D6FFDE] p-2 py-3 pl-3 rounded-2xl">
              <i className="ti ti-at text-2xl"></i>
              <span className="ml-2">Email</span>
            </div>
            <div className="flex items-center bg-[#D6FFDE] p-2 py-3 pl-3 rounded-2xl">
              <i className="ti ti-lock text-2xl"></i>
              <span className="ml-2">Password</span>
            </div>
            <div className="flex items-center bg-[#028414CF] opacity-80 p-2 py-3 pl-3 rounded-2xl mt-3">
              <button className="text-white text-center mx-auto">Sign Up</button>
            </div>
            <p>You already have an account? <Link to="/login" className="font-semibold">Login</Link>
            </p>
          </div>

        </section>
      </section>
    </main>
  )
}
