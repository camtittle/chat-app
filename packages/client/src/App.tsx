import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ChatGroupList } from './pages/ChatGroupList'
import { Container } from './components/Container'
import { UserProvider } from './contexts/UserContext/UserProvider'
import { UserSelector } from './components/UserSelector'

const queryClient = new QueryClient()

function App() {

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <Container>
            <UserSelector />
            <ChatGroupList />
          </Container>
        </UserProvider>
      </QueryClientProvider>
    </>
  )
}

export default App
