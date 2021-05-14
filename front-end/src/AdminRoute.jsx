import { Route, Switch, BrowserRouter as Router } from "react-router-dom";
import Layout from "./pages/Admin/Shared/Layout/Layout";
import UserProfile from "./pages/Admin/UserProfile/UserProfile";
import Orders from "./pages/Admin/Orders/Orders";
import CourierService from "./pages/Admin/CourierService/CourierService";
import ViewCourierService from "./pages/Admin/CourierService/viewcourierservice";
import Transaction from "./pages/Admin/Transaction/Transaction";
import Category from "./pages/Admin/Category/Category";
import Dashboard from './pages/Admin/Dashboard/Dashboard'
import endPoints from './pages/endPoints'
import Cart from "./pages/Cart/Cart";
import Invoice from "./pages/Invoice/Invoice";
export const AdminRoute = (props)=>{
    return (
        <>
        <Layout/>
        <Switch>
          <Route exact path={endPoints.admin.dashboard} component={Dashboard} />
          <Route exact path={endPoints.admin.userProfile} component={UserProfile} />
          <Route exact path={endPoints.admin.orders} component={Orders} />
          <Route exact path={endPoints.admin.courierService} component={CourierService} />
          <Route exact path="/Admin/viewcourierservice" component={ViewCourierService} />
          <Route exact path={endPoints.admin.transaction} component={Transaction} />
          <Route exact path={endPoints.admin.category} component={Category} />
        </Switch>
        </>
    )
}