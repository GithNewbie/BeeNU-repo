import QRCode from 'qrcode';

/**
 * Generate QR code as data URL
 */
export const generateQRCode = async (batchId, baseUrl = 'https://honeytrace.example.com') => {
  try {
    const url = `${baseUrl}/batch/${batchId}`;
    
    const qrCodeDataUrl = await QRCode.toDataURL(url, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      quality: 0.95,
      margin: 2,
      color: {
        dark: '#713f12',  // honey-900
        light: '#fef9c3'  // honey-100
      },
      width: 400
    });

    return {
      success: true,
      dataUrl: qrCodeDataUrl,
      url
    };
  } catch (error) {
    console.error('Error generating QR code:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Generate QR code as SVG string
 */
export const generateQRCodeSVG = async (batchId, baseUrl = 'https://honeytrace.example.com') => {
  try {
    const url = `${baseUrl}/batch/${batchId}`;
    
    const qrCodeSVG = await QRCode.toString(url, {
      errorCorrectionLevel: 'H',
      type: 'svg',
      color: {
        dark: '#713f12',
        light: '#fef9c3'
      }
    });

    return {
      success: true,
      svg: qrCodeSVG,
      url
    };
  } catch (error) {
    console.error('Error generating QR code SVG:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Download QR code as PNG file
 */
export const downloadQRCode = async (batchId, baseUrl = 'https://honeytrace.example.com') => {
  try {
    const result = await generateQRCode(batchId, baseUrl);
    
    if (!result.success) {
      throw new Error(result.error);
    }

    // Create download link
    const link = document.createElement('a');
    link.href = result.dataUrl;
    link.download = `honeytrace-${batchId}-qr.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return { success: true };
  } catch (error) {
    console.error('Error downloading QR code:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Generate printable QR code label (HTML)
 */
export const generatePrintableLabel = async (batchId, productInfo = {}) => {
  const qrResult = await generateQRCode(batchId);
  
  if (!qrResult.success) {
    return qrResult;
  }

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>BeeNU - ${batchId}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            background: #fef9c3;
          }
          .label {
            background: white;
            padding: 30px;
            border-radius: 15px;
            text-align: center;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            max-width: 400px;
          }
          .logo {
            font-size: 48px;
            margin-bottom: 10px;
          }
          .title {
            font-size: 24px;
            font-weight: bold;
            color: #713f12;
            margin-bottom: 10px;
          }
          .batch-id {
            font-size: 18px;
            color: #a16207;
            margin-bottom: 20px;
            font-weight: 600;
          }
          .qr-code {
            margin: 20px 0;
          }
          .qr-code img {
            width: 300px;
            height: 300px;
          }
          .instructions {
            font-size: 14px;
            color: #666;
            margin-top: 20px;
            line-height: 1.6;
          }
          .product-info {
            font-size: 12px;
            color: #888;
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid #eee;
          }
          @media print {
            body {
              background: white;
            }
            .label {
              box-shadow: none;
              page-break-inside: avoid;
            }
          }
        </style>
      </head>
      <body>
        <div class="label">
          <div class="logo">🍯</div>
          <div class="title">BeeNU</div>
          <div class="batch-id">Batch: ${batchId}</div>
          <div class="qr-code">
            <img src="${qrResult.dataUrl}" alt="QR Code" />
          </div>
          <div class="instructions">
            Scan this QR code with your smartphone<br/>
            to verify the authentic journey of your honey<br/>
            from hive to jar
          </div>
          ${productInfo.producer ? `
            <div class="product-info">
              Producer: ${productInfo.producer}<br/>
              ${productInfo.harvestDate ? `Harvest: ${productInfo.harvestDate}<br/>` : ''}
              ${productInfo.flowerType ? `Type: ${productInfo.flowerType}` : ''}
            </div>
          ` : ''}
        </div>
      </body>
    </html>
  `;

  return {
    success: true,
    html,
    dataUrl: qrResult.dataUrl
  };
};

/**
 * Open printable label in new window
 */
export const printLabel = async (batchId, productInfo = {}) => {
  const result = await generatePrintableLabel(batchId, productInfo);
  
  if (!result.success) {
    return result;
  }

  const printWindow = window.open('', '_blank');
  printWindow.document.write(result.html);
  printWindow.document.close();
  
  // Wait for content to load, then trigger print dialog
  printWindow.onload = () => {
    printWindow.print();
  };

  return { success: true };
};
