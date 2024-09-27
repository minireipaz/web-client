import { Navigate } from "react-router-dom";

interface Props {
  handleLogin: () => void;
  authenticated: boolean | null;
};

export default function Login({ authenticated, handleLogin }: Props) {
  if (authenticated === true) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex flex-col gap-4">
      <button className="bg-slate-400" onClick={handleLogin}>
        Login
      </button>
      <h2>ayilezt485@nic.edu.pl</h2>
      <h2>1234</h2>
    </div>
  );
}
