import AuthContextProvider from "./auth-context";
import UserContextProvider from "./user-context";

const Contexts = ({ children }) => {
  return (
    <AuthContextProvider>
      <UserContextProvider>{children}</UserContextProvider>
    </AuthContextProvider>
  );
};

export default Contexts;
