export default function BottomSecondaryButton(props){
    return(
        <div className="form-group">
            <button
              onClick={props.swapFunctionality}
              type="submit"
              className="form-control btn btn-secondary rounded submit px-3"
            >
              {props.isLogin ? "Sign me in now" : "Back to login"}
            </button>
          </div>
    )
}