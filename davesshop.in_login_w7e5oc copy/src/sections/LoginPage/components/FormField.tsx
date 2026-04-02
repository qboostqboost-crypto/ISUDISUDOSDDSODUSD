export const FormField = () => {
  return (
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
  );
};
