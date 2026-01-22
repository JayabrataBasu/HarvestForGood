# Email DNS Setup (DMARC, SPF, DKIM)

This guide helps you protect deliverability and domain reputation for harvestforgood.org.

## SPF (Sender Policy Framework)
Publish a TXT record on the root domain:
- Name/Host: `@`
- Type: `TXT`
- Value: `v=spf1 include:resend.com ~all`

Notes:
- If you already have SPF, merge includes rather than creating a second SPF record.
- During stabilization, consider `-all` (hard fail) once you verify all legitimate senders are included.

## DKIM (DomainKeys Identified Mail)
Resend provides DKIM via CNAMEs in their dashboard for your domain. Add exactly the records they provide.
Typical pattern (example only – use the exact hostnames/values from Resend):
- Name: `xxxx._domainkey`
- Type: `CNAME`
- Target: `xxxx.dkim.resend.com`

Verify DKIM status in Resend after DNS propagates.

## DMARC (Domain-based Message Authentication, Reporting & Conformance)
Create a TXT record at the DMARC subdomain:
- Name/Host: `_dmarc`
- Type: `TXT`
- Value (recommended strict policy with reporting):
  `v=DMARC1; p=quarantine; sp=quarantine; adkim=s; aspf=s; pct=100; rua=mailto:postmaster@harvestforgood.org; ruf=mailto:postmaster@harvestforgood.org`

Policy tips:
- Start with `p=quarantine`; move to `p=reject` after verifying no legitimate mail is failing.
- `adkim=s; aspf=s` enforces strict alignment for better protection.
- `rua` and `ruf` mailboxes must exist and be monitored.

## From/Reply-To considerations
- Avoid "no-reply" senders when possible; many receivers down-rank them. If you must use `noreply@harvestforgood.org`, add a `Reply-To: support@harvestforgood.org` (or another monitored address).
- Ensure the envelope sender and header From align to your domain for DMARC alignment.

## Monitoring
- Use Resend analytics and DMARC aggregate reports (rua) to monitor spam/complaint/bounce rates.
- After incidents, warm up sending volume gradually.
