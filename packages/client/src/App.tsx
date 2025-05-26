import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ChatGroupList } from './pages/ChatGroupList'

const queryClient = new QueryClient()

function App() {

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ChatGroupList />
      </QueryClientProvider>
    </>
  )
}

export default App
