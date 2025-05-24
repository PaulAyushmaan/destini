// At the top of your imports
import SocketProvider from './SocketContext';

// In your App component's return statement, wrap everything with SocketProvider
function App() {
  return (
    <ThemeProvider>
      <SocketProvider>
        <Router>
          {/* Your existing routes */}
        </Router>
      </SocketProvider>
    </ThemeProvider>
  )
}