import React from 'react';

const SuspenseLoader = ({minHeight}) => {
    return (
        <div style={{minHeight:`${minHeight}px`}} className={`flex items-center justify-center`}>
            <span className="inline-block w-10 h-10 m-auto align-middle border-4 rounded-full animate-spin border-primary border-l-transparent"></span>
        </div>
    );
};

export default SuspenseLoader;
