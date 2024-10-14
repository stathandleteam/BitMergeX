import React from 'react';
import { Link as ReactRouterLink, LinkProps as ReactRouterLinkProps } from 'react-router-dom';

interface PrefetchLinkProps extends ReactRouterLinkProps {
  prefetch?: boolean;
  reloadDocument?: boolean;
}

const PrefetchLink: React.FC<PrefetchLinkProps> = ({ to, prefetch = true, reloadDocument = true, children, ...rest }) => {
  const handleMouseOver = () => {
    if (prefetch) {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = to as string;
      document.head.appendChild(link);
    }
  };

  return (
    <ReactRouterLink reloadDocument = {reloadDocument} to={to} onMouseOver={handleMouseOver}  {...rest}>
      {children}
    </ReactRouterLink>
  );
};

export default PrefetchLink;