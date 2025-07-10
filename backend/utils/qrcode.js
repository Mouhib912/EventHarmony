const QRCode = require('qrcode');

/**
 * Generate QR code as data URL
 * @param {string} data - Data to encode in QR code
 * @param {Object} options - QR code options
 * @returns {Promise<string>} - QR code data URL
 */
exports.generateQRCodeDataURL = async (data, options = {}) => {
  const defaultOptions = {
    errorCorrectionLevel: 'H',
    type: 'image/png',
    margin: 1,
    color: {
      dark: '#000000',
      light: '#ffffff'
    }
  };

  const qrOptions = { ...defaultOptions, ...options };
  return await QRCode.toDataURL(data, qrOptions);
};

/**
 * Generate QR code as buffer
 * @param {string} data - Data to encode in QR code
 * @param {Object} options - QR code options
 * @returns {Promise<Buffer>} - QR code buffer
 */
exports.generateQRCodeBuffer = async (data, options = {}) => {
  const defaultOptions = {
    errorCorrectionLevel: 'H',
    type: 'png',
    margin: 1,
    color: {
      dark: '#000000',
      light: '#ffffff'
    }
  };

  const qrOptions = { ...defaultOptions, ...options };
  return await QRCode.toBuffer(data, qrOptions);
};

/**
 * Generate QR code for participant badge
 * @param {Object} participant - Participant data
 * @param {string} eventId - Event ID
 * @returns {Promise<string>} - QR code data URL
 */
exports.generateParticipantQRCode = async (participant, eventId) => {
  const data = JSON.stringify({
    participantId: participant._id,
    userId: participant.user._id,
    eventId,
    timestamp: Date.now()
  });

  return await exports.generateQRCodeDataURL(data, {
    errorCorrectionLevel: 'H',
    margin: 1,
    width: 300,
    color: {
      dark: '#000000',
      light: '#ffffff'
    }
  });
};

/**
 * Generate QR code for contact exchange
 * @param {Object} user - User data
 * @param {string} eventId - Event ID
 * @returns {Promise<string>} - QR code data URL
 */
exports.generateContactQRCode = async (user, eventId) => {
  const data = JSON.stringify({
    userId: user._id,
    eventId,
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
    company: user.company,
    position: user.position,
    timestamp: Date.now()
  });

  return await exports.generateQRCodeDataURL(data, {
    errorCorrectionLevel: 'H',
    margin: 1,
    width: 300,
    color: {
      dark: '#000000',
      light: '#ffffff'
    }
  });
};