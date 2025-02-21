import ReactDOM from "react-dom/client";
import Root from "~/components/layout/root";

const root = document.getElementById("root")!;

if (!root.innerHTML) {
  ReactDOM.createRoot(root).render(<Root />);
}
