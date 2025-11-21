export async function onRequest(context) {
  const { id } = context.params;

  const data = await context.env.FILES_KV.get(id);

  return new Response(data, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
