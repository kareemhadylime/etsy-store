# Wedding AI Co-Pilot — 8-Prompt PDF Content

_Drafted: 2026-05-11_
_Status: v1 — content ready for PDF production_
_Tier: AI Edition ($49) only_
_References: [proposal](../product-proposals/wedding-budget-planner.md) · [design brief](../product-designs/wedding-budget-planner.md) Section 4_
_PDF format: US Letter portrait, 12 pages (cover + intro + 8 prompts × 1 page + tips + back cover)_

This file is the **content source of truth** for the AI Co-Pilot PDF. Visual layout rules live in the design brief; copy lives here.

---

## Page 1 — Cover

### Title (Cormorant Garamond 36pt, centered)
```
AI Wedding Co-Pilot
```

### Subtitle (Cormorant Garamond italic 18pt, dusty-rose, centered)
```
Eight prompts. Two AI tools. One unforgettable wedding.
```

### Bottom band (matte black, white type)
- Left: studio wordmark (Inter 10pt)
- Right: `weddingbudgetplanner.com / v1.0` (Inter 10pt)

### Visual element
Dusty-rose foil-style underline beneath the title (per brief Section 4). No imagery — type-led cover keeps the premium read.

---

## Page 2 — Intro / How to use these prompts

### Header (Cormorant Garamond 24pt)
```
How to use these prompts
```

### Body (Inter 11pt, 1.4 line-height)
```
Eight situations every couple hits at least once during a wedding. Eight prompts you can copy, paste, and adapt — designed to work in ChatGPT's free tier or Claude.

The prompts here aren't generic. Each one is built to pair with a specific tab in your Wedding spreadsheet. You'll see the tab name listed on each page — paste the prompt, fill in the placeholders from that tab, and you'll get an answer you can actually use.

— How it works —

1. Open the prompt page you need (Guest List Optimizer, Vendor Negotiation, etc.).
2. Open the matching tab in your spreadsheet.
3. Copy the prompt into ChatGPT or Claude.
4. Replace the [PLACEHOLDERS] with your data from the tab.
5. Paste, send, read the worked example on the same page to know what a good answer looks like.

— What you'll need —

• A ChatGPT account (free tier works) OR a Claude account (free tier works)
• Your Wedding spreadsheet open in another window
• 10 minutes per prompt for the first one; ~3 minutes once you're used to the flow

— What this PDF won't do —

This is not an AI agent that runs by itself. You paste, you read, you decide. The AI suggests; you choose. That separation is on purpose — your wedding, your call.

Turn the page when you're ready.
```

### Footer (Inter italic 9pt, page number right)
```
2 / 12
```

---

## Page 3 — Prompt 1: Guest List Optimizer

### Page title (Cormorant Garamond 24pt)
```
1. Guest List Optimizer
```

### Tab callout (dusty-rose pill, top-right of page)
```
Pairs with: 👥 Guest List tab + 📊 AI Guest List Optimizer tab
```

### The prompt (deep-mauve bordered card, Inter mono 10pt)
```
You are helping me cut my wedding guest list fairly. Here is the situation:

CURRENT COUNT: [number] guests
TARGET COUNT: [number] guests (I need to cut [N] people)
WEDDING DATE: [date]
BUDGET CONSTRAINT: [optional — e.g., "$30k cap, $200/head average"]

Here is my guest list (paste from the Guest List tab — name, side, relationship, must-attend flag):

[PASTE GUEST LIST HERE]

Rules I want you to follow:
- Cut equally from both sides where possible.
- Never cut a "must-attend" person (those with Y in the must-attend column).
- Prefer to cut acquaintances and plus-ones over family.
- Treat "joint" friends as cuttable from neither side preferentially.
- If both members of a couple are on the list, treat them as one unit.

Return a table with three columns:
1. Person/couple to cut
2. Side (his/hers/joint)
3. Rationale (one sentence)

Then give me a one-paragraph summary of total people cut, side balance, and estimated budget impact at $200/head.
```

