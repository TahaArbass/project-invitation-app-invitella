import React, { useEffect, useState } from 'react';
import InvitationPagesGrid from './InviationPagesGrid';
import InvitationCreator from './InvitationCreator';
import api from '../utils/api';
import { useProject } from './OwnerContainer';

const ManageInvitation = () => {
    const [pages, setPages] = useState([]);
    const [selectedPageIndex, setSelectedPageIndex] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const { selectedProject } = useProject();

    useEffect(() => {
        if (selectedProject.id) {
            api.get('/api/pages/project/' + selectedProject.id)
                .then((response) => {
                    setPages(response.data);
                })
                .catch((error) => {
                    console.error('Failed to fetch pages:', error);
                });
        }
    }, [selectedProject.id]);

    const handleEditPage = (index) => {
        setSelectedPageIndex(index);
        setIsEditing(true);
    };

    const handleDeletePage = (index) => {
        const updatedPages = pages.filter((_, i) => i !== index);
        setPages(updatedPages);
        // Optionally send delete request to the server here
    };

    const handleAddPage = () => {
        setSelectedPageIndex(null);
        setIsEditing(true);
    };

    const handleSavePage = (newPage) => {
        if (selectedPageIndex !== null) {
            const updatedPages = pages.map((page, i) =>
                i === selectedPageIndex ? newPage : page
            );
            setPages(updatedPages);
        } else {
            setPages([...pages, newPage]);
        }
        setIsEditing(false);
    };

    return (
        <div>
            {isEditing ? (
                <InvitationCreator
                    page={selectedPageIndex !== null ? pages[selectedPageIndex] : null}
                    onSave={handleSavePage}
                    onCancel={() => setIsEditing(false)}
                />
            ) : (
                <InvitationPagesGrid
                    pages={pages}
                    onEdit={handleEditPage}
                    onDelete={handleDeletePage}
                    onAdd={handleAddPage}
                />
            )}
        </div>
    );
};

export default ManageInvitation;
