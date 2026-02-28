import { useEffect, useState, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../../services/authService';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
    children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const isAuth = await authService.isAuthenticated();
                if (!isAuth) {
                    navigate('/', { replace: true, state: { from: location } });
                } else {
                    setIsAuthenticated(true);
                }
            } catch (error) {
                navigate('/', { replace: true });
            } finally {
                setIsCheckingAuth(false);
            }
        };
        checkAuth();
    }, [navigate, location]);

    if (isCheckingAuth) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-100">
                <Loader2 className="w-8 h-8 animate-spin text-[#2E7BA6]" />
            </div>
        );
    }

    return isAuthenticated ? <>{children}</> : null;
}
