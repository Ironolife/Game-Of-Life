import { useSelector } from 'react-redux';
import { toggleValue } from '../../reducers/dataReducer';
import { RootState, useAppDispatch } from '../../store';

interface CellProps {
  value: boolean;
  x: number;
  y: number;
}

const Cell = ({ value, x, y }: CellProps) => {
  const dispatch = useAppDispatch();

  const handleClick = () => {
    dispatch(toggleValue({ x, y }));
  };

  return (
    <div
      className={'h-4 w-4' + (value ? ' ' + 'bg-green-500' : '')}
      onClick={handleClick}
    />
  );
};

const View = () => {
  const data = useSelector((state: RootState) => state.data);

  return (
    <div className='absolute inset-0 overflow-hidden'>
      <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
        <div className='flex flex-col justify-center divide-y divide-gray-600'>
          {data.map((row, x) => (
            <div
              key={x}
              className='flex justify-center divide-x divide-gray-600'
            >
              {row.map((col, y) => (
                <Cell key={y} value={col} x={x} y={y} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default View;
