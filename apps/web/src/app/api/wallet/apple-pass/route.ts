import { NextRequest, NextResponse } from 'next/server';

// Apple Wallet Pass generator
// Full PKPass generation requires an Apple Developer certificate.
// This endpoint returns the pass JSON structure and instructions.
// For production: use a library like `passkit-generator` with your cert.

export async function POST(req: NextRequest) {
  try {
    const { merchantId, businessName, paymentUrl, plan } = await req.json();

    // Pass JSON structure (PKPass format)
    const passJson = {
      formatVersion: 1,
      passTypeIdentifier: 'pass.live.blockpay.merchant',
      serialNumber: `bp-${merchantId}-${Date.now()}`,
      teamIdentifier: 'BLOCKPAY_TEAM_ID', // Replace with Apple Team ID
      organizationName: 'BlockPay',
      description: `${businessName} — BlockPay Merchant`,
      logoText: 'BlockPay',
      foregroundColor: 'rgb(255, 255, 255)',
      backgroundColor: 'rgb(10, 7, 26)',
      labelColor: 'rgb(167, 139, 250)',
      webServiceURL: `${process.env.NEXT_PUBLIC_APP_URL}/api/wallet`,
      authenticationToken: `bp${merchantId.replace(/-/g, '').slice(0, 16)}`,
      generic: {
        primaryFields: [
          {
            key: 'businessName',
            label: 'MERCHANT',
            value: businessName,
          },
        ],
        secondaryFields: [
          {
            key: 'plan',
            label: 'PLAN',
            value: plan.toUpperCase(),
          },
          {
            key: 'powered',
            label: 'POWERED BY',
            value: 'BlockPay',
          },
        ],
        auxiliaryFields: [
          {
            key: 'payUrl',
            label: 'PAYMENT URL',
            value: paymentUrl,
          },
        ],
        backFields: [
          {
            key: 'instructions',
            label: 'How to pay',
            value: `Tap this card or scan the QR code to open ${businessName}\'s crypto payment page. Choose your coin and pay instantly.`,
          },
          {
            key: 'website',
            label: 'Powered by',
            value: 'blockpay.live',
          },
        ],
      },
      barcode: {
        message: paymentUrl,
        format: 'PKBarcodeFormatQR',
        messageEncoding: 'iso-8859-1',
        altText: paymentUrl,
      },
      nfc: {
        message: paymentUrl,
        encryptionPublicKey: '', // Add for secure NFC tap
      },
    };

    return NextResponse.json({
      passJson,
      instructions: [
        'Install passkit-generator: npm install passkit-generator',
        'Add your Apple Developer certificates to /certs/',
        'Call PKPass.generate(passJson, signingInfo) to create the .pkpass file',
        'Serve with Content-Type: application/vnd.apple.pkpass',
      ],
      downloadReady: false, // Set to true once certificates are configured
      paymentUrl,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
