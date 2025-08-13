// Import Supabase client
import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js';
import jsPDF from 'https://cdn.skypack.dev/jspdf';
import html2canvas from 'https://cdn.skypack.dev/html2canvas';

// Configuration
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
const OPENAI_API_KEY = 'YOUR_OPENAI_API_KEY';
const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbwEvFs88l76BoRZQByL4PUaMgFrgwYu8BvIilHKhsmcJwgo0tsmUqCk-k_alVvaC-ZX/exec';

// Initialize Supabase client
let supabase = null;
let currentUser = { email: 'demo@healthcare.com', id: 'demo-user' }; // Demo user for non-auth mode

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadPatients();
});

function initializeApp() {
    // Initialize Supabase if credentials are provided
    if (SUPABASE_URL !== 'YOUR_SUPABASE_URL' && SUPABASE_ANON_KEY !== 'YOUR_SUPABASE_ANON_KEY') {
        supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
}

function setupEventListeners() {
    // Navigation
    document.getElementById('calculatorTab').addEventListener('click', () => showSection('calculator'));
    document.getElementById('patientsTab').addEventListener('click', () => showSection('patients'));
    
    // Patient form
    document.getElementById('patientForm').addEventListener('submit', handleFormSubmit);
    document.getElementById('clearForm').addEventListener('click', clearForm);
    
    // Results actions
    document.getElementById('saveResults').addEventListener('click', saveResults);
    document.getElementById('exportPdfResults').addEventListener('click', exportPdfResults);
    
    // Patient management
    document.getElementById('searchPatients').addEventListener('input', filterPatients);
    document.getElementById('syncToGoogleSheets').addEventListener('click', syncToGoogleSheets);
    
    // Real-time calculation
    const inputs = ['weight', 'height', 'glucose', 'triglycerides', 'hdl'];
    inputs.forEach(id => {
        document.getElementById(id).addEventListener('input', debounce(calculateRealTime, 500));
    });
}

function showSection(section) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(s => s.classList.add('hidden'));
    
    // Show selected section
    document.getElementById(section + 'Section').classList.remove('hidden');
    
    // Update navigation
    document.querySelectorAll('.nav-tab').forEach(tab => tab.classList.remove('active'));
    document.getElementById(section + 'Tab').classList.add('active');
    
    if (section === 'patients') {
        loadPatients();
    }
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = getFormData();
    if (!validateFormData(formData)) {
        showToast('Please fill in all required fields', 'error');
        return;
    }
    
    const calculations = calculateMetrics(formData);
    const riskCategory = categorizeRisk(calculations.tygIndex);
    
    displayResults(calculations, riskCategory);
    createAdvancedGauges(calculations, riskCategory);
    
    // Generate AI recommendations
    generateAIRecommendations(formData, calculations, riskCategory);
}

function getFormData() {
    return {
        fullName: document.getElementById('fullName').value,
        age: parseInt(document.getElementById('age').value),
        gender: document.getElementById('gender').value,
        weight: parseFloat(document.getElementById('weight').value),
        height: parseFloat(document.getElementById('height').value),
        glucose: parseFloat(document.getElementById('glucose').value),
        triglycerides: parseFloat(document.getElementById('triglycerides').value),
        hdl: parseFloat(document.getElementById('hdl').value),
        hba1c: parseFloat(document.getElementById('hba1c').value),
        diabetes: document.getElementById('diabetes').value
    };
}

function validateFormData(data) {
    const required = ['fullName', 'age', 'gender', 'weight', 'height', 'glucose', 'triglycerides', 'hdl', 'hba1c', 'diabetes'];
    return required.every(field => data[field] !== '' && data[field] !== null && !isNaN(data[field]) || field === 'fullName' || field === 'gender' || field === 'diabetes');
}

function calculateMetrics(data) {
    // BMI = weight / (height²)
    const bmi = data.weight / (data.height * data.height);
    
    // TyG Index = ln((Fasting Glucose × Triglycerides) / 2)
    const tygIndex = Math.log((data.glucose * data.triglycerides) / 2);
    
    // TG/HDL Ratio = Triglycerides / HDL
    const tgHdlRatio = data.triglycerides / data.hdl;
    
    return {
        bmi: Math.round(bmi * 10) / 10,
        tygIndex: Math.round(tygIndex * 100) / 100,
        tgHdlRatio: Math.round(tgHdlRatio * 100) / 100
    };
}

