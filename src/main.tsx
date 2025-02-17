import ReactDOM from 'react-dom/client';
import Root from '~/components/layout/root';
import '~/globals.css';

const root = document.getElementById('root')!;

if (!root.innerHTML) {
	ReactDOM.createRoot(root).render(<Root />);
}
