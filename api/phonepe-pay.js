const crypto = require('crypto');

module.exports = async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const { txnId, amount, merchantId, saltKey, saltIndex = '1', environment = 'Production', callbackUrl } = req.body || {};

    if (!merchantId || !saltKey) {
      return res.status(400).json({ success: false, error: 'Merchant ID and Salt Key are required in Admin Settings.' });
    }

    const payload = {
      merchantId: merchantId.trim(),
      merchantTransactionId: txnId,
      merchantUserId: 'CUB_' + Date.now(),
      amount: Math.round(parseFloat(amount) * 100), // Amount in paise
      redirectUrl: callbackUrl,
      redirectMode: 'REDIRECT',
      callbackUrl: callbackUrl,
      paymentInstrument: {
        type: 'PAY_PAGE'
      }
    };

    const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
    const apiPath = '/pg/v1/pay';
    const checksum = crypto.createHash('sha256').update(base64Payload + apiPath + saltKey.trim()).digest('hex') + '###' + saltIndex.trim();

    const host = environment === 'Production'
      ? 'https://api.phonepe.com/apis/hermes'
      : 'https://api-preprod.phonepe.com/apis/pg-sandbox';

    const response = await fetch(`${host}${apiPath}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': checksum
      },
      body: JSON.stringify({ request: base64Payload })
    });

    const data = await response.json();

    if (data.success && data.data && data.data.instrumentResponse && data.data.instrumentResponse.redirectInfo) {
      return res.status(200).json({
        success: true,
        redirectUrl: data.data.instrumentResponse.redirectInfo.url,
        data: data
      });
    } else {
      return res.status(400).json({
        success: false,
        message: data.message || 'PhonePe Gateway Initialization Failed',
        details: data
      });
    }
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
