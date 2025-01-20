// import { ModalCredentialData } from "./Credential";
// import { FormData } from './Workflow';

// interface NodeData {
//   type: string;
//   nodeid: string;
//   workflowid: string;
//   credential: ModalCredentialData;
//   formdata: FormData;
// }

// export const defaultFormModal: FormData = {
//   pollmode: 'none',
//   selectdocument: 'byuri',
//   document: '',
//   selectsheet: 'byname',
//   sheet: '',
//   operation: 'getallcontent',
//   credentialid: '',
//   sub: '',
//   type: '',
//   workflowid: '',
//   nodeid: '',
//   redirecturl: '',
//   testmode: false,
// };

// export type CredentialComponent = React.ComponentType<{
//   credential: ModalCredentialData;
//   onChange: (field: keyof ModalCredentialData, value: any) => void;
// }>;

// export interface ResponseSaveFormData {
//   status: number;
//   error: string;
//   data: string;
// }

// export const enum ERRORTEXT {
//   notvalidurl = 'Not valid URL in Document',
//   notvalidoptiondocument = 'Select Document not valid option',
//   notsavedyet = "Already not saved",
//   notsaved = "Not Saved!",
//   saved = "Saved"
// }
