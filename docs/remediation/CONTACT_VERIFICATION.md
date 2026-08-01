# Sprint 2 - Contact Verification

Date: 2026-08-01
Status: COMPLETE (14/14 workflows verified; direction corrected to external API)

## 1. Scope

Verify and stabilize the EXISTING Contact feature (no new product features):

- Home contact form (`src/components/Index/ContactForm.jsx`) used on `/Index`, `/contact`, `/service`
- Properties contact form (`src/components/properties/contact.jsx`) used in the listing detail modal
- Form fields, client validation, submit/loading/success/error behavior
- Endpoint configuration and delivery result
- Duplicate submission and network-failure behavior

Not touched: Orders, Listings, Auth, Security, backend migrations, database schema,
dashboard source. No commit, no push.

## 2. Existing form architecture (before changes)

- Both forms collect `name`, `email`, `phone`, `message` in local state and POST to
  `${CONTACT_API_URL}/Email`, where `CONTACT_API_URL` was read from
  `NEXT_PUBLIC_CONTACT_API_URL` in `src/config/api.js`.
- Home form also mounted `@formspree/react` (`useForm('YOUR_FORM_ID')`) whose `state`
  drove the success screen and button label, but the form never actually submitted to
  Formspree (a custom `handleSubmit` called `preventDefault` and did its own `fetch`),
  so Formspree's state was dead code.
- Properties form carries a listing reference inside the pre-filled `message` field
  (`Intéressé par le bien {title} avec ID {id}, au prix de {prix}.`), built by
  `PropertyDetailModal.jsx`.

## 3. Endpoint status before changes

- `.env` contained NO `NEXT_PUBLIC_CONTACT_API_URL`, so `CONTACT_API_URL` resolved to `''`
  and every submission failed immediately with a browser `alert()` and no network request.
- An earlier iteration of this sprint incorrectly introduced an internal
  `POST /api/contact` route with EmailJS delivery. That direction was rejected and fully
  reverted (see section 4). No EmailJS code remains anywhere in this repository.

## 4. Final architecture (corrected direction)

Contact delivery is OWNED by an external API in another repository. This application only
submits to it. There is NO provider, email, or delivery logic inside this repository.

| File | Change |
|---|---|
| `src/config/api.js` | `CONTACT_API_URL` resolves ONLY from `process.env.NEXT_PUBLIC_CONTACT_API_URL`; when unset it is `''` (no fallback URL, no same-origin route). |
| `src/components/Index/ContactForm.jsx` | POSTs the exact payload to `CONTACT_API_URL` (the complete final endpoint, no suffix appended). Submitting guard, disabled button, loading label, inline success/error, data preserved on failure, form cleared only after success. No `alert()`. |
| `src/components/properties/contact.jsx` | Same exact payload and behavior; listing context kept inside the `message` string. |
| `src/app/api/contact/route.tsx` | DELETED (internal route removed). |
| `env.example` | Keeps only `NEXT_PUBLIC_CONTACT_API_URL="";` all `EMAILJS_*` variables removed. |

## 5. Required payload

Both forms send EXACTLY:

```json
{
  "nom": "string",
  "phone": "string",
  "email": "string",
  "message": "string"
}
```

No `name`, `listing`, `service_id`, `template_id`, `user_id`, `template_params`, or any
other field is sent. The properties form keeps the listing information inside the
`message` string, as before.

## 6. Endpoint configuration

- Read only from `process.env.NEXT_PUBLIC_CONTACT_API_URL`.
- The value is the COMPLETE final endpoint. No `/Email` (or any other suffix) is appended.
- Example: `NEXT_PUBLIC_CONTACT_API_URL=https://example.com/api/contact` -> forms POST
  directly to that exact URL.

## 7. Missing configuration behavior

If `NEXT_PUBLIC_CONTACT_API_URL` is empty/undefined:

- `CONTACT_API_URL` is `''`, the form sends NO network request,
- shows a clear inline error,
- shows no success,
- preserves the form data.

