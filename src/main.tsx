import ReactDOM from "react-dom/client";
import RootApp from "~/components/utility/root-app";
const root = document.getElementById("root")!;

if (!root.innerHTML) {
  ReactDOM.createRoot(root).render(<RootApp />);
}
