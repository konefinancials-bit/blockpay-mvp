import { NextRequest, NextResponse } from 'next/server';

// Google Wallet Pass (Generic Pass) generator
// Requires Google Pay & Wallet API credentials (service account)
// https://developers.google.com/wallet/generic

export async function POST(req: NextRequest) {
  try {
    const { merchantId, businessName, paymentUrl, plan } = await req.json();

    const issuerId = process.env.GOOGLE_WALLET_ISSUER_ID ?? '';
    const classId = `${issuerId}.blockpay_merchant`;
    const objectId = `${issuerId}.merchant_${merchantId}`;

    // Generic Pass object
    const genericObject = {
      id: objectId,
      classId,
      genericType: 'GENERIC_TYPE_UNSPECIFIED',
      hexBackgroundColor: '#0a071a',
      logo: {
        sourceUri: { uri: `${process.env.NEXT_PUBLIC_APP_URL}/logo.png` },
        contentDescription: { defaultValue: { language: 'en-US', value: 'BlockPay' } },
      },
      cardTitle: {
        defaultValue: { language: 'en-US', value: 'BlockPay Merchant' },
      },
      subheader: {
        defaultValue: { language: 'en-US', value: 'Crypto Payments' },
      },
      header: {
        defaultValue: { language: 'en-US', value: businessName },
      },
      barcode: {
        type: 'QR_CODE',
        value: paymentUrl,
        alternateText: paymentUrl,
      },
      textModulesData: [
        {
          id: 'plan',
          header: 'PLAN',
          body: plan.toUpperCase(),
        },
        {
          id: 'powered',
          header: 'POWERED BY',
          body: 'BlockPay',
        },
      ],
      linksModuleData: {
        uris: [
          {
            uri: paymentUrl,
            description: 'Open Payment Page',
            id: 'payment_link',
          },
          {
            uri: 'https://blockpay.live',
            description: 'BlockPay Website',
            id: 'website',
          },
        ],
      },
      validTimeInterval: {
        start: { date: new Date().toISOString() },
      },
    };

    // JWT payload for "Add to Google Wallet" button
    const jwtPayload = {
      iss: process.env.GOOGLE_WALLET_SERVICE_ACCOUNT_EMAIL ?? '',
      aud: 'google',
      origins: [process.env.NEXT_PUBLIC_APP_URL ?? 'https://blockpay.live'],
      typ: 'savetowallet',
      payload: {
        genericObjects: [genericObject],
      },
    };

    // In production: sign this JWT with your Google service account private key
    // const jwt = sign(jwtPayload, privateKey, { algorithm: 'RS256' });
    // Return: `https://pay.google.com/gp/v/save/${jwt}`

    return NextResponse.json({
      genericObject,
      jwtPayload,
      addToWalletUrl: null, // Set once GOOGLE_WALLET_SERVICE_ACCOUNT is configured
      instructions: [
        'Enable Google Wallet API in Google Cloud Console',
        'Create a service account and download the JSON key',
        'Set GOOGLE_WALLET_ISSUER_ID and GOOGLE_WALLET_SERVICE_ACCOUNT_EMAIL env vars',
        'Sign the JWT payload with the service account private key',
        'Redirect to https://pay.google.com/gp/v/save/{signedJwt}',
      ],
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
