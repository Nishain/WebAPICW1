import { Link } from "react-router-dom";
import image from "./serverError.jpg";
import "./style.css";
export const ServerErrorPage = (props) => {
  return (
    <div class="card text-center">
      <div class="card-header">Server is not responding</div>
      <div class="card-body">
        <h5 class="card-title">500 Server Error</h5>
        <p class="card-text">
          Ouch!...Yes the server might have just crashed please don't fail us Ma'am.Please have a nice cup of cofee!
        </p>
        <Link to='/'>Go back to Login</Link>
      </div>
      <div class="card-footer text-muted">Team Easy Photos</div>
    </div>
  );
};
