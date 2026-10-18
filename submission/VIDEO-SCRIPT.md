# Fieldwork: 3-minute video script (3:00)

**Rule:** one story (Yuki), one trick (the blink comparator), Gemini visibly doing the work. No jargon. Say "it only claims what it can see" and "it tells you when it can't tell".
Record on a phone at the live URL. Every beat has a recorded fallback clip.

| # | Time | Beat |
|---|---|---|
| 1 | 0:00 to 0:15 | Yuki's problem |
| 2 | 0:15 to 0:55 | One Take |
| 3 | 0:55 to 1:25 | The agent buys it |
| 4 | 1:25 to 2:05 | The unbox check and the blink comparator |
| 5 | 2:05 to 2:40 | Forger vs Fieldwork, and the case |
| 6 | 2:40 to 3:00 | The vision: agents can now buy one-of-one things |

---

## Beat 1 · 0:00 to 0:15 · Yuki's problem

**Visual:** Phone screen of a chat. Yuki in Tokyo holds up a grey jacket. Cut to a message from a buyer in Singapore with a photo: a stain on the sleeve. Text over: "6,000 yen. Her word against his."
**Screen:** none; shot of a mock chat, then a hard cut to `/sell`.
**Voice-over:** "Yuki is a student in Tokyo. She sold a jacket. The buyer in Singapore says it arrived stained. She has no proof it was clean. Today, nobody does."

## Beat 2 · 0:15 to 0:55 · One Take

**Visual:** Yuki turns the jacket in front of the camera. A code is on screen. Timer counts 12 seconds. Then the record builds on screen: tags appear (brand from the label, size, "light wear, left cuff"), the Gemini zoom crops into the cuff, a grade range "3 to 4" appears, the listing flips between English and Japanese. Show the "Shown / Declared / Can't judge" lanes quickly.
**Screen:** `/sell` (take recorder), then `/pass/[id]` (Garment Pass).
**Voice-over:** "Fieldwork asks for one thing: a twelve-second video. Gemini watches it. It reads the label, zooms in on the flaws by itself, and writes the listing in any language. It only claims what it can see. What it can't see, smell or fit, it marks as 'declared', not shown."

## Beat 3 · 0:55 to 1:25 · The agent buys it

**Visual:** A buyer types one sentence into Gemini-powered chat: "A dark wool coat, medium, no stains, under 8,000 yen, for Singapore." Agent steps appear: searching by evidence, asking the garment ("Is there any mark on the sleeve?" answer in English with the exact crop), then "Payment held. Released only if the unboxing matches." Brief caption: "Payment simulated."
**Screen:** `/agent`, then `/pass/[id]` with "Ask the garment" open.
**Voice-over:** "A buyer's AI agent finds the jacket by its evidence, not by seller prose. It asks the garment questions and gets answers with the exact crop, or 'not in the take'. Then it holds the payment. Money moves only if the parcel matches the video."

## Beat 4 · 1:25 to 2:05 · Unbox and the blink comparator

**Visual:** The buyer in Singapore films the unboxing. The system pairs frames. **Blink comparator moment (hero shot, give it 12 seconds):** the listing crop and the arrival crop of the sleeve flash back and forth; nothing moves. Verdict card: "Consistent with the listing." Seller paid (simulated). Then the twist: the buyer's claimed stain photo is overlaid and the comparator shows no stain on the sleeve in either clip. Show "Can't tell" briefly with the random close-up request: "Show the inside collar", with caption "No money moves on 'can't tell'."
**Screen:** `/unbox/[id]`.
**Voice-over:** "When it arrives, the buyer films the unboxing. Gemini and computer vision line up the two videos and flash between them. Watch the sleeve. Nothing changes. Consistent with the listing, so Yuki is paid. If it can't tell, it never guesses: it asks for one close-up the buyer could not have prepared."

## Beat 5 · 2:05 to 2:40 · Forger vs Fieldwork, and the case

**Visual:** Split screen titled "Forger vs Fieldwork". Left: an AI-edited photo with a fake stain added. Right: Fieldwork's blink comparator, the stain flashes as "differs", with the changed spot highlighted. Then a small ladder graphic: faked photo, JPEG, screenshot, re-photographed, with the catch rate for each [[RESULT: forger ladder numbers]]. Cut to the case card: both clips attached, three Gemini rulings agreeing, a remedy slider; for a large claim, "Sent to a person".
**Screen:** `/unbox/[id]` (differs case), then `/case/[id]`.
**Voice-over:** "Buyers can now fake damage with AI. So we attack ourselves. Here is a stain added by AI. Fieldwork catches it [[RESULT: x% of y fakes]], and we show how it fares when the fake is screenshotted or re-photographed. If a real difference shows, a case opens itself with both clips. Gemini rules three times. If they disagree, or the claim is big, a person decides."

## Beat 6 · 2:40 to 3:00 · The vision

**Visual:** Yuki's jacket on a shelf, then a stream of one-of-one items (a jacket, a bag, a phone) each with a small Garment Pass tag; Gemini, ADK and Cloud Run logos in a line; end card: "Fieldwork. Shopping agents can't buy one-of-a-kind things yet. Now they can." Add the results line with real numbers: "[[RESULT: grade agreement vs untuned Gemini; catch rate on planted changes; cost per check]]".
**Screen:** `/pass/[id]`, then end card.
**Voice-over:** "Agents can already buy a new phone, because every copy is identical. A used jacket is one of a kind. Fieldwork gives it a record an agent can read and a check an agent can trust. Built on Gemini, ADK and Cloud Run. Sell it in one take. Settle it in one unboxing."

---

## Recording checklist

- Use the live Cloud Run URL on a real phone. Record screen and a second angle for Yuki's hands.
- Pre-record a fallback clip for every beat. Keep the blink comparator clip clean: crop tight, no UI noise.
- Put real numbers on screen only from the final evaluation. If a number is missing, drop the line, not the feature.
- Never show the words "verified", "certified" or "guaranteed". Label simulated payment on screen.
- Captions on all voice-over (the judges may watch on mute). Subtitles in English; Japanese text for Yuki's listing shown on screen.
- Hard stop at 3:00.
