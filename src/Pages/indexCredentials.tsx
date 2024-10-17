import { NavDashboard } from "../components/Dashboard/NavDashboard";
import { HeaderDashboard } from "../components/Header/Headers";

interface ContainerProps {

}

export function Credentials(_: ContainerProps) {
  return(
    <>
      <div className="grid min-h-screen w-full grid-cols-[240px_1fr] overflow-hidden" >
        <NavDashboard />
        <div className="flex flex-col" >
          <HeaderDashboard title="Credentials" />
        </div>
      </div>
    </>
  );
}
