import { createRoot } from 'react-dom/client'

import { App } from './app'
import '@shared/utils/setup-monaco/setup-monaco'

const root = createRoot(document.getElementById('root')!)
root.render(<App />)
