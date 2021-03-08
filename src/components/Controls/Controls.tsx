import { PropsWithChildren, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { next, reset, useRandomTemplate } from '../../reducers/dataSlice';
import { RootState, useAppDispatch } from '../../store';
import ForwardIcon from '../icons/ForwardIcon';
import InfoIcon from '../icons/InfoIcon';
import RabbitIcon from '../icons/RabbitIcon';
import RandomIcon from '../icons/RandomIcon';
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
  label,
}: PropsWithChildren<ButtonProps>) => {
  return (
    <button
      className={
        'p-2 mr-2 lg:mr-0 lg:mb-2 last:m-0 text-white' +
        (isActive ? ' ' + 'bg-pink-700' : ' ' + 'bg-pink-500') +
        (disabled ? ' ' + 'opacity-50 pointer-events-none' : '')
      }
      onClick={handleClick}
      disabled={disabled}
      aria-label={label}
    >
      {children}
    </button>
  );
};

const Controls = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<500 | 250 | 125>(125);
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
    <div className='absolute bottom-4 left-1/2 lg:bottom-auto lg:top-4 lg:left-4 transform -translate-x-1/2 lg:transform-none'>
      <div className='relative p-2 inline-flex flex-row lg:flex-col bg-black z-10'>
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
          {speed === 500 && <SnailIcon size={36} />}
          {speed === 250 && <TurtleIcon size={36} />}
          {speed === 125 && <RabbitIcon size={36} />}
        </Button>
        <Button
          label='template button'
          handleClick={() => dispatch(useRandomTemplate())}
          disabled={isPlaying}
        >
          <RandomIcon size={36} />
        </Button>
        <Button label='info button'>
          <a
            href='https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life'
            target='_blank'
            rel='noreferrer'
            aria-label='wiki link'
          >
            <InfoIcon size={36} />
          </a>
        </Button>
      </div>
    </div>
  );
};

export default Controls;