function categorizeRisk(tygIndex) {
    if (tygIndex < 8.0) {
        return {
            level: 'Low Risk',
            description: 'Low metabolic disorder risk',
            color: 'bg-green-100 border-green-200 text-green-800',
            colorClass: 'success'
        };
    } else if (tygIndex <= 8.5) {
        return {
            level: 'Moderate Risk',
            description: 'Moderate metabolic disorder risk - monitoring recommended',
            color: 'bg-yellow-100 border-yellow-200 text-yellow-800',
            colorClass: 'warning'
        };
    } else {
        return {
            level: 'High Risk',
            description: 'High metabolic disorder risk - immediate attention required',
            color: 'bg-red-100 border-red-200 text-red-800',
            colorClass: 'danger'
        };
    }
}

function displayResults(calculations, riskCategory) {
    // Show results container
    document.getElementById('resultsContainer').classList.remove('hidden');
    document.getElementById('noResults').classList.add('hidden');
    
    // Update calculated values
    document.getElementById('bmiValue').textContent = calculations.bmi;
    document.getElementById('tygValue').textContent = calculations.tygIndex;
    document.getElementById('ratioValue').textContent = calculations.tgHdlRatio;
    
    // Update risk category
    const riskElement = document.getElementById('riskCategory');
    riskElement.className = `p-4 rounded-lg mb-6 text-center border ${riskCategory.color}`;
    document.getElementById('riskLevel').textContent = riskCategory.level;
    document.getElementById('riskDescription').textContent = riskCategory.description;
}

function createAdvancedGauges(calculations, riskCategory) {
    // Show gauge container and hide no data message
    document.getElementById('gaugeChartsContainer').classList.remove('hidden');
    document.getElementById('noGaugeData').classList.add('hidden');
    
    // Update gauge values
    document.getElementById('bmiGaugeValue').textContent = calculations.bmi;
    document.getElementById('tygGaugeValue').textContent = calculations.tygIndex;
    document.getElementById('ratioGaugeValue').textContent = calculations.tgHdlRatio;
    document.getElementById('riskGaugeValue').textContent = riskCategory.level;
    
    // Create advanced gauge visualizations
    createAdvancedGauge('bmiGauge', calculations.bmi, [
        { min: 0, max: 18.5, color: '#60a5fa', label: 'Underweight' },
        { min: 18.5, max: 25, color: '#34d399', label: 'Normal' },
        { min: 25, max: 30, color: '#fbbf24', label: 'Overweight' },
        { min: 30, max: 40, color: '#f87171', label: 'Obese' }
    ], 40);
    
    createAdvancedGauge('tygGauge', calculations.tygIndex, [
        { min: 6, max: 8, color: '#34d399', label: 'Low Risk' },
        { min: 8, max: 8.5, color: '#fbbf24', label: 'Moderate Risk' },
        { min: 8.5, max: 12, color: '#f87171', label: 'High Risk' }
    ], 12);
    
    createAdvancedGauge('ratioGauge', calculations.tgHdlRatio, [
        { min: 0, max: 3, color: '#34d399', label: 'Ideal' },
        { min: 3, max: 4.5, color: '#fbbf24', label: 'Moderate' },
        { min: 4.5, max: 10, color: '#f87171', label: 'High Risk' }
    ], 10);
    
    // Create overall risk gauge
    createRiskGauge('riskGauge', riskCategory);
}

function createAdvancedGauge(canvasId, value, ranges, maxValue) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 15;
    
    // Draw background arc
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, Math.PI, 2 * Math.PI);
    ctx.lineWidth = 15;
    ctx.strokeStyle = '#e5e7eb';
    ctx.stroke();
    
    // Draw colored segments
    const totalRange = maxValue - ranges[0].min;
    let currentAngle = Math.PI;
    
    ranges.forEach(range => {
        const segmentAngle = ((range.max - range.min) / totalRange) * Math.PI;
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + segmentAngle);
        ctx.lineWidth = 15;
        ctx.strokeStyle = range.color;
        ctx.stroke();
        
        currentAngle += segmentAngle;
    });
    
    // Draw value needle
    const needleAngle = Math.PI + ((value - ranges[0].min) / totalRange) * Math.PI;
    const needleLength = radius - 5;
    
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(
        centerX + needleLength * Math.cos(needleAngle),
        centerY + needleLength * Math.sin(needleAngle)
    );
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#1f2937';
    ctx.stroke();
    
    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 8, 0, 2 * Math.PI);
    ctx.fillStyle = '#1f2937';
    ctx.fill();
    
    // Add glow effect
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowBlur = 10;
}

function createRiskGauge(canvasId, riskCategory) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 30;
    
    const riskColors = {
        'Low Risk': '#34d399',
        'Moderate Risk': '#fbbf24',
        'High Risk': '#f87171'
    };
    
    // Draw background circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fillStyle = '#f3f4f6';
    ctx.fill();
    
    // Draw risk level circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fillStyle = riskColors[riskCategory.level] || '#6b7280';
    ctx.fill();
    
    // Add gradient effect
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    gradient.addColorStop(0, riskColors[riskCategory.level] || '#6b7280');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.1)');
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Draw risk level text
    ctx.font = 'bold 14px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText(riskCategory.level.split(' ')[0], centerX, centerY - 5);
    
    ctx.font = '12px Arial';
    ctx.fillText(riskCategory.level.split(' ')[1] || '', centerX, centerY + 10);
    
    // Add shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 15;
}

async function generateAIRecommendations(formData, calculations, riskCategory) {
    const aiContainer = document.getElementById('aiRecommendations');
    
    // Show loading state
    aiContainer.innerHTML = `
        <div class="flex items-center justify-center py-4">
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2"></div>
            Generating personalized recommendations...
        </div>
    `;
    
    try {
        let recommendations;
        
        if (OPENAI_API_KEY !== 'YOUR_OPENAI_API_KEY') {
            // Use OpenAI API
            recommendations = await getOpenAIRecommendations(formData, calculations, riskCategory);
        } else {
            // Use mock recommendations for demo
            recommendations = getMockRecommendations(formData, calculations, riskCategory);
        }
        
        aiContainer.innerHTML = recommendations;
    } catch (error) {
        console.error('Error generating recommendations:', error);
        aiContainer.innerHTML = `
            <div class="text-red-600">
                <i class="fas fa-exclamation-triangle mr-2"></i>
                Unable to generate AI recommendations. Please try again.
            </div>
        `;
    }
}

async function getOpenAIRecommendations(formData, calculations, riskCategory) {
    const prompt = `
    As a medical AI assistant, provide personalized health recommendations for a patient with the following profile:
    
    Patient: ${formData.age}-year-old ${formData.gender}
    BMI: ${calculations.bmi}
    TyG Index: ${calculations.tygIndex}
    TG/HDL Ratio: ${calculations.tgHdlRatio}
    HbA1c: ${formData.hba1c}%
    Diabetes Status: ${formData.diabetes}
    Risk Level: ${riskCategory.level}
    
    Please provide specific recommendations for:
    1. Dietary modifications
    2. Exercise recommendations
    3. Follow-up tests or monitoring
    4. Lifestyle changes
    
    Use a professional medical tone and be specific with actionable advice.
    `;
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 500,
            temperature: 0.7
        })
    });
    
    const data = await response.json();
    return formatRecommendations(data.choices[0].message.content);
}

