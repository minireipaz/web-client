import { Handle, Position } from '@xyflow/react';

interface WrapperNodeProps {
  data: {
    id: string;
    label: string;
    type: string;
    description: string;
    options: string;
    onClickFromNode: (posX: number, posY: number, nodeID: string) => void;
  };
}

const offsetRight = 200;
const offsetBottom = -50;

export function WrapperNode(props: WrapperNodeProps) {
  function handleClick(event: React.MouseEvent) {
    event.preventDefault();
    const { clientX, clientY } = event;
    props.data.onClickFromNode(
      clientX + offsetRight,
      clientY + offsetBottom,
      props.data.id
    );
  }

  return (
    <div className="relative w-[50px] h-[50px] border border-gray-300 bg-white text-black group">
      {/* Options Node */}
      <div className="absolute top-[-16px] left-0 right-0 bg-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span className="flex flex-row h-full w-full items-center justify-start gap-2">
          <button className="text-white w-10 text-[10px]  ">&gt;</button>
          <button className="text-white w-10 text-[10px]  ">O</button>
          <button className="text-white w-10 text-[10px]  ">X</button>
          <button className="text-white w-10 text-[10px]  ">...</button>
        </span>
      </div>

      {/* Default Node */}
      <div className="absolute bottom-0 left-0 right-0 h-full p-1 bg-gray-100 rounded-md">
        <p className="text-[9px] ">{props.data.label}</p>
      </div>

      {/* Edge Source */}
      <div className="absolute top-[50%] right-[-4px]">
        <Handle
          type="source"
          position={Position.Right}
          className="bg-[#e8824b] w-[10px] h-[10px] border-0"
        />
      </div>

      {/* Edge target */}
      <div className="absolute top-[50%] left-[-3px]">
        <Handle
          type="target"
          position={Position.Left}
          className="bg-lime-600 w-[4px] h-[12px] border-0 rounded-none"
        />
      </div>

      {/* "+" button */}
      <div className="absolute bottom-[-3%] right-[-1px]">
        <button
          onClick={handleClick}
          className=" w-3 h-3 bg-green-500 text-white flex items-center justify-center"
        >
          <span className="text-[10px] leading-normal">+</span>
        </button>
      </div>
    </div>
  );
}
