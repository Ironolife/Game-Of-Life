import Controls from './components/Controls/Controls';
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import View from './components/View/View';

const App = () => {
  return (
    <>
      <Header />
      <main className='relative' style={{ flex: '1 0 auto' }}>
        <View />
        <Controls />
      </main>
      <Footer />
    </>
  );
};

export default App;
