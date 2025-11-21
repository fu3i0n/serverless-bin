export async function onRequestPost(context) {
  const body = await context.request.text();

  // generate new uuid
  const uuid = crypto.randomUUID();

  await context.env.FILES_KV.put(uuid, body);

  return new Response(
    JSON.stringify({
      success: true,
      data: body,
      key: uuid,
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
