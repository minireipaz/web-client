export interface Workflow {
  sub?: string
	id?: string
	name: string
  description?: string
  directory_to_save: string
	created_at?: string
	updated_at?: string
}


export interface ResponseGenerateWorkflow {
  error: string
  workflow?: Workflow
  status: number
}
