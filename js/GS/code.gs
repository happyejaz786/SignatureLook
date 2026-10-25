/**
 * Signature Look - Google Sheets JSON API Endpoint
 * Reads active products from the first sheet and returns JSON
 */
function doGet(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    const data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      return createJsonResponse({ status: 'success', data: [] });
    }

    const headers = data[0].map(h => String(h).trim());
    const products = [];

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const productObj = {};

      headers.forEach((header, index) => {
        let val = row[index];

        // Format specific field types
        if (header === 'price' || header === 'comparePrice') {
          val = val ? Number(val) : 0;
        } else if (header === 'sizes') {
          val = val ? String(val).split(',').map(s => s.trim()) : ['Free Size'];
        } else {
          val = val !== undefined ? String(val).trim() : '';
        }

        productObj[header] = val;
      });

      // Filter: Sirf active status wale products return karein
      if (!productObj.status || productObj.status.toLowerCase() === 'active') {
        products.push(productObj);
      }
    }

    return createJsonResponse({
      status: 'success',
      total: products.length,
      data: products
    });

  } catch (error) {
    return createJsonResponse({
      status: 'error',
      message: error.toString()
    });
  }
}

function createJsonResponse(output) {
  return ContentService.createTextOutput(JSON.stringify(output))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Signature Look - Admin Panel Product Append API
 * Receives JSON payload and appends a new product row to Google Sheets
 */
function doPost(e) {
  try {
    const postData = JSON.parse(e.postData.contents);

    // 1. Agar customer registration ki request hai
    if (postData.action === 'register_customer') {
      const regResult = handleCustomerRegistration(postData);
      return createJsonResponse(regResult);
    }

    // Headers order: id, title, category, price, comparePrice, sizes, primaryImage, secondaryImage, badge, status
    const newId = postData.id || ('prod-' + Utilities.formatDate(new Date(), 'GMT+5:30', 'yyyyMMdd-HHmmss'));
    const title = postData.title || '';
    const category = postData.category || 'suit-sets';
    const price = postData.price ? Number(postData.price) : 0;
    const comparePrice = postData.comparePrice ? Number(postData.comparePrice) : 0;
    const sizes = Array.isArray(postData.sizes) ? postData.sizes.join(',') : (postData.sizes || 'Free Size');
    const primaryImage = postData.primaryImage || '';
    const secondaryImage = postData.secondaryImage || primaryImage;
    const badge = postData.badge || '';
    const status = postData.status || 'active';

    // Sheet me agle blank row me insert karein
    sheet.appendRow([
      newId,
      title,
      category,
      price,
      comparePrice,
      sizes,
      primaryImage,
      secondaryImage,
      badge,
      status
    ]);

    return createJsonResponse({
      status: 'success',
      message: 'Product published successfully to Google Sheet',
      productId: newId
    });

  } catch (err) {
    return createJsonResponse({
      status: 'error',
      message: err.toString()
    });
  }
}