### Worked example (collapsed-style box, Inter 9pt, ivory background)
```
EXAMPLE INPUT (excerpt):
- Mike Davis | his | high school friend | (not must-attend)
- Sarah Chen | hers | college roommate | must-attend
- Tom & Kate | joint | colleagues from old job | (not must-attend)
- Aunt Linda | his | aunt | must-attend
- Jess Park | his | gym friend | (not must-attend)
... [continue list]

EXAMPLE OUTPUT:
| Cut | Side | Why |
|---|---|---|
| Mike Davis | his | High school friend, no recent contact |
| Jess Park | his | Gym friend — connection is current but not deep |
| Tom & Kate | joint | Former colleagues; haven't seen them in 2+ years |

Total cut: 4 guests · His side -2 · Hers side 0 · Joint -2
Side balance: needs 2 more cuts from her side to match.
Budget impact: ~$800 saved at $200/head.
```

### Footer
```
3 / 12 · AI Wedding Co-Pilot
```

---

## Page 4 — Prompt 2: Vendor Cost Intelligence

### Page title
```
2. Vendor Cost Intelligence
```

### Tab callout
```
Pairs with: 🤝 Vendor Tracker tab + 🔍 AI Vendor Cost Intelligence tab
```

### The prompt
```
You are helping me evaluate vendor quotes for my wedding. Tell me which are fair, which are red-flagged, and what questions to ask before signing.

VENDOR CATEGORY: [photography / catering / florist / DJ / videography / venue / hair-makeup / etc.]
REGION: [city, state OR metro area]
SEASON: [spring / summer / fall / winter] / [peak or off-peak month if known]
GUEST COUNT: [number]

QUOTES (paste 2–4 from your Vendor Tracker tab):

QUOTE 1
  Vendor name: [name]
  Total price: $[amount]
  What's included: [deliverables — e.g., "8 hours coverage, 2 photographers, 500 edited photos, online gallery, USB"]
  Travel fee: [yes/no — $amount]
  Deposit required: [%]

QUOTE 2
  [same fields]

[Add more quotes as needed]

For each quote, tell me:
1. Is the total price ABOVE, AT, or BELOW fair market for that region + season + category?
2. What's missing from the deliverables that competitors usually include?
3. Two specific questions I should ask before signing.
4. One red flag I should look for in the contract (deposit structure, cancellation, rights to images, etc.).

Then rank the quotes 1 (best value) to N (worst value) and tell me which one you'd pick and why.
```

### Worked example
```
EXAMPLE INPUT:
Category: Photography · Region: Austin, TX · Season: October (peak) · Guests: 120
Quote 1: Emma Carter Photography — $4,200 — 8hr, 2 shooters, ~600 edited, gallery, USB
Quote 2: Lone Star Lens — $2,900 — 6hr, 1 shooter, ~300 edited, gallery only
Quote 3: Hill Country Films — $5,800 — 10hr, 2 shooters, video add-on, ~800 edited

EXAMPLE OUTPUT (abbreviated):
Quote 1 — AT MARKET. Austin peak-season comp for 2-shooter, 8hr is $3,800–$4,500. Missing: engagement shoot add-on (often $500 elsewhere). Ask: (1) Print release vs. usage rights? (2) Backup-shooter policy if Emma is sick? Red flag: deposit > 50% is unusual.

Quote 2 — BELOW MARKET. Either she's new or underbooking. Missing: 2nd shooter (matters for 120-guest event). Ask: (1) How many weddings shot this year? (2) Sample full gallery, not just highlights. Red flag: edits-only-300 is light for the price.

Quote 3 — ABOVE MARKET. Adding video raises floor to $5,000+. Missing: probably nothing. Ask: (1) Same team for video + photo, or subcontracted? (2) Drone permit included? Red flag: bundled video sometimes means weaker photo work.

RANK: 1 = Emma Carter, 2 = Hill Country Films, 3 = Lone Star Lens.
Pick: Emma Carter. Strongest deliverables-to-price ratio, market-fair, established.
```

### Footer
```
4 / 12 · AI Wedding Co-Pilot
```

---

## Page 5 — Prompt 3: Seating Constraint Solver

### Page title
```
3. Seating Constraint Solver
```

### Tab callout
```
Pairs with: 🪑 Seating Chart Planner tab + 🧩 AI Seating Constraint Solver tab
```

