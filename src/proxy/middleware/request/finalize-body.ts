import { fixRequestBody } from "http-proxy-middleware";
import type { ProxyRequestMiddleware } from ".";

/** Finalize the rewritten request body. Must be the last rewriter. */
export const finalizeBody: ProxyRequestMiddleware = (proxyReq, req) => {
  if (["POST", "PUT", "PATCH"].includes(req.method ?? "") && req.body) {
    const updatedBody = JSON.stringify(req.body);
    proxyReq.setHeader("Content-Length", Buffer.byteLength(updatedBody));
    (req as any).rawBody = Buffer.from(updatedBody);

    // body-parser and http-proxy-middleware don't play nice together
    fixRequestBody(proxyReq, req);
  }
};
