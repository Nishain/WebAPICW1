import { Component } from "react";
import TopNavigation from "./TopNavigation";
export class Dashboard extends Component {
  render() {
    return (
      <section>
        <TopNavigation items={2} />
        <div className="container row">
            <div class="card col-3 m-3">
              <div class="card-body">
                <h5 class="card-title">Notifications</h5>
                <p class="card-text">
                  Your Order is ready collect them
                </p>
                <button className="btn btn-info">View invoice</button>
                <p class="card-text">
                  <small class="text-muted">Last updated 3 mins ago</small>
                </p>
              </div>
            </div>
            <div class="card col-3 m-3">
              <div class="card-body">
                <h5 class="card-title">Create an Order</h5>
                <p class="card-text">
                  Create and order
                </p>
                <button className="btn btn-info">Upload images</button>
              </div>
            </div>
        </div>
      </section>
    );
  }
}
