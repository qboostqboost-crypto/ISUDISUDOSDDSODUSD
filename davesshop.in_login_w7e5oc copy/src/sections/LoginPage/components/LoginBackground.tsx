export const LoginBackground = () => {
  return (
    <div className="relative items-center box-border caret-transparent flex justify-center min-h-[1000px] overflow-hidden" style={{background: '#04060f'}}>
      {/* Blue glow blobs */}
      <div className="absolute pointer-events-none inset-0" style={{background: 'radial-gradient(ellipse 900px 500px at 50% 0%, rgba(37,99,235,0.28) 0%, transparent 70%)'}}></div>
      <div className="absolute pointer-events-none" style={{width:'600px',height:'600px',top:'10%',left:'-10%',background:'radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%)',borderRadius:'50%'}}></div>
      <div className="absolute pointer-events-none" style={{width:'500px',height:'500px',bottom:'5%',right:'-8%',background:'radial-gradient(circle, rgba(37,99,235,0.16) 0%, transparent 70%)',borderRadius:'50%'}}></div>
      <div className="absolute bg-[radial-gradient(1200px_600px,rgba(59,130,246,0.22),rgba(0,0,0,0)_70%)] box-border caret-transparent pointer-events-none inset-0"></div>
      <div className="fixed box-border caret-transparent pointer-events-none z-[9999] inset-4"></div>
      <div className="relative backdrop-blur-xl box-border caret-transparent max-w-md min-h-[auto] min-w-[auto] w-full border p-6 rounded-2xl border-solid md:p-8" style={{background:'rgba(10,20,50,0.75)',border:'1px solid rgba(59,130,246,0.2)',boxShadow:'0 0 60px rgba(37,99,235,0.2), 0 0 0 1px rgba(59,130,246,0.1)'}}>
        <div className="items-center bg-sky-400/10 shadow-[rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0.05)_0px_1px_2px_0px] box-border caret-transparent grid h-16 justify-items-center w-16 border border-sky-400/40 overflow-hidden mx-auto rounded-2xl border-solid">
          <img
            src="https://c.animaapp.com/mmuuezyrLXbx4q/img/uploaded-asset-1773842134543-0.png"
            alt="Logo"
            className="box-border caret-transparent h-14 max-w-full min-h-[auto] min-w-[auto] object-contain w-14"
          />
        </div>
        <h1 className="text-white text-2xl font-semibold box-border caret-transparent leading-8 text-center mt-6">
          Log in to your account
        </h1>
        <p className="text-neutral-400 text-sm box-border caret-transparent leading-5 text-center mt-2">
          Welcome back! Please enter your details.
        </p>
        <div className="box-border caret-transparent grid grid-cols-[repeat(2,minmax(0px,1fr))] border overflow-hidden mt-6 rounded-lg border-solid border-white/10">
          <a
            href="/register"
            className="text-neutral-300 text-sm font-medium box-border caret-transparent block leading-5 min-h-[auto] min-w-[auto] text-center py-2.5 hover:bg-white/10"
          >
            Sign up
          </a>
          <button className="text-sm font-semibold bg-sky-400 caret-transparent block leading-5 min-h-[auto] min-w-[auto] text-center px-0 py-2.5">
            Log in
          </button>
        </div>
        <div className="box-border caret-transparent mt-6">
          <div className="box-border caret-transparent">
            <label className="text-neutral-200 text-sm font-medium box-border caret-transparent block leading-5 mb-2">
              Username
            </label>
            <input
              type="text"
              placeholder="username"
              value=""
              className="appearance-none text-white bg-white/10 box-border caret-transparent outline-transparent outline-offset-2 outline outline-2 w-full border p-3 rounded-xl border-solid border-white/10"
            />
          </div>
          <div className="box-border caret-transparent mt-5">
            <div className="items-center box-border caret-transparent flex justify-between mb-2">
              <label className="text-neutral-200 text-sm font-medium box-border caret-transparent block leading-5 min-h-[auto] min-w-[auto]">
                Password
              </label>
            </div>
            <input
              type="password"
              placeholder="••••••••"
              value=""
              className="appearance-none text-white bg-white/10 box-border caret-transparent outline-transparent outline-offset-2 outline outline-2 w-full border p-3 rounded-xl border-solid border-white/10"
            />
          </div>
          <label className="text-neutral-300 items-center box-border caret-transparent gap-x-2 flex gap-y-2 mt-5">
            <input
              type="checkbox"
              className="appearance-none text-sky-400 bg-white/10 bg-origin-border box-border caret-transparent block shrink-0 h-4 min-h-[auto] min-w-[auto] align-middle w-4 border overflow-visible p-0 rounded-bl rounded-br rounded-tl rounded-tr border-solid border-white/20"
            />
            Remember for 30 days
          </label>
          <button className="font-medium bg-sky-400 shadow-[rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0.05)_0px_1px_2px_0px] caret-transparent text-center w-full mt-5 px-0 py-3 rounded-xl">
            Sign in
          </button>
        </div>
        <p className="text-neutral-300 text-sm box-border caret-transparent leading-5 text-center mt-8">
          Don’t have an account?
          <a
            href="/register"
            className="text-sky-400 font-medium box-border caret-transparent"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};
