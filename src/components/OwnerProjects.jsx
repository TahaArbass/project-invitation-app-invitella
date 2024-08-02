// OwnerProjects.jsx
import React, { useState, useEffect } from 'react';
import ProjectDetails from './ProjectDetails'; // Displays project details\

const OwnerProjects = ({ project }) => {
    const [selectedProject, setSelectedProject] = useState(null);

    useEffect(() => {
        setSelectedProject(project);
    }, [project]);

    return (
        <>
            {selectedProject && (
                <ProjectDetails project={selectedProject} />
            )}
        </>
    );
};

export default OwnerProjects;
