/**
 * DaisyPaste - Get Raw Document Handler
 * Optimized for performance and proper content delivery
 */

function isValidDocumentId(id) {
  return /^[a-z0-9]{12}$/.test(id);
}

function detectContentType(content) {
  // Simple content type detection based on content patterns
  if (content.trim().startsWith('{') || content.trim().startsWith('[')) {
    return 'application/json';
  }
  if (content.includes('<!DOCTYPE html') || content.includes('<html')) {
    return 'text/html';
  }
  if (content.includes('<?xml')) {
    return 'application/xml';
  }
  if (content.match(/^[\s]*[a-zA-Z-]+\s*:\s*.+/m)) {
    return 'text/css';
  }
  return 'text/plain';
}

export async function onRequest(context) {
  const startTime = Date.now();

  try {
    const { id } = context.params;

    // Validate document ID format
    if (!id || !isValidDocumentId(id)) {
      return new Response('Invalid document ID format', {
        status: 400,
        headers: { 'Content-Type': 'text/plain' },
      });
    }

    // Retrieve document from KV store
    const storedData = await context.env.FILES_KV.get(id);

    if (!storedData) {
      return new Response('Document not found', {
        status: 404,
        headers: { 'Content-Type': 'text/plain' },
      });
    }

    let content;
    let metadata = {};

    try {
      // Try to parse as new format (with metadata)
      const documentData = JSON.parse(storedData);
      content = documentData.content || documentData.data;
      metadata = {
        size: documentData.size,
        created: documentData.createdAt,
        version: documentData.version,
      };
    } catch (e) {
      // Legacy format - plain text
      content = storedData;
      metadata = {
        size: new Blob([content]).size,
        created: null,
        version: '1.0',
      };
    }

    // Detect content type for proper rendering
    const contentType = detectContentType(content);

    // Log access
    console.log(
      `Raw document accessed: ${id} (${metadata.size} bytes) in ${Date.now() - startTime}ms`
    );

    // Return raw content with appropriate headers
    return new Response(content, {
      status: 200,
      headers: {
        'Content-Type': `${contentType}; charset=utf-8`,
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
        'Content-Length': metadata.size?.toString() || content.length.toString(),
        'X-Document-ID': id,
        'X-Document-Version': metadata.version || '1.0',
        'X-Response-Time': `${Date.now() - startTime}ms`,
        // Security headers
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'SAMEORIGIN',
      },
    });
  } catch (error) {
    console.error('Raw document retrieval error:', error);

    return new Response('Internal server error', {
      status: 500,
      headers: {
        'Content-Type': 'text/plain',
        'X-Response-Time': `${Date.now() - startTime}ms`,
      },
    });
  }
}
