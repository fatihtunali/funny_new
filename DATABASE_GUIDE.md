# 🔐 Customer Portal & Database Integration Guide

## ✅ What's Been Added

Your Funny Tourism website now has a complete customer portal with database integration!

### 🎯 Features Implemented:

1. **User Authentication**
   - Customer registration
   - Login/Logout system
   - Secure password hashing (bcrypt)
   - JWT session management
   - Protected routes

2. **Customer Dashboard**
   - View all bookings
   - Track booking status (Pending/Confirmed/In Progress/Completed/Cancelled)
   - See booking details (dates, travelers, pricing)
   - Payment status tracking
   - Member statistics

3. **Booking Management**
   - Create bookings from inquiry form
   - Automatic reference number generation (e.g., FT12345678ABCD)
   - Store traveler information
   - Price calculation and storage
   - Special requests

4. **Database Schema**
   - Users table (customer accounts)
   - Bookings table (all reservations)
   - ContactInquiry table (for non-registered inquiries)

---

## 🗄️ Database Configuration

**Database Server:** 93.113.96.11:3306
**Database Name:** funny_web
**Username:** fatihtunali
**Password:** Dlr235672.-Yt

**Connection String:**
```
mysql://fatihtunali:Dlr235672.-Yt@93.113.96.11:3306/funny_web
```

---

## 📊 Database Tables

### **1. User Table**
Stores customer account information

| Field | Type | Description |
|-------|------|-------------|
| id | String | Unique user ID (auto-generated) |
| email | String | Email (unique, for login) |
| name | String | Full name |
| phone | String | Phone number (optional) |
| country | String | Country (optional) |
| password | String | Hashed password |
| emailVerified | Boolean | Email verification status |
| createdAt | DateTime | Registration date |
| updatedAt | DateTime | Last update |

### **2. Booking Table**
Stores all customer bookings

| Field | Type | Description |
|-------|------|-------------|
| id | String | Unique booking ID |
| userId | String | Link to User |
| referenceNumber | String | Booking reference (e.g., FT12345678ABCD) |
| packageName | String | Name of tour package |
| packageId | String | Package identifier (optional) |
| travelDate | DateTime | Departure date |
| duration | String | Trip duration |
| hotelCategory | String | 3-star/4-star/5-star |
| adults | Int | Number of adults |
| children3to5 | Int | Children age 3-5 |
| children6to10 | Int | Children age 6-10 |
| totalPrice | Float | Total booking cost |
| currency | String | EUR/USD/GBP |
| status | Enum | PENDING/CONFIRMED/IN_PROGRESS/COMPLETED/CANCELLED |
| paymentStatus | Enum | PENDING/PAID/REFUNDED |
| specialRequests | Text | Customer notes |
| createdAt | DateTime | Booking creation date |
| confirmedAt | DateTime | Confirmation date (optional) |
| completedAt | DateTime | Completion date (optional) |

---

## 🚀 How to Use

### **For Customers:**

#### **1. Create Account**
- Go to: http://localhost:3000/register
- Fill in: Name, Email, Password, Phone (optional), Country (optional)
- Submit → Automatically logged in and redirected to dashboard

#### **2. Login**
- Go to: http://localhost:3000/login
- Enter: Email & Password
- Submit → Redirected to dashboard

#### **3. View Dashboard**
- Go to: http://localhost:3000/dashboard
- See:
  - Total bookings count
  - Confirmed bookings
  - Pending bookings
  - Member since date
  - List of all bookings with full details

#### **4. Make a Booking**
- Must be logged in
- Go to package page
- Use pricing calculator
- Click "Book This Package"
- Booking automatically saved to database
- View in dashboard

#### **5. Track Booking Status**
- Login to dashboard
- See all bookings with status:
  - 🟡 **PENDING** - Awaiting confirmation
  - 🟢 **CONFIRMED** - Booking confirmed
  - 🔵 **IN_PROGRESS** - Trip in progress
  - ⚫ **COMPLETED** - Trip completed
  - 🔴 **CANCELLED** - Booking cancelled

---

## 🔧 API Endpoints

### **Authentication**

**Register**
```
POST /api/auth/register
Body: {
  email: string,
  password: string,
  name: string,
  phone?: string,
  country?: string
}
```

**Login**
```
POST /api/auth/login
Body: {
  email: string,
  password: string
}
```

**Logout**
```
POST /api/auth/logout
```

**Get Current User**
```
GET /api/auth/me
Returns: User data with booking count
```

### **Bookings**

**Create Booking**
```
POST /api/bookings
Requires: Authentication
Body: {
  packageName: string,
  packageId?: string,
  travelDate: string,
  duration: string,
  hotelCategory: string,
  adults: number,
  children3to5: number,
  children6to10: number,
  totalPrice: number,
  currency: string,
  specialRequests?: string
}
```

**Get User Bookings**
```
GET /api/bookings
Requires: Authentication
Returns: Array of user's bookings
```

---

## 🔐 Security Features

1. **Password Security**
   - Passwords hashed with bcrypt (12 salt rounds)
   - Never stored in plain text

2. **Session Management**
   - JWT tokens with 7-day expiry
   - HttpOnly cookies (protected from XSS)
   - Secure flag in production

