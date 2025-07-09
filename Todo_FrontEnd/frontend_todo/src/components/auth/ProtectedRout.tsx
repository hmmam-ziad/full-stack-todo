import { Navigate } from "react-router-dom";

interface Iprops {
    isAllowed: boolean;
    redirectPath: string;
    children: React.ReactNode;
    data?: unknown;
}

const ProtectedRoute = ({isAllowed, redirectPath, children, data}: Iprops) => {
    if(!isAllowed) {
        return <Navigate to={redirectPath} state={data}/>;
    }

    return children;
}

export default ProtectedRoute