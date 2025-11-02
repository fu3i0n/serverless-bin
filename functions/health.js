/**
 * DaisyPaste Health Check Endpoint
 * Returns service status and version information
 */

export async function onRequest(context) {
  const startTime = Date.now();

  try {
    // Check KV connectivity
    let kvStatus = 'healthy';
    try {
      await context.env.FILES_KV.list({ limit: 1 });
    } catch (error) {
      kvStatus = 'unhealthy';
      console.error('KV health check failed:', error);
    }

    const healthData = {
      status: kvStatus === 'healthy' ? 'ok' : 'degraded',
      version: '2.0.0',
      service: 'DaisyPaste',
      timestamp: new Date().toISOString(),
      uptime: process.uptime ? Math.floor(process.uptime()) : 'N/A',
      checks: {
        kv: kvStatus,
        api: 'healthy',
      },
      responseTime: `${Date.now() - startTime}ms`,
    };

    return new Response(JSON.stringify(healthData, null, 2), {
      status: kvStatus === 'healthy' ? 200 : 503,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Service-Version': '2.0.0',
        'X-Response-Time': `${Date.now() - startTime}ms`,
      },
    });
  } catch (error) {
    console.error('Health check error:', error);

    return new Response(
      JSON.stringify({
        status: 'error',
        message: 'Health check failed',
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
