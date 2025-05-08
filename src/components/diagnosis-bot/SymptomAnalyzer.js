// SymptomAnalyzer.js
import * as tf from '@tensorflow/tfjs';
import metadata from './diagnosis_metadata.json';

class SymptomAnalyzer {
  constructor() {
    this.model = null;
    this.vectorizer = null;
    this.labelMap = metadata.label_map;
    this.symptomDiseaseMap = metadata.symptom_disease_map;
    this.diseaseSymptomMap = metadata.disease_symptom_map;
    this.currentSymptoms = new Set();
    this.possibleConditions = new Set();
    this.diagnosticPath = [];
    this.loaded = this.loadModel();
  }

  async loadModel() {
    this.model = await tf.loadLayersModel('/models/symptom_nlp_model.keras/model.json');
    this.vectorizer = tf.layers.TextVectorization.fromConfig(
      tf.layers.deserialize(metadata.vectorizer_config)
    );
  }

  preprocessInput(text) {
    return this.vectorizer.call(tf.tensor([text.toLowerCase()]));
  }

  async predictCondition(text) {
    await this.loaded;
    const inputTensor = this.preprocessInput(text);
    const prediction = this.model.predict(inputTensor);
    const predictedIndex = prediction.argMax(1).dataSync()[0];
    return this.labelMap[predictedIndex];
  }

  extractSymptoms(text) {
    const symptoms = new Set();
    const textLower = text.toLowerCase();
    
    // Check for each known symptom in the text
    for (const symptom in this.symptomDiseaseMap) {
      if (textLower.includes(symptom)) {
        symptoms.add(symptom);
      }
    }
    
    return Array.from(symptoms);
  }

  async analyzeInput(text) {
    await this.loaded;
    
    // Extract symptoms from text
    const newSymptoms = this.extractSymptoms(text);
    newSymptoms.forEach(s => this.currentSymptoms.add(s));
    this.diagnosticPath.push(`Patient reported: ${text}`);

    // If we have no symptoms yet, ask for more information
    if (this.currentSymptoms.size === 0) {
      return {
        text: "I need more information to help. Can you describe your symptoms in more detail?",
        isQuestion: true,
        isDiagnosis: false
      };
    }

    // Find possible conditions based on symptoms
    const possibleConditions = this.findPossibleConditions();
    
    // If only one possible condition, return diagnosis
    if (possibleConditions.size === 1) {
      const condition = Array.from(possibleConditions)[0];
      return this.generateDiagnosis(condition);
    }
    
    // If multiple possible conditions, ask follow-up question
    if (possibleConditions.size > 1) {
      return this.generateFollowUpQuestion(possibleConditions);
    }
    
    // If no conditions match, use ML model to predict
    const predictedCondition = await this.predictCondition(text);
    this.diagnosticPath.push(`AI model predicted: ${predictedCondition} based on symptom patterns`);
    return this.generateDiagnosis(predictedCondition);
  }

