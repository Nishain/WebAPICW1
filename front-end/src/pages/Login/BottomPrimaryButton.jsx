 export function BottomButton(props){
    return <div className="form-group" >
    <div
      class="alert alert-danger"
      hidden={!props.errorMessage}
      role="alert"
    >
      {props.errorMessage}
    </div>
    <button
      type="button"
      className="form-control btn btn-secondary rounded submit px-3"
      onClick={props.tapLoginOrRegisterBtn}
    >
      {props.buttonLabel}
    </button>
  </div>
}