### The prompt
```
You are helping me solve a wedding seating arrangement.

TOTAL TABLES: [number]
SEATS PER TABLE: [number — typically 8 or 10]
TOTAL GUESTS TO SEAT: [number]

CONSTRAINTS:
- DO NOT SEAT TOGETHER: [pair 1 names; pair 2 names; etc.]
- MUST SEAT TOGETHER: [pair 1; group 1; etc.]
- ACCESSIBILITY: [name — needs wheelchair access / hearing aid side / etc.]
- AGE CONSIDERATIONS: [name — sits with kids / no kids near speeches table / etc.]

GUEST LIST WITH RELATIONSHIPS (paste from Seating Chart Planner tab):
[Name | Side | Relationship | Notes]
[Continue list]

Generate a seating plan as a numbered list of tables (Table 1, Table 2, ...) with the guests at each. For each table, give it a one-word "vibe" name (e.g., "Family", "College Friends", "Work + Plus-ones") and the rationale for who's grouped where.

If any constraint cannot be satisfied with the given table count, flag it explicitly and suggest the smallest change (one more table, one fewer constraint, etc.).
```

### Worked example
```
EXAMPLE INPUT (abbreviated):
8 tables × 8 seats = 64 guests
DO NOT SEAT TOGETHER: Uncle Bill and Cousin Marie (long-standing feud); Aunt Rose and Tom's mom (workplace history)
MUST SEAT TOGETHER: Sarah's college roommates (4 of them); the bride's parents at head table
ACCESSIBILITY: Grandma Pat needs aisle seat near restroom (Table 1)
AGE: Cousin Daniel (7) and his sister (5) at the kids' table

EXAMPLE OUTPUT (excerpt):
Table 1 — "Bride's Family Core"
  Bride's parents, Grandma Pat (aisle seat), Aunt Sue, Uncle Mark + spouse
  Rationale: head-table-adjacent. Grandma Pat closest to restroom corridor. Bill kept on opposite side of room from Marie.

Table 2 — "College Roommates"
  Sarah's 4 roommates + their plus-ones
  Rationale: the must-seat-together group. Younger crowd, drinks-friendly placement.

[continues for all 8 tables]

FLAGS: All constraints satisfied with 8 tables of 8. No changes needed.
```

### Footer
```
5 / 12 · AI Wedding Co-Pilot
```

---

## Page 6 — Prompt 4: RSVP Reminder Scripts

### Page title
```
4. RSVP Reminder Scripts
```

### Tab callout
```
Pairs with: 📬 RSVP Tracker tab + 📩 AI RSVP Reminder Scripts tab
```

### The prompt
```
You are writing polite reminder messages for guests who haven't RSVP'd to my wedding. Give me three scripts: one for 30 days before the RSVP deadline, one for 14 days, and one for 7 days. Each should feel a little more direct than the last — but always warm, never guilty.

WEDDING DATE: [date]
RSVP DEADLINE: [date]
RELATIONSHIP TO GUEST: [close family / extended family / close friend / colleague / parent's friend / etc.]
MEDIUM: [email / text message / handwritten note]
TONE PREFERENCE: [warm-casual / formal-polite / direct-friendly]

Each script should:
- Open with a personal touch (not just "Hey, did you RSVP?")
- State the actual ask clearly
- Give them one easy action (link to RSVP form, reply with yes/no, etc.)
- Close warmly, no pressure
- Be under 80 words

If the 30-day script doesn't get a response, the 14-day and 7-day scripts assume they're seeing the second/third message and reflect that.
```

### Worked example
```
EXAMPLE INPUT:
Wedding date: October 12, 2026 · RSVP deadline: September 15, 2026
Relationship: close friend (haven't seen in 3 months) · Medium: text · Tone: warm-casual

EXAMPLE OUTPUT:

30 DAYS OUT (Aug 16):
"Hey Jess! Hope summer's been good to you 🌞 Just a friendly heads-up: the RSVP deadline for our wedding (Oct 12) is Sept 15. The form's at [link]. Would love to see you there — let me know either way! xo"

14 DAYS OUT (Sept 1):
"Hi Jess — quick second nudge on the RSVP for the wedding! Deadline's two weeks out (Sept 15). I know life gets busy — totally no pressure either way, but the venue needs the count by then. [link]"

7 DAYS OUT (Sept 8):
"Hey Jess, final ping! Need to lock the venue count by Sept 15 (one week from today). Could you fire me a quick yes or no when you get a sec? Either answer is great — just need to know. ❤️"
```

### Footer
```
6 / 12 · AI Wedding Co-Pilot
```

---

## Page 7 — Prompt 5: Wedding Vows Drafter

### Page title
```
5. Wedding Vows Drafter
```

