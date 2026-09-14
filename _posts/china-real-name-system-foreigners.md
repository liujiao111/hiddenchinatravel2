---
title: "China Real-Name System: Why Foreign Passports Get Blocked (2026 Guide)"
seoTitle: "China Real-Name System 2026: Why Passports Fail"
excerpt: "Why foreign passports fail China’s real-name system for SIMs, hotels, and apps — and the sequence that avoids silent registration blocks in 2026."
coverImage: "/assets/blog/china-real-name-system-foreigners/cover.webp"
date: "2026-03-23T09:38:03+00:00"
dateModified: "2026-09-05T16:00:00+00:00"
author:
  name: "Joy Liu"
  picture: "/brand/founder/avatar-joy.webp"
ogImage:
  url: "/assets/blog/china-real-name-system-foreigners/cover.webp"
canonical: "https://hiddenchinatravel.com/china-real-name-system-foreigners"
section: "Travel China Essentials"
sourceUrl: "https://hiddenchinatravel.com/china-real-name-system-foreigners"
---
You’re standing at a China Mobile counter in Shanghai. You’ve handed over your passport. The staff member has typed in your details carefully — you watched every keystroke. The screen flashes red. _Registration failed._

You try the store next door. Same passport. Same details. Same result. You pull up Google on the store’s Wi-Fi and find a Reddit thread from 2019 that says “just use your passport number.” That’s exactly what you did. Still nothing.

Here’s the part that nobody explains upfront: **you didn’t do anything wrong.** Your passport is valid. The details are correct. The staff member knows what they’re doing. And you’re still blocked.

That’s not a glitch. That’s the system working exactly as intended — just not for you. Welcome to China’s **real-name registration system (实名制, shí míng zhì)**.

Stuck on a screen that only wants **姓名** and **身份证号码**? What to type is [Chinese ID number vs passport](/chinese-id-number-foreigners). This page is the rest of it: why a correct passport still fails at a SIM counter, a hotel computer, or an app backend.

**Confused by China’s real-name verification rules?** This guide is part of our [Travel China Guide for Foreigners](/independent-travel-china), where we explain the practical systems foreign travelers need to understand before visiting China, including passport verification, hotel registration, ticket booking, payments, internet access, and common app restrictions.

## Quick Answer: Why Foreigners Get Blocked (Even When Everything Is Correct)

