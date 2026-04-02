import { FormField } from "@/sections/LoginPage/components/FormField";
import { PasswordField } from "@/sections/LoginPage/components/PasswordField";
import { RememberMe } from "@/sections/LoginPage/components/RememberMe";
import { LoginButton } from "@/sections/LoginPage/components/LoginButton";

export const LoginForm = () => {
  return (
    <div className="box-border caret-transparent mt-6">
      <FormField />
      <PasswordField />
      <RememberMe />
      <LoginButton />
    </div>
  );
};
