import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Booting up the runway! Let the show begin.
createRoot(document.getElementById('root')).render(
    <StrictMode>
        <App/>
    </StrictMode>,
)