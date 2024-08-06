// OwnerProjects.jsx
import React from 'react';
import ProjectDetails from './ProjectDetails'; // Displays project details
import { useProject } from './OwnerContainer';

const OwnerProjects = () => {
    const { selectedProject } = useProject();

    return (
        <>
            {selectedProject && (
                <ProjectDetails />
            )}
        </>
    );
};

export default OwnerProjects;
