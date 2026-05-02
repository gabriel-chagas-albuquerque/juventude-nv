import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import Navbar from '@/components/Navbar';
import ScrollToTop from '@/components/ScrollToTop';
import Footer from '@/components/Footer';
import Home from '@/pages/Home';
import FormPage from '@/pages/FormPage';
import EnemCristao from '@/pages/EnemCristao';
import AboutUs from '@/pages/AboutUs';
import SchedulePage from '@/pages/SchedulePage';
import { SpeedInsights } from "@vercel/speed-insights/react"

function App() {
  return (
    <BrowserRouter>
      <SpeedInsights />
      <Toaster richColors position="top-right" />
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sobre-nos" element={<AboutUs />} />
            <Route path="/programacao" element={<SchedulePage />} />
            <Route path="/fale-conosco" element={<FormPage />} />
            <Route path="/enem-cristao" element={<EnemCristao />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
