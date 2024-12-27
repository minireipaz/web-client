import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { NavDashboard } from '../components/Dashboard/NavDashboard';
import { DetailWorkflow } from '../components/Workflow/DetailWorkflow';
import { ReactFlowProvider } from '@xyflow/react';
import { ResponseGetWorkflow, Workflow } from '../models/Workflow';
import { useEffect, useRef, useState } from 'react';
import { getUriFrontend } from '../utils/getUriFrontend';
import { useAuth } from '../components/AuthProvider/indexAuthProvider';
import { ModalCredentialData } from '../models/Credential';
import { defaultCredential } from '../components/WorkflowModal/Modal';

interface ResponseExistWorkflow {
  currentWorkflow: Workflow | null;
  exist: boolean;
  credentials: ModalCredentialData[];
}

export function WorkflowDetails() {
  const location = useLocation();
  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [credentials, setCredentials] = useState<ModalCredentialData[] | null>(
    null
  );
  const [loading, setLoading] = useState(!workflow);
  const { userInfo, handleTokenExpiration } = useAuth();
  const navigate = useNavigate();
  const fetchedRef = useRef(false);

  useEffect(() => {
    async function fetchWorkflowDetails() {
      if (fetchedRef.current || workflow) return;

      fetchedRef.current = true;
      const {
        currentWorkflow,
        exist,
        credentials: currentCredentials,
      } = await getWorkflowData(location.pathname);
      if (!exist) {
        navigate('/dashboard', { replace: true });
        return;
      }

      setWorkflow(currentWorkflow);
      setCredentials([defaultCredential, ...currentCredentials]);
      setLoading(false);
    }

    fetchWorkflowDetails();
  }, [location.pathname, navigate, workflow]);

  if (loading) {
    return <div></div>;
  }

  if (!workflow || !workflow?.id || workflow?.id === '') {
    return <Navigate to="/dashboard" replace />;
  }

  async function getWorkflowData(path: string): Promise<ResponseExistWorkflow> {
    const workflowID = convertPathToID(path);
    if (workflowID === '') {
      return { currentWorkflow: null, exist: false, credentials: [] };
    }
    const [newWorkflow, credentials] = await getContent(workflowID);
    return {
      currentWorkflow: newWorkflow,
      exist: !!newWorkflow,
      credentials: credentials as ModalCredentialData[],
    };
  }

  function convertPathToID(path: string) {
    const pathSplitted = path.split('/');
    if (pathSplitted.length != 3) {
      return '';
    }
    const workflowID = pathSplitted[2];
    if (!workflowID || workflowID === '') {
      return '';
    }
    return workflowID;
  }

  async function getContent(
    workflowID: string
  ): Promise<[Workflow | null, ModalCredentialData[] | null]> {
    try {
      const [ok, uriFrontend] = getUriFrontend(
        `/api/v1/workflows/${userInfo?.profile.sub}/${workflowID}`
      );
      if (!ok) {
        console.log('ERROR | cannot get uri frontend');
        return [null, null];
      }
      const response = await fetch(uriFrontend, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo?.access_token}`,
        },
      });

      if (response.status === 401 || response.status === 404) {
        // Token has expired, handle expiration and redirect
        // TODO: add noallowed list
        handleTokenExpiration();
        navigate('/', { replace: true });
        return [null, null];
      }

      if (!response.ok) {
        return [null, null];
      }

      const data: ResponseGetWorkflow = await response.json();
      if (data.error !== '' || data.status !== 200) {
        console.log('ERROR | cannot get dashboard data');
        return [null, null];
      }

      return [data.workflow, data.credentials];
    } catch (error) {
      console.error('Error fetching workflow data:', error);
      return [null, null];
    }
  }

  return (
    <>
      <div className="grid min-h-screen w-full grid-cols-[240px_1fr] overflow-hidden">
        <NavDashboard />
        <ReactFlowProvider>
          <DetailWorkflow
            workflow={workflow}
            credentials={credentials as ModalCredentialData[]}
          />
        </ReactFlowProvider>
      </div>
    </>
  );
}
