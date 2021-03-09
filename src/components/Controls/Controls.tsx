import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useSelector } from 'react-redux';
import { clear, next, reset, useTemplate } from '../../reducers/dataSlice';
import { RootState, useAppDispatch } from '../../store';
import { encodeData } from '../../utils/encodeData';
import getRandomTemplate from '../../utils/templates';
import ClearIcon from '../icons/ClearIcon';
import CopyIcon from '../icons/CopyIcon';
import ForwardIcon from '../icons/ForwardIcon';
import InfoIcon from '../icons/InfoIcon';
import RabbitIcon from '../icons/RabbitIcon';
import ResetIcon from '../icons/ResetIcon';
import ShareIcon from '../icons/ShareIcon';
import SnailIcon from '../icons/SnailIcon';
import StartIcon from '../icons/StartIcon';
import StopIcon from '../icons/StopIcon';
import TemplateIcon from '../icons/TemplateIcon';
import TurtleIcon from '../icons/TurtleIcon';

interface ButtonProps {
  handleClick?: () => void;
  isActive?: boolean;
  disabled?: boolean;
  label: string;
}

const Button = ({
  handleClick,
  isActive = false,
  disabled = false,
  children,
  label,
}: PropsWithChildren<ButtonProps>) => {
  return (
    <button
      className={
        'p-2 mr-2 md:mr-0 md:mb-2 last:m-0 text-white' +
        (isActive ? ' ' + 'bg-pink-700' : ' ' + 'bg-pink-500') +
        (disabled ? ' ' + 'opacity-50 pointer-events-none' : '')
      }
      onClick={handleClick}
      disabled={disabled}
      aria-label={label}
      title={label}
    >
      {children}
    </button>
  );
};

interface ControlsProps {
  isPlaying: boolean;
  setIsPlaying: Dispatch<SetStateAction<boolean>>;
}

const Group1 = ({ isPlaying, setIsPlaying }: ControlsProps) => {
  const [speed, setSpeed] = useState<500 | 250 | 125>(125);
  const dispatch = useAppDispatch();
  const { startData, livingCells } = useSelector(
    (state: RootState) => state.data
  );

  useEffect(() => {
    if (isPlaying) {
      if (livingCells === 0) {
        setIsPlaying(false);
      }

      const interval = setInterval(() => {
        dispatch(next());
      }, speed);

      return () => clearInterval(interval);
    }
  }, [isPlaying, speed, livingCells]);

  return (
    <>
      <Button
        label={isPlaying ? 'Stop' : 'Start'}
        handleClick={() => setIsPlaying(!isPlaying)}
        isActive={isPlaying}
        disabled={!isPlaying && livingCells === 0}
      >
        {isPlaying ? <StopIcon /> : <StartIcon />}
      </Button>
      <Button
        label='Next State'
        handleClick={() => dispatch(next())}
        disabled={isPlaying || livingCells === 0}
      >
        <ForwardIcon />
      </Button>
      <Button
        label='Reset'
        handleClick={() => {
          dispatch(reset());
          setIsPlaying(false);
        }}
        disabled={!startData}
      >
        <ResetIcon />
      </Button>
      <Button
        label='Clear'
        handleClick={() => {
          dispatch(clear());
          setIsPlaying(false);
        }}
        disabled={livingCells === 0}
      >
        <ClearIcon />
      </Button>
      <Button
        label='Change Speed'
        handleClick={() => {
          switch (speed) {
            case 500:
              setSpeed(250);
              break;
            case 250:
              setSpeed(125);
              break;
            case 125:
              setSpeed(500);
              break;
          }
        }}
      >
        {speed === 500 && <SnailIcon />}
        {speed === 250 && <TurtleIcon />}
        {speed === 125 && <RabbitIcon />}
      </Button>
    </>
  );
};

interface ShareProps {
  url: string;
}

const Share = ({ url }: ShareProps) => {
  const [copied, setCopied] = useState(false);

  const handleClick = async () => {
    await navigator?.clipboard?.writeText(url);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 100);
  };

  return (
    <div className='absolute top-full md:top-1/2 left-1/2 md:left-full transform -translate-x-1/2 md:translate-x-0 md:-translate-y-1/2 flex flex-col md:flex-row items-center justify-center'>
      <div
        className='md:hidden w-0 mt-2 border-solid'
        style={{
          borderWidth: '0 6px 12px 6px',
          borderColor: 'transparent transparent black transparent',
        }}
      />
      <div
        className='hidden md:block ml-2 border-solid'
        style={{
          borderWidth: '6px 12px 6px 0',
          borderColor: 'transparent black transparent transparent',
        }}
      />
      <div className='flex items-center p-2 text-white bg-black'>
        <input className='px-2' value={url} disabled />
        <button
          className='ml-2'
          aria-label='Copy'
          title='Copy'
          onClick={handleClick}
        >
          <CopyIcon
            className={
              'h-5 w-5' +
              (copied
                ? ' ' + 'text-green-500'
                : ' ' + 'transition-colors duration-500 text-white')
            }
          />
        </button>
      </div>
    </div>
  );
};

const Group2 = ({ isPlaying }: ControlsProps) => {
  const [url, setUrl] = useState<string | null>(null);
  const shareRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const { startData } = useSelector((state: RootState) => state.data);

  useEffect(() => {
    if (shareRef.current && url) {
      window.onclick = (event: MouseEvent) => {
        if (!shareRef.current?.contains(event.target as Node)) {
          setUrl(null);
        }
      };

      return () => {
        window.onclick = null;
      };
    }
  }, [shareRef.current, url]);

  return (
    <>
      <Button
        label='Use Template'
        handleClick={() => dispatch(useTemplate(getRandomTemplate()))}
        disabled={isPlaying}
      >
        <TemplateIcon />
      </Button>
      <div className='relative mr-2 md:mr-0 md:mb-2'>
        <div ref={shareRef}>{url ? <Share url={url} /> : null}</div>
        <Button
          label='Share'
          handleClick={() => {
            if (!url) {
              setUrl(
                `${window.location.origin}?data=${encodeData(startData!)}`
              );
            } else {
              setUrl(null);
            }
          }}
          disabled={!startData}
        >
          <ShareIcon />
        </Button>
      </div>
      <Button label='Info'>
        <a
          href='https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life'
          target='_blank'
          rel='noreferrer'
          aria-label='Wiki Link'
        >
          <InfoIcon />
        </a>
      </Button>
    </>
  );
};

const Controls = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <>
      <div className='md:hidden absolute bottom-4 left-1/2 transform -translate-x-1/2'>
        <div className='relative p-2 inline-flex bg-black z-10'>
          <Group1 isPlaying={isPlaying} setIsPlaying={setIsPlaying} />
        </div>
      </div>
      <div className='md:hidden absolute top-4 left-1/2 transform -translate-x-1/2'>
        <div className='relative p-2 inline-flex bg-black z-10'>
          <Group2 isPlaying={isPlaying} setIsPlaying={setIsPlaying} />
        </div>
      </div>
      <div className='hidden md:inline-flex relative m-4 p-2 flex-col bg-black z-10'>
        <Group1 isPlaying={isPlaying} setIsPlaying={setIsPlaying} />
        <Group2 isPlaying={isPlaying} setIsPlaying={setIsPlaying} />
      </div>
    </>
  );
};

export default Controls;
