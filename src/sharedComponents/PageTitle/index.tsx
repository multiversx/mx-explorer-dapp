import React, { useEffect } from 'react';

const withPageTitle = (title: string, Component: React.ComponentType) =>
    () => {
        useEffect(() => {
            document.title = title}, []
        );
        return <Component />;
    };

export default withPageTitle;