### Tab callout
```
Pairs with: 💍 AI Wedding Vows Drafter tab
```

### The prompt
```
You are helping me draft my wedding vows. Write three distinct drafts in the tone I specify, drawing on the relationship details I provide. Each draft should be readable in 60–90 seconds when spoken aloud.

PARTNER'S NAME: [name]
OUR STORY (paste 150–250 words):
[How we met, a defining moment, what changed when you knew, an inside joke or shared phrase, what your partner does that you're grateful for — the more specific, the better the output]

TONE: [pick one or combine — romantic / funny / heartfelt-quiet / spiritual / mixed]
LENGTH: [60 sec / 75 sec / 90 sec — pick one]
CULTURE OR RELIGION (optional): [Christian / Jewish / Muslim / Hindu / secular / interfaith / etc.]
WHAT I DON'T WANT: [clichés to avoid — e.g., "no 'I promise to be your best friend,'" "no rom-com references"]
ONE VOW I MUST INCLUDE: [optional — a specific promise or phrase that has to make it in]

Generate three distinct drafts. Each should:
- Open differently (don't reuse the same hook)
- Reference at least one specific detail from "Our Story"
- End with a clear promise (not a vague sentiment)

After the three drafts, tell me which one you'd pick and why — one sentence each.
```

### Worked example
```
EXAMPLE INPUT (abbreviated):
Partner: Alex
Story: Met at a bookstore in 2022. They were holding the last copy of a book I'd been hunting for two years. I said "I'll trade you a coffee for that book." They said "Make it a long one." We've been together 3 years. Alex makes me laugh at my own neuroses. Sundays we cook together — burnt three pans, kept all three. I want them to feel I see them.
Tone: Heartfelt-quiet + a little funny
Length: 75 sec
No clichés: no "you make me a better person"
Must include: "Long coffee, longer life"

EXAMPLE OUTPUT (Draft 1 abbreviated — full prompt returns three):

"Alex —
Three years ago you held the last copy of a book I'd been searching for. You said 'make it a long one.' I didn't know then that long coffee meant long life, but I'm catching on.

Today I promise you the burnt pans and the Sunday cooking. The book finds. The bad jokes only one of us will laugh at. I promise to see you on the days you're tired of being seen, and to let you see me on the days I'd rather hide.

Long coffee, longer life — that's the deal. I'm in."

RECOMMENDATION: Draft 1 — the bookstore opening earns the inside joke without overselling it. Drafts 2 and 3 lean funnier and quieter respectively; this one balances.
```

### Footer
```
7 / 12 · AI Wedding Co-Pilot
```

---

## Page 8 — Prompt 6: Day-of Crisis Playbook

### Page title
```
6. Day-of Crisis Playbook
```

### Tab callout
```
Pairs with: 🚨 AI Day-of Crisis Playbook tab + 📋 Day-of Schedule tab
```

### The prompt
```
You are helping me handle a wedding day crisis. Give me a calm, actionable script — what to say, who to delegate to, and what to skip worrying about.

THE CRISIS: [describe in 1–2 sentences — vendor late / guest drama / weather / wardrobe / family / lost item / venue issue / etc.]
TIME OF DAY: [morning / pre-ceremony / ceremony / cocktail hour / reception / late / right now]
WHO'S INVOLVED: [name + role — bride / groom / parent / vendor / guest / coordinator]
WHO CAN HELP RIGHT NOW: [maid of honor / best man / day-of coordinator / parent / venue manager / etc.]
HOW URGENT: [under 5 min / under 30 min / can wait 1 hr / not urgent]

Give me:
1. THE FIRST WORDS TO SAY (literal script — what comes out of my mouth in the next 30 seconds)
2. DELEGATE TO: who handles what so I can focus on the wedding
3. WHAT TO SKIP: anything I'm tempted to worry about that doesn't matter right now
4. DEBRIEF NOTE: one line for after the day, so I can revisit if it comes up later

Keep tone calm-direct. No "stay positive!" — be useful.
```