3. **Protected Routes**
   - Dashboard requires authentication
   - Booking creation requires login
   - API routes validate sessions

4. **Database Security**
   - Connection credentials in .env file
   - .env file in .gitignore (not committed to repo)
   - Prisma ORM prevents SQL injection

---

## 🛠️ Admin Operations

### **View All Users**
```sql
SELECT id, email, name, phone, country, createdAt
FROM User
ORDER BY createdAt DESC;
```

### **View All Bookings**
```sql
SELECT
  b.referenceNumber,
  u.name AS customerName,
  u.email,
  b.packageName,
  b.travelDate,
  b.totalPrice,
  b.status,
  b.paymentStatus,
  b.createdAt
FROM Booking b
JOIN User u ON b.userId = u.id
ORDER BY b.createdAt DESC;
```

### **View Pending Bookings**
```sql
SELECT * FROM Booking
WHERE status = 'PENDING'
ORDER BY createdAt DESC;
```

### **Confirm a Booking**
```sql
UPDATE Booking
SET
  status = 'CONFIRMED',
  confirmedAt = NOW()
WHERE referenceNumber = 'FT12345678ABCD';
```

### **Update Payment Status**
```sql
UPDATE Booking
SET paymentStatus = 'PAID'
WHERE referenceNumber = 'FT12345678ABCD';
```

### **Get Customer Booking History**
```sql
SELECT * FROM Booking
WHERE userId = 'user-id-here'
ORDER BY createdAt DESC;
```

---

## 📱 Testing the System

### **Test Flow:**

1. **Register a new customer**
   ```
   Visit: http://localhost:3000/register
   Email: test@example.com
   Password: test123
   Name: Test User
   ```

2. **Login**
   ```
   Visit: http://localhost:3000/login
   Use same credentials
   ```

3. **View Dashboard**
   ```
   Auto-redirected to: http://localhost:3000/dashboard
   Should see: 0 bookings initially
   ```

4. **Create a test booking**
   - Go to package page
   - Fill pricing calculator
   - Click "Book This Package"
   - Check dashboard - booking appears!

5. **Verify in Database**
   ```sql
   SELECT * FROM User WHERE email = 'test@example.com';
   SELECT * FROM Booking WHERE userId = [user-id-from-above];
   ```

---

## 🎨 UI Components

### **Navigation Updates**
- Shows "Login" button when not authenticated
- Shows "My Bookings" button when logged in
- Detects auth status automatically

### **Dashboard Features**
- **Stats Cards:**
  - Total Bookings
  - Confirmed Count
  - Pending Count
  - Member Since

- **Booking Cards:**
  - Package name
  - Reference number
  - Status badge (color-coded)
  - Travel date
  - Duration
  - Hotel category
  - Traveler count
  - Total price
  - Payment status

### **Status Colors**
- 🟢 Green = Confirmed
- 🟡 Yellow = Pending
- 🔵 Blue = In Progress
- ⚫ Gray = Completed
- 🔴 Red = Cancelled

---

## 🔄 Database Migrations

If you need to update the database schema:

```bash
# 1. Edit prisma/schema.prisma
# 2. Run migration
npx prisma migrate dev --name your_migration_name

# 3. Regenerate Prisma Client
npx prisma generate
```

---

## 📧 Next Steps (Optional Enhancements)

1. **Email Notifications**
   - Send confirmation emails on booking
   - Send status update emails
   - Welcome email on registration

2. **Payment Integration**
   - Add Stripe/PayPal
   - Process real payments
   - Update payment status automatically

3. **Admin Panel**
   - Manage bookings (approve/reject)
   - Update booking status
   - View customer list
   - Generate reports

4. **Email Verification**
   - Send verification email on registration
   - Require email verification before booking

5. **Password Reset**
   - "Forgot Password" functionality
   - Email reset link

6. **Profile Management**
   - Edit profile page
   - Change password
   - Update contact info

---

## 🐛 Troubleshooting

**"Can't reach database server"**
- Check internet connection
- Verify IP: 93.113.96.11 is accessible
- Check firewall settings

**"User not found" error**
- Clear browser cookies
- Try logging in again
- Check if user exists in database

**"Failed to create booking"**
- Ensure user is logged in
- Check browser console for errors
- Verify all required fields are filled

---

## 📝 Important Files

```
funny_new/
├── .env                          # Database credentials
├── prisma/
│   └── schema.prisma            # Database schema
├── lib/
│   ├── prisma.ts                # Database connection
│   └── auth/
│       ├── passwordUtils.ts     # Password hashing
│       └── session.ts           # Session management
├── app/
│   ├── api/
│   │   ├── auth/               # Auth API routes
│   │   └── bookings/           # Booking API routes
│   ├── login/page.tsx          # Login page
│   ├── register/page.tsx       # Registration page
│   └── dashboard/page.tsx      # Customer dashboard
└── components/
    └── Navigation.tsx          # Updated navigation
```

---

## ✅ System is Ready!

Your complete customer portal is live and functional. Customers can now:
- ✅ Create accounts
- ✅ Login securely
- ✅ Make bookings
- ✅ Track their trips
- ✅ View booking history
- ✅ See booking status

All data is stored in your MySQL database at **93.113.96.11** and ready for production use!
