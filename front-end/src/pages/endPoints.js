export const Admin = {
    dashboard : '/Admin/AdminDashboard/',
    userProfile  : '/Admin/UserProfile/',
    orders : '/Admin/Orders/',
    courierService : '/Admin/CourierService/',
    transaction : '/Admin/Transaction/',
    category : '/Admin/Category/'
}
export default class EndPoints{
    static dashboard = '/Dashboard'
    static admin = Admin
    static productsView = '/ProductView'
    static forgetPassword = "/forgetPassword/:code"
}