### Worked example
```
EXAMPLE INPUT:
Crisis: My mother-in-law just arrived at the venue 2 hours before the ceremony — she wasn't invited (long story). She's at the front entrance.
Time: pre-ceremony · Involved: mother-in-law + bride
Who can help: maid of honor (Sara), day-of coordinator (Mike)
Urgent: under 5 min — guests will start arriving in 90 min

EXAMPLE OUTPUT:

1. FIRST WORDS: "Hey [MIL's name] — I'm getting ready and we hadn't planned for you to come today. Can we step out front and figure this out together? Give me one second to grab Sara."

2. DELEGATE TO:
   - Sara (maid of honor): stays with you while you talk to MIL — don't do this alone
   - Mike (coordinator): keep guests at the cocktail hour space; don't let anyone wander toward the entrance for 15 min
   - Partner: tell them what's happening in one sentence, then they go back to getting ready. Don't loop them in until the immediate moment is handled.

3. WHAT TO SKIP: Whether MIL should be allowed to stay. Decide that in 15 min with a clear head. Right now you just need her out of the entry and the next 90 min protected.

4. DEBRIEF NOTE: "MIL arrived uninvited at 2pm. Resolved by [outcome]. Discuss with partner Sunday — not tonight."
```

### Footer
```
8 / 12 · AI Wedding Co-Pilot
```

---

## Page 9 — Prompt 7: Vendor Negotiation Scripts

### Page title
```
7. Vendor Negotiation Scripts
```

### Tab callout
```
Pairs with: 🤝 Vendor Tracker tab + 💬 AI Vendor Negotiation Scripts tab
```

### The prompt
```
You are writing a script for me to negotiate a vendor quote down without burning the relationship.

VENDOR CATEGORY: [photographer / florist / caterer / DJ / etc.]
VENDOR NAME: [name]
CURRENT QUOTE: $[amount]
MY TARGET: $[amount]
GAP TO CLOSE: $[difference]
BEST ALTERNATIVE I HAVE: [another quote at $X, or "no alternative — I want this vendor specifically"]
RELATIONSHIP STATUS: [first inquiry / second conversation / already signed contract but quote crept up / etc.]
WHAT I LIKE ABOUT THIS VENDOR: [one or two specifics — style, recommendation, prior work]
MEDIUM: [email / phone / in-person meeting]

Write me:
1. The opening (don't lead with "your price is too high")
2. The ask (one specific dollar number or trade — be concrete)
3. Two fallback positions if they push back (e.g., remove an inclusion, extend payment terms)
4. WALK-AWAY POINT: the price/terms below which I should politely decline and use my alternative

Keep it warm. Vendors talk to each other; reputation matters.
```

### Worked example
```
EXAMPLE INPUT:
Vendor: Florist "Wildflower Studio" · Quote: $5,200 · Target: $4,000 · Gap: $1,200
Alt: Quoted $3,800 at "Stem & Story" (similar quality)
Status: second conversation · I love: their use of seasonal flowers, won 2 awards in our region
Medium: email

EXAMPLE OUTPUT:

OPENING (subject: "Re: Wedding Florals — Refining the Plan"):
"Hi [name] — thanks again for the proposal last week. The seasonal-flower approach is exactly what we want, and your portfolio (especially the [specific arrangement] from last year's award) is what made you our top pick.

I'm working through the budget and need to land closer to $4,000 total. Want to walk through what's possible at that number?"

THE ASK:
Specifically: "Could we drop from $5,200 → $4,000 if we cut the ceremony arch installation and use simpler reception centerpieces (mason jars vs. ceramic urns)? The bridal bouquet and bridesmaid bouquets are the pieces we don't want to compromise on."

FALLBACK 1 (if they push back on $4,000):
"What about $4,400 — same scope as the original quote, but with payment in two installments instead of three?"

FALLBACK 2:
"Can we keep the ceremony arch but use a single-color palette instead of multi-color to reduce sourcing complexity?"

WALK-AWAY POINT:
Below $4,300 with original scope — politely decline. "We've decided to go a different direction; thank you for the time and the beautiful proposal." Mention the alternative quote vaguely, never by name.
```

### Footer
```
9 / 12 · AI Wedding Co-Pilot
```

---

## Page 10 — Prompt 8: Speech Drafter

### Page title
```
8. Speech Drafter (Best Man / Maid of Honor / Parent)
```

### Tab callout
```
Pairs with: 🎤 AI Speech Drafter tab (AI Edition only — accessed via the spreadsheet's prompt-launcher)
```