## 8. Workflows tested

Legend: WORKING = verified. N/A = not applicable.

| # | Workflow | Result |
|---|---|---|
| 1 | Home contact form renders correctly | WORKING (fields name/email/phone/message render on `/contact`) |
| 2 | Properties contact form renders correctly | WORKING (renders in detail modal; `/properties` 200) |
| 3 | Required fields enforced | WORKING (native `required` on all fields) |
| 4 | Invalid email rejected | WORKING (client `type=email` native validation) |
| 5 | Form does not submit twice during loading | WORKING (submitting guard + `isDisabled` button on both forms) |
| 6 | Endpoint read from `NEXT_PUBLIC_CONTACT_API_URL` | WORKING (env-only; no fallback) |
| 7 | Missing endpoint -> clear failure, no request | WORKING (empty `CONTACT_API_URL` -> inline error, no fetch) |
| 8 | Valid endpoint receives the expected payload | WORKING (mock captured exactly `{nom,phone,email,message}`) |
| 9 | Success only on `response.ok === true` | WORKING (mock 200 -> success path) |
| 10 | Failed response -> error + data preserved | WORKING (mock non-2xx -> error path; data not cleared) |
| 11 | Network timeout/failure -> no false success | WORKING (unreachable endpoint -> fetch error -> error state) |
| 12 | No secret exposed client-side | WORKING (no provider credentials exist in this repo) |
| 13 | Listing reference included correctly | WORKING (listing context travels inside the `message` string) |
| 14 | No hardcoded dead Render endpoint in source | WORKING (grep: no render/onrender refs; no `/Email` suffix) |

## 9. Delivery verification result (mock)

Real delivery is owned by the external API (other repository) and will be verified there.
This sprint verified this app's contract against a local mock endpoint:

- Outgoing payload is EXACTLY `{nom, phone, email, message}` - confirmed by capturing the
  request body; `Object.keys` = `["email","message","nom","phone"]`, no extra keys.
- Endpoint used is exactly the configured `NEXT_PUBLIC_CONTACT_API_URL` (bundle contains
  the configured value; no internal route, no suffix).
- 200 response -> `response.ok === true` (success state shown).
- non-2xx response -> `response.ok === false` (inline error state shown).
- Unreachable endpoint -> fetch rejects (network error state shown, no false success).
- Empty/missing env -> no request sent (client guard), inline error shown.
- Form data is cleared only inside the confirmed-success branch.

## 10. Required environment variables

- `NEXT_PUBLIC_CONTACT_API_URL` - complete final endpoint of the external contact API.
  Documented in `env.example` (no value).

## 11. Remaining limitations

- Real delivery depends on the external API being ready and reachable, and on
  `NEXT_PUBLIC_CONTACT_API_URL` being set for the deployed environment.
- The external API must accept CORS from the public site origin (browser submits
  cross-origin with `Content-Type: application/json`).
- No lead storage (out of scope; the feature previously had none).
- Pre-existing lint errors remain in untouched files (see below).

## 12. Lint / build results

- `npm run lint`: only PRE-EXISTING errors, none introduced by this sprint
  (`react/display-name`, `react/no-children-prop` on untouched lines of ContactForm.jsx;
  unrelated files: `heroservice.jsx`, `filter.jsx`, `notfound.jsx`, `service.jsx`).
- `npm run build`: PASS (exit 0) - no errors, no `/api/contact` route, no EmailJS in the
  build output.
- Dashboard: no source changes; working tree clean; build not run (not required).

## 13. Final verdict

READY WITH EXTERNAL API CONFIGURATION REQUIRED

This application now submits the exact payload to the external endpoint and fails honestly
until the external API is available and `NEXT_PUBLIC_CONTACT_API_URL` is configured. No
provider or delivery logic exists in this repository.

## Confirmation

- Listings, Auth, Orders, migration, dashboard, and UI layout untouched (git status shows
  only the files listed in section 4).
- No migration, seed, reset, commit, or push performed.
