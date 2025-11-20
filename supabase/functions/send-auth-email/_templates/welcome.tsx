import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';

interface WelcomeEmailProps {
  displayName: string;
  email: string;
}

export const WelcomeEmail = ({ displayName, email }: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>Welcome to NeuroTunes</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Welcome to NeuroTunes! 🎵</Heading>
        <Text style={text}>Hi {displayName},</Text>
        <Text style={text}>
          Thank you for joining NeuroTunes. We're excited to have you on board!
        </Text>
        <Text style={text}>
          Your account has been successfully created with the email: <strong>{email}</strong>
        </Text>
        <Text style={text}>
          Start exploring our therapeutic music collection designed to enhance your well-being.
        </Text>
        <Text style={footer}>
          NeuroTunes - Music for Your Mind
        </Text>
      </Container>
    </Body>
  </Html>
);

export default WelcomeEmail;

const main = {
  backgroundColor: '#ffffff',
};

const container = {
  paddingLeft: '12px',
  paddingRight: '12px',
  margin: '0 auto',
};

const h1 = {
  color: '#333',
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
};

const text = {
  color: '#333',
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: '14px',
  margin: '24px 0',
};

const footer = {
  color: '#898989',
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: '12px',
  lineHeight: '22px',
  marginTop: '12px',
  marginBottom: '24px',
};
