import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to therapeutic goals page
    navigate('/goals');
  }, [navigate]);

  return null;
};

export default Index;