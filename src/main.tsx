import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ScriptDetail from '@/pages/ScriptDetail'
import Gabarit from '@/pages/Gabarit'
import Projects from '@/pages/Projects'
import ProjectDetail from '@/pages/ProjectDetail'
import { SiteLayout } from '@/components/SiteLayout'

const router = createBrowserRouter([
	{
		path: '/',
		element: <SiteLayout />,
		children: [
			{ index: true, element: <App /> },
			{ path: 'script/:id', element: <ScriptDetail /> },
			{ path: 'gabarit', element: <Gabarit /> },
			{ path: 'projects', element: <Projects /> },
			{ path: 'projects/:id', element: <ProjectDetail /> },
		],
	},
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