function getMockRecommendations(formData, calculations, riskCategory) {
    const recommendations = [];
    
    // BMI-based recommendations
    if (calculations.bmi > 25) {
        recommendations.push("**Weight Management**: Consider a structured weight loss program targeting 5-10% body weight reduction through caloric restriction and increased physical activity.");
    }
    
    // TyG Index recommendations
    if (calculations.tygIndex > 8.0) {
        recommendations.push("**Metabolic Health**: Focus on low-glycemic index foods, reduce refined carbohydrates, and consider Mediterranean-style diet patterns.");
    }
    
    // TG/HDL ratio recommendations
    if (calculations.tgHdlRatio > 3.5) {
        recommendations.push("**Lipid Management**: Increase omega-3 fatty acids, reduce saturated fats, and consider aerobic exercise 150+ minutes per week.");
    }
    
    // HbA1c recommendations
    if (formData.hba1c > 6.5) {
        recommendations.push("**Glucose Control**: Monitor blood glucose regularly, consider continuous glucose monitoring, and maintain consistent meal timing.");
    }
    
    // General recommendations
    recommendations.push("**Follow-up**: Schedule follow-up in 3-6 months to reassess metabolic markers and adjust treatment plan as needed.");
    
    return formatRecommendations(recommendations.join('\n\n'));
}

function formatRecommendations(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>')
        .replace(/^/, '<p>')
        .replace(/$/, '</p>');
}

function calculateRealTime() {
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);
    const glucose = parseFloat(document.getElementById('glucose').value);
    const triglycerides = parseFloat(document.getElementById('triglycerides').value);
    const hdl = parseFloat(document.getElementById('hdl').value);
    
    if (weight && height && glucose && triglycerides && hdl) {
        const calculations = calculateMetrics({
            weight, height, glucose, triglycerides, hdl
        });
        
        const riskCategory = categorizeRisk(calculations.tygIndex);
        
        // Update preview values
        document.getElementById('bmiValue').textContent = calculations.bmi;
        document.getElementById('tygValue').textContent = calculations.tygIndex;
        document.getElementById('ratioValue').textContent = calculations.tgHdlRatio;
        
        // Update gauges in real-time
        createAdvancedGauges(calculations, riskCategory);
        
        // Show results container
        document.getElementById('resultsContainer').classList.remove('hidden');
        document.getElementById('noResults').classList.add('hidden');
    }
}

async function saveResults() {
    const formData = getFormData();
    const calculations = calculateMetrics(formData);
    const riskCategory = categorizeRisk(calculations.tygIndex);
    const aiRecommendations = document.getElementById('aiRecommendations').innerHTML;
    
    const patientRecord = {
        ...formData,
        ...calculations,
        risk_level: riskCategory.level,
        risk_description: riskCategory.description,
        ai_recommendations: aiRecommendations,
        created_at: new Date().toISOString(),
        created_by: currentUser.email
    };
    
    try {
        if (supabase) {
            const { error } = await supabase
                .from('patient_records')
                .insert([patientRecord]);
            
            if (error) throw error;
        } else {
            // Save to localStorage for demo
            const records = JSON.parse(localStorage.getItem('patientRecords') || '[]');
            records.push({ ...patientRecord, id: Date.now() });
            localStorage.setItem('patientRecords', JSON.stringify(records));
        }
        
        showToast('Patient record saved successfully', 'success');
        loadPatients();
    } catch (error) {
        console.error('Error saving record:', error);
        showToast('Error saving record: ' + error.message, 'error');
    }
}

async function syncToGoogleSheets() {
    try {
        showToast('Syncing to Google Sheets...', 'info');
        
        let records = [];
        
        if (supabase) {
            const { data, error } = await supabase
                .from('patient_records')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            records = data || [];
        } else {
            records = JSON.parse(localStorage.getItem('patientRecords') || '[]');
        }
        
        if (records.length === 0) {
            showToast('No patient records to sync', 'warning');
            return;
        }
        
        // Prepare data for Google Sheets
        const sheetsData = records.map(record => ({
            name: record.fullName || record.full_name,
            age: record.age,
            gender: record.gender,
            weight: record.weight,
            height: record.height,
            glucose: record.glucose,
            triglycerides: record.triglycerides,
            hdl: record.hdl,
            bmi: record.bmi,
            tyg: record.tygIndex || record.tyg_index,
            tghdl: record.tgHdlRatio || record.tg_hdl_ratio,
            risk: record.risk_level
        }));
        
        // Send to Google Sheets
        const response = await fetch(GOOGLE_SHEETS_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(sheetsData)
        });
        
        if (response.ok) {
            showToast('Successfully synced to Google Sheets!', 'success');
        } else {
            throw new Error('Failed to sync to Google Sheets');
        }
        
    } catch (error) {
        console.error('Error syncing to Google Sheets:', error);
        showToast('Error syncing to Google Sheets: ' + error.message, 'error');
    }
}

async function exportPdfResults() {
    const formData = getFormData();
    const calculations = calculateMetrics(formData);
    const riskCategory = categorizeRisk(calculations.tygIndex);
    
    try {
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        
        // Header with gradient background effect
        pdf.setFillColor(102, 126, 234);
        pdf.rect(0, 0, pageWidth, 40, 'F');
        
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(24);
        pdf.setFont('helvetica', 'bold');
        pdf.text('METABOLIC RISK ASSESSMENT', pageWidth / 2, 25, { align: 'center' });
        
        // Patient Information Box
        pdf.setFillColor(248, 250, 252);
        pdf.rect(15, 50, pageWidth - 30, 35, 'F');
        pdf.setDrawColor(226, 232, 240);
        pdf.rect(15, 50, pageWidth - 30, 35, 'S');
        
        pdf.setTextColor(51, 65, 85);
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text('PATIENT INFORMATION', 20, 60);
        
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(11);
        pdf.text(`Name: ${formData.fullName}`, 20, 70);
        pdf.text(`Age: ${formData.age} years`, 100, 70);
        pdf.text(`Gender: ${formData.gender}`, 20, 78);
        pdf.text(`Assessment Date: ${new Date().toLocaleDateString()}`, 100, 78);
        
        // Measurements Section
        let yPos = 100;
        pdf.setTextColor(51, 65, 85);
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text('CLINICAL MEASUREMENTS', 20, yPos);
        
        yPos += 15;
        pdf.setFillColor(239, 246, 255);
        pdf.rect(15, yPos - 5, pageWidth - 30, 50, 'F');
        
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Weight: ${formData.weight} kg`, 20, yPos + 5);
        pdf.text(`Height: ${formData.height} m`, 100, yPos + 5);
        pdf.text(`Fasting Glucose: ${formData.glucose} mg/dL`, 20, yPos + 15);
        pdf.text(`Triglycerides: ${formData.triglycerides} mg/dL`, 100, yPos + 15);
        pdf.text(`HDL Cholesterol: ${formData.hdl} mg/dL`, 20, yPos + 25);
        pdf.text(`HbA1c: ${formData.hba1c}%`, 100, yPos + 25);
        pdf.text(`Diabetes Status: ${formData.diabetes}`, 20, yPos + 35);
        
        // Calculated Results Section
        yPos += 65;
        pdf.setTextColor(51, 65, 85);
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text('CALCULATED RISK METRICS', 20, yPos);
        
        yPos += 15;
        
        // BMI Result Box
        pdf.setFillColor(219, 234, 254);
        pdf.rect(15, yPos - 5, (pageWidth - 45) / 3, 25, 'F');
        pdf.setTextColor(30, 64, 175);
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text('BMI', 20, yPos + 5);
        pdf.setFontSize(18);
        pdf.text(calculations.bmi.toString(), 20, yPos + 15);
        
        // TyG Index Result Box
        const boxWidth = (pageWidth - 45) / 3;
        pdf.setFillColor(233, 213, 255);
        pdf.rect(15 + boxWidth + 5, yPos - 5, boxWidth, 25, 'F');
        pdf.setTextColor(109, 40, 217);
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text('TyG Index', 20 + boxWidth + 5, yPos + 5);
        pdf.setFontSize(18);
        pdf.text(calculations.tygIndex.toString(), 20 + boxWidth + 5, yPos + 15);
        
        // TG/HDL Ratio Result Box
        pdf.setFillColor(254, 215, 170);
        pdf.rect(15 + 2 * (boxWidth + 5), yPos - 5, boxWidth, 25, 'F');
        pdf.setTextColor(194, 65, 12);
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text('TG/HDL Ratio', 20 + 2 * (boxWidth + 5), yPos + 5);
        pdf.setFontSize(18);
        pdf.text(calculations.tgHdlRatio.toString(), 20 + 2 * (boxWidth + 5), yPos + 15);
        
        // Risk Assessment Section
        yPos += 45;
        pdf.setTextColor(51, 65, 85);
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text('RISK ASSESSMENT', 20, yPos);
        
        yPos += 15;
        
        // Risk level with appropriate color
        let riskColor = [107, 114, 128]; // Default gray
        if (riskCategory.level === 'Low Risk') riskColor = [34, 197, 94];
        else if (riskCategory.level === 'Moderate Risk') riskColor = [251, 191, 36];
        else if (riskCategory.level === 'High Risk') riskColor = [239, 68, 68];
        
        pdf.setFillColor(...riskColor);
        pdf.rect(15, yPos - 5, pageWidth - 30, 20, 'F');
        
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`RISK LEVEL: ${riskCategory.level.toUpperCase()}`, pageWidth / 2, yPos + 7, { align: 'center' });
        
        yPos += 25;
        pdf.setTextColor(51, 65, 85);
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'normal');
        pdf.text(riskCategory.description, 20, yPos);
        
        // Add new page for reference values
        pdf.addPage();
        
        // Reference Values Page
        pdf.setFillColor(102, 126, 234);
        pdf.rect(0, 0, pageWidth, 30, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(20);
        pdf.setFont('helvetica', 'bold');
        pdf.text('REFERENCE VALUES & CLINICAL IMPORTANCE', pageWidth / 2, 20, { align: 'center' });
        
        yPos = 50;
        
        // Reference Values Section
        pdf.setTextColor(51, 65, 85);
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text('REFERENCE VALUES', 20, yPos);
        
        yPos += 20;
        
        // BMI Reference
        pdf.setFillColor(219, 234, 254);
        pdf.rect(15, yPos - 5, pageWidth - 30, 35, 'F');
        pdf.setTextColor(30, 64, 175);
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text('BMI (Body Mass Index)', 20, yPos + 5);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        pdf.text('Normal: 18.5–24.9  |  Overweight: 25–29.9  |  Obese: ≥30', 20, yPos + 15);
        
        yPos += 45;
        
        // TyG Index Reference
        pdf.setFillColor(233, 213, 255);
        pdf.rect(15, yPos - 5, pageWidth - 30, 35, 'F');
        pdf.setTextColor(109, 40, 217);
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text('TyG Index (Triglyceride-Glucose Index)', 20, yPos + 5);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        pdf.text('Low Risk: < 8.0  |  Moderate Risk: 8.0–8.5  |  High Risk: > 8.5', 20, yPos + 15);
        
        yPos += 45;
        
        // TG/HDL Reference
        pdf.setFillColor(254, 215, 170);
        pdf.rect(15, yPos - 5, pageWidth - 30, 35, 'F');
        pdf.setTextColor(194, 65, 12);
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text('TG/HDL Ratio (Triglyceride to HDL Ratio)', 20, yPos + 5);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        pdf.text('Ideal: < 3.0  |  Moderate Risk: 3.0–4.5  |  High Risk: > 4.5', 20, yPos + 15);
        
        yPos += 55;
        
        // Clinical Importance Section
        pdf.setTextColor(51, 65, 85);
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text('CLINICAL IMPORTANCE', 20, yPos);
        
        yPos += 15;
        pdf.setFillColor(239, 246, 255);
        pdf.rect(15, yPos - 5, pageWidth - 30, 60, 'F');
        
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'normal');
        pdf.text('• High BMI increases risk for cardiovascular diseases, diabetes, and metabolic syndrome.', 20, yPos + 10);
        pdf.text('• Elevated TyG Index is linked with insulin resistance and higher risk of type 2 diabetes.', 20, yPos + 25);
        pdf.text('• High TG/HDL ratio is associated with atherosclerosis and heart disease.', 20, yPos + 40);
        
        // Add visual charts if available
        const gaugeContainer = document.getElementById('gaugeChartsContainer');
        if (gaugeContainer && !gaugeContainer.classList.contains('hidden')) {
            try {
                const canvas = await html2canvas(gaugeContainer, {
                    scale: 2,
                    useCORS: true,
                    allowTaint: true,
                    backgroundColor: '#ffffff'
                });
                
                const imgData = canvas.toDataURL('image/png');
                pdf.addPage();
                
                pdf.setFillColor(102, 126, 234);
                pdf.rect(0, 0, pageWidth, 30, 'F');
                pdf.setTextColor(255, 255, 255);
                pdf.setFontSize(20);
                pdf.setFont('helvetica', 'bold');
                pdf.text('VISUAL ANALYTICS', pageWidth / 2, 20, { align: 'center' });
                
                pdf.addImage(imgData, 'PNG', 10, 40, pageWidth - 20, 150);
            } catch (error) {
                console.warn('Could not add charts to PDF:', error);
            }
        }
        
        pdf.save(`${formData.fullName}_metabolic_assessment.pdf`);
        showToast('PDF exported successfully', 'success');
        
    } catch (error) {
        console.error('Error exporting PDF:', error);
        showToast('Error exporting PDF: ' + error.message, 'error');
    }
}

async function loadPatients() {
    const tableBody = document.getElementById('patientsTableBody');
    const noPatients = document.getElementById('noPatients');
    
    try {
        let records = [];
        
        if (supabase) {
            const { data, error } = await supabase
                .from('patient_records')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            records = data || [];
        } else {
            // Load from localStorage for demo
            records = JSON.parse(localStorage.getItem('patientRecords') || '[]');
        }
        
        if (records.length === 0) {
            tableBody.innerHTML = '';
            noPatients.classList.remove('hidden');
            return;
        }
        
        noPatients.classList.add('hidden');
        tableBody.innerHTML = records.map(record => `
            <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">${record.fullName || record.full_name}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${record.age} / ${record.gender}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${record.bmi}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${record.tygIndex || record.tyg_index}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRiskBadgeClass(record.risk_level)}">
                        ${record.risk_level}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${new Date(record.created_at).toLocaleDateString()}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onclick="viewPatient(${record.id})" class="text-medical-600 hover:text-medical-900 mr-3">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button onclick="exportPatient(${record.id})" class="text-green-600 hover:text-green-900">
                        <i class="fas fa-download"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading patients:', error);
        showToast('Error loading patient records', 'error');
    }
}

function getRiskBadgeClass(riskLevel) {
    switch (riskLevel) {
        case 'Low Risk':
            return 'bg-green-100 text-green-800';
        case 'Moderate Risk':
            return 'bg-yellow-100 text-yellow-800';
        case 'High Risk':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
}

function filterPatients() {
    const searchTerm = document.getElementById('searchPatients').value.toLowerCase();
    const rows = document.querySelectorAll('#patientsTableBody tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

function clearForm() {
    document.getElementById('patientForm').reset();
    document.getElementById('resultsContainer').classList.add('hidden');
    document.getElementById('gaugeChartsContainer').classList.add('hidden');
    document.getElementById('noGaugeData').classList.remove('hidden');
    document.getElementById('noResults').classList.remove('hidden');
}

function downloadCSV(content, filename) {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    const icon = document.getElementById('toastIcon');
    const messageEl = document.getElementById('toastMessage');
    
    const icons = {
        success: '<i class="fas fa-check-circle text-green-500"></i>',
        error: '<i class="fas fa-exclamation-circle text-red-500"></i>',
        warning: '<i class="fas fa-exclamation-triangle text-yellow-500"></i>',
        info: '<i class="fas fa-info-circle text-blue-500"></i>'
    };
    
    icon.innerHTML = icons[type] || icons.info;
    messageEl.textContent = message;
    
    toast.classList.remove('hidden');
    
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Global functions for patient management
window.viewPatient = function(id) {
    // Implementation for viewing patient details
    showToast('Patient details view - Feature coming soon', 'info');
};

window.exportPatient = function(id) {
    const records = JSON.parse(localStorage.getItem('patientRecords') || '[]');
    const record = records.find(r => r.id === id);
    
    if (record) {
        // Create a temporary form data object and export as PDF
        const tempFormData = {
            fullName: record.fullName,
            age: record.age,
            gender: record.gender,
            weight: record.weight,
            height: record.height,
            glucose: record.glucose,
            triglycerides: record.triglycerides,
            hdl: record.hdl,
            hba1c: record.hba1c,
            diabetes: record.diabetes
        };
        
        // Use the existing PDF export function
        exportPdfResults();
    }
};