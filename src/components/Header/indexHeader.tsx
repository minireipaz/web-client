import { useEffect, useState } from 'react'
import { authConfig } from "../../authConfig.ts";
import { createZitadelAuth } from "@zitadel/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Login from "../Login/indexLogin.tsx";
import Callback from "../Callback/indexCallback.tsx";


export function Header() {

  const zitadel = createZitadelAuth(authConfig);

  function login() {
    zitadel.authorize();
  }

  function signout() {
    zitadel.signout();
  }

  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    zitadel.userManager.getUser().then((user) => {
      if (user) {
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
      }
    });
  }, [zitadel]);

  return (
    <>
      <header className="">
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <Login authenticated={authenticated} handleLogin={login} />
              }
            />
            <Route
              path="/callback"
              element={
                <Callback
                  authenticated={authenticated}
                  setAuth={setAuthenticated}
                  handleLogout={signout}
                  userManager={zitadel.userManager}
                />
              }
            />
          </Routes>
        </BrowserRouter>
      </header>
    </>
  );
}
