import React, { Component } from "react";
import TopNavigation from "./TopNavigation";
import $ from "jquery";
export class Dashboard extends Component {
  hiddenFileInput = React.createRef();
  constructor(){
    super()
    this.signOut = this.signOut.bind(this)
  }
  state = {
    uploadedFiles:[],
  };
  handleFileUpload = (evt) => {
    var uploadedFiles = this.state.uploadedFiles
    for (let index = 0; index < evt.target.files.length; index++) {
      uploadedFiles.push(evt.target.files[index].name);
    }
    this.setState({ uploadedFiles: uploadedFiles });
  };
  removeFile = (file) => {
      const deleteIndex = this.state.uploadedFiles.indexOf(file)
      this.state.uploadedFiles.splice(deleteIndex,1)
      this.setState({uploadedFiles:this.state.uploadedFiles})
  }
  signOut(){
    this.props.history.replace('/')
  }
  render() {
    return (
      <section>
        <TopNavigation items={2} signOut={this.signOut}/>
        <div className="container row">
          <div class="card col-3 m-3">
            <div class="card-body">
              <h5 class="card-title">Notifications</h5>
              <p class="card-text">Your Order is ready collect them</p>
              <button className="btn btn-info">View invoice</button>
              <p class="card-text">
                <small class="text-muted">Last updated 3 mins ago</small>
              </p>
            </div>
          </div>
          <div className="col-6 m-3">
            <div className="card row" >
                <div className="card-body col">
                    <h5 class="card-title">Create an Order</h5>
                    <p class="card-text">Create and order</p>
                    <input
                    ref={this.hiddenFileInput}
                    type="file"
                    onChange={this.handleFileUpload}
                    hidden={true}
                    multiple={true}
                    />
                    <button
                    className="btn btn-info"
                    onClick={() => {
                        this.hiddenFileInput.current.click();
                    }}
                    >
                    Upload photos
                    </button>
                </div>    
                <div className="card-body col">
                    <ul class="list-group list-group-flush">
                        {this.state.uploadedFiles.slice(0,3).map(file=>
                            <li class="list-group-item">
                                <span >{file}</span><button className="btn btn-outline-danger float-right" onClick={()=>this.removeFile(file)}>Remove</button>
                            </li>
                        )}
                    </ul>
                </div>    
            </div>
        </div>
          </div>
      </section>
    );
  }
}
