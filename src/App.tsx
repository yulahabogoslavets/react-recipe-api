import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SearchInput } from './components/SearchInput';
import { MealDetail } from './components/MealDetail';

function App() {
  return (
    <>
      <main className="container mx-auto my-4 flex flex-col items-center gap-4 px-4">
        <h1 className="text-3xl underline decoration-blue-500 mb-8">
          Recipe Finder
        </h1>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<SearchInput />} />
            <Route path="/meal/:id" element={<MealDetail />} />
          </Routes>
        </BrowserRouter>
      </main>
    </>
  );
}

export default App;
