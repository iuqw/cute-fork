import express from "express";
import fetch from "node-fetch";
import { normalize } from "node:path";

const app = express();

function normalizeIP(ip) {
  if (!ip) return ip;

  if (ip.startsWith("::ffff:")) {
    return ip.replace("::ffff:", "");
  }

  return ip;
}

app.get(["/", "/ipv4", "/ipv6"], async (req, res) => {
  const rawIP =
    req.headers["cf-connecting-ip"] ||
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress;

  const ip = normalizeIP(rawIP);

  const r = await fetch(`https://ipinfo.akane.network/${ip}`);
  res.setHeader("content-type", "application/json");
  res.send(await r.text());
});

app.listen(3003);
