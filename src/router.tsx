import { createBrowserRouter } from 'react-router-dom'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { CityPage } from './pages/CityPage'
import { ComparePage } from './pages/ComparePage'
import { MethodologyPage } from './pages/MethodologyPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'city/:id', element: <CityPage /> },
      { path: 'compare', element: <ComparePage /> },
      { path: 'methodology', element: <MethodologyPage /> },
    ],
  },
])
