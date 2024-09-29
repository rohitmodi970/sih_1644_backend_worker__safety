import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
const app = express()
const port = 3000
app.use(cors())
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to the Monitoring API. Use the /monitor endpoint to send data.');
});

app.post('/monitor', (req, res) => {
    const data = req.body;

    const rcmd = data.rcmd || 0;
    const silica = data.silica || 0;
    const co_ppm = data.co_ppm || 0;
    const ch4_lel = data.ch4_lel || 0;

  let alerts = [];
  let alertColor = "green"; // Default alert color

  // Check for RCMD alert
  if (rcmd > 1.5) {
    alerts.push({
      safety_message: "CRITICAL HEALTH ALERT FOR RCMD LEVELS: RCMD levels are above the safety thresholds. Immediate action is required to limit exposure.<br>Risk of Coal Workers' Pneumoconiosis (CWP): Prolonged exposure to high levels of respirable coal mine dust (RCMD) can lead to CWP, commonly known as black lung disease.<br>",
      preventive_measures: "Preventive Measure:<br>1. Proper Ventilation: Ensure proper ventilation to reduce dust concentration.<br>2. Water Sprays: Use water sprays to suppress dust at the source.<br>3. Personal Protective Equipment: Provide workers with proper PPE to limit exposure.<br>",
      alert_color: "red"
    });
    alertColor = "red";
  }

  // Check for Silica alert
  if (silica > 0.05) {
    alerts.push({
      safety_message: "CRITICAL HEALTH ALERT FOR SILICA: Silica dust levels are above the safety threshold. Immediate action is required to limit exposure.<br>Risk of Silicosis: Silicosis is a lung disease caused by inhaling silica dust. Chronic exposure can lead to severe respiratory issues.<br>",
      preventive_measures: "Preventive Measures:<br>1. Proper Ventilation: Ensure proper ventilation to disperse silica dust.<br>2. Water Sprays: Use water sprays to reduce airborne dust.<br>3. Personal Protective Equipment: Provide workers with proper PPE to limit exposure.<br>",
      alert_color: "red"
    });
    alertColor = "red";
  }

  // Check for CO alert
  if (co_ppm > 100) {
    alerts.push({
      safety_message: "CRITICAL FIRE ALERT: CO levels are dangerously high. Immediate action is required.<br>Use of Fire Suppression Systems is recommended in critical areas.<br>",
      preventive_measures: "Preventive Measures:<br>1. Use Fire Suppression Systems: Automatic fire suppression systems in critical areas should be activated immediately.<br>2. Immediate Ventilation: Ensure proper ventilation to clear out dangerous CO levels.<br>3. Immediate Evacuation of workers is mandatory.<br>",
      alert_color: "red"
    });
    alertColor = "red";
  } else if (co_ppm > 50 && co_ppm <= 100) {
    alerts.push({
      safety_message: "CRITICAL HEALTH WARNING FOR CO LEVELS: CO levels are elevated. No human should enter the area due to the fatal risk.<br>",
      preventive_measures: "Preventive Measures for Elevated CO:<br>1. Increase Ventilation: Ventilation systems should be used to clear CO from the air.<br>2. Evacuate Personnel: Ensure that no workers are exposed to these levels of CO.<br>",
      alert_color: "red"
    });
    alertColor = "red";
  } else if (co_ppm > 35 && co_ppm <= 50) {
    alerts.push({
      safety_message: "ALERT FOR CO: CO levels are elevated, causing risk of headaches, dizziness, and nausea. Immediate ventilation is required.<br>",
      preventive_measures: "Preventive Measures for Moderate CO Levels:<br>1. Use Ventilation Systems: Ensure proper ventilation to reduce CO levels.<br>2. Limit Exposure: Restrict the time workers spend in areas with elevated CO levels.<br>",
      alert_color: "yellow"
    });
    alertColor = "yellow";
  }

  // Check for Methane (CH4) alert
  if (ch4_lel > 12) {
    alerts.push({
      safety_message: "CRITICAL EXPLOSION ALERT FOR METHANE: Methane levels are dangerously high. Immediate evacuation is required.<br>",
      preventive_measures: "Preventive Measures for Methane:<br>1. Immediate Evacuation: Evacuate all personnel from the area.<br>2. Ensure Proper Ventilation: Methane buildup should be dispersed with proper ventilation systems.<br>3. Regular Monitoring: Use gas detectors to continuously monitor methane levels.<br>",
      alert_color: "red"
    });
    alertColor = "red";
  } else if (ch4_lel >= 10 && ch4_lel <= 12) {
    alerts.push({
      safety_message: "ALERT: Methane levels are slightly elevated. Monitor closely and ensure proper ventilation.<br>",
      preventive_measures: "Preventive Measures for Abnormal Methane Levels:<br>1. Increase Ventilation: Ensure proper ventilation to disperse accumulated methane.<br>2. Monitor Closely: Keep a close watch on methane levels.<br>",
      alert_color: "yellow"
    });
    alertColor = "yellow";
  }

  // If no alerts are triggered
  if (alerts.length === 0) {
    alerts.push({
      safety_message: "All safety parameters are within normal limits. No risk of fire or respiratory problems for workers. Operations can continue as usual.",
      preventive_measures: "All good!",
      alert_color: "green"
    });
  }

  // Send the response with alerts
  res.json({
    alerts,
    overall_alert_color: alertColor
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
