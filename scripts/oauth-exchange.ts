/**
 * OAuth Token Exchange Helper
 *
 * Usage:
 *   tsx scripts/oauth-exchange.ts --code=<code> --client-id=<id> --client-secret=<secret> --redirect-uri=<uri>
 *
 * Or set env vars and run:
 *   GHL_OAUTH_CODE=xxx GHL_CLIENT_ID=xxx GHL_CLIENT_SECRET=xxx GHL_OAUTH_REDIRECT_URI=xxx tsx scripts/oauth-exchange.ts
 */

import axios from 'axios';

function getArg(name: string): string | undefined {
  const flag = process.argv.find((arg) => arg.startsWith(`--${name}=`));
  if (flag) return flag.split('=')[1];
  return process.env[`GHL_${name.toUpperCase().replace(/-/g, '_')}`];
}

async function exchangeCode() {
  const code = getArg('code');
  const clientId = getArg('client-id') || process.env.GHL_CLIENT_ID;
  const clientSecret = getArg('client-secret') || process.env.GHL_CLIENT_SECRET;
  const redirectUri =
    getArg('redirect-uri') ||
    process.env.GHL_OAUTH_REDIRECT_URI ||
    'https://your-app.example.com/oauth/callback';

  if (!code || !clientId || !clientSecret) {
    console.error('Missing required parameters:');
    console.error('  --code=<authorization_code>');
    console.error('  --client-id=<client_id>');
    console.error('  --client-secret=<client_secret>');
    console.error('');
    console.error('Or set environment variables: GHL_OAUTH_CODE, GHL_CLIENT_ID, GHL_CLIENT_SECRET');
    process.exit(1);
  }

  const params = new URLSearchParams();
  params.append('client_id', clientId);
  params.append('client_secret', clientSecret);
  params.append('grant_type', 'authorization_code');
  params.append('code', code);
  params.append('redirect_uri', redirectUri);

  console.log('Exchanging authorization code for tokens...');

  try {
    const res = await axios.post('https://api.gohighlevel.com/oauth/token', params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    console.log('\n✅ Token exchange successful!\n');
    console.log('Add these to your .env file:\n');
    console.log(`GHL_ACCESS_TOKEN=${res.data.access_token}`);
    console.log(`GHL_REFRESH_TOKEN=${res.data.refresh_token}`);
    console.log(`# Token type: ${res.data.token_type}`);
    console.log(`# Expires in: ${res.data.expires_in} seconds`);

    if (res.data.locationId) {
      console.log(`# Location ID: ${res.data.locationId}`);
    }
  } catch (error: unknown) {
    console.error('\n❌ Token exchange failed:\n');
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: unknown } };
      if (axiosError.response?.data) {
        console.error(JSON.stringify(axiosError.response.data, null, 2));
      } else {
        console.error(String(error));
      }
    } else if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(String(error));
    }
    process.exit(1);
  }
}

exchangeCode();
