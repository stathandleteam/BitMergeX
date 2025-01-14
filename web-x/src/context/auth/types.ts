export type AuthContextType = {
  isLoggedIn: boolean;
  login: (password: string) => Promise<boolean | any>;
  logout: () => void;
};
