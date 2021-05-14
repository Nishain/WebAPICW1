import { Link } from "react-router-dom";
export default function Page404 (props){
    return (
        <div class="card text-center">
      <div class="card-header">Cannot find route</div>
      <div class="card-body">
        <h5 class="card-title">404 Error</h5>
        <p class="card-text">
          Hmm..We didn't find what you are looking for
        </p>
        <Link to='/'>Go back to Login</Link>
      </div>
      <div class="card-footer text-muted">Team Easy Photos</div>
    </div>
    )
}