![Foreign passports prepared for China's real-name registration](/assets/blog/china-real-name-system-foreigners/foreign-passports-for-real-name-registration.webp)

China’s real-name system was built from the ground up around one document: the Chinese national ID card (身份证). Every carrier system, every app backend, every payment platform was designed to verify _that_ specific format — 18 digits, all numeric, cross-checked against a national database in real time.

Your passport is the legal substitute. But it’s a substitute that was bolted on later, handled differently at every carrier and app, and still breaks in ways that have nothing to do with whether your information is accurate. **Foreigners get blocked not because their details are wrong, but because the system wasn’t built to process them reliably in the first place.**

The chain looks like this:  
Phone number → registered to real ID → WeChat/Alipay tied to that number → bank account tied to passport + phone → everything else downstream.

If any link in that chain fails — and for foreigners, the first link is already fragile — nothing after it works. Not WeChat Pay. Not Didi. Not food delivery. Not ticketing. All-or-nothing.

* * *

## How the System Actually Works (Simplified)

Think of it as layers you have to build in sequence:

  1. **Passport / ID** — the root identity document
  2. **Chinese phone number** — registered in-person to that ID
  3. **WeChat or Alipay account** — tied to that phone number
  4. **Chinese bank account** — tied to passport and phone
  5. **Everything else** — ride apps, food delivery, hotels, [train tickets](/book-china-high-speed-rail-foreigners)

For a Chinese citizen, this assembles in about 20 minutes. Their ID is machine-readable, pre-indexed in government databases, and instantly verifiable. The whole thing clicks together.

For a foreigner, you’re entering the same system through a side door that was added as an afterthought. Each layer is a roll of the dice.

## Why Foreigners Fail: A Simple Framework

After seeing dozens of people go through this, the failures almost always come down to one of three root causes. Everything else is a variation of these.

### Problem 1 — Format

The system expects a specific data format. Chinese IDs are 18 numeric digits. Your passport is alphanumeric. Some fields, some systems, some kiosks simply cannot process what you’re giving them — not because of human error, but because the database was never built to handle it.

### Problem 2 — Data

Even when your format is accepted, your passport has no existing footprint in Chinese government databases. A Chinese ID resolves against a national register instantly. Your passport has to be manually verified against Ministry of Public Security records — a process that varies by carrier, is inconsistently implemented, and can fail silently for reasons that nobody at the counter can explain or fix.

### Problem 3 — Process

Foreigners make up a tiny fraction of SIM registrations in most Chinese cities. Many front-line staff have never done a foreign passport registration before, or they do it rarely enough that they default to the wrong procedure. An official carrier flagship store in a major city is a fundamentally different experience from a reseller kiosk at a shopping mall — even if both have the same carrier sign on the wall.

One bad link in any of these three areas and the whole thing fails. Which brings us to the specifics.

* * *

## The Real Reason Everything Breaks in China (At Once)

Most countries have siloed digital systems. Your phone plan is separate from your bank, which is separate from your social media. If one breaks, the others still work.

China’s system is a closed loop. Everything is connected, everything requires verified identity, and every verification goes back to the same root document. **This means it’s extraordinarily efficient for the 1.4 billion people it was built for — and extraordinarily brittle for everyone it wasn’t.**

When a foreigner hits a wall at the first step (SIM registration), they don’t just lose phone service. They lose WeChat. They lose WeChat Pay. They lose Alipay. They can’t hail a Didi. They can’t order from Meituan. They can’t check in to some hotels digitally. One failure cascades into total disconnection because each piece of the chain depends on the piece before it.

That’s the thing to understand before you arrive: this is not a series of separate problems. It is one problem with many faces. Fix the first link correctly, and the rest follows. Fail at the first link, and you’re fighting the entire ecosystem.

* * *

## Why Foreigners Get Blocked: The Specific Reasons

Each of the following is a real failure mode. Some are format issues. Some are data issues. Some are process issues. Most people hit more than one at the same time.

### 1\. Your Passport Format Doesn’t Match the Input Field

**What you see:** The registration form rejects your passport number, or the staff member enters it and the system returns an immediate error. You’ve spelled everything correctly. Nothing helps.

**What’s actually happening:** Many backend systems — especially older carrier registration platforms — were built for 18-digit numeric Chinese IDs. Alphanumeric passport numbers (like `P<USA<SMITH…`) don’t pass the field validation. It’s not that your data is wrong. It’s that the field was never designed to hold your data.

### 2\. Your Country’s Passport Doesn’t Resolve Against the MPS Database

**What you see:** You select “passport” from the document type dropdown, enter your details, and get either a spinning wheel that goes nowhere or a vague “verification failed” message. No explanation. No next steps.

**What’s actually happening:** Carrier systems run real-time checks against the Ministry of Public Security (MPS) database. Chinese IDs resolve instantly. Foreign passports require a different verification path — one that is patchy, slower, and inconsistently supported. Some passport issuing countries resolve fine. Others fail silently every time, with no error message that means anything.

### 3\. You’re at a Reseller, Not a Carrier Store

**What you see:** The store looks official. It has the carrier’s branding everywhere. The staff tries for 15 minutes, fails, and tells you to “try another store.” Or they just register the SIM under their own ID and hand it to you — which works until it doesn’t.

**What’s actually happening:** Authorized resellers and franchise operators don’t have the same back-office tools as official flagship stores. The procedure for registering a foreign passport is different from a domestic one, and reseller staff often haven’t been trained on it. The only reliable option is an official carrier-owned store, ideally in a major city with experience serving expats and international visitors.

### 4\. Your Airport SIM Has a Hidden Expiry Window

**What you see:** Your SIM works for a few days after landing, then suddenly stops. Data gone. Calls gone. You assume the SIM died.

**What’s actually happening:** Many tourist SIMs sold at airports are registered under a bulk corporate license to get you through the first 72 hours or 7 days. After that window closes, the SIM requires your personal registration to stay active. The packaging rarely explains this clearly in English. It’s not a dead SIM — it’s an unverified SIM that’s been deliberately suspended.

### 5\. WeChat Has Its Own Separate Verification Wall

**What you see:** You’ve installed WeChat, entered your phone number, received the SMS code — and then hit a screen asking you to have an existing user verify you by scanning a QR code. You don’t know anyone on WeChat yet. You’re stuck.

**What’s actually happening:** WeChat runs a friend-verification layer for new accounts as an anti-bot and anti-fraud measure. It has nothing to do with real-name registration — it’s a separate system entirely. You can have a perfectly valid Chinese SIM and still be locked out of WeChat because you have zero existing contacts to vouch for you. One person scanning your QR code for 10 seconds solves this permanently. But if you arrive solo with no contacts, that one person is hard to find when you need them most.

### 6\. Your Foreign Number Never Receives the SMS Code

**What you see:** You enter your home country number (+1, +44, +61, etc.) into a Chinese app. It says the code has been sent. You wait 60 seconds. Nothing arrives. You request it again. Still nothing. The app eventually locks you out for too many attempts.

**What’s actually happening:** Chinese apps use local SMS gateways to send verification codes. Many of these gateways have incomplete or restricted international routing — some deliberately, some because they were never built for it. The code was sent. It just didn’t reach you. This is a carrier routing issue, not an app issue, and there’s no fix from your end other than using a Chinese number.

### 7\. Bank Account Setup Has Its Own Gauntlet

**What you see:** You go to a bank with your passport and your Chinese SIM. You wait in a queue for 45 minutes. The teller looks at your visa, makes a phone call, and tells you they can’t open an account for you today — or that you need additional documents not mentioned anywhere online.

**What’s actually happening:** Chinese banks have discretion over which visa types they accept for account opening, and individual branches often have their own interpretation of the policy. Tourist visa holders face stricter scrutiny than long-term residents. Some branches deal with foreigners regularly and have a clear process. Others have genuinely never done it and are making it up as they go. The branch you choose matters as much as the documents you bring.

* * *

## How to Fix It: The Right Sequence

### Step 1 — Get a Properly Registered SIM First (Everything Depends on This)

This is the foundation. Without a verified Chinese phone number in your name, nothing downstream works reliably. Go to an official carrier flagship store — not a reseller, not an airport kiosk. Bring your physical passport (not a photo of it). China Unicom flagship stores in major cities are generally the most experienced with foreign passport registration.

> 🔗 **Start here →** [Our complete guide to getting a Chinese SIM card as a foreigner](/china-sim-card-for-foreigners) covers which carriers handle foreign passports best, exactly which documents to bring, and what to say if the first attempt fails. Read this before you go to any store.

### Step 2 — Set Up WeChat on Day One, Not When You Need It

Don’t wait until you’re standing in a restaurant with a QR code menu and no way to pay. Install WeChat immediately after landing. The first person you speak to — hotel front desk, a colleague, anyone — ask them to scan your verification QR code. It takes them 10 seconds. It unlocks WeChat for you permanently. Do not put this off.

### Step 3 — Use International Card Linking as a Bridge

If you’re a short-term visitor, you don’t necessarily need a Chinese bank account anymore. Both Alipay and WeChat Pay now allow foreigners to link international Visa, Mastercard, or AmEx cards directly. Daily limits apply, but it covers most day-to-day spending without the bank account headache.

> 🔗 **Do this next →** [Setting up Alipay and WeChat Pay as a foreigner](/digital-survival-china-payment-guide) — step-by-step screenshots, which card types actually work, and the daily limit workarounds that most guides skip. This is how you get to cashless in China without a Chinese bank account.

### Step 4 — Open a Bank Account Early If You’re Staying Long-Term

If you’re in China for more than a few weeks, a Chinese bank account removes the spending limits and opens up the full ecosystem. Bank of China and ICBC are the most foreigner-friendly, particularly in branches near expat neighborhoods or international business districts. Go on a weekday morning. Bring your passport, your Chinese SIM number written on paper, and your visa. Some branches also want a proof of address or employment — call ahead if you can.

* * *

## Pro Tips From People Who’ve Learned the Hard Way

  * **Screenshot your SIM registration confirmation.** Some systems ask you to re-verify weeks later. If you have a photo of your number and the confirmation screen, that process takes minutes instead of another trip to the store.
  * **The carrier app is not for you.** Carrier apps are built for Chinese ID holders. Don’t try to register or manage your account through the app. Go in person, every time.
  * **Your SIM will expire if you leave China.** Prepaid SIMs get deactivated if unused for roughly 6 months. If you’re coming back to China after a long gap, check whether your number is still active before assuming your whole setup works.
  * **Bring a physical passport, not a phone photo.** Many stores need to scan both your photo page and your visa page. Some will refuse to proceed if you only have a digital copy, regardless of how clear it is.
  * **If it fails twice, ask for a manager — politely.** Senior staff have access to override procedures and escalation pathways that front-line employees don’t routinely use. It’s worth asking.
  * **VPN before you land, not after.** China’s internet restrictions affect which apps you can download and which sites you can access. Install and test your VPN on your home network before you arrive. Once you’re in China, getting it set up for the first time is significantly harder.

* * *

## Frequently Asked Questions

### Why do foreigners get blocked in Chinese apps even with correct information?

Because most Chinese apps were built for Chinese national ID numbers — a specific 18-digit format that cross-checks against government databases in real time. Foreign passports use different formats and different verification paths that many apps handle inconsistently or not at all. Your information being correct doesn’t guarantee the system can process it.

### Is the real-name system mandatory for tourists visiting China?

Yes. The real-name requirement applies to everyone in China regardless of nationality or visa type. There is no tourist exemption. You are required to register SIM cards, and most digital services require identity verification to function. What varies is how smoothly the registration process works for foreign passports — which is the entire problem this article is about.

### What is passport verification in China, and why does it fail?

Passport verification is how carrier systems and apps confirm your identity against Ministry of Public Security records when you register. For Chinese citizens, this is instant because their ID data is pre-loaded. For foreign passports, the system has to query a different database that is slower, patchier, and not consistently supported across all carriers and platforms. It fails silently, with error messages that don’t explain the actual cause.

### Can I use a foreign phone number to register WeChat in China?

Yes — WeChat accepts international numbers. But you’ll still need an existing WeChat user to verify your new account by scanning your QR code, and without a Chinese number, payment features are more restricted. For anything beyond basic messaging, a Chinese SIM linked to WeChat is the practical path.

### Why does my SIM card work for calls but not for app SMS verification?

Different problem, different cause. Your SIM is working fine. The issue is with how Chinese apps route their verification SMS — many use local gateways that have restricted or broken international delivery. The app sent the code. It just didn’t get to you. The fix is a Chinese number, not a new SIM.

### Do I need a Chinese bank account to use Alipay or WeChat Pay?

Not for basic use anymore. Since 2023–2024, both platforms allow foreign visitors to link international cards (Visa, Mastercard, AmEx) directly. Daily limits apply, but it covers most daily spending. For higher limits or online shopping on Chinese platforms, a linked Chinese bank account is still required.

### Which carrier is best for foreigners registering a SIM in China?

China Unicom is generally the safest bet. They have a dedicated international visitor program, and their flagship stores in major cities handle foreign passport registrations more regularly than others. China Mobile has better rural coverage if you’re traveling outside cities. Telecom is strong in parts of the south. The carrier matters less than whether you’re at an official flagship store versus a reseller.

### What happens if I give wrong information during real-name registration?

Providing false information or using someone else’s identity documents is illegal under Chinese law. Penalties range from account suspension to fines to, in serious cases, legal action. Beyond the legal risk, it also means you have no legitimate way to recover your account if something goes wrong. Register under your own real name with your own passport.

![Foreigner successfully paying with WeChat Pay QR code in China](/assets/blog/china-real-name-system-foreigners/image-1.webp)

* * *

## The Bottom Line

China’s real-name system isn’t trying to exclude foreigners. It was just never designed with you in mind. It’s a closed loop that runs seamlessly for 1.4 billion people and throws up unpredictable walls for everyone else — not out of malice, but out of indifference to edge cases.

The foreigners who get through it quickly are not the ones who found a workaround. They’re the ones who understood the structure well enough to do each step correctly the first time: the right store, the right documents, the right sequence, no shortcuts.

You now know more about how this works than most people who’ve lived in China for months. Use it.

## Related Guides

Planning your China trip? These practical guides may also help you deal with real-name verification, bookings, payments, and travel apps:

  * [Chinese ID Number vs Passport](/chinese-id-number-foreigners) — what to type when a form wants 身份证
  * [China SIM Card for Foreigners](/china-sim-card-for-foreigners) — passport registration for a +86 number
  * [Alipay or WeChat Pay Verification Failed?](/alipay-wechat-pay-verification-failed) — when identity checks block payment setup
  * [Hotels in China for Foreigners](/hotels-in-china-for-foreigners) — passport check-in that matches real-name rules
  * [Attraction Tickets in China](/attraction-tickets-in-china) — passport booking for popular sights
  * [Payments in China for Foreigners](/payments-in-china)
  * [Internet, VPN and SIM in China](/internet-in-china)

_Last updated: August 2026. Real-name verification rules, passport support, and app requirements in China may change over time — always confirm details with the carrier, bank, or app during setup._
