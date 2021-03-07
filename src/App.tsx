import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import View from './components/View/View';

const App = () => {
  return (
    <>
      <Header />
      <main style={{ flex: '1 0 auto' }}>
        <View />
      </main>
      <Footer />
    </>
  );
};

export default App;