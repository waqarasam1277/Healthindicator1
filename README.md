# Metabolic Disorder Risk Calculator

A comprehensive web application for healthcare professionals to assess metabolic disorder risk in patients using validated medical formulas and AI-powered recommendations.

## Features

### 🏥 Patient Assessment
- **Comprehensive Input Form**: Collect patient demographics, anthropometric data, and laboratory values
- **Real-time Calculations**: Automatic computation of BMI, TyG Index, and TG/HDL ratio
- **Risk Categorization**: Color-coded risk levels based on TyG Index thresholds
- **AI-Powered Recommendations**: Personalized health advice using OpenAI integration

### 📊 Medical Calculations
- **BMI (Body Mass Index)**: weight / (height²)
- **TyG Index**: ln((Fasting Glucose × Triglycerides) / 2)
- **TG/HDL Ratio**: Triglycerides / HDL cholesterol

### 🎯 Risk Categories
- **Low Risk**: TyG Index < 8.0 (Green)
- **Moderate Risk**: TyG Index 8.0-8.5 (Yellow)
- **High Risk**: TyG Index > 8.5 (Red)

### 💾 Data Management
- **Secure Storage**: Patient records stored in Supabase database
- **Patient List**: View and filter all patient records
- **Export Functionality**: Download individual or bulk patient data as CSV
- **Search & Filter**: Quick patient lookup capabilities

### 🔐 Security & Authentication
- **Healthcare Staff Login**: Email/password authentication
- **Row Level Security**: Secure data access controls
- **API Key Protection**: Secure handling of external API credentials

## Technology Stack

- **Frontend**: HTML5, TailwindCSS, Vanilla JavaScript
- **Backend**: Supabase (PostgreSQL database, Authentication, Row Level Security)
- **AI Integration**: OpenAI GPT-3.5-turbo for health recommendations
- **Deployment**: Compatible with Netlify, Vercel, GitHub Pages

## Setup Instructions

### 1. Database Setup (Supabase)

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL migration in `supabase/migrations/create_patient_records.sql`
3. Get your project URL and anon key from Settings > API

### 2. OpenAI Setup

1. Create an OpenAI account at [openai.com](https://openai.com)
2. Generate an API key from the API section
3. Ensure you have credits available for API calls

### 3. Configuration

Update the configuration variables in `script.js`:

```javascript
const SUPABASE_URL = 'your-supabase-project-url';
const SUPABASE_ANON_KEY = 'your-supabase-anon-key';
const OPENAI_API_KEY = 'your-openai-api-key';
```

### 4. Authentication Setup

In your Supabase dashboard:
1. Go to Authentication > Settings
2. Disable email confirmation for faster testing
3. Add healthcare staff users manually or enable sign-up

### 5. Deployment

#### Netlify
1. Connect your GitHub repository
2. Set build command: `npm run build` (if using build process)
3. Set publish directory: `/` (for static files)
4. Add environment variables in Netlify dashboard

#### Vercel
1. Import project from GitHub
2. Configure environment variables
3. Deploy automatically

#### GitHub Pages
1. Enable GitHub Pages in repository settings
2. Use GitHub Actions for deployment with environment variables

## Usage Guide

### For Healthcare Professionals

1. **Login**: Use your healthcare credentials to access the system
2. **Patient Assessment**:
   - Fill in patient information form
   - Review real-time calculations
   - Analyze risk categorization
   - Read AI-generated recommendations
3. **Save Results**: Store patient records for future reference
4. **Export Data**: Download individual or bulk patient reports
5. **Patient Management**: View and search through patient history

### Medical Formulas Reference

#### BMI Categories
- Underweight: < 18.5
- Normal: 18.5-24.9
- Overweight: 25-29.9
- Obese: ≥ 30

#### TyG Index Interpretation
- Low metabolic risk: < 8.0
- Moderate metabolic risk: 8.0-8.5
- High metabolic risk: > 8.5

#### TG/HDL Ratio
- Optimal: < 2.0
- Borderline: 2.0-3.5
- High risk: > 3.5

## Security Features

- **Row Level Security**: Database-level access controls
- **Authentication Required**: All data operations require login
- **API Key Protection**: Secure handling of external service credentials
- **Input Validation**: Comprehensive form validation and sanitization
- **HTTPS Only**: Secure data transmission

## Development

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Code Structure
```
├── index.html          # Main application interface
├── script.js           # Application logic and API integrations
├── styles.css          # Custom styles (if needed)
├── supabase/
│   └── migrations/     # Database schema
└── README.md          # Documentation
```

### Key Functions
- `calculateMetrics()`: Performs medical calculations
- `categorizeRisk()`: Determines risk level based on TyG Index
- `generateAIRecommendations()`: Integrates with OpenAI for advice
- `saveResults()`: Stores patient data in database
- `loadPatients()`: Retrieves patient records

## API Integration

### OpenAI Integration
The application uses OpenAI's GPT-3.5-turbo model to generate personalized health recommendations based on:
- Patient demographics
- Calculated metabolic markers
- Risk assessment results
- Medical best practices

### Supabase Integration
- **Authentication**: Email/password login for healthcare staff
- **Database**: PostgreSQL with Row Level Security
- **Real-time**: Automatic updates when data changes

## Compliance & Medical Disclaimer

⚠️ **Important Medical Disclaimer**:
This tool is designed for healthcare professionals and should be used as a supplementary assessment tool only. All medical decisions should be made by qualified healthcare providers based on comprehensive patient evaluation.

- Results should be interpreted by qualified medical professionals
- Not intended for direct patient use
- Should not replace clinical judgment
- Ensure compliance with local healthcare regulations (HIPAA, GDPR, etc.)

## Support & Maintenance

### Updating Medical Formulas
Medical calculations are modularized in the `calculateMetrics()` function for easy updates:

```javascript
function calculateMetrics(data) {
    // Update formulas here as medical standards evolve
    const bmi = data.weight / (data.height * data.height);
    const tygIndex = Math.log((data.glucose * data.triglycerides) / 2);
    const tgHdlRatio = data.triglycerides / data.hdl;
    
    return { bmi, tygIndex, tgHdlRatio };
}
```

### Adding New Risk Factors
Extend the risk categorization by modifying the `categorizeRisk()` function and updating the database schema as needed.

## License

This project is intended for healthcare use. Please ensure compliance with local medical software regulations and data protection laws.