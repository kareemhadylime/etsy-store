# LimeStudiosCo — Etsy Policy Appeal Package (2026-06-20)

Use the **Support message** below verbatim (Help → Contact us). The **Remediation summary** can be attached or referenced. Every claim is verified against the repo (see truthfulness note at the end).

---

## Support message (paste into Etsy Support)

> **Subject:** Request to review account standing and lift listing freezes — LimeStudiosCo (corrected for Seller Policy)
>
> Hello Etsy Support,
>
> I'm writing about my shop LimeStudiosCo regarding listings that were removed and then frozen under the Seller Policy for using third-party AI brand names and "AI prompt pack" framing. I fully accept the policy and have corrected every issue on the listing-facing content that Etsy reviews. I'm requesting a review of my account standing and the lifting of the freezes.
>
> **What was flagged:**
> - Original listings: 4524285771 (Wedding), 4510288322 (Finance Bundle AI), 4510284477 (Life Bundle AI).
> - These used third-party AI brand names (ChatGPT, Claude) in titles, tags, descriptions, image alt text, and listing images, and framed the products as "AI prompt packs / prompt libraries."
>
> **What I corrected on the Etsy-reviewed surfaces:**
> 1. Listing titles, tags, descriptions, FAQs, and image alt text — all third-party AI brand names (ChatGPT, Claude, and related references) and all prompt-pack / prompt-library framing have been removed and replaced with generic, brand-neutral language.
>    - Example title before: "Premium Finance Bundle AI Edition | 5 Spreadsheets + 60 ChatGPT Claude Prompts + Setup PDF | Master AI Library Digital Download"
>    - Example title after: "Premium Finance Bundle AI Edition | 5 Spreadsheets + 60 AI Planning Prompts + Setup Guide | Digital Download"
> 2. Listing images (thumbnails) — the visible text no longer shows any third-party AI brand name. Badges/pills that previously read "CHATGPT" / "CLAUDE" now read generic terms such as "ANY AI" / "FREE TIER."
> 3. Downloadable product files — I also removed all third-party AI brand names and "prompt pack/library" framing from the files buyers actually download (spreadsheet tab names + in-app help text, and the included AI guide PDFs), and re-attached the corrected files to the listings. Nothing in the product now references ChatGPT, Claude, or any other third-party AI tool.
>
> **Re-created compliant listings:** After correcting the content, I published fully compliant re-creations (4524986765, 4524986789, 4524993902) built from the scrubbed copy and images — yet these were also auto-frozen within seconds. I have since confirmed that even a brand-new listing that is fully compliant on **every** surface — title, tags, description, images, and the downloadable files — is auto-frozen within seconds of publishing. This indicates the freeze is being applied automatically at the account level, and there is no further content change I can make on my own to resolve it. That is precisely why I'm asking for a **manual human review**. (Appeals are currently disabled in-app, so I'm raising this here.)
>
> I'd be grateful if your team could review both the corrected originals and the compliant re-creations, confirm the listing-facing content now meets the Seller Policy, and lift the freezes / restore my account standing. If anything still needs adjustment on the listing copy or images, I'll address it immediately — please tell me exactly what to change.
>
> Thank you for your time and for taking another look.
>
> Best regards,
> Karim Hady — LimeStudiosCo

---

## Remediation summary (reference / attach)

**Owner:** Karim Hady · **Shop:** LimeStudiosCo
**Issue:** Third-party AI brand names (ChatGPT/Claude) + "AI prompt pack / prompt library" framing on listings.
**Scope of fix:** Etsy-reviewed, listing-facing surfaces (listing copy + listing images).

**Affected listing IDs**
- Originals (frozen): 4524285771 (Wedding), 4510288322 (Finance Bundle AI), 4510284477 (Life Bundle AI)
- Compliant re-creations (also frozen): 4524986765, 4524986789, 4524993902

**1. Listing text — titles, tags, descriptions, FAQs, image alt text**
- Removed all third-party AI brand names (ChatGPT, Claude, Anthropic/OpenAI/Gemini/Llama).
- Removed all "prompt pack / prompt library / master AI library" framing; replaced with neutral terms like "AI Planning Guide."
- A brand-only check over the published catalog and all listing-copy documents returns **zero** matches.
- Examples:
  - Title — before: "…60 ChatGPT Claude Prompts + Setup PDF | Master AI Library…" → after: "…60 AI Planning Prompts + Setup Guide | Digital Download"
  - Image alt — before: "60+ ChatGPT and Claude prompts + cross-product workflows" → after: "AI Planning Guide + cross-product workflows"
  - Description — before: "Built for buyers who live in ChatGPT or Claude." → after: "Built for buyers who live in AI tools."

**2. Listing images (thumbnails)**
- Visible text no longer shows any third-party AI brand name.
- "AI Edition Built for ChatGPT and Claude" → "AI Edition Built for any AI assistant"
- Pills "CHATGPT FREE / CLAUDE FREE" → "ANY AI / FREE TIER"

**3. Downloadable product files (also cleaned)**
- Removed all third-party AI brand names + prompt-pack framing from the actual deliverables — spreadsheet tab names + in-app help text and the included AI guide PDFs.
- Examples: "AI Business Co-Pilot" tab → "AI Business Advisor"; "Master AI Prompt Library" PDF → "AI Planning Guide"; "paste into ChatGPT/Claude" → "paste into your AI assistant."
- Files regenerated from the cleaned templates and **re-attached to the listings**; a grep inside the rebuilt `.xlsx`/`.pdf` confirms **zero** brand references.

**Change record:** listing copy/payloads scrubbed in `08cf277`; listing images in `c7b2a15`; pushed live in `a78ebae` + `b56cac1`.
