import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const ProtectedRoute = ({element: Element}) => {
    const jwtToken = Cookies.get('jwt_token')
    if(jwtToken === undefined) {
        return <Navigate to ='/login' />
    }
    return (
        <Element />
    )
}

export default ProtectedRoute