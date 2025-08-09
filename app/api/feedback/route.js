import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend('re_BM6W3bGx_3izx5awWEtjBQp9yE6e6MURS');

export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      type, 
      message, 
      requestId, 
      userEmail, 
      timestamp, 
      currentPage, 
      userAgent 
    } = body;

    // Construct email subject
    const subject = `${type} - Mentoring Platform Feedback`;

    // Construct HTML email body
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">New Feedback Received</h1>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
          <div style="margin-bottom: 25px;">
            <h2 style="color: #495057; margin: 0 0 15px 0; font-size: 18px; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
              ${type}
            </h2>
          </div>

          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #007bff;">
            <h3 style="color: #343a40; margin: 0 0 10px 0; font-size: 16px;">Message:</h3>
            <p style="color: #6c757d; line-height: 1.6; margin: 0; white-space: pre-wrap;">${message}</p>
          </div>

          ${requestId ? `
          <div style="background: #fff3cd; padding: 15px; border-radius: 6px; margin-bottom: 20px; border: 1px solid #ffeaa7;">
            <h4 style="color: #856404; margin: 0 0 5px 0; font-size: 14px;">Request ID:</h4>
            <p style="color: #856404; margin: 0; font-family: 'Courier New', monospace; font-weight: bold;">${requestId}</p>
          </div>
          ` : ''}

          <div style="border-top: 1px solid #dee2e6; padding-top: 20px; margin-top: 20px;">
            <h4 style="color: #495057; margin: 0 0 15px 0; font-size: 16px;">Submission Details:</h4>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #dee2e6; font-weight: bold; color: #495057; width: 120px;">Timestamp:</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #dee2e6; color: #6c757d;">${timestamp}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #dee2e6; font-weight: bold; color: #495057;">Page:</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #dee2e6;">
                  <a href="${currentPage}" style="color: #007bff; text-decoration: none;">${currentPage}</a>
                </td>
              </tr>
              ${userEmail ? `
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #dee2e6; font-weight: bold; color: #495057;">User Email:</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #dee2e6;">
                  <a href="mailto:${userEmail}" style="color: #007bff; text-decoration: none;">${userEmail}</a>
                </td>
              </tr>
              ` : ''}
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #495057;">User Agent:</td>
                <td style="padding: 8px 0; color: #6c757d; font-size: 12px;">${userAgent}</td>
              </tr>
            </table>
          </div>

          <div style="margin-top: 30px; padding: 15px; background: #e3f2fd; border-radius: 6px; border-left: 4px solid #2196f3;">
            <p style="margin: 0; color: #1565c0; font-size: 12px;">
              📧 This feedback was submitted via the floating feedback widget on the mentoring platform.
            </p>
          </div>
        </div>
      </div>
    `;

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'feedback@resend.dev',
      to: 'saikatsamanta052@gmail.com',
      subject: subject,
      html: htmlBody
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send email', details: error },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Feedback sent successfully',
        emailId: data?.id 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
