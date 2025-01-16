// components/LazyComponent.js
import React, { useState, useEffect } from 'react';

const LazyLoader = ({ importFunc, fallback = null }: any) => {
  const [Component, setComponent]:any = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const loadComponent = async () => {
      try {
        const module = await importFunc();
        if (mounted) {
          setComponent(() => module.default);
        }
      } catch (err:any) {
        if (mounted) {
          setError(err);
          console.error('Error loading component:', err);
        }
      }
    };

    loadComponent();

    return () => {
      mounted = false;
    };
  }, [importFunc]);

  if (error) {
    return <div>Error loading component!</div>;
  }

  if (!Component) {
    return fallback;
  }

  return <Component />;
};

export default LazyLoader;