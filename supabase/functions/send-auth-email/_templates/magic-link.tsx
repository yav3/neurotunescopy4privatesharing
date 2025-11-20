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

interface MagicLinkEmailProps {
  magicLink: string;
  recipientName: string;
}

export const MagicLinkEmail = ({ magicLink, recipientName }: MagicLinkEmailProps) => (
  <Html>
    <Head />
    <Preview>Your VIP access link to NeuroTunes</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Your VIP Access Link 🌟</Heading>
        <Text style={text}>Hi {recipientName},</Text>
        <Text style={text}>
          You've been granted VIP access to NeuroTunes! Click the link below to sign in:
        </Text>
        <Link
          href={magicLink}
          target="_blank"
          style={{
            ...link,
            display: 'block',
            marginBottom: '16px',
          }}
        >
          Access NeuroTunes VIP
        </Link>
        <Text style={{ ...text, marginTop: '14px' }}>
          This link will expire in 24 hours.
        </Text>
        <Text style={{ ...text, color: '#ababab', marginTop: '14px', marginBottom: '16px' }}>
          If you didn't expect this email, you can safely ignore it.
        </Text>
        <Text style={footer}>
          NeuroTunes - Music for Your Mind
        </Text>
      </Container>
    </Body>
  </Html>
);

export default MagicLinkEmail;

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

const link = {
  color: '#2754C5',
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: '14px',
  textDecoration: 'underline',
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
