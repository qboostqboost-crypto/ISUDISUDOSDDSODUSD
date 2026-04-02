export const LoginFooter = () => {
  return (
    <p className="text-neutral-300 text-sm box-border caret-transparent leading-5 text-center mt-8">
      Don’t have an account?
      <a
        href="/register"
        className="text-sky-400 font-medium box-border caret-transparent"
      >
        Sign up
      </a>
    </p>
  );
};
