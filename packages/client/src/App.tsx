import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ChatGroupList } from './pages/ChatGroupList'
import { Container } from './components/Container'

const queryClient = new QueryClient()

function App() {

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Container>
          <ChatGroupList />
        </Container>
      </QueryClientProvider>
    </>
  )
}

export default App
