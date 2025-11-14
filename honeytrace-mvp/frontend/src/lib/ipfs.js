import axios from 'axios';

// IPFS configuration
const PINATA_API_KEY = process.env.NEXT_PUBLIC_PINATA_API_KEY || '';
const PINATA_SECRET_KEY = process.env.NEXT_PUBLIC_PINATA_SECRET_KEY || '';
const PINATA_JWT = process.env.NEXT_PUBLIC_PINATA_JWT || '';

// IPFS gateways
const IPFS_GATEWAYS = [
  'https://ipfs.io/ipfs/',
  'https://gateway.pinata.cloud/ipfs/',
  'https://cloudflare-ipfs.com/ipfs/'
];

/**
 * Upload JSON metadata to IPFS via Pinata
 */
export const uploadMetadataToIPFS = async (metadata) => {
  try {
    if (!PINATA_JWT && !PINATA_API_KEY) {
      console.warn('IPFS upload disabled: No Pinata credentials configured');
      // Return mock hash for demo
      return {
        success: true,
        hash: `QmMock${Date.now()}`,
        url: `https://ipfs.io/ipfs/QmMock${Date.now()}`
      };
    }

    const url = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';
    
    const response = await axios.post(url, metadata, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${PINATA_JWT}`,
        'pinata_api_key': PINATA_API_KEY,
        'pinata_secret_api_key': PINATA_SECRET_KEY
      }
    });

    return {
      success: true,
      hash: response.data.IpfsHash,
      url: `${IPFS_GATEWAYS[0]}${response.data.IpfsHash}`
    };
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Upload file to IPFS via Pinata
 */
export const uploadFileToIPFS = async (file) => {
  try {
    if (!PINATA_JWT && !PINATA_API_KEY) {
      console.warn('IPFS upload disabled: No Pinata credentials configured');
      // Return mock hash for demo
      return {
        success: true,
        hash: `QmMockFile${Date.now()}`,
        url: `https://ipfs.io/ipfs/QmMockFile${Date.now()}`
      };
    }

    const formData = new FormData();
    formData.append('file', file);

    const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
    
    const response = await axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${PINATA_JWT}`,
        'pinata_api_key': PINATA_API_KEY,
        'pinata_secret_api_key': PINATA_SECRET_KEY
      }
    });

    return {
      success: true,
      hash: response.data.IpfsHash,
      url: `${IPFS_GATEWAYS[0]}${response.data.IpfsHash}`
    };
  } catch (error) {
    console.error('Error uploading file to IPFS:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Retrieve data from IPFS
 */
export const fetchFromIPFS = async (ipfsHash) => {
  // Try multiple gateways in case one is down
  for (const gateway of IPFS_GATEWAYS) {
    try {
      const url = `${gateway}${ipfsHash}`;
      const response = await axios.get(url, { timeout: 10000 });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.warn(`Failed to fetch from ${gateway}:`, error.message);
      continue;
    }
  }
  
  return {
    success: false,
    error: 'Failed to fetch from all IPFS gateways'
  };
};

/**
 * Create batch metadata object
 */
export const createBatchMetadata = (batchData, imageHashes = []) => {
  return {
    batchId: batchData.batchId,
    producer: batchData.producer || 'Unknown',
    geo: batchData.geo || { lat: null, lon: null },
    harvestDate: batchData.harvestDate,
    weightKg: batchData.weightKg,
    flowerType: batchData.flowerType || 'Mixed',
    organic: batchData.organic || false,
    notes: batchData.notes || '',
    images: imageHashes.map(hash => `ipfs://${hash}`),
    timestamp: new Date().toISOString(),
    version: '1.0'
  };
};

/**
 * Create event metadata object
 */
export const createEventMetadata = (eventData, imageHashes = []) => {
  return {
    batchId: eventData.batchId,
    eventType: eventData.eventType,
    actor: eventData.actor || 'Unknown',
    description: eventData.description,
    images: imageHashes.map(hash => `ipfs://${hash}`),
    timestamp: new Date().toISOString(),
    location: eventData.location || null,
    additionalData: eventData.additionalData || {},
    version: '1.0'
  };
};

/**
 * Upload batch with images to IPFS
 */
export const uploadBatchWithImages = async (batchData, imageFiles = []) => {
  try {
    // Upload images first
    const imageHashes = [];
    for (const file of imageFiles) {
      const result = await uploadFileToIPFS(file);
      if (result.success) {
        imageHashes.push(result.hash);
      }
    }

    // Create and upload metadata
    const metadata = createBatchMetadata(batchData, imageHashes);
    const metadataResult = await uploadMetadataToIPFS(metadata);

    if (!metadataResult.success) {
      return metadataResult;
    }

    return {
      success: true,
      metadataHash: metadataResult.hash,
      metadataUrl: metadataResult.url,
      imageHashes,
      metadata
    };
  } catch (error) {
    console.error('Error uploading batch:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Upload event with images to IPFS
 */
export const uploadEventWithImages = async (eventData, imageFiles = []) => {
  try {
    // Upload images first
    const imageHashes = [];
    for (const file of imageFiles) {
      const result = await uploadFileToIPFS(file);
      if (result.success) {
        imageHashes.push(result.hash);
      }
    }

    // Create and upload metadata
    const metadata = createEventMetadata(eventData, imageHashes);
    const metadataResult = await uploadMetadataToIPFS(metadata);

    if (!metadataResult.success) {
      return metadataResult;
    }

    return {
      success: true,
      metadataHash: metadataResult.hash,
      metadataUrl: metadataResult.url,
      imageHashes,
      metadata
    };
  } catch (error) {
    console.error('Error uploading event:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Get IPFS URL for display
 */
export const getIPFSUrl = (ipfsHash, gatewayIndex = 0) => {
  if (!ipfsHash) return '';
  
  // Remove ipfs:// prefix if present
  const hash = ipfsHash.replace('ipfs://', '');
  
  return `${IPFS_GATEWAYS[gatewayIndex]}${hash}`;
};

/**
 * Validate IPFS hash format
 */
export const isValidIPFSHash = (hash) => {
  // Basic validation for CIDv0 (Qm...) and CIDv1 (bafy...)
  return /^(Qm[1-9A-HJ-NP-Za-km-z]{44}|bafy[0-9a-z]{50,})$/.test(hash);
};
