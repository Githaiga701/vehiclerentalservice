BUSINESS REQUIREMENTS DOCUMENT (BRD) 
Website-First Vehicle Rental, Hire & Leasing Platform 
Phase 1 – Web MVP (Mobile-Ready Backend) 
1. PURPOSE 
This document defines the business and functional requirements for a website-first 
vehicle rental platform designed to: 
• Validate market demand 
• Onboard vehicle owners, vehicles, and drivers 
• Collect booking and payment confirmation data 
• Build trust through KYC, ratings, and analytics 
• Prepare a shared backend for future mobile applications 
2. GOALS & OBJECTIVES 
Primary Goals 
• Enable discovery and booking of vehicles across multiple categories 
• Reduce fraud using mandatory KYC 
• Track payments without processing money 
• Build data-driven trust scores and performance analytics 
Secondary Goals 
• Launch quickly with low cost 
• Be SEO-friendly for organic growth 
• Reuse backend for future mobile app 
3. SCOPE (PHASE 1) 
In Scope 
• Website (responsive, mobile-friendly) 
• Authentication & KYC 
Kerzner business use 
• Vehicle listings & booking requests 
• Driver-based payment confirmation 
• Ratings & analytics 
• Admin moderation tools 
Out of Scope 
• In-app payments 
• Escrow 
• Automated commissions 
• Insurance integration 
• Native mobile apps 
4. TECHNOLOGY STACK (RECOMMENDED) 
Frontend 
• Next.js / React 
• Tailwind CSS or Bootstrap 
• SEO-optimized pages 
Backend 
• Node.js (NestJS or Express) 
• REST APIs (mobile-ready) 
Database 
• PostgreSQL or MySQL 
Authentication 
• Phone number + OTP (mandatory) 
• Email (optional) 
Notifications 
• SMS (Phase 1) 
• WhatsApp (future phase) 
Kerzner business use 
5. USER TYPES 
5.1 Vehicle Owner 
• Lists and manages vehicles 
• Assigns drivers to vehicles 
• Accepts or declines bookings 
• Views payment confirmations 
• Views analytics and performance data 
5.2 Renter 
• Searches and requests vehicles 
• Pays offline (cash / M-Pesa / bank) 
• Confirms vehicle receipt 
• Rates owner, vehicle, and driver 
No standalone Driver account 
• Drivers are linked to vehicles 
• Drivers interact only via secure payment update link 
6. WEBSITE STRUCTURE & FUNCTIONAL REQUIREMENTS 
6.1 PUBLIC PAGES (NO LOGIN) 
Home Page 
• Platform explanation 
• Categories: 
• Cars 
• Vans 
• Luxury / Wedding 
• Buses 
• Nganya 
• Construction 
Kerzner business use 
• Lease / Contract 
• Call-to-Action: 
• List Your Vehicle 
• Find a Vehicle 
Search & Listings Page 
Filters: 
• Category 
• Location 
• With driver / without driver 
• Daily / Monthly 
Each listing displays: 
• Vehicle photos 
• Price 
• Rating 
• KYC verification badge 
Vehicle Detail Page 
Displays: 
• Vehicle details 
• Driver details (if applicable) 
• Owner rating 
• Booking button → Request Booking 
6.2 AUTHENTICATION & KYC 
Registration / Login 
• Phone number entry 
• OTP verification 
Kerzner business use 
KYC Page (MANDATORY) 
Required for both renters and owners: 
• Full name 
• National ID upload 
• Selfie upload 
• Address / location 
Users cannot book or list vehicles without completed KYC. 
6.3 OWNER DASHBOARD (CORE MODULE) 
My Vehicles 
• Add / edit vehicles 
• Upload photos 
• Assign driver to vehicle 
• Set pricing and availability 
Booking Requests 
• View booking requests 
• Accept / decline 
• View renter profile, KYC status, and ratings 
Payment Updates 
• View payment status 
• View driver payment confirmation 
• Override payment status (admin-controlled rule) 
Analytics Dashboard 
Monthly view: 
Kerzner business use 
• Total bookings 
• Completed vs cancelled trips 
• Reported revenue 
• Vehicle performance 
• Driver reliability metrics 
6.4 DRIVER PAYMENT UPDATE FLOW (CRITICAL) 
Driver does NOT have full login access. 
Flow: 
1. Booking confirmed 
2. System sends secure, one-time link to driver (SMS) 
3. Link opens limited payment update page 
Driver Payment Update Page 
Fields: 
• Booking ID (read-only) 
• Payment received (Yes / No) 
• Amount received 
• Payment method (Cash / M-Pesa / Bank) 
• Date & time received 
System Behavior After Update 
One driver update automatically: 
• Marks renter payment status → PAID 
• Updates booking status → PAYMENT CONFIRMED 
• Notifies owner 
• Logs transaction 
• Updates analytics 
Kerzner business use 
6.5 RENTER DASHBOARD 
My Bookings 
• Booking status 
• Payment status (Paid / Pending) 
• Driver confirmation timestamp 
Ratings 
After completed trip, renter can: 
• Rate vehicle 
• Rate owner 
• Rate driver 
6.6 ADMIN PANEL (VERY IMPORTANT) 
Admin capabilities: 
• Approve / reject KYC 
• Flag suspicious users 
• View all bookings 
• View payment logs 
• Edit trust scores 
• Platform-wide analytics dashboard 
7. BOOKING & PAYMENT FLOW (END-TO-END) 
1. User visits website 
2. Registers with phone number 
3. Completes KYC 
4. Searches or lists vehicle 
5. Booking requested 
Kerzner business use 
6. Owner accepts booking 
7. Driver receives payment 
8. Driver updates payment via secure link 
9. System syncs all statuses 
10. Trip completes 
11. Ratings and analytics updated 
8. TRUST, RATINGS & ANALYTICS 
Ratings 
• Renter rates: vehicle, owner, driver 
• Owner rates: renter 
• Ratings only after completed booking 
Trust Score (System-Generated) 
Based on: 
• KYC completion 
• Booking completion rate 
• Payment update accuracy 
• Ratings 
• Dispute flags 
Displayed as: 
• Low / Medium / High trust 
9. NON-FUNCTIONAL REQUIREMENTS 
• Responsive (desktop + mobile web) 
• Fast load time (<3 seconds) 
• Secure storage of KYC data 
• Role-based access control 
Kerzner business use 
• Audit logs for payment updates 
• Scalable backend for mobile app reuse 
10. FUTURE PHASES (REFERENCE) 
Phase 2 
• Paid verification badges 
• Featured listings 
• Subscriptions for fleet owners 
Phase 3 
• In-app payments 
• Escrow services 
• Automated commission handling 
• Native mobile apps 
11. SUCCESS METRICS (KPIs) 
• Number of KYC-verified users 
• Monthly booking requests 
• Payment update accuracy 
• Completed trips 
• Repeat renters 
12. APPROVAL & SIGN-OFF 
This BRD is approved by: 
• Product Owner 
• Engineering Lead 
• Business Stakeholder