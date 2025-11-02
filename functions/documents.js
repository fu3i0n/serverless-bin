/**
 * DaisyPaste - Create Document Handler
 * Optimized for performance and error handling
 */

// Utility functions
function generateSecureId() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function validateContent(content) {
  if (!content || typeof content !== 'string') {
    throw new Error('Content is required and must be a string');
  }

  if (content.length > 1024 * 1024) {
    // 1MB limit
    throw new Error('Content too large. Maximum size is 1MB');
  }

  return content.trim();
}

export async function onRequestPost(context) {
  const startTime = Date.now();

  try {
    // Validate request
    const contentType = context.request.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return new Response(
        JSON.stringify({
          error: 'Invalid content type. Expected application/json',
          code: 'INVALID_CONTENT_TYPE',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Parse and validate content
    const body = await context.request.text();
    const validatedContent = validateContent(body);

    // Generate secure unique ID
    let uuid;
    let attempts = 0;
    const maxAttempts = 5;

    do {
      uuid = generateSecureId();
      attempts++;

      // Check if key already exists
      const existing = await context.env.FILES_KV.get(uuid);
      if (!existing) break;

      if (attempts >= maxAttempts) {
        throw new Error('Failed to generate unique ID after multiple attempts');
      }
    } while (true);

    // Store document with metadata
    const documentData = {
      content: validatedContent,
      createdAt: new Date().toISOString(),
      size: new Blob([validatedContent]).size,
      version: '2.0',
    };

    await context.env.FILES_KV.put(uuid, JSON.stringify(documentData), {
      metadata: {
        size: documentData.size,
        created: documentData.createdAt,
        contentType: 'text/plain',
      },
    });

    // Log for monitoring (remove in production if needed)
    console.log(
      `Document created: ${uuid} (${documentData.size} bytes) in ${Date.now() - startTime}ms`
    );

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        key: uuid,
        size: documentData.size,
        created: documentData.createdAt,
      }),
      {
        status: 201,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'X-Response-Time': `${Date.now() - startTime}ms`,
        },
      }
    );
  } catch (error) {
    console.error('Document creation error:', error);

    return new Response(
      JSON.stringify({
        error: error.message || 'Internal server error',
        code: 'DOCUMENT_CREATION_FAILED',
        timestamp: new Date().toISOString(),
      }),
      {
        status: error.message.includes('too large') ? 413 : 500,
        headers: {
          'Content-Type': 'application/json',
          'X-Response-Time': `${Date.now() - startTime}ms`,
        },
      }
    );
  }
}
