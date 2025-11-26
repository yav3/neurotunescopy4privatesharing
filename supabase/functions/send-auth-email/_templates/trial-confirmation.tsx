import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';

interface TrialConfirmationEmailProps {
  displayName: string;
  email: string;
}

export const TrialConfirmationEmail = ({ displayName, email }: TrialConfirmationEmailProps) => (
  <Html>
    <Head />
    <Preview>Your NeuroTunes Free Business Trial is Confirmed</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Free Business Trial Confirmed! 🎵</Heading>
        <Text style={text}>Hi {displayName},</Text>
        <Text style={text}>
          Thank you for requesting a free 30-day business trial of NeuroTunes. We're excited to help your team discover the benefits of therapeutic music!
        </Text>
        
        <Section style={benefitsBox}>
          <Heading style={h2}>What's Included in Your Trial:</Heading>
          <Text style={listItem}>✓ Sample of full music library</Text>
          <Text style={listItem}>✓ Web app for office use</Text>
          <Text style={listItem}>✓ One end-user web app experience</Text>
          <Text style={listItem}>✓ 30-day full access</Text>
        </Section>

        <Text style={text}>
          Our team will contact you shortly at <strong>{email}</strong> to set up your trial and answer any questions you may have.
        </Text>
        
        <Text style={text}>
          <strong>After your trial expires,</strong> you can redeem a 10% discount code for full SaaS access including web app, iOS, Android, and admin controller with access to our complete therapeutic suite.
        </Text>

        <Text style={footer}>
          NeuroTunes - Music for Your Mind<br />
          © 2025 Neuralpositive, all rights reserved
        </Text>
      </Container>
    </Body>
  </Html>
);

export default TrialConfirmationEmail;

const main = {
  backgroundColor: '#050607',
  padding: '20px',
};

const container = {
  backgroundColor: '#ffffff',
  paddingLeft: '12px',
  paddingRight: '12px',
  margin: '0 auto',
  borderRadius: '8px',
};

const h1 = {
  color: '#0a0a0c',
  fontFamily: "SF Pro Display, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  fontSize: '28px',
  fontWeight: '400',
  margin: '40px 0 20px 0',
  padding: '0',
};

const h2 = {
  color: '#0a0a0c',
  fontFamily: "SF Pro Display, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  fontSize: '18px',
  fontWeight: '400',
  margin: '0 0 16px 0',
};

const text = {
  color: '#0a0a0c',
  fontFamily: "SF Pro Display, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  fontSize: '16px',
  fontWeight: '400',
  lineHeight: '24px',
  margin: '16px 0',
};

const benefitsBox = {
  backgroundColor: '#f5f5f5',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 0',
};

const listItem = {
  color: '#0a0a0c',
  fontFamily: "SF Pro Display, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  fontSize: '16px',
  fontWeight: '400',
  lineHeight: '28px',
  margin: '4px 0',
};

const footer = {
  color: '#898989',
  fontFamily: "SF Pro Display, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  fontSize: '14px',
  fontWeight: '400',
  lineHeight: '22px',
  marginTop: '32px',
  marginBottom: '24px',
  paddingTop: '24px',
  borderTop: '1px solid #e5e5e5',
};
