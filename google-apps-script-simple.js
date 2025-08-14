/**
 * SIMPLIFIED Google Apps Script for Metabolic Risk Calculator
 * Copy this EXACT code to your Google Apps Script editor
 */

// Handle GET requests
function doGet(e) {
  try {
    const action = e.parameter.action;
    
    if (action === 'test') {
      return ContentService
        .createTextOutput('Google Apps Script is working!')
        .setMimeType(ContentService.MimeType.TEXT);
    }
    
    if (action === 'getPatients') {
      return getPatients();
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: 'Invalid action parameter'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Handle POST requests
function doPost(e) {
  try {
    const requestData = JSON.parse(e.postData.contents);
    const action = requestData.action;
    
    if (action === 'savePatient') {
      return savePatient(requestData.data);
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: 'Invalid action'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Save patient data to the sheet
function savePatient(patientData) {
  try {
    const sheet = getOrCreateSheet();
    
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
    
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'success',
        message: 'Patient record saved successfully'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: 'Failed to save patient: ' + error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Get all patient records
function getPatients() {
  try {
    const sheet = getOrCreateSheet();
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    if (values.length <= 1) {
      return ContentService
        .createTextOutput(JSON.stringify({
          status: 'success',
          data: []
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    const headers = values[0];
    const patients = [];
    
    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      const patient = {};
      
      // Map data to object
      patient.id = row[0] || '';
      patient.fullName = row[1] || '';
      patient.age = row[2] || '';
      patient.gender = row[3] || '';
      patient.weight = row[4] || '';
      patient.height = row[5] || '';
      patient.glucose = row[6] || '';
      patient.triglycerides = row[7] || '';
      patient.hdl = row[8] || '';
      patient.hba1c = row[9] || '';
      patient.diabetes = row[10] || '';
      patient.bmi = row[11] || '';
      patient.tygIndex = row[12] || '';
      patient.tgHdlRatio = row[13] || '';
      patient.riskLevel = row[14] || '';
      patient.riskDescription = row[15] || '';
      patient.aiRecommendations = row[16] || '';
      patient.createdAt = row[17] || '';
      patient.createdBy = row[18] || '';
      
      patients.push(patient);
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'success',
        data: patients
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: 'Failed to retrieve patients: ' + error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Get or create the patient records sheet
function getOrCreateSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName('Patient Records');
  
  if (!sheet) {
    sheet = spreadsheet.insertSheet('Patient Records');
    
    // Add headers
    const headers = [
      'ID', 'Full Name', 'Age', 'Gender', 'Weight (kg)', 'Height (m)', 
      'Glucose (mg/dL)', 'Triglycerides (mg/dL)', 'HDL (mg/dL)', 'HbA1c (%)', 
      'Diabetes Status', 'BMI', 'TyG Index', 'TG/HDL Ratio', 'Risk Level', 
      'Risk Description', 'AI Recommendations', 'Created At', 'Created By'
    ];
    
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    
    // Format header row
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground('#4285f4');
    headerRange.setFontColor('white');
    headerRange.setFontWeight('bold');
  }
  
  return sheet;
}