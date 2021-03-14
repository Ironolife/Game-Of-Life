import { useEffect } from 'react';
import Controls from './components/Controls/Controls';
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import View from './components/View/View';
import { useTemplate } from './store/reducers/data.reducer';
import { useAppDispatch } from './store/store';
import { decodeData } from './utils/encodeData';

const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get('data');

    if (encoded) {
      try {
        const template = decodeData(encoded);
        dispatch(useTemplate(template));
      } catch (err) {
        console.error(err);
      }
    }
  }, []);

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
