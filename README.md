# Dessishub Assessor

A modern candidate assessment system with skill-based tier calculation and comprehensive admin dashboard.

## Features

### 🎯 Candidate Assessment
- **Skill-based Registration**: Candidates register with their technical skills
- **Automatic Tier Calculation**: Smart algorithm assigns candidates to appropriate tiers (1-5)
- **Persistent Data Storage**: All candidate data is securely stored and survives server restarts
- **Email Notifications**: Automated tier result notifications

### 🛡️ Admin Dashboard
- **Secure Authentication**: Admin-only access with username/password
- **Analytics Dashboard**: Visual tier distribution charts and statistics
- **Candidate Management**: View, search, filter, and manage all candidates
- **Data Export**: CSV and Excel export functionality
- **Email System**: Send notifications to candidates directly from dashboard

### 🎨 Modern UI/UX
- **Curved Design Language**: Consistent rounded corners and modern aesthetics
- **Custom Color Scheme**: Professional color palette with CSS custom properties
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Smooth Animations**: Hover effects and transitions for enhanced user experience

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Authentication**: NextAuth.js
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Database**: File-based JSON storage (easily replaceable with real database)
- **Email**: Nodemailer integration
- **Security**: bcrypt password hashing

## Tier System

The application automatically calculates candidate tiers based on their technical skills:

- **Tier 1**: Junior Frontend Developer
- **Tier 2**: Mid-level Frontend Developer  
- **Tier 3**: Senior Frontend Developer
- **Tier 4**: Full-stack Developer
- **Tier 5**: Senior Full-stack Developer

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/dessishub-assessor.git
cd dessishub-assessor
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Add your environment variables:
```env
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Email configuration (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

4. Run the development server:
```bash
npm run dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Default Admin Access

- **Username**: `sirneo`
- **Password**: `Neo@2025`

## Project Structure

```
dessishub-assessor/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin dashboard pages
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Public dashboard pages
│   └── api/               # API routes
├── components/            # Reusable React components
├── lib/                   # Utility functions and database
├── data/                  # JSON data storage (gitignored)
└── public/               # Static assets
```

## Key Features Explained

### Persistent Storage
- Candidates and admins are stored in JSON files
- Data survives server restarts and development reloads
- Easy to migrate to a real database later

### Security
- Admin passwords are hashed with bcrypt
- Session-based authentication with NextAuth
- Sensitive data files are gitignored

### Responsive Design
- Mobile-first approach
- Consistent spacing and typography
- Curved design language throughout

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

**Developer**: Sir NEO  
**Email**: neo@dessishub.com  
**GitHub**: [@neo-codes](https://github.com/neo-codes)

---

Built with ❤️ for Dessishub