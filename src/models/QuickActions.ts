import { Workflow } from "./Workflow"

export interface ResponseGenerateWorkflow {
  error: string
  workflow?: Workflow
  status: number
}
