import React, { useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import InvitationCreator from './InvitationCreator';
import Guests from './GuestsComponent';
import UploadedMedia from './UploadedMedia';
import ProjectDetailsTab from './ProjectDetailsTab';
import { Email, People, PhotoLibrary, Info } from '@mui/icons-material';

const ProjectDetails = () => {
    const [tabIndex, setTabIndex] = useState(0);
    // const { selectedProject } = useProject();

    const handleChange = (event, newValue) => {
        setTabIndex(newValue);
    };

    return (
        <>
            {/* <Typography variant="h3" align="center" gutterBottom sx={{ mt: 2, fontWeight: 'bold' }}>
                Project: {selectedProject.title}
            </Typography> */}
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Tabs
                    value={tabIndex}
                    onChange={handleChange}
                    variant="scrollable"
                    scrollButtons="auto"
                >
                    <Tab icon={<Email />} label="Invitation" />
                    <Tab icon={<People />} label="Guests" />
                    <Tab icon={<PhotoLibrary />} label="Uploaded Media" />
                    <Tab icon={<Info />} label="Details" />
                </Tabs>
            </Box>
            <TabPanel value={tabIndex} index={0}>
                <InvitationCreator />
            </TabPanel>
            <TabPanel value={tabIndex} index={1}>
                <Guests />
            </TabPanel>
            <TabPanel value={tabIndex} index={2}>
                <UploadedMedia />
            </TabPanel>
            <TabPanel value={tabIndex} index={3}>
                <ProjectDetailsTab />
            </TabPanel>
        </>
    );
};

function TabPanel(props) {
    const { children, value, index } = props;

    return (
        <div hidden={value !== index}>
            {value === index && (
                <Box>
                    {children}
                </Box>
            )}
        </div>
    );
}

export default ProjectDetails;
