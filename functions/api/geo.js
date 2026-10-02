/**
 * Cloudflare Pages Function —— 返回访客的地理位置信息
 *
 * 路由：/api/geo
 *
 * 原理：Cloudflare 在边缘节点就已经解析好了访客的 IP 归属信息，
 * 放在 request.cf 对象里，不需要调用任何第三方接口。
 *
 * 好处：
 *   - 不需要第三方 API（国内那些接口大多不可用）
 *   - 不把访客 IP 泄露给任何人
 *   - 延迟极低（数据本来就在边缘节点）
 */

export async function onRequestGet(context) {
  const { request } = context;
  const cf = request.cf || {};

  const data = {
    ip: request.headers.get('CF-Connecting-IP') || '',
    country: cf.country || '',
    city: cf.city || '',
    region: cf.region || '',
    regionCode: cf.regionCode || '',
    postalCode: cf.postalCode || '',
    latitude: cf.latitude || '',
    longitude: cf.longitude || '',
    timezone: cf.timezone || '',
    continent: cf.continent || '',
    asn: cf.asn || '',
    asOrganization: cf.asOrganization || '',
    colo: cf.colo || '',
    httpProtocol: cf.httpProtocol || '',
    tlsVersion: cf.tlsVersion || '',
    clientTcpRtt: cf.clientTcpRtt || '',
    botManagement: cf.botManagement ? { score: cf.botManagement.score } : null,
    ua: request.headers.get('user-agent') || ''
  };

  return new Response(JSON.stringify(data), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store, no-cache, must-revalidate'
    }
  });
}