  findPossibleConditions() {
    const conditionScores = {};
    
    // Score each condition based on matching symptoms
    this.currentSymptoms.forEach(symptom => {
      this.symptomDiseaseMap[symptom]?.forEach(condition => {
        conditionScores[condition] = (conditionScores[condition] || 0) + 1;
      });
    });
    
    // Get conditions with highest scores
    const maxScore = Math.max(...Object.values(conditionScores));
    return new Set(
      Object.entries(conditionScores)
        .filter(([_, score]) => score === maxScore)
        .map(([condition]) => condition)
    );
  }

//   generateFollowUpQuestion(possibleConditions) {
//     // Find symptoms that would help differentiate between conditions
//     const differentiatingSymptoms = this.findDifferentiatingSymptoms(possibleConditions);
    
//     if (differentiatingSymptoms.length > 0) {
//       const symptom = differentiatingSymptoms[0];
//       this.diagnosticPath.push(
//         `Asking about ${symptom} to differentiate between ${Array.from(possibleConditions).join(', ')}`
//       );
      
//       return {
//         text: `Do you also have ${symptom}?`,
//         isQuestion: true,
//         isDiagnosis: false
//       };
//     }
    
//     // If no differentiating symptoms, just pick the first one
//     const condition = Array.from(possibleConditions)[0];
//     return this.generateDiagnosis(condition);
//   }

generateFollowUpQuestion(possibleConditions) {
    const conditions = Array.from(possibleConditions);
    
    // First try to find differentiating symptoms
    const differentiatingSymptoms = this.findDifferentiatingSymptoms(possibleConditions);
    
    if (differentiatingSymptoms.length > 0) {
      const symptom = differentiatingSymptoms[0];
      this.diagnosticPath.push(
        `Asking about ${symptom} to differentiate between ${conditions.join(', ')}`
      );
      
      const questionTemplates = [
        `Do you also have ${symptom}?`,
        `Have you noticed any ${symptom}?`,
        `I need to know if you're experiencing ${symptom} as well?`,
        `To help narrow it down, are you having ${symptom} too?`,
        `Another important symptom would be ${symptom} - are you feeling that?`
      ];
      
      return {
        text: questionTemplates[Math.floor(Math.random() * questionTemplates.length)],
        isQuestion: true,
        isDiagnosis: false
      };
    }
    
    // If no differentiating symptoms, ask about symptom severity/duration
    const symptomToAsk = this.getMostImportantSymptom();
    const severityTemplates = [
      `How would you describe the severity of your ${symptomToAsk}? (mild/moderate/severe)`,
      `Has your ${symptomToAsk} been getting better, worse, or staying the same?`,
      `How long have you had ${symptomToAsk}?`,
      `What makes your ${symptomToAsk} better or worse?`,
      `Can you describe your ${symptomToAsk} in more detail?`
    ];
    
    this.diagnosticPath.push(
      `Asking about ${symptomToAsk} characteristics to better understand condition`
    );
    
    return {
      text: severityTemplates[Math.floor(Math.random() * severityTemplates.length)],
      isQuestion: true,
      isDiagnosis: false
    };
  }

  findDifferentiatingSymptoms(possibleConditions) {
    const conditionList = Array.from(possibleConditions);
    const allSymptoms = new Set();
    
    // Get all symptoms associated with possible conditions
    conditionList.forEach(condition => {
      this.diseaseSymptomMap[condition]?.forEach(symptom => {
        allSymptoms.add(symptom);
      });
    });
    
    // Find symptoms not yet reported that are in some but not all conditions
    const differentiatingSymptoms = [];
    allSymptoms.forEach(symptom => {
      if (!this.currentSymptoms.has(symptom)) {
        const conditionsWithSymptom = conditionList.filter(condition => 
          this.diseaseSymptomMap[condition]?.includes(symptom)
        );
        
        if (conditionsWithSymptom.length > 0 && 
            conditionsWithSymptom.length < conditionList.length) {
          differentiatingSymptoms.push(symptom);
        }
      }
    });
    
    return differentiatingSymptoms;
  }

  generateDiagnosis(condition) {
    const reasoning = [...this.diagnosticPath];
    reasoning.push(`Final diagnosis: ${condition} based on reported symptoms`);
    
    // Get recommended specialty (simple mapping - could be enhanced)
    const specialty = this.mapConditionToSpecialty(condition);
    
    return {
      text: `Based on your symptoms, you may have ${condition}. ` +
            `I recommend consulting with a ${specialty} specialist.`,
      isQuestion: false,
      isDiagnosis: true,
      reasoning: reasoning,
      specialty: specialty
    };
  }

