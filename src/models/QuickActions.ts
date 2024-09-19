import { Workflow } from "./Dashboard"


export interface ResponseGenerateWorkflow {
  error: string
  workflow?: Workflow
  status: number
}
