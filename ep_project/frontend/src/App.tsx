import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Placeholder routes - will build these next */}
        <Route path="/admin/dashboard" element={<div>Admin Dashboard - Coming Soon</div>} />
        <Route path="/student/dashboard" element={<div>Student Dashboard - Coming Soon</div>} />
        <Route path="/examiner/dashboard" element={<div>Examiner Dashboard - Coming Soon</div>} />
      </Routes>
    </Router>
  );
}

export default App;