### The prompt
```
You are drafting a wedding speech. Write a full draft based on my details — I'll edit, but I want a real starting point, not a generic template.

WHO I AM: [best man / maid of honor / father of bride / mother of groom / sibling / friend / etc.]
WHO I'M TOASTING: [name — the bride? the groom? the couple?]
RELATIONSHIP TO THEM: [how I know them, how long]
LENGTH: [3 min / 4 min / 5 min — pick one. Anything over 5 min loses the room.]
TONE: [funny + heartfelt / mostly heartfelt / dry-witty / formal / cultural-specific]
WHAT NOT TO SAY: [things to avoid — old relationships, work problems, embarrassing stories with kids in the room, etc.]

ANECDOTES I WANT TO INCLUDE (give me 2–4 short stories, 1–2 sentences each):
1. [story]
2. [story]
3. [story]
4. [story]

ONE THING I WANT THE COUPLE/AUDIENCE TO FEEL AT THE END:
[seen / honored / proud / hopeful / etc.]

Structure the speech in four parts:
1. Opening hook (gets the room — joke OR observation, not "Hi everyone")
2. Who you are and your relationship to the couple (60 seconds max)
3. Two of the anecdotes I gave you, woven together with what they reveal about the couple (this is the heart of the speech)
4. The toast: a clear promise / wish / observation, then "raise your glasses to..."

Mark word counts on each section so I can time it (~150 wpm spoken pace).
End with three alternate one-line toasts I can pick from if the main toast doesn't land in rehearsal.
```

### Worked example
```
EXAMPLE INPUT (abbreviated):
Who: best man · Toasting: the couple (Alex + Jordan)
Relationship: Alex's best friend since 7th grade
Length: 4 min · Tone: funny + heartfelt
Avoid: ex-girlfriends, the time Alex got food poisoning in Mexico
Anecdotes:
1. Alex saved up for two years to buy his first car at 17; the day he got it he drove me to the DMV because I'd forgotten my road test
2. Jordan once cooked dinner for Alex's whole family the day she met them and asked everyone's allergies in advance
3. Alex once spent an entire Saturday helping me move apartments without complaining once
Want audience to feel: that Alex picked someone who pays attention.

EXAMPLE OUTPUT (abbreviated — full prompt returns ~600 words structured for 4 min):

OPENING HOOK (~30 sec / 80 words):
"For those of you who don't know me — I'm Tom. I've known Alex since we were both wearing braces and dressing badly. He's mostly grown out of one of those things.
I've been waiting fifteen years to hold this microphone, which means I've had time to come up with material. I've also had time to lose it. So we're going with the truth instead."

WHO I AM (~60 sec / 150 words):
[...]

THE HEART — TWO ANECDOTES WOVEN (~120 sec / 320 words):
[Combines the car/DMV story with Jordan-cooking-for-family — shows Alex notices what people need, picked someone who does the same. Lands on: "He spent two years saving for that car, and the first thing he did with it was give someone else a ride. Of course he ended up with Jordan."]

TOAST (~30 sec / 75 words):
"To Alex and Jordan — for noticing the things most of us miss. For showing up when it counts. For the food allergies asked about in advance, and the rides to the DMV, and the kind of love that doesn't announce itself loudly because it's busy being useful. Raise your glasses. To paying attention. To Alex and Jordan."

ALTERNATE ONE-LINE TOASTS:
1. "To being noticed by the right person."
2. "To the people who show up. May we be them, and may we keep finding them."
3. "To Alex and Jordan — long road ahead, good driver."
```

### Footer
```
10 / 12 · AI Wedding Co-Pilot
```

---

## Page 11 — Tips: ChatGPT free vs. Claude vs. paid

### Page title (Cormorant Garamond 24pt)
```
Which AI should I use?
```