  // In SymptomAnalyzer.js - update the specialty mapping
mapConditionToSpecialty(condition) {
    // Expanded specialty mapping
    const specialtyMap = {
      // Cardiovascular
      'heart attack': 'cardiology',
      'angina': 'cardiology',
      'arrhythmia': 'cardiology',
      'hypertension': 'cardiology',
      
      // Respiratory
      'asthma': 'pulmonology',
      'copd': 'pulmonology',
      'pneumonia': 'pulmonology',
      'bronchitis': 'pulmonology',
      
      // Gastrointestinal
      'gastritis': 'gastroenterology',
      'gerd': 'gastroenterology',
      'ibs': 'gastroenterology',
      'crohns': 'gastroenterology',
      
      // Neurological
      'migraine': 'neurology',
      'epilepsy': 'neurology',
      'multiple sclerosis': 'neurology',
      'parkinsons': 'neurology',
      
      // Musculoskeletal
      'arthritis': 'rheumatology',
      'fibromyalgia': 'rheumatology',
      'osteoporosis': 'rheumatology',
      
      // Dermatological
      'eczema': 'dermatology',
      'psoriasis': 'dermatology',
      'acne': 'dermatology',
      
      // Endocrine
      'diabetes': 'endocrinology',
      'thyroid disorder': 'endocrinology',
      
      // Infectious diseases
      'influenza': 'infectious disease',
      'covid': 'infectious disease',
      'urinary tract infection': 'urology',
      
      // Mental health
      'depression': 'psychiatry',
      'anxiety': 'psychiatry',
      'bipolar disorder': 'psychiatry'
    };
  
    // Try to find exact match first
    if (specialtyMap[condition.toLowerCase()]) {
      return specialtyMap[condition.toLowerCase()];
    }
  
    // Fallback to keyword matching
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes('heart') || conditionLower.includes('cardiac')) 
      return 'cardiology';
    if (conditionLower.includes('lung') || conditionLower.includes('pulmonary') || conditionLower.includes('breath')) 
      return 'pulmonology';
    if (conditionLower.includes('stomach') || conditionLower.includes('intestinal') || conditionLower.includes('digest')) 
      return 'gastroenterology';
    if (conditionLower.includes('skin') || conditionLower.includes('rash') || conditionLower.includes('dermat')) 
      return 'dermatology';
    if (conditionLower.includes('brain') || conditionLower.includes('nerve') || conditionLower.includes('neuro')) 
      return 'neurology';
    if (conditionLower.includes('joint') || conditionLower.includes('arthritis') || conditionLower.includes('muscle')) 
      return 'rheumatology';
    if (conditionLower.includes('diabet') || conditionLower.includes('thyroid') || conditionLower.includes('hormon')) 
      return 'endocrinology';
    if (conditionLower.includes('infection') || conditionLower.includes('fever') || conditionLower.includes('viral')) 
      return 'infectious disease';
    if (conditionLower.includes('mental') || conditionLower.includes('depress') || conditionLower.includes('anxiety')) 
      return 'psychiatry';
  
    return 'general practice';
  }
  
  // Enhanced symptom extraction with synonyms
  extractSymptoms(text) {
    const symptoms = new Set();
    const textLower = text.toLowerCase();
    
    // Symptom synonym mapping
    const symptomSynonyms = {
      'headache': ['head pain', 'head ache', 'migraine', 'head throbbing'],
      'fever': ['high temperature', 'elevated temp', 'pyrexia'],
      'nausea': ['sick to stomach', 'queasy', 'feeling vomit'],
      'fatigue': ['tiredness', 'exhaustion', 'low energy'],
      'dizziness': ['lightheaded', 'vertigo', 'unsteady'],
      'rash': ['skin irritation', 'red patches', 'hives'],
      'cough': ['hacking', 'coughing fits', 'dry cough'],
      'shortness of breath': ['breathlessness', 'difficulty breathing', 'sob']
    };
  
    // Check for each known symptom and its synonyms
    for (const symptom in this.symptomDiseaseMap) {
      // Check main symptom
      if (textLower.includes(symptom)) {
        symptoms.add(symptom);
        continue;
      }
      
      // Check synonyms
      for (const [mainSymptom, synonyms] of Object.entries(symptomSynonyms)) {
        if (symptom === mainSymptom) {
          for (const synonym of synonyms) {
            if (textLower.includes(synonym)) {
              symptoms.add(mainSymptom);
              break;
            }
          }
        }
      }
    }
    
    return Array.from(symptoms);
  }
  
  // Enhanced follow-up question generation
  
  
  getMostImportantSymptom() {
    // Simple implementation - could be enhanced with symptom importance ranking
    return Array.from(this.currentSymptoms)[0];
  }

  resetConversation() {
    this.currentSymptoms.clear();
    this.possibleConditions.clear();
    this.diagnosticPath = [];
  }
}

export default SymptomAnalyzer;