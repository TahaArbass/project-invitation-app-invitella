import React from "react";
import { Card, CardContent, Typography, Link } from "@mui/material";

const ContactUs = ({ email = "example@support.com", phone = "+123456789" }) => {
    return (
        <Card variant="outlined" sx={{ padding: 1 }}>
            <CardContent>
                <Typography variant="h5" component="div" gutterBottom>
                    Contact Us
                </Typography>
                <Typography variant="body1" gutterBottom>
                    To activate your account in case it is deactivated, for any queries or concerns, please contact us at:
                </Typography>
                {email && (
                    <Typography variant="body1" color={'InfoText'} gutterBottom>
                        Email:
                        <Link href={`mailto:${email}`} sx={{ ml: 1 }}>
                            {email}
                        </Link>
                    </Typography>
                )}
                {phone && (
                    <Typography variant="body1" gutterBottom>
                        Phone:
                        <Link href={`tel:${phone}`} sx={{ ml: 1 }}>
                            {phone}
                        </Link>
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
};

export default ContactUs;
