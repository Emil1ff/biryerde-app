import { AuthContext } from '../provider/AuthProvider';
import { useContext } from 'react';

export const useAuth = () => useContext(AuthContext);
