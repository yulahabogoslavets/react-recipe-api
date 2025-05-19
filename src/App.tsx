import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SearchInput } from './components/SearchInput';
import { MealDetail } from './components/MealDetail';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SearchInput />} />
          <Route path="/meal/:id" element={<MealDetail />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
