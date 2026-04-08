# API Authentication — Technical Specification

<span class="badge badge-warning">Draft</span> <span class="badge">v0.3</span>

**Author:** David Park, Lead Engineer
**Last Updated:** March 28, 2026

---

## Overview

This document specifies the authentication flow for the public REST API. The system uses short-lived JWT access tokens with rotating refresh tokens.

<div class="box-accent">

**Scope:** This spec covers token issuance, validation, and rotation. Authorization (permissions, roles) is covered in a separate document.

</div>

## Authentication Flow

<div class="steps">
<div class="step"><div class="step-num">1</div><div class="step-content">

### Client Credentials

Client sends `POST /auth/token` with API key and secret in the request body.

```json
{
  "grant_type": "client_credentials",
  "client_id": "app_k7x9m2",
  "client_secret": "sk_live_..."
}
```

</div></div>
<div class="step"><div class="step-num">2</div><div class="step-content">

### Token Issuance

Server validates credentials and returns an access token (15 min TTL) and a refresh token (7 day TTL).

```json
{
  "access_token": "eyJhbG...",
  "refresh_token": "rt_a8f3...",
  "expires_in": 900,
  "token_type": "Bearer"
}
```

</div></div>
<div class="step"><div class="step-num">3</div><div class="step-content">

### Token Refresh

Before the access token expires, client sends `POST /auth/refresh` with the refresh token. A new token pair is issued and the old refresh token is invalidated.

</div></div>
</div>

## Token Specifications

| Property | Access Token | Refresh Token |
| --- | --- | --- |
| Format | JWT (RS256) | Opaque string |
| TTL | 15 minutes | 7 days |
| Storage | Memory only | Secure, server-side |
| Revocable | No (short-lived) | Yes |
| Max per client | Unlimited | 5 active |

## Rate Limits

<div class="kv">
<div class="kv-row"><span class="kv-key">Token issuance</span><span class="kv-val">10 requests / minute</span></div>
<div class="kv-row"><span class="kv-key">Token refresh</span><span class="kv-val">30 requests / minute</span></div>
<div class="kv-row"><span class="kv-key">API calls (authenticated)</span><span class="kv-val">1,000 requests / minute</span></div>
</div>

## Error Codes

| Code | Status | Description |
| --- | --- | --- |
| `invalid_client` | 401 | API key or secret is incorrect |
| `invalid_grant` | 400 | Refresh token is expired or revoked |
| `rate_limited` | 429 | Too many requests — retry after `Retry-After` header |
| `token_expired` | 401 | Access token has expired — use refresh flow |

## Security Considerations

<div class="note-important">

**Critical:** Refresh tokens must never be stored in browser local storage or exposed in client-side code. Use HTTP-only secure cookies or a backend proxy for browser-based clients.

</div>

<ul class="checklist">
<li class="done">RS256 signing with key rotation support</li>
<li class="done">Refresh token rotation (one-time use)</li>
<li class="done">Rate limiting on auth endpoints</li>
<li>Implement token revocation endpoint</li>
<li>Add IP allowlist support for API keys</li>
</ul>
