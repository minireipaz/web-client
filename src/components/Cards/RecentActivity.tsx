export function RecentActivity() {
  return (
    <>
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm" >
        <div className="flex flex-col space-y-1.5 p-6" >
          <h3 className="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight" >Recent Activity</h3>
        </div>
        <div className="p-6 grid gap-2" >
          <div className="flex items-center justify-between" >
            <div className="flex items-center gap-2" >
              <span className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full" >
                <img className="aspect-square h-full w-full" src="https://picsum.photos/40" />
              </span>
              <div >
                <div className="font-medium" >John Doe</div>
                <div className="text-sm" >Created new workflow</div>
              </div>
            </div>
            <div className="text-sm" >2 hours ago</div>
          </div>
          <div className="flex items-center justify-between" >
            <div className="flex items-center gap-2" ><span className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full" ><img className="aspect-square h-full w-full" src="https://picsum.photos/40" /></span>
              <div >
                <div className="font-medium" >Jane Smith</div>
                <div className="text-sm" >Uploaded a file</div>
              </div>
            </div>
            <div className="text-sm" >4 hours ago</div>
          </div>
          <div className="flex items-center justify-between" >
            <div className="flex items-center gap-2" ><span className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full" ><img className="aspect-square h-full w-full" src="https://picsum.photos/40" /></span>
              <div >
                <div className="font-medium" >Michael Johnson</div>
                <div className="text-sm" >Downloaded a report</div>
              </div>
            </div>
            <div className="text-sm" >1 day ago</div>
          </div>
        </div>
      </div>
    </>
  );
}
