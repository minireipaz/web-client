export function RecentWorkflows() {
  return (
    <>
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm" >
        <div className="flex flex-col space-y-1.5 p-6" >
          <h3 className="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight" >Recent Workflows</h3>
          <p className="text-sm text-muted-foreground" >View the latest workflows</p>
        </div>
        <div className="p-6" >
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm" >
              <thead className="[&amp;_tr]:border-b" >
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted" >
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground " >Name</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground " >Status</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground " >Started</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground " >Duration</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground " >Actions</th>
                </tr>
              </thead>
              <tbody className="[&amp;_tr:last-child]:border-0" >
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted" >
                  <td className="p-4 align-middle " >
                    <div className="font-medium" >Deploy to Production</div>
                    <div className="text-sm text-muted-foreground" >Deploys the latest changes to production</div>
                  </td>
                  <td className="p-4 align-middle " >
                    <div className="inline-flex w-fit items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground">
                      Completed
                    </div>
                  </td>
                  <td className="p-4 align-middle ">2023-04-15 10:30 AM</td>
                  <td className="p-4 align-middle ">15 minutes</td>
                  <td className="p-4 align-middle ">
                    <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10" type="button" >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><polyline points="18 8 22 12 18 16"></polyline><polyline points="6 8 2 12 6 16"></polyline><line x1="2" x2="22" y1="12" y2="12"></line></svg>
                      <span className="sr-only" >Actions</span>
                    </button>
                  </td>
                </tr>
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted" >
                  <td className="p-4 align-middle " >
                    <div className="font-medium" >Update Dependencies</div>
                    <div className="text-sm text-muted-foreground" >Updates all project dependencies to latest versions</div>
                  </td>
                  <td className="p-4 align-middle " >
                    <div className="inline-flex w-fit items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground">
                      Completed
                    </div>
                  </td>
                  <td className="p-4 align-middle ">2023-04-12 3:45 PM</td>
                  <td className="p-4 align-middle ">30 minutes</td>
                  <td className="p-4 align-middle "><button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10" type="button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><polyline points="18 8 22 12 18 16"></polyline><polyline points="6 8 2 12 6 16"></polyline><line x1="2" x2="22" y1="12" y2="12"></line></svg>
                    <span className="sr-only" >Actions</span>
                  </button>
                  </td>
                </tr>
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted" >
                  <td className="p-4 align-middle " >
                    <div className="font-medium" >Run E2E Tests</div>
                    <div className="text-sm text-muted-foreground" >Runs end-to-end tests for the application</div>
                  </td>
                  <td className="p-4 align-middle " >
                    <div className="inline-flex w-fit items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground">
                      Failed
                    </div>
                  </td>
                  <td className="p-4 align-middle ">2023-04-10 9:00 AM</td>
                  <td className="p-4 align-middle ">45 minutes</td>
                  <td className="p-4 align-middle "><button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10" type="button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><polyline points="18 8 22 12 18 16"></polyline><polyline points="6 8 2 12 6 16"></polyline><line x1="2" x2="22" y1="12" y2="12"></line></svg>
                    <span className="sr-only" >Actions</span>
                  </button>
                  </td>
                </tr>
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted" >
                  <td className="p-4 align-middle ">
                    <div className="font-medium">Build and Deploy</div>
                    <div className="text-sm text-muted-foreground">Builds the application and deploys it to staging</div>
                  </td>
                  <td className="p-4 align-middle ">
                    <div className="inline-flex w-fit items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground">
                      Completed
                    </div>
                  </td>
                  <td className="p-4 align-middle " >2023-04-08 2:15 PM</td>
                  <td className="p-4 align-middle " >20 minutes</td>
                  <td className="p-4 align-middle " >
                    <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10" type="button">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><polyline points="18 8 22 12 18 16"></polyline><polyline points="6 8 2 12 6 16"></polyline><line x1="2" x2="22" y1="12" y2="12"></line></svg>
                      <span className="sr-only" >Actions</span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
