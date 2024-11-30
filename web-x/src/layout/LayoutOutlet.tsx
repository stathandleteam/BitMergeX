import React, { Suspense } from 'react'
import {  Outlet } from 'react-router-dom';
// import { Spinner } from '../imageloader/ImageLoader';
import ErrorBoundary from '../error/ErrorBoundary';

const LayoutOutlet = ({children = null}: {children?: React.ReactNode}) => {
  
  return (
    <Suspense fallback={
      children
    }>
      <ErrorBoundary reloadOnReset>
        <Outlet />
      </ErrorBoundary>
    </Suspense>
  )
}

export default LayoutOutlet;