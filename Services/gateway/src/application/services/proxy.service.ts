import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import * as httpProxy from 'http-proxy';

@Injectable()
export class ProxyService {
  private proxy = httpProxy.createProxyServer();

  private services: Record<string, string> = {
    products: process.env.PRODUCTS_SERVICE || 'http://localhost:3003',
    categories: process.env.CATEGORIES_SERVICE || 'http://localhost:3004',
    cart: process.env.CART_SERVICE || 'http://localhost:3005',
    voice: process.env.VOICE_SERVICE || 'http://localhost:3006',
  };

  forwardRequest(service: string, req: Request, res: Response) {
  const target = this.services[service];
  if (!target) {
    return res.status(404).json({ error: `Service ${service} not found` });
  }

  // Ajustamos la URL original
  req.url = req.url.replace(`/gateway/${service}`, "");

  this.proxy.web(req, res, { target }, (err) => {
    res.status(502).json({ error: "Bad Gateway", details: err.message });
  });
}

}
