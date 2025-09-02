import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';

export const useCloseModalOnRouteChange = () => {

  const location = useLocation();

  const closeModal = useAppStore(state => state.closeModal);
  
  useEffect(() => {
    closeModal();
  }, [location.pathname, closeModal]);
  
}; 