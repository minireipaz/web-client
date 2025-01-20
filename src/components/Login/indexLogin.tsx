import { User } from "oidc-client-ts";
import { Navigate } from "react-router-dom";

interface Props {
  handleLogin: () => void;
  userInfo: User | null;
  authenticated: boolean | null;
}

export default function Login({ authenticated, userInfo, handleLogin }: Props) {
  if (authenticated === true && userInfo) {
    return <Navigate to="/dashboard" replace state={userInfo} />;
  }

  return (
    <div className="flex flex-col gap-4">
      <button className="bg-slate-400" onClick={handleLogin}>
        Login
      </button>
      <h2>ayilezt485@nic.edu.pl</h2>
      <h2>123</h2>
      <h2>fake@email.com</h2>
      <h2>1234</h2>
    </div>
  );
}
