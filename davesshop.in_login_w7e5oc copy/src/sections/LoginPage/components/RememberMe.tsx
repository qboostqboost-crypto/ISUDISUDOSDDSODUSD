export const RememberMe = () => {
  return (
    <label className="text-neutral-300 items-center box-border caret-transparent gap-x-2 flex gap-y-2 mt-5">
      <input
        type="checkbox"
        className="appearance-none text-sky-400 bg-white/10 bg-origin-border box-border caret-transparent block shrink-0 h-4 min-h-[auto] min-w-[auto] align-middle w-4 border overflow-visible p-0 rounded-bl rounded-br rounded-tl rounded-tr border-solid border-white/20"
      />
      Remember for 30 days
    </label>
  );
};
