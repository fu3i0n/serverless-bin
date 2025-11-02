/**
 * DaisyPaste - Get Document Handler
 * Optimized for performance and error handling
 */

function isValidDocumentId(id) {
  return /^[a-z0-9]{12}$/.test(id);
}

export async function onRequest(context) {
  const startTime = Date.now();

  try {
    const { id } = context.params;

    // Validate document ID format
    if (!id || !isValidDocumentId(id)) {
      return new Response(
        JSON.stringify({
          error: 'Invalid document ID format',
          code: 'INVALID_DOCUMENT_ID',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Retrieve document from KV store
    const storedData = await context.env.FILES_KV.get(id);

    if (!storedData) {
      return new Response(
        JSON.stringify({
          error: 'Document not found',
          code: 'DOCUMENT_NOT_FOUND',
          id: id,
        }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    let documentData;
    let content;

    try {
      // Try to parse as new format (with metadata)
      documentData = JSON.parse(storedData);
      content = documentData.content || documentData.data; // Support both formats
    } catch (e) {
      // Legacy format - plain text
      content = storedData;
      documentData = {
        content: content,
        createdAt: null,
        size: new Blob([content]).size,
        version: '1.0',
      };
    }

    // Log access for monitoring
    console.log(
      `Document accessed: ${id} (${documentData.size || content.length} bytes) in ${Date.now() - startTime}ms`
    );

    // Return document data
    return new Response(
      JSON.stringify({
        id: id,
        data: content,
        metadata: {
          size: documentData.size || new Blob([content]).size,
          created: documentData.createdAt,
          version: documentData.version || '1.0',
        },
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
          'X-Response-Time': `${Date.now() - startTime}ms`,
        },
      }
    );
  } catch (error) {
    console.error('Document retrieval error:', error);

    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        code: 'DOCUMENT_RETRIEVAL_FAILED',
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'X-Response-Time': `${Date.now() - startTime}ms`,
        },
      }
    );
  }
}
