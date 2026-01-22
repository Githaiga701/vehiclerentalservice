Backend Service Modules
- **Auth & Identity**: Phone-based OTP login, JWT issuance/refresh, roles (renter, owner, admin). Ties to user profile and KYC status for gatekeeping bookings/listings.
- **KYC**: Document uploads (ID, selfie), address capture, verification state, admin approval workflow. Blocks core actions until approved.
- **Vehicles**: CRUD vehicles, photos, pricing/availability, assign drivers to vehicles.
- **Bookings**: Create booking requests, owner accept/decline, status transitions, links to payment and driver update events.
- **Driver Link / Payments**: Generates single-use, time-bound secure tokens/links for drivers to submit payment updates; captures amount/method/timestamp and logs for audit.
- **Payments (offline status capture)**: Records payment state (pending/paid), source (driver update), links to booking; writes audit log entries.
- **Ratings & Trust**: Post-trip ratings (vehicle, owner, driver), trust score computation (KYC completion, completion rate, payment accuracy, disputes).
- **Admin**: KYC approval, user/booking/payment log views, flagging and trust-score edits, analytics dashboards.
- **Notifications**: SMS for OTP and secure driver links; future WhatsApp.

API Layer
- **NestJS REST APIs**, versioned (e.g., `/v1`), with:
  - **Auth endpoints**: request OTP, verify OTP, issue/refresh JWT.
  - **KYC endpoints**: upload ID/selfie, submit address, check status.
  - **Vehicle endpoints**: list/search, create/update/delete, upload photos, assign driver.
  - **Booking endpoints**: create request, owner accept/decline, fetch booking state.
  - **Driver payment link endpoints**: generate/validate token; driver submits payment status.
  - **Payment status endpoints**: read/update payment state (admin overrides as needed).
  - **Ratings endpoints**: post-trip ratings.
  - **Admin endpoints**: KYC approvals, flags, analytics views.
- **Guards/Middleware**:
  - Auth guard (JWT), role guard, KYC gate (blocks core flows until approved).
  - Idempotency/CSRF protections on driver link submission; rate limiting on OTP.

Database Layer (PostgreSQL via Prisma)
- **Users** (role, phone, email optional, status), **Sessions/OTPs** (short-lived), **KYC** (doc refs, status, reviewer).
- **Vehicles** (owner FK, metadata, pricing, availability), **VehiclePhotos**.
- **Drivers** (linked to vehicles), **DriverLinks** (token, expiry, booking FK, used_at).
- **Bookings** (renter FK, vehicle FK, owner FK, status lifecycle), **Payments** (status, method, amount, timestamps, audit trail).
- **Ratings** (vehicle/owner/driver targets), **Flags/TrustScores** (computed/overrides).
- **Audit logs** for payment updates and admin actions.

## Auth & OTP Flow
1) User enters phone -> OTP issued (short-lived), SMS delivered.
2) User verifies OTP -> JWT (access/refresh) issued; user record created/updated.
3) Access to bookings/listings gated by **KYC status**; role guard for admin endpoints.

## Driver Secure Link Flow
1) Owner accepts booking -> system generates single-use, time-bound token + link for driver; SMS sent.
2) Driver opens link (no full login), submits payment status (yes/no), amount, method, timestamp.
3) System validates token/expiry, updates payment status to **PAID**, booking to **PAYMENT CONFIRMED**, logs audit, notifies owner, updates analytics/trust inputs.

## Admin Dashboards
- **KYC queue** (approve/reject), **user/booking/payment logs**, **flags/trust overrides**, **analytics** (bookings, completion vs cancel, reported revenue, driver reliability, payment accuracy).

## Future Mobile API Reuse Strategy
- Keep APIs stateless, versioned REST (compatible with mobile clients).
- Shared DTOs/types in `packages/shared` to align web/mobile/backend contracts.
- Auth via the same JWT/OTP endpoints; enforce KYC/role gates uniformly.
- Maintain clean separation of admin-only endpoints and role guards.
- Notification abstraction so SMS/WhatsApp providers can be swapped without client change.