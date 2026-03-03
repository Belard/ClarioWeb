import { theme } from '@/theme';
import { Header } from '@/components';
import './App.css';

const { colors, typography, spacing, shadows, borderRadius } = theme;

function App() {
  return (
    <div style={{width: '100vw', minHeight: '100vh', backgroundColor: colors.primary[500], padding: 0, margin: 0, fontFamily: typography.fontFamily.generalSans.join(', ')}}>
      <Header />

    </div>
  );
}

export default App;
