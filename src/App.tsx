import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Home from '@/pages/Home';
import FormPage from '@/pages/FormPage';
import EnemCristao from '@/pages/EnemCristao';
import StudioPage from '@/pages/StudioPage';
import AboutUs from '@/pages/AboutUs';
import SchedulePage from '@/pages/SchedulePage';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sobre-nos" element={<AboutUs />} />
            <Route path="/programacao" element={<SchedulePage />} />
            <Route path="/inscricao" element={<FormPage />} />
            <Route path="/enem-cristao" element={<EnemCristao />} />
            <Route path="/studio/*" element={<StudioPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
