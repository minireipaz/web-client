import { AuthProvider } from './components/AuthProvider/indexAuthProvider.tsx';
import { Header } from './components/Header/indexHeader.tsx';

function App() {

  return (
    <>
      <AuthProvider>
        <Header />
      </AuthProvider>
    </>
  )
}

export default App
