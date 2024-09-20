import { useState, useCallback } from 'react';
import {
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  Node,
  Controls,
  Background,
  BackgroundVariant,
  NodeTypes,
  Connection,
  Edge,
  useReactFlow
} from '@xyflow/react';
import { Workflow } from '../../models/Dashboard';
import '@xyflow/react/dist/style.css';
import { WorkflowDrawer } from './WorkflowDrawer';
import { WrapperNode } from './WrapperNode';
import ButtonEdge from './ButtonEdge';

interface ContainerProps {
  workflow: Workflow
}

export interface NodeData {
  type: string;
  label: string;
  options?: string;
  description?: string;
}

const nodeTypes: NodeTypes = {
  wrapperNode: WrapperNode,
};

const edgeTypes = {
  buttonedge: ButtonEdge,
};

const offsetRight = 80;
const offsetBottom = -20;

export function DetailWorkflow(_: ContainerProps) {

  const initialNodes: Node[] = [
    {
      id: 'initial-node',
      type: 'wrapperNode',
      position: { x: 2, y: 0 },
      data: {
        id: "initial-node",
        label: 'Start Point',
        options: 'Initial Options',
        description: 'This is the starting point of your workflow',
        onClickFromNode: () => handleClickFromNode(flowToScreenPosition({ x: 100, y: 0 }).x, flowToScreenPosition({ x: 100, y: 0 }).y, 'initial-node'),  //setIsDrawerOpen(true),
      },
    },
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const closeDrawer = () => setIsDrawerOpen(false);
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });
  const { screenToFlowPosition, flowToScreenPosition } = useReactFlow();
  const [lastNodeID, setLastNodeID] = useState("");

  const onConnect = useCallback(
    function (params: Connection) {
      setEdges(function (eds) {
        return addEdge({ ...params, type: 'buttonedge', animated: true, style: { stroke: '#fff' } }, eds);
      });
    },
    [setEdges]
  );

  const onConnectEnd = useCallback(
    (event: any, connectionState: any) => {
      if (!connectionState.isValid) {
        setLastNodeID(connectionState.fromNode.id);
        let { clientX, clientY } = 'changedTouches' in event ? event.changedTouches[0] : event;
        clientX += offsetRight;
        clientY += offsetBottom;
        setClickPosition({ x: clientX, y: clientY });
        setIsDrawerOpen(true);
      }
    }, [screenToFlowPosition])

    const handleClickFromNode = useCallback( (posX: number, posY: number, nodeID: string) => {
      setIsDrawerOpen(true);
      setLastNodeID(nodeID);
      setClickPosition({ x: posX, y: posY });
    }, [isDrawerOpen, setIsDrawerOpen])

  const handleClickDrawer = useCallback((event: any, nodeData: NodeData) => {
    event.preventDefault();
    const position = screenToFlowPosition({
      x: clickPosition.x,
      y: clickPosition.y,
    });
    const nodeID = `${nodeData.type}-${nodes.length + 1}`;
    const newNode: Node = {
      id: nodeID,
      type: 'wrapperNode',
      position,
      data: {
        id: nodeID,
        label: nodeData.label,
        options: nodeData.options || 'Default Options',
        description: nodeData.description || 'Default Description',
        onClickFromNode: (posX: number, posY: number, nodeID: string) => handleClickFromNode(posX, posY, nodeID),
      },
    };

    setNodes((nds) => nds.concat(newNode));
    setEdges((eds) =>
      eds.concat({ id: nodeID, source: lastNodeID, target: nodeID, type: 'buttonedge', animated: true, style: { stroke: '#fff' } }),
    );
    setIsDrawerOpen(false);

  }, [isDrawerOpen, setIsDrawerOpen]);

  return (
    <div className="h-full w-full relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onConnectEnd={onConnectEnd}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView={true}
        minZoom={0}
        maxZoom={1}
        colorMode='dark'
        nodeOrigin={[2, 0]}
      >
        <Controls />
        <Background color="#ffffff4f" variant={BackgroundVariant.Dots} gap={6} size={1} />

      </ReactFlow>
      <div className='absolute w-16 h-32 top-0 right-0 flex flex-col z-50'>
        <div className='absolute top-4 right-4'>
          <button className="flex items-center justify-center bg-[#141414] h-12 w-12 top-0 right-0 border-white border border-solid hover:border-red-300 hover:text-red-300 "
            onClick={() => setIsDrawerOpen(true)}>
            <span className="font-semibold text-4xl ">+</span>
          </button>
        </div>
        <WorkflowDrawer
          isOpen={isDrawerOpen}
          onClose={closeDrawer}
          onClick={handleClickDrawer}
        />
      </div>

    </div>
  );
};
