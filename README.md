# Metabolic Disorder Risk Calculator

A comprehensive web application for healthcare professionals to assess metabolic disorder risk in patients using validated medical formulas and AI-powered recommendations. **Now with Google Sheets integration for seamless data management!**

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

### 💾 Data Management with Google Sheets
- **Google Sheets Integration**: Patient records automatically saved to your Google Sheet
- **Real-time Sync**: Data immediately appears in your spreadsheet
- **Color-coded Risk Levels**: Automatic highlighting based on risk assessment
- **Export Functionality**: Download individual patient reports as PDF
- **Search & Filter**: Quick patient lookup capabilities
- **No Database Setup**: Simple integration without complex database configuration

### 🔐 Security & Data Privacy
- **Your Data, Your Control**: All patient data stored in your personal Google Sheet
- **No Third-party Storage**: Direct integration with your Google Workspace
- **HIPAA Compliance Ready**: Use Google Workspace Business plans for compliance requirements

## Technology Stack

- **Frontend**: HTML5, TailwindCSS, Vanilla JavaScript
- **Data Storage**: Google Sheets with Google Apps Script API
- **AI Integration**: OpenAI GPT-3.5-turbo for health recommendations
- **Visualization**: Canvas-based advanced gauge charts
- **Export**: jsPDF for professional PDF reports
- **Deployment**: Compatible with Netlify, Vercel, GitHub Pages

## Quick Setup

### 1. Google Sheets Setup (5 minutes)

**Follow the detailed guide in `GOOGLE_SHEETS_SETUP.md`**

Quick steps:
1. Create a new Google Sheet
2. Go to Extensions > Apps Script
3. Paste the code from `/app/google-apps-script.js`
4. Deploy as web app with "Anyone" access
5. Copy the deployment URL

### 2. Configure Your Application

Update `/app/script.js` with your Google Apps Script URL:

```javascript
const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
```

### 3. Optional: OpenAI Setup

For AI-powered recommendations, add your OpenAI API key:

```javascript
const OPENAI_API_KEY = 'your-openai-api-key';
```

### 4. Run the Application

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Usage Guide

### For Healthcare Professionals

1. **Patient Assessment**:
   - Fill in patient information form
   - Review real-time calculations
   - Analyze risk categorization
   - Read AI-generated recommendations

2. **Save Results**: Patient records automatically saved to your Google Sheet

3. **Patient Management**: 
   - View all patients in the application
   - Search and filter patient records
   - Export individual patient reports as PDF

4. **Google Sheets Benefits**:
   - Access data from anywhere
   - Create custom reports and charts
   - Share with colleagues (with proper permissions)
   - Backup and version control through Google Drive

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

## Advanced Features

### 📈 Visual Analytics
- **Advanced Gauge Charts**: Real-time risk visualization
- **Color-coded Metrics**: Instant visual feedback
- **Professional UI**: Healthcare-grade interface design

### 📄 Professional Reports
- **PDF Export**: Comprehensive patient assessment reports
- **Medical Formatting**: Professional medical document layout
- **Reference Values**: Integrated clinical guidelines

### 🤖 AI Integration
- **Personalized Recommendations**: OpenAI-powered health advice
- **Clinical Context**: Recommendations based on all patient metrics
- **Professional Tone**: Medical-grade language and suggestions

## Google Sheets Integration Benefits

### ✅ Advantages over Traditional Databases:
- **No Setup Required**: No database configuration or hosting
- **Familiar Interface**: Everyone knows how to use spreadsheets
- **Built-in Analytics**: Use Google Sheets' powerful analysis tools
- **Easy Sharing**: Control access with Google's permission system
- **Automatic Backup**: Google Drive handles backups and version history
- **Free to Use**: No database hosting costs
- **Scalable**: Handles thousands of patient records efficiently

### 📊 What You Get in Your Google Sheet:
- **Organized Data**: Properly formatted columns and headers
- **Color Coding**: Risk levels automatically highlighted
- **Sortable Data**: Click column headers to sort
- **Filtering**: Use Google Sheets' built-in filters
- **Charts**: Create custom charts and graphs
- **Export Options**: Download as Excel, CSV, PDF

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
├── script.js           # Application logic and Google Sheets integration
├── styles.css          # Custom styles
├── google-apps-script.js    # Google Apps Script backend code
├── GOOGLE_SHEETS_SETUP.md   # Detailed setup instructions
└── README.md          # Documentation
```

### Key Functions
- `saveToGoogleSheets()`: Saves patient data to Google Sheets
- `loadFromGoogleSheets()`: Retrieves patient records
- `calculateMetrics()`: Performs medical calculations
- `categorizeRisk()`: Determines risk level based on TyG Index
- `generateAIRecommendations()`: Integrates with OpenAI for advice

## API Integration

### Google Sheets API Endpoints
- `POST`: Save new patient record
- `GET`: Retrieve all patient records
- Automatic data validation and formatting
- Error handling and fallback to localStorage

### OpenAI Integration
The application uses OpenAI's GPT-3.5-turbo model to generate personalized health recommendations based on:
- Patient demographics
- Calculated metabolic markers
- Risk assessment results
- Medical best practices

## Compliance & Medical Disclaimer

⚠️ **Important Medical Disclaimer**:
This tool is designed for healthcare professionals and should be used as a supplementary assessment tool only. All medical decisions should be made by qualified healthcare providers based on comprehensive patient evaluation.

- Results should be interpreted by qualified medical professionals
- Not intended for direct patient use
- Should not replace clinical judgment
- Ensure compliance with local healthcare regulations (HIPAA, GDPR, etc.)

### HIPAA Compliance with Google Sheets
- Use Google Workspace Business plans for HIPAA compliance
- Enable 2-factor authentication
- Control access permissions carefully
- Consider using Google Workspace's advanced security features

## Deployment Options

### Netlify
1. Connect your GitHub repository
2. Build settings: `npm run build` (if using build process)
3. Publish directory: `/`
4. Add environment variables for API keys

### Vercel
1. Import project from GitHub
2. Configure environment variables
3. Deploy automatically

### GitHub Pages
1. Enable GitHub Pages in repository settings
2. Use GitHub Actions for deployment

## Support & Maintenance

### Updating Medical Formulas
Medical calculations are modularized for easy updates:

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
Extend the risk categorization by modifying the `categorizeRisk()` function and updating both the application and Google Apps Script.

### Troubleshooting
See `GOOGLE_SHEETS_SETUP.md` for detailed troubleshooting guide.

## License

This project is intended for healthcare use. Please ensure compliance with local medical software regulations and data protection laws.

---

## What's New in This Version

### ✨ Google Sheets Integration
- **Removed Supabase dependency** - No more complex database setup
- **Direct Google Sheets integration** - Your data stays in your Google account
- **Simplified deployment** - Just configure one Google Apps Script URL
- **Better data control** - Full ownership of your patient data
- **Enhanced privacy** - No third-party database storage

### 🚀 Quick Start
1. Follow `GOOGLE_SHEETS_SETUP.md` (5-minute setup)
2. Update the Google Sheets URL in `script.js`
3. Run `npm run dev`
4. Start assessing patients!

Ready to transform your metabolic risk assessments with the power of Google Sheets? Get started in minutes!