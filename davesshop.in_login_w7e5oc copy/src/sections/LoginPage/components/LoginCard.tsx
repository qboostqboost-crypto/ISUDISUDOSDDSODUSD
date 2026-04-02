import { LoginLogo } from "@/sections/LoginPage/components/LoginLogo";
import { LoginTabs } from "@/sections/LoginPage/components/LoginTabs";
import { LoginForm } from "@/sections/LoginPage/components/LoginForm";
import { LoginFooter } from "@/sections/LoginPage/components/LoginFooter";

export const LoginCard = () => {
  return (
    <div className="relative backdrop-blur-xl bg-white/10 shadow-[rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(36,196,255,0.15)_0px_0px_40px_0px] box-border caret-transparent max-w-md min-h-[auto] min-w-[auto] w-full border p-6 rounded-2xl border-solid border-white/10 md:p-8">
      <LoginLogo />
      <h1 className="text-white text-2xl font-semibold box-border caret-transparent leading-8 text-center mt-6">
        Log in to your account
      </h1>
      <p className="text-neutral-400 text-sm box-border caret-transparent leading-5 text-center mt-2">
        Welcome back! Please enter your details.
      </p>
      <LoginTabs />
      <LoginForm />
      <LoginFooter />
    </div>
  );
};
