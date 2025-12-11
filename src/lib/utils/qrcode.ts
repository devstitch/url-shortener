import QRCode from "qrcode";

/**
 * Generate QR code as data URL
 */
export async function generateQRCode(url: string): Promise<string> {
  try {
    const qrDataUrl = await QRCode.toDataURL(url, {
      width: 256,
      margin: 2,
      color: {
        dark: "#06b6d4", // Cyan color
        light: "#030712", // Dark background
      },
      errorCorrectionLevel: "M",
    });
    return qrDataUrl;
  } catch (error) {
    console.error("Error generating QR code:", error);
    throw new Error("Failed to generate QR code");
  }
}

/**
 * Generate QR code as SVG string
 */
export async function generateQRCodeSVG(url: string): Promise<string> {
  try {
    const svg = await QRCode.toString(url, {
      type: "svg",
      width: 256,
      margin: 2,
      color: {
        dark: "#06b6d4",
        light: "#030712",
      },
      errorCorrectionLevel: "M",
    });
    return svg;
  } catch (error) {
    console.error("Error generating QR code SVG:", error);
    throw new Error("Failed to generate QR code");
  }
}

