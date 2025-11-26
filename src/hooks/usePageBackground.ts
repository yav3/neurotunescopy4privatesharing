import { useLocation } from 'react-router-dom';
import { pageBackgrounds } from '@/config/pageBackgrounds';

export const usePageBackground = () => {
  const location = useLocation();
  const path = location.pathname;
  
  const background = pageBackgrounds[path] || pageBackgrounds['default'];
  
  return background;
};
