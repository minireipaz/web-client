export interface Workflow {
  sub?: string
	uuid?: string
	workflowname: string
  description?: string
	directorytosave: string
	createdat?: string
	updatedat?: string
}


export interface ResponseGenerateWorkflow {
  error: string
  workflow?: Workflow
  status: number
}
