/**
 * Signature Look - Customer Registration & Authentication Engine
 * File: Customers.gs
 */

function handleCustomerRegistration(payload) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let customerSheet = ss.getSheetByName('Customers');

    // Agar Customers tab nahi bana hai to auto-create headers
    if (!customerSheet) {
      customerSheet = ss.insertSheet('Customers');
      customerSheet.appendRow([
        'customer_id',
        'full_name',
        'phone_number',
        'email',
        'password_hash',
        'delivery_address',
        'city',
        'pincode',
        'created_at'
      ]);
    }

    const data = customerSheet.getDataRange().getValues();
    const phoneInput = String(payload.phone || '').trim();
    const emailInput = String(payload.email || '').trim().toLowerCase();

    // Check duplicate phone number or email (Row 2 onwards)
    for (let i = 1; i < data.length; i++) {
      const existingPhone = String(data[i][2]).trim();
      const existingEmail = String(data[i][3]).trim().toLowerCase();

      if (phoneInput && existingPhone === phoneInput) {
        return {
          status: 'error',
          message: 'This mobile number is already registered. Please login.'
        };
      }
      if (emailInput && existingEmail === emailInput) {
        return {
          status: 'error',
          message: 'This email is already registered. Please login.'
        };
      }
    }

    // Generate Secure SHA-256 Password Hash (Never store plain password)
    const rawPassword = String(payload.password || '');
    const digest = Utilities.computeDigest(
      Utilities.DigestAlgorithm.SHA_256,
      rawPassword,
      Utilities.Charset.UTF_8
    );
    const passwordHash = digest.map(byte => {
      const v = (byte < 0 ? byte + 256 : byte).toString(16);
      return v.length === 1 ? '0' + v : v;
    }).join('');

    // Generate Unique Customer ID
    const newCustomerId = 'CUST-' + Utilities.formatDate(new Date(), 'GMT+5:30', 'yyyyMMdd-HHmmss');
    const createdAt = Utilities.formatDate(new Date(), 'GMT+5:30', 'yyyy-MM-dd HH:mm:ss');

    // Append to Customers Sheet
    customerSheet.appendRow([
      newCustomerId,
      payload.fullName || '',
      phoneInput,
      emailInput,
      passwordHash,
      payload.address || '',
      payload.city || '',
      payload.pincode || '',
      createdAt
    ]);

    return {
      status: 'success',
      message: 'Registration successful!',
      customer: {
        id: newCustomerId,
        fullName: payload.fullName || '',
        phone: phoneInput,
        email: emailInput,
        address: payload.address || '',
        city: payload.city || '',
        pincode: payload.pincode || ''
      }
    };

  } catch (err) {
    return {
      status: 'error',
      message: 'Server error: ' + err.toString()
    };
  }
}