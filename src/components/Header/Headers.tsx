import { MyAccount } from "../MyAccount/indexMyaccount";

interface Props {
  title: string;
}

export function HeaderDashboard(props: Props) {
  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
        <div className="flex-1">
          <h1 className="text-lg font-semibold select-none">{props.title}</h1>
        </div>
        <MyAccount />
      </header>
    </>
  );
}
