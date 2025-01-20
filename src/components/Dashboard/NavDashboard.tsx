import { Link, useLocation } from "react-router-dom";
import { memo } from "react";

export const NavDashboard = memo(function NavDashboard() {
  const location = useLocation();

  function isActive(path: string) {
    return location.pathname.startsWith(path);
  }

  return (
    <>
      <aside className="flex flex-col border-r bg-background">
        <div className="flex h-16 items-center justify-center border-b gap-2 font-semibold">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
          >
            <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"></path>
            <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9"></path>
            <path d="M12 3v6"></path>
          </svg>
          <span className=" select-none ">SEE LOGO</span>
        </div>
        <nav className="flex-1 px-4 py-6">
          <ul className="grid gap-1">
            <li>
              <Link
                to="/dashboard"
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors
                ${isActive("/dashboard") ? "bg-blue-500 text-white" : "hover:bg-[rgba(255,255,255,0.1)]"}
                `}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/workflows"
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors
                ${isActive("/workflow") ? "bg-blue-500 text-white" : "hover:bg-[rgba(255,255,255,0.1)]"}
                `}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"></path>
                  <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"></path>
                  <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"></path>
                </svg>
                Workflows
              </Link>
            </li>
            <li>
              <Link
                to="/credentials"
                className={`flex items-cente gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors
                ${isActive("/credentials") ? "bg-blue-500 text-white" : "hover:bg-[rgba(255,255,255,0.1)]"}
                `}
              >
                <svg
                  fill="#fff"
                  height="20"
                  width="20"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path d="M480.6 204.7H373v-26.6c0-11.3-9.1-20.4-20.4-20.4h-38.7V141c17.8-14 28.1-34 28.1-55.3 0-41.2-38.5-74.7-85.9-74.7s-85.9 33.5-85.9 74.7c0 21.3 10.3 41.3 28.1 55.3v16.7h-38.7c-11.3 0-20.4 9.1-20.4 20.4v26.6H31.4c-11.3 0-20.4 9.1-20.4 20.4v255.5c0 11.3 9.1 20.4 20.4 20.4h449.2c11.3 0 20.4-9.1 20.4-20.4V225.1c0-11.2-9.1-20.4-20.4-20.4zm-251.8-92.2c-11.2-6.5-17.9-16.5-17.9-26.8 0-18.4 20.6-33.9 45.1-33.9 24.4 0 45.1 15.5 45.1 33.9 0 10.3-6.7 20.4-17.9 26.8-6.3 3.6-10.2 10.4-10.2 17.7v27.4h-34v-27.4c0-7.3-3.9-14-10.2-17.7zm-48.9 86h152.3v52.4H179.9v-52.4zm280.3 261.7H51.8V245.5H139v25.8c0 11.3 9.1 20.4 20.4 20.4h193.1c11.3 0 20.4-9.1 20.4-20.4v-25.8h87.2v214.7z" />
                </svg>
                Credentials
              </Link>
            </li>
            <li>
              <Link
                to="/history"
                className={`flex items-cente gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors
                ${isActive("/history") ? "bg-blue-500 text-white" : "hover:bg-[rgba(255,255,255,0.1)]"}
                `}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                History
              </Link>
            </li>
            <li>
              <Link
                to="/settings"
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors
                ${isActive("/settings") ? "bg-blue-500 text-white" : "hover:bg-[rgba(255,255,255,0.1)]"}
                `}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                Settings
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
});
