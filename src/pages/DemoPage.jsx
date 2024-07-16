import React, { useState } from 'react';
import { Container } from '@mui/material';
import TextInputForm from '../components/TextInputForm';
import DisplayComponent from '../components/DisplayComponent';

const DemoPage = () => {
    const [jsonObject, setJsonObject] = useState(null);

    const handleGenerateJSON = (json) => {
        setJsonObject(json);
    };

    return (
        <Container>
            <TextInputForm onGenerateJSON={handleGenerateJSON} />
            {jsonObject && <DisplayComponent jsonObject={jsonObject} />}
        </Container>
    );
};

export default DemoPage;
