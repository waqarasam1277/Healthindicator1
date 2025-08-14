/**
 * Google Apps Script for Metabolic Risk Calculator
 * This script handles patient data storage and retrieval in Google Sheets
 * 
 * Setup Instructions:
 * 1. Create a new Google Sheet
 * 2. Go to Extensions > Apps Script
 * 3. Replace the default code with this script
 * 4. Save and deploy as a web app
 * 5. Set permissions to "Anyone" and execution as "Me"
 * 6. Copy the deployment URL to your JavaScript application
 */

// Configuration - Update these values
const SHEET_NAME = 'Patient Records';
const HEADERS = [
  'ID', 'Full Name', 'Age', 'Gender', 'Weight (kg)', 'Height (m)', 
  'Glucose (mg/dL)', 'Triglycerides (mg/dL)', 'HDL (mg/dL)', 'HbA1c (%)', 
  'Diabetes Status', 'BMI', 'TyG Index', 'TG/HDL Ratio', 'Risk Level', 
  'Risk Description', 'AI Recommendations', 'Created At', 'Created By'
];

/**
 * Handle HTTP GET requests
 */
function doGet(e) {
  try {
    const action = e.parameter.action;
    
    switch (action) {
      case 'getPatients':
        return getPatients();
      case 'test':
        return ContentService.createTextOutput('Google Apps Script is working!');
      default:
        return ContentService
          .createTextOutput(JSON.stringify({
            status: 'error',
            message: 'Invalid action parameter'
          }))
          .setMimeType(ContentService.MimeType.JSON);
    }
  } catch (error) {
    console.error('Error in doGet:', error);
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle HTTP POST requests
 */
function doPost(e) {
  try {
    const requestData = JSON.parse(e.postData.contents);
    const action = requestData.action;
    
    switch (action) {
      case 'savePatient':
        return savePatient(requestData.data);
      case 'bulkSave':
        return bulkSavePatients(requestData.data);
      default:
        return ContentService
          .createTextOutput(JSON.stringify({
            status: 'error',
            message: 'Invalid action'
          }))
          .setMimeType(ContentService.MimeType.JSON);
    }
  } catch (error) {
    console.error('Error in doPost:', error);
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Initialize the spreadsheet with headers
 */
function initializeSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  
  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }
  
  // Check if headers exist
  const firstRow = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
  const hasHeaders = firstRow.some(cell => cell !== '');
  
  if (!hasHeaders) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    
    // Format header row
    const headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
    headerRange.setBackground('#4285f4');
    headerRange.setFontColor('white');
    headerRange.setFontWeight('bold');
    
    // Auto-resize columns
    sheet.autoResizeColumns(1, HEADERS.length);
  }
  
  return sheet;
}

/**
 * Save a single patient record
 */
function savePatient(patientData) {
  try {
    const sheet = initializeSheet();
    
    // Prepare data row
    const rowData = [
      patientData.id || new Date().getTime().toString(),
      patientData.fullName || '',
      patientData.age || '',
      patientData.gender || '',
      patientData.weight || '',
      patientData.height || '',
      patientData.glucose || '',
      patientData.triglycerides || '',
      patientData.hdl || '',
      patientData.hba1c || '',
      patientData.diabetes || '',
      patientData.bmi || '',
      patientData.tygIndex || '',
      patientData.tgHdlRatio || '',
      patientData.riskLevel || '',
      patientData.riskDescription || '',
      patientData.aiRecommendations || '',
      patientData.createdAt || new Date().toISOString(),
      patientData.createdBy || ''
    ];
    
    // Add the data to the sheet
    sheet.appendRow(rowData);
    
    // Format the new row
    const lastRow = sheet.getLastRow();
    const dataRange = sheet.getRange(lastRow, 1, 1, HEADERS.length);
    
    // Apply risk level color coding
    const riskLevel = patientData.riskLevel;
    if (riskLevel === 'Low Risk') {
      dataRange.setBackground('#d4edda'); // Light green
    } else if (riskLevel === 'Moderate Risk') {
      dataRange.setBackground('#fff3cd'); // Light yellow
    } else if (riskLevel === 'High Risk') {
      dataRange.setBackground('#f8d7da'); // Light red
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'success',
        message: 'Patient record saved successfully',
        rowNumber: lastRow
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error saving patient:', error);
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: 'Failed to save patient: ' + error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Get all patient records
 */
function getPatients() {
  try {
    const sheet = initializeSheet();
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    if (values.length <= 1) {
      // No data or only headers
      return ContentService
        .createTextOutput(JSON.stringify({
          status: 'success',
          data: []
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    const headers = values[0];
    const patients = [];
    
    // Convert rows to objects
    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      const patient = {};
      
      headers.forEach((header, index) => {
        const key = convertHeaderToKey(header);
        patient[key] = row[index] || '';
      });
      
      patients.push(patient);
    }
    
    // Sort by creation date (most recent first)
    patients.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'success',
        data: patients
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error getting patients:', error);
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: 'Failed to retrieve patients: ' + error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Save multiple patient records at once
 */
function bulkSavePatients(patientsData) {
  try {
    const sheet = initializeSheet();
    const rows = [];
    
    patientsData.forEach(patientData => {
      const rowData = [
        patientData.id || new Date().getTime().toString(),
        patientData.fullName || '',
        patientData.age || '',
        patientData.gender || '',
        patientData.weight || '',
        patientData.height || '',
        patientData.glucose || '',
        patientData.triglycerides || '',
        patientData.hdl || '',
        patientData.hba1c || '',
        patientData.diabetes || '',
        patientData.bmi || '',
        patientData.tygIndex || '',
        patientData.tgHdlRatio || '',
        patientData.riskLevel || '',
        patientData.riskDescription || '',
        patientData.aiRecommendations || '',
        patientData.createdAt || new Date().toISOString(),
        patientData.createdBy || ''
      ];
      rows.push(rowData);
    });
    
    // Add all rows at once for better performance
    if (rows.length > 0) {
      const startRow = sheet.getLastRow() + 1;
      sheet.getRange(startRow, 1, rows.length, HEADERS.length).setValues(rows);
      
      // Apply formatting
      for (let i = 0; i < rows.length; i++) {
        const rowRange = sheet.getRange(startRow + i, 1, 1, HEADERS.length);
        const riskLevel = rows[i][14]; // Risk level is at index 14
        
        if (riskLevel === 'Low Risk') {
          rowRange.setBackground('#d4edda');
        } else if (riskLevel === 'Moderate Risk') {
          rowRange.setBackground('#fff3cd');
        } else if (riskLevel === 'High Risk') {
          rowRange.setBackground('#f8d7da');
        }
      }
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'success',
        message: `Successfully saved ${rows.length} patient records`,
        count: rows.length
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error bulk saving patients:', error);
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: 'Failed to bulk save patients: ' + error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Convert header text to JavaScript object key
 */
function convertHeaderToKey(header) {
  const keyMap = {
    'ID': 'id',
    'Full Name': 'fullName',
    'Age': 'age',
    'Gender': 'gender',
    'Weight (kg)': 'weight',
    'Height (m)': 'height',
    'Glucose (mg/dL)': 'glucose',
    'Triglycerides (mg/dL)': 'triglycerides',
    'HDL (mg/dL)': 'hdl',
    'HbA1c (%)': 'hba1c',
    'Diabetes Status': 'diabetes',
    'BMI': 'bmi',
    'TyG Index': 'tygIndex',
    'TG/HDL Ratio': 'tgHdlRatio',
    'Risk Level': 'riskLevel',
    'Risk Description': 'riskDescription',
    'AI Recommendations': 'aiRecommendations',
    'Created At': 'createdAt',
    'Created By': 'createdBy'
  };
  
  return keyMap[header] || header.toLowerCase().replace(/\s+/g, '');
}

/**
 * Test function to verify the script is working
 */
function testScript() {
  console.log('Google Apps Script is working!');
  return 'Test successful';
}

/**
 * Manual trigger to initialize the sheet
 */
function manualInitialize() {
  try {
    const sheet = initializeSheet();
    console.log('Sheet initialized successfully');
    return 'Sheet initialized: ' + sheet.getName();
  } catch (error) {
    console.error('Error initializing sheet:', error);
    return 'Error: ' + error.toString();
  }
}