export const PasswordField = () => {
  return (
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
  );
};
