import { Tooltip, Dropdown } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import { NavDashboard } from '../components/Dashboard/NavDashboard';
import { HeaderDashboard } from '../components/Header/Headers';
import { activeMap, statusMap } from '../models/Dashboard';
import { customTooltipTheme } from '../models/Workflow';
import { getUriFrontend } from '../utils/getUriFrontend';
import {
  ModalCredentialData,
  ResponseGetAllCredentials,
} from '../models/Credential';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '../components/AuthProvider/indexAuthProvider';
import { ModalCredential } from '../components/Credentials/ModalCredential';
import { CredentialComponent } from '../components/WorkflowModal/Modal';
import { RenderGoogleSheetsOAuth2Api } from '../components/Credentials/GoogleSheetsOAuth2Api';

interface ContainerProps {}

export function Credentials(_: ContainerProps) {
  const { authenticated, handleTokenExpiration, userInfo } = useAuth();
  const navigate = useNavigate();
  const fetchedRef = useRef(false);

  const [listCredentials, setListCredentials] = useState<
    ModalCredentialData[] | undefined
  >(undefined);
  const [isModalCredentialOpen, setIsModalCredentialOpen] = useState(false);
  const [currentCredential, setCurrentCredential] =
    useState<ModalCredentialData>();
  const [currentCredentialComponent, setCurrentCredentialComponent] =
    useState<CredentialComponent | null>(null);

  const fetchAllCredentials = useCallback(async () => {
    if (fetchedRef.current) return;

    fetchedRef.current = true;

    try {
      const [ok, uriFrontend] = getUriFrontend(
        `/api/v1/credentials/${userInfo?.profile.sub}`
      );
      if (!ok) {
        console.log('ERROR | cannot get uri frontend');
        return;
      }
      const response = await fetch(uriFrontend, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo?.access_token}`,
        },
      });

      if (response.status === 401) {
        // Token has expired, handle expiration and redirect
        handleTokenExpiration();
        navigate('/', { replace: true });
        return;
      }

      if (!response.ok) {
        return;
      }

      const data: ResponseGetAllCredentials = await response.json();
      if (data.error !== '' || data.status !== 200) {
        console.log('ERROR | cannot get dashboard data');
        return;
      }

      setListCredentials(data.credentials);
      return;
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  }, [handleTokenExpiration, navigate]);

  useEffect(() => {
    if (!authenticated) {
      navigate('/', { replace: true });
      return;
    }

    if (userInfo) {
      fetchAllCredentials();
    }
  }, [userInfo, authenticated, fetchAllCredentials, navigate]);

  function formatTextIsActive(isActive: Number) {
    const index: string = isActive.toString();
    let activeText = activeMap[Number.parseInt(index)].text;
    if (!activeText) {
      activeText = activeMap[3].text;
    }
    return activeText;
  }

  function handleSaveModalCredential(newCredential: ModalCredentialData) {
    const updatedListCredentials = handleSearchDuplicated(newCredential);
    setListCredentials(updatedListCredentials);
    setCurrentCredential(newCredential);
    setIsModalCredentialOpen(false);
  }

  function handleSearchDuplicated(newCredential: ModalCredentialData) {
    const updatedListCredentials = [
      ...(listCredentials as ModalCredentialData[]),
    ];
    const index = updatedListCredentials.findIndex(
      (cred) => cred.id === newCredential.id
    );
    if (index !== -1) {
      updatedListCredentials[index] = {
        ...updatedListCredentials[index],
        ...newCredential,
      };
    } else {
      updatedListCredentials?.push(newCredential);
    }
    return updatedListCredentials;
  }

  function handleClickOpenModal(id: string) {
    const selectedCredential = searchCredentail(id);
    if (!selectedCredential) return;

    setIsModalCredentialOpen(!isModalCredentialOpen);
    setCurrentCredential(selectedCredential);

    if (selectedCredential.type === 'googlesheets') {
      setCurrentCredentialComponent(() => RenderGoogleSheetsOAuth2Api);
    }
  }

  function searchCredentail(id: string): ModalCredentialData | undefined {
    for (let i = 0; i < listCredentials!.length; i++) {
      if (listCredentials![i].id === id) {
        return listCredentials![i];
      }
    }
    return undefined;
  }

  function handleCloseModalCredential() {
    setIsModalCredentialOpen(false);
  }

  return (
    <>
      <ModalCredential
        isOpen={isModalCredentialOpen}
        onClose={handleCloseModalCredential}
        onSave={handleSaveModalCredential}
        initialCredential={currentCredential as ModalCredentialData}
        renderBody={currentCredentialComponent as CredentialComponent}
      />
      <div className="grid min-h-screen w-full grid-cols-[240px_1fr] overflow-hidden">
        <NavDashboard />
        <div className="flex flex-col">
          <HeaderDashboard title="Credentials" />
          <div className="grid gap-6">
            <div className="flex flex-col space-y-1.5 p-6">
              <p className="text-sm">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit.
              </p>
            </div>
            <div className="pt-0 pr-4 pl-4 pb-4">
              <div className="relative w-full ">
                {/* Header */}
                <div className="grid grid-cols-6 gap-4 font-medium text-sm border-b py-2">
                  <div className="px-4">Name</div>
                  <div className="px-4">Description</div>
                  <div className="px-4">Status</div>
                  <div className="px-4">Type</div>
                  <div className="px-4">Actions</div>
                </div>

                {/* List of workflows */}
                <ul className="text-sm list-none m-0 p-0">
                  {listCredentials === undefined ? (
                    <li className="py-4 px-4">
                      <div className="font-medium text-lg">Loading...</div>
                    </li>
                  ) : listCredentials.length === 0 ? (
                    <li className="py-4 px-4">
                      <div className="font-medium text-lg">No data</div>
                    </li>
                  ) : (
                    listCredentials.map(
                      (credential: ModalCredentialData, index: number) => (
                        <li key={index} className="border-b last:border-b-0">
                          <div className="grid grid-cols-6 gap-4 py-2 items-center">
                            <div className="px-4">
                              <button
                                onClick={() =>
                                  handleClickOpenModal(credential.id)
                                }
                                className="w-fit font-medium flex flex-shrink-0 cursor-pointer items-center underline underline-offset-4 "
                              >
                                <span>
                                  <svg
                                    width="8"
                                    height="8"
                                    viewBox="0 0 50 50"
                                    fill="none"
                                    preserveAspectRatio="xMidYMin meet"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <circle
                                      cx="25"
                                      cy="25"
                                      r="25"
                                      fill={formatTextIsActive(1)}
                                    ></circle>
                                  </svg>
                                </span>
                                <span
                                  title={credential.name}
                                  className="overflow-ellipsis overflow-hidden whitespace-nowrap ml-2  "
                                >
                                  {credential.name}
                                </span>
                              </button>
                            </div>
                            <div className="px-4 flex items-center">
                              <Tooltip
                                theme={customTooltipTheme}
                                placement="top"
                                content={credential.name}
                              >
                                <div className="text-sm overflow-ellipsis overflow-hidden whitespace-nowrap">
                                  {credential.name}
                                </div>
                              </Tooltip>
                            </div>
                            <div className="px-4 flex items-center">
                              <div
                                className={`${statusMap[6].class} inline-flex w-fit items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground`}
                              >
                                {statusMap[6].text}
                              </div>
                            </div>
                            <div className="px-4 flex items-center">
                              <div
                                className={` inline-flex w-fit items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground`}
                              >
                                {credential.type.toString()}
                              </div>
                            </div>
                            <div className="px-4 flex items-center">
                              <Dropdown label="More" dismissOnClick={false}>
                                <Dropdown.Item>Option 1</Dropdown.Item>
                                <Dropdown.Item>Option 2</Dropdown.Item>
                                <Dropdown.Item>Option 3</Dropdown.Item>
                                <Dropdown.Item>Option 4</Dropdown.Item>
                              </Dropdown>
                            </div>
                          </div>
                        </li>
                      )
                    )
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
