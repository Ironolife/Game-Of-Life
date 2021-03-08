import { useSelector } from 'react-redux';
import { Pos, toggleValue } from '../../reducers/dataSlice';
import { RootState, useAppDispatch } from '../../store';

interface CellProps {
  value: boolean;
  pos: Pos;
}

const Cell = ({ value, pos }: CellProps) => {
  const dispatch = useAppDispatch();

  const handleClick = () => {
    dispatch(toggleValue(pos));
  };

  return (
    <div
      className={'h-6 w-6 md:h-8 md:w-8' + (value ? ' ' + 'bg-green-500' : '')}
      onClick={handleClick}
    />
  );
};

const View = () => {
  const data = useSelector((state: RootState) => state.data.data);

  return (
    <div className='absolute inset-0 overflow-hidden'>
      <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
        <div className='flex flex-col justify-center divide-y divide-gray-600'>
          {data.map((row, y) => (
            <div
              key={y}
              className='flex justify-center divide-x divide-gray-600'
            >
              {row.map((col, x) => (
                <Cell key={x} value={col} pos={{ y, x }} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default View;
