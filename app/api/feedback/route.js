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
    const htmlBody = `    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
        <!-- Header -->
        <div style="background-color: #1a365d; padding: 32px 40px; text-align: center;">
            <div style="background-color: #2d5a87; width: 48px; height: 48px; border-radius: 12px; margin: 0 auto 16px; display: inline-flex; align-items: center; justify-content: center;">
                <span style="color: #ffffff; font-size: 24px;">💬</span>
            </div>
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: -0.025em;">
                New Feedback Received
            </h1>
            <p style="color: #a0aec0; margin: 8px 0 0 0; font-size: 14px;">
                Someone shared their thoughts on your platform
            </p>
        </div>

        <!-- Content -->
        <div style="padding: 40px;">
            <!-- Feedback Type Badge -->
            <div style="margin-bottom: 32px;">
                <span style="display: inline-block; background-color: #edf2f7; color: #2d3748; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 500; text-transform: capitalize;">
                    ${type}
                </span>
            </div>

            <!-- Message Card -->
            <div style="background-color: #f7fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin-bottom: 32px;">
                <h2 style="color: #2d3748; margin: 0 0 16px 0; font-size: 16px; font-weight: 600;">
                    Message
                </h2>
                <div style="color: #4a5568; line-height: 1.6; font-size: 15px; margin: 0;">
                    ${message}
                </div>
            </div>

            ${
              requestId
                ? `
            <div style="background-color: #fffbeb; border: 1px solid #fed7aa; border-radius: 8px; padding: 16px; margin-bottom: 32px;">
                <div style="display: flex; align-items: center; margin-bottom: 8px;">
                    <span style="color: #d97706; font-size: 16px; margin-right: 8px;">🔍</span>
                    <h3 style="color: #92400e; margin: 0; font-size: 14px; font-weight: 600;">Request ID</h3>
                </div>
                <code style="color: #92400e; font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace; font-size: 13px; background-color: #fef3c7; padding: 4px 8px; border-radius: 4px;">
                    ${requestId}
                </code>
            </div>
            `
                : ""
            }

            <!-- Details Section -->
            <div style="border-top: 1px solid #e2e8f0; padding-top: 32px;">
                <h3 style="color: #2d3748; margin: 0 0 20px 0; font-size: 16px; font-weight: 600;">
                    Submission Details
                </h3>
                
                <div>
                    <div style="display: flex; padding: 12px 0; border-bottom: 1px solid #f1f5f9;">
                        <div style="width: 120px; flex-shrink: 0;">
                            <span style="color: #64748b; font-size: 14px; font-weight: 500;">Timestamp</span>
                        </div>
                        <div style="flex: 1;">
                            <span style="color: #334155; font-size: 14px;">${timestamp}</span>
                        </div>
                    </div>

                    <div style="display: flex; padding: 12px 0; border-bottom: 1px solid #f1f5f9;">
                        <div style="width: 120px; flex-shrink: 0;">
                            <span style="color: #64748b; font-size: 14px; font-weight: 500;">Page</span>
                        </div>
                        <div style="flex: 1;">
                            <a href="${currentPage}" style="color: #3b82f6; text-decoration: none; font-size: 14px; word-break: break-all;">
                                ${currentPage}
                            </a>
                        </div>
                    </div>

                    ${
                      userEmail
                        ? `
                    <div style="display: flex; padding: 12px 0; border-bottom: 1px solid #f1f5f9;">
                        <div style="width: 120px; flex-shrink: 0;">
                            <span style="color: #64748b; font-size: 14px; font-weight: 500;">User Email</span>
                        </div>
                        <div style="flex: 1;">
                            <a href="mailto:${userEmail}" style="color: #3b82f6; text-decoration: none; font-size: 14px;">
                                ${userEmail}
                            </a>
                        </div>
                    </div>
                    `
                        : ""
                    }

                    <div style="display: flex; padding: 12px 0;">
                        <div style="width: 120px; flex-shrink: 0;">
                            <span style="color: #64748b; font-size: 14px; font-weight: 500;">User Agent</span>
                        </div>
                        <div style="flex: 1;">
                            <span style="color: #64748b; font-size: 12px; line-height: 1.4; word-break: break-all;">
                                ${userAgent}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Footer Note -->
            <div style="margin-top: 32px; padding: 16px; background-color: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px;">
                <div style="display: flex; align-items: start;">
                    <span style="color: #0284c7; font-size: 16px; margin-right: 8px; margin-top: 1px;">ℹ️</span>
                    <p style="margin: 0; color: #0369a1; font-size: 13px; line-height: 1.5;">
                        This feedback was submitted via the floating feedback widget on your mentoring platform. 
                        Consider following up with the user if contact information was provided.
                    </p>
                </div>
            </div>
        </div>

        <!-- Email Footer -->
        <div style="background-color: #f8fafc; padding: 24px 40px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0; color: #64748b; font-size: 12px;">
                Sent from your mentoring platform feedback system
            </p>
        </div>
    </div>`;

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
