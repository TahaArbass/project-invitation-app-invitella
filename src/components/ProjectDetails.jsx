import React from 'react';
import { Typography, Tabs, Tab, Box } from '@mui/material';
import InvitationCreator from './InvitationCreator';
import Guests from './GuestsComponent';
import UploadedMedia from './UploadedMedia';
import { Email, People, PhotoLibrary, Info } from '@mui/icons-material';

const ProjectDetails = ({ project }) => {
    const [tabIndex, setTabIndex] = React.useState(0);

    const handleChange = (event, newValue) => {
        setTabIndex(newValue);
    };

    return (
        <div>
            <Typography variant="h4" align="center" gutterBottom sx={{ mt: 2 }}>
                Project: {project.title}
            </Typography>
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
                <Typography variant="body1" align="center" gutterBottom sx={{ mt: 2 }}>
                    "here goes the project details"
                </Typography>
            </TabPanel>
        </div>
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
