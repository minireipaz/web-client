import React from 'react';
import { AppRouter } from '../AuthProvider/Approuter.tsx';

export const Header = React.memo(function Header() {
  return (
    <>
      <header className=""></header>
      <AppRouter />
    </>
  );
});
