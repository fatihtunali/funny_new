/**
 * Brevo (formerly Sendinblue) API Integration
 * Used for newsletter subscriptions and email marketing
 */

const BREVO_API_URL = 'https://api.brevo.com/v3';

export interface BrevoContact {
  email: string;
  attributes?: Record<string, string | number | boolean>;
  listIds?: number[];
  updateEnabled?: boolean;
}

export interface BrevoResponse {
  success: boolean;
  message?: string;
  id?: number;
}

/**
 * Add or update a contact in Brevo
 * @param contact - Contact information
 * @returns Promise with response data
 */
export async function addContactToBrevo(contact: BrevoContact): Promise<BrevoResponse> {
  const apiKey = process.env.BREVO_API_KEY;

  if (!apiKey) {
    console.error('BREVO_API_KEY is not set in environment variables');
    throw new Error('Email service configuration error');
  }

  try {
    const response = await fetch(`${BREVO_API_URL}/contacts`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        email: contact.email,
        listIds: contact.listIds || [2], // Default to list ID 2
        updateEnabled: contact.updateEnabled !== false, // Default to true
        attributes: contact.attributes || {},
      }),
    });

    // Handle empty or invalid JSON responses
    let data;
    try {
      const text = await response.text();
      console.log('Brevo API response status:', response.status, 'body:', text);
      data = text ? JSON.parse(text) : {};
    } catch (parseError) {
      console.error('Failed to parse Brevo response:', parseError);
      data = {};
    }

    if (response.ok) {
      return {
        success: true,
        message: 'Contact added successfully',
        id: data.id,
      };
    } else {
      // Handle specific Brevo errors
      if (response.status === 400 && data.code === 'duplicate_parameter') {
        // Contact already exists, update instead
        return {
          success: true,
          message: 'Contact already subscribed',
        };
      }

      console.error('Brevo API error - Status:', response.status, 'Data:', data);
      return {
        success: false,
        message: data.message || `Brevo API error (status ${response.status})`,
      };
    }
  } catch (error) {
    console.error('Error adding contact to Brevo:', error);
    throw new Error('Failed to subscribe to newsletter');
  }
}

/**
 * Send a transactional email using Brevo
 * @param to - Recipient email
 * @param subject - Email subject
 * @param htmlContent - HTML email content
 * @param textContent - Plain text email content (optional)
 */
export async function sendTransactionalEmail(
  to: string,
  subject: string,
  htmlContent: string,
  textContent?: string
): Promise<BrevoResponse> {
  const apiKey = process.env.BREVO_API_KEY;

  if (!apiKey) {
    throw new Error('Email service configuration error');
  }

  try {
    const response = await fetch(`${BREVO_API_URL}/smtp/email`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          name: process.env.EMAIL_FROM_NAME || 'Funny Tourism',
          email: process.env.EMAIL_FROM || 'info@funnytourism.com',
        },
        to: [{ email: to }],
        subject,
        htmlContent,
        textContent,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: 'Email sent successfully',
        id: data.messageId,
      };
    } else {
      console.error('Brevo email error:', data);
      return {
        success: false,
        message: data.message || 'Failed to send email',
      };
    }
  } catch (error) {
    console.error('Error sending email via Brevo:', error);
    throw new Error('Failed to send email');
  }
}
