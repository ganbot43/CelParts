export default defineEventHandler((event) => {
  if (process.env.NODE_ENV !== 'production') {
    return;
  }

  const forwardedProto = getHeader(event, 'x-forwarded-proto')?.split(',')[0]?.trim();
  const hostHeader = String(getHeader(event, 'x-forwarded-host') ?? getHeader(event, 'host') ?? '');

  const host = (hostHeader.split(',')[0] ?? '').trim().toLowerCase();
  const protocol = (forwardedProto
    ? forwardedProto
    : (event.node.req.socket as { encrypted?: boolean }).encrypted
      ? 'https'
      : 'http'
  ).toLowerCase();

  const isJoymarHost = host === 'joymarperu.com' || host === 'www.joymarperu.com';
  const mustRedirect = isJoymarHost && (host !== 'joymarperu.com' || protocol !== 'https');

  if (!mustRedirect) {
    return;
  }

  const requestUrl = getRequestURL(event);
  const targetUrl = `https://joymarperu.com${requestUrl.pathname}${requestUrl.search}`;

  return sendRedirect(event, targetUrl, 301);
});