### Body (Inter 11pt)
```
All eight prompts work in free tiers. The differences are speed, output length, and how well the AI handles long inputs (like a full guest list or 4 quotes side-by-side).

— ChatGPT Free —

Best for: Speech Drafter, Vendor Negotiation, RSVP Reminders, Vows Drafter.
Strength: Conversational tone. Good at editing and revising drafts when you ask.
Limit: ~3,000–4,000 word context per message in free tier. If your guest list is 200+ names, paste it in chunks and ask it to combine results.

— Claude Free (claude.ai) —

Best for: Guest List Optimizer, Seating Constraint Solver, Vendor Cost Intelligence.
Strength: Handles longer inputs in a single message. Better at structured table outputs (great for guest lists and seating).
Limit: Conversation limits per day on the free tier. If you hit a wall, wait a few hours or use ChatGPT for the next prompt.

— Paid tiers (ChatGPT Plus, Claude Pro) —

Worth it if: You're going to use these prompts heavily over 2–3 months of planning.
Skip if: One-off use. Free tiers do the job.

— Tips that apply to both —

1. **Paste your data as a list, not a screenshot.** AI can't read photos of spreadsheets well in free tiers. Copy cells, paste as text.
2. **Read the worked example before pasting.** It tells you what good output looks like — if yours doesn't match, you missed a placeholder.
3. **Iterate.** First draft is rarely the final. "Make it 30 words shorter" or "make the tone warmer" — the AI will revise.
4. **Save what works.** Found a great vow draft on attempt 3? Copy it into your spreadsheet's Notes column so you don't lose it.

Your wedding data never leaves your AI conversation. ChatGPT and Claude don't see your spreadsheet — only what you paste into them, and only during that conversation. (Read their privacy policies if you want the details.)
```

### Footer
```
11 / 12 · AI Wedding Co-Pilot
```

---

## Page 12 — Back cover

### Top quarter (Cormorant Garamond italic 18pt, centered, dusty-rose)
```
You're going to be fine.
```

### Mid section (Inter 11pt, centered)
```
Wedding planning is mostly two things: deciding,
and then deciding again because something changed.

These eight prompts won't decide for you.
They'll just make the decisions a little less lonely.
```

### Footer panel (matte black, white type)
```
Wedding Budget & Planner (AI Edition)
v1.0 · Updated [DATE]
support@[studio-domain] · Reply within 24 hours

This PDF ships with your purchase of the Wedding
AI Edition spreadsheet. AI prompts are designed for
ChatGPT and Claude (free or paid tiers — your choice).

12-month free updates included with AI Edition.
weddingbudgetplanner.com/updates
```

### Bottom-right (Inter italic 9pt)
```
12 / 12
```

---

## Production notes

- **Page count: 12 total** (cover + intro + 8 prompts + tips + back). Matches design brief Section 4 spec.
- **Visual rules:** all type styling, palette, border treatments, and layout per design brief Section 4. This file is *content only*.
- **PDF tool:** Figma → PDF export per locked production decision P3. Same Figma "Wedding Brand Kit" file holds palette + components + 5 thumbnails + this PDF.
- **Page numbering convention:** "N / 12 · AI Wedding Co-Pilot" in Cormorant italic 9pt, right-aligned at footer. Cover (page 1) and back cover (page 12) follow the same numbering for buyer reference.
- **Placeholders** in prompt blocks use ALL-CAPS bracketed strings (`[DATE]`, `[NUMBER]`, `[GUEST LIST HERE]`) — visually distinct from regular prompt text so the buyer knows what to replace.
- **Each prompt page includes a tab callout** identifying which Wedding spreadsheet tab the prompt pairs with. This is the bridge between the PDF and the spreadsheet — buyers should never wonder "where does this go?"
- **Worked examples use realistic but anonymized data.** Names (Mike, Sarah, Emma, Alex, Jordan, Tom) are common across cultures; no surnames in vow/speech examples that imply specific religions or origins. Cultural-specific wording stays in the dedicated Muslim Walima / Hindu Multi-day tabs (Wedding AI Edition only).
- **Update cadence:** AI prompt patterns are stable enough that this PDF rarely needs full refresh. If ChatGPT/Claude ship a major model update that breaks any prompt, ship an updated version under the same 12-month free-update window AI Edition buyers receive.
- **Cross-reference with spreadsheet:** When the Wedding spreadsheet build ticket-breakdown happens (next session option), each of the 6 AI Edition tabs (Guest List Optimizer / Vendor Cost Intelligence / Seating / RSVP / Crisis Playbook / Vows) gets a "Open the AI Co-Pilot PDF, page N" button that opens the PDF or a deep-linked anchor.

## Catalog-wide patterns this informs

When the Bundle AI Library content (60+ prompts + 10 cross-product workflows) gets written next, reuse this file's structure: title + tab callout + copy-paste prompt + worked example + footer page number. The Bundle's prompts will lean more on cross-product workflows (e.g., "Plan a year of sinking funds while saving for wedding"), but the per-prompt structure stays identical so buyers who own both products experience consistency.
