import pk from '../../../package.json';

const Header = () => (
  <header className='relative p-4 flex-shrink-0 flex bg-black z-10'>
    <h1>John Conway's Game of Life</h1>
    <div className='flex-1' />
    <a
      href='https://github.com/Ironolife/Game-Of-Life'
      target='_black'
      rel='noreferrer'
    >
      v{pk.version}
    </a>
  </header>
);

export default Header;
