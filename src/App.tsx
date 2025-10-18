import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './layout/AppLayout'
import Learn from './pages/Learn'
import Practice from './pages/Practice'
import Progress from './pages/Progress'
import QuizRunner from './pages/QuizRunner'

const App = () => {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/learn" replace />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/practice" element={<Practice />} />
        <Route path="/practice/:quizId" element={<QuizRunner />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="*" element={<Navigate to="/learn" replace />} />
      </Routes>
    </AppLayout>
  )
}

export default App
