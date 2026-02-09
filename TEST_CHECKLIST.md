# Endpoint Test Checklist

This checklist enumerates API endpoints discovered in `apps/api/src` and the tests that should be implemented for each.

Format: Endpoint — Tests required

## Auth (/auth)
- POST /auth/request-otp — valid phone, invalid phone, rate-limit, Redis unavailable
- POST /auth/verify-otp — correct code, wrong code, expired code, replay code
- POST /auth/refresh — valid refresh token, invalid refresh token
- GET /auth/me — unauthenticated (401), authenticated (200)
- PUT /auth/profile — validation errors, successful update, unauthorized
- POST/PUT /auth/profile-picture — file upload success, invalid file
- GET /auth/admin/otps — admin allowed (200), non-admin forbidden (403), Redis fallback message
- PUT /auth/admin/users/role — admin only, invalid role payload
- POST /auth/admin/make-admin/:phone — admin only, setup endpoint (public with secret)
- GET /auth/admin/users — admin only

## Vehicles (/vehicles)
- POST /vehicles — owner authenticated, renter forbidden, validation errors, file uploads
- GET /vehicles — public list, filters, pagination
- GET /vehicles/my-vehicles — owner only, unauthorized otherwise
- GET /vehicles/:id — public
- PUT /vehicles/:id — owner only, cannot edit other owners' vehicles
- DELETE /vehicles/:id — owner only, soft-delete or no-content
- POST /vehicles/:id/driver — owner only
- DELETE /vehicles/:id/driver — owner only
- PUT /vehicles/:id/availability — owner only
- PUT /vehicles/:id/approve — admin only
- PUT /vehicles/:id/reject — admin only
- GET /vehicles/admin/pending — admin only

## Bookings (/bookings)
- POST /bookings — renter only, validation, vehicle availability, double-booking prevention
- GET /bookings/my-bookings — renter only
- GET /bookings/owner-bookings — owner only
- GET /bookings/:id — renter or owner or admin as permitted
- PUT /bookings/:id/status — owner or admin (approve/reject), invalid transitions

## KYC (/kyc)
- POST /kyc — authenticated users, file uploads, validation
- GET /kyc/status — authenticated
- GET /kyc/admin/pending — admin only
- PUT /kyc/admin/:userId/approve — admin only
- PUT /kyc/admin/:userId/reject — admin only

## Contact (/contact)
- POST /contact — public submit
- GET /contact/admin/all — admin only
- GET /contact/admin/unread-count — admin only
- GET /contact/admin/:id — admin only
- PUT /contact/admin/:id/read|reply|archive — admin only
- DELETE /contact/admin/:id — admin only

## Health (/health)
- GET /health — public, returns service health and dependencies

## Security & Edge Cases (apply across endpoints)
- Expired JWT handling (401)
- Missing JWT (401)
- Insufficient role (403)
- Invalid payloads (400) — test DTO validation messages
- SQL injection attempts — ensure 200/400 and no DB errors
- XSS attempts — input accepted but escaped on render (UI E2E)
- Duplicate registrations (409 or validation failure)

Use this checklist to generate tests automatically and track per-endpoint test coverage.
