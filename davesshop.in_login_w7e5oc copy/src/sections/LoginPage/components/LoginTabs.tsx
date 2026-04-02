export const LoginTabs = () => {
  return (
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
  );
};
