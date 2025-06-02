import { getSession } from 'next-auth/react';

export async function insertIntoOutlook(content: string) {
  try {
    const session = await getSession();
    if (!session?.accessToken) {
      throw new Error('No access token available');
    }

    // Get the current email being composed
    const response = await fetch('https://graph.microsoft.com/v1.0/me/messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        body: {
          contentType: 'HTML',
          content: content
        }
      })
    });

    if (!response.ok) {
      throw new Error('Failed to insert content into Outlook');
    }

    return await response.json();
  } catch (error) {
    console.error('Outlook integration error:', error);
    throw error;
  }
}

export async function getCurrentEmail() {
  try {
    const session = await getSession();
    if (!session?.accessToken) {
      throw new Error('No access token available');
    }

    // Get the current email being composed
    const response = await fetch('https://graph.microsoft.com/v1.0/me/messages?$top=1&$orderby=receivedDateTime desc', {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
      }
    });

    if (!response.ok) {
      throw new Error('Failed to get current email');
    }

    const data = await response.json();
    return data.value[0];
  } catch (error) {
    console.error('Outlook integration error:', error);
    throw error;
  }
} 