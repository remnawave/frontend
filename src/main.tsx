import ReactDOM from 'react-dom/client'

import { App } from './app'
import '@shared/utils/setup-monaco/setup-monaco'

const root = ReactDOM.createRoot(document.getElementById('root')!)
root.render(<App />)
