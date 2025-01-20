import { Dropdown } from "flowbite-react";
import React from "react";
import { useAuth } from "../AuthProvider/indexAuthProvider";

export const MyAccount = React.memo(function MyAccount() {
  const { handleLogout, userInfo } = useAuth();

  let name = userInfo?.profile.name || "demo";
  let email = userInfo?.profile.email || "demo";
  let verified = userInfo?.profile.email_verified ? "Yes" : "No";

  return (
    <>
      <div className="flex items-center gap-4 z-50">
        <Dropdown label="My Account" className="">
          <Dropdown.Header className="flex flex-col gap-y-1">
            <span className="block italic text-xs">Name: {name}</span>
            <span className="block italic truncate text-xs font-medium">
              Email: {email}
            </span>
            <span className="block italic truncate text-xs font-medium">
              Email Verified: {verified ? "Yes" : "No"}
            </span>
          </Dropdown.Header>
          <Dropdown.Divider />
          <Dropdown.Item icon={IconSettings} className="bg-white ">
            Settings
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item
            onClick={handleLogout}
            icon={IconLogout}
            className="bg-white "
          >
            Logout
          </Dropdown.Item>
        </Dropdown>
      </div>
    </>
  );
});

function IconLogout(props: any) {
  return (
    <>
      <svg
        {...props}
        stroke="currentColor"
        fill="currentColor"
        strokeWidth="0"
        viewBox="0 0 20 20"
        aria-hidden="true"
        className="mr-2 h-4 w-4"
        height="1em"
        width="1em"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
          clipRule="evenodd"
        ></path>
      </svg>
    </>
  );
}

function IconSettings(props: any) {
  return (
    <>
      <svg
        {...props}
        stroke="currentColor"
        fill="currentColor"
        strokeWidth="0"
        viewBox="0 0 20 20"
        aria-hidden="true"
        className="mr-2 h-4 w-4"
        height="1em"
        width="1em"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
          clipRule="evenodd"
        ></path>
      </svg>
    </>
  );
}
