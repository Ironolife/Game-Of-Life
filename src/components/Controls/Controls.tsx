import { PropsWithChildren, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { next, reset } from '../../reducers/dataSlice';
import { RootState, useAppDispatch } from '../../store';
import ForwardIcon from '../icons/ForwardIcon';
import InfoIcon from '../icons/InfoIcon';
import RabbitIcon from '../icons/RabbitIcon';
import ResetIcon from '../icons/ResetIcon';
import SnailIcon from '../icons/SnailIcon';
import StartIcon from '../icons/StartIcon';
import StopIcon from '../icons/StopIcon';
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
}: PropsWithChildren<ButtonProps>) => {
  return (
    <button
      className={
        'p-2 mb-2 last:mb-0 text-white' +
        (isActive ? ' ' + 'bg-pink-700' : ' ' + 'bg-pink-500') +
        (disabled ? ' ' + 'opacity-50 pointer-events-none' : '')
      }
      onClick={handleClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

const Controls = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<1000 | 500 | 250>(1000);
  const dispatch = useAppDispatch();
  const livingCells = useSelector((state: RootState) => state.data.livingCells);

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
    <div className='relative m-4 p-2 inline-flex flex-col bg-black z-10'>
      <Button
        label={isPlaying ? 'stop button' : 'start button'}
        handleClick={() => setIsPlaying(!isPlaying)}
        isActive={isPlaying}
        disabled={!isPlaying && livingCells === 0}
      >
        {isPlaying ? <StopIcon size={36} /> : <StartIcon size={36} />}
      </Button>
      <Button
        label='forward button'
        handleClick={() => dispatch(next())}
        disabled={isPlaying || livingCells === 0}
      >
        <ForwardIcon size={36} />
      </Button>
      <Button
        label='reset button'
        handleClick={() => {
          dispatch(reset());
          setIsPlaying(false);
        }}
        disabled={livingCells === 0}
      >
        <ResetIcon size={36} />
      </Button>
      <Button
        label='speed button'
        handleClick={() => {
          switch (speed) {
            case 1000:
              setSpeed(500);
              break;
            case 500:
              setSpeed(250);
              break;
            case 250:
              setSpeed(1000);
              break;
          }
        }}
      >
        {speed === 1000 && <SnailIcon size={36} />}
        {speed === 500 && <TurtleIcon size={36} />}
        {speed === 250 && <RabbitIcon size={36} />}
      </Button>
      <Button label='info button'>
        <a
          href='https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life'
          target='_blank'
          rel='noreferrer'
        >
          <InfoIcon size={36} />
        </a>
      </Button>
    </div>
  );
};

export default Controls;
