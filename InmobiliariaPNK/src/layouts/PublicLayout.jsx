// TODO: Fase 3.2 — Layout público con Navbar y Footer
import { Outlet } from 'react-router-dom';
export default function PublicLayout() {
  return (
    <>
      <Outlet />
    </>
  );
}
