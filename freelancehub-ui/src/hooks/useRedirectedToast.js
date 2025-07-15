import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const useRedirectedToast = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const toastMessage = location.state?.toastMessage;
    const toastType = location.state?.toastType || "info";

    useEffect(() => {
        if (toastMessage && toast[toastType]) {
            toast[toastType](toastMessage, {
                position: "top-right",
                autoClose: 3000,
                pauseOnHover: true,
                draggable: true,
            });

            // Clear the navigation state so the toast doesn't repeat
            navigate(location.pathname, { replace: true });
        }
    }, [toastMessage, toastType, navigate, location.pathname]);
};

export default useRedirectedToast;
