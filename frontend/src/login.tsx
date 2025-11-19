import { Link } from "react-router-dom"

export default function Login() {
  return (
    <main className="flex justify-center items-center min-h-screen bg-[#C6FECE]">

      <section className="flex flex-row justify-center items-center h-[520px] absolute">
        {/*Circulito SUPER FACILES DE HACER Y POSICIONAR */}
        <div className="rounded-full size-16 bg-white absolute -bottom-8 -right-8"></div>

        {/*Circulito SUPER FACILES DE HACER Y POSICIONAR */}
        <div className="rounded-full size-16 bg-linear-to-b from-[#6EFA5B] to-[#0C5719] absolute -top-8 -left-8"></div>

        {/* Back to home */}
        <Link to="/" className="flex items-center gap-2 absolute top-4 left-4 text-black opacity-80 text-3xl z-10">
          <i className="ti ti-chevron-left"></i> <span className="text-sm">Back to home</span>
        </Link>

        {/* Sign Up */}
        <section className="flex flex-col justify-between items-center text-center h-full gap-4 bg-white text-black p-16 py-24 rounded-l-3xl relative">

          <div className="">
            <h2 className="text-xl font-bold text-center uppercase opacity-70"> Login</h2>
            <p className="opacity-70">Welcome back! Please log in to continue</p>
          </div>
          <div className="flex flex-col gap-4 w-full">
            <div className="flex items-center bg-[#D6FFDE] p-2 py-3 pl-3 rounded-2xl">
              <i className="ti ti-user-circle text-2xl"></i>
              <span className="ml-2">Name</span>
            </div>
            <div className="flex items-center bg-[#D6FFDE] p-2 py-3 pl-3 rounded-2xl">
              <i className="ti ti-lock text-2xl"></i>
              <span className="ml-2">Password</span>
            </div>
          </div>
          <div className="flex flex-col gap-4 w-full">
            <div className="flex items-center bg-[#028414CF] opacity-80 p-2 py-3 pl-3 rounded-2xl mt-3">
              <button className="text-white text-center mx-auto">Log In</button>
            </div>
            <p>You don't have an account? <Link to="/signup" className="font-semibold">Sign up</Link></p>
          </div>
        </section>

        {/* Totally useful images */}
        <section className="rounded-r-3xl h-full relative">
          <div className="flex justify-center items-center rounded-r-3xl bg-[#028414] shadow-lg w-[425px] h-full relative">
            <img src="/weird-pattern.jpg" alt="Pattern" className="h-full opacity-35 rounded-r-3xl absolute top-0" />
            <div className="bg-white opacity-55 w-64 h-80 rounded-3xl"></div>
            <img src="/login-img.png" alt="Plantica" className="absolute size-80" />
          </div>
        </section>
      </section>
    </main>
  )
}
