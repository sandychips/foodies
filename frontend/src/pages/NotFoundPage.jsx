import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <>
      <Link to={`/`}>
        <button>To Home Page</button>
      </Link>
      <h1>Page NotFound</h1>
    </>
  );
}
