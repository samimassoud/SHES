import * as tf from '@tensorflow/tfjs';

class SymptomAnalyzer {
  constructor() {
    this.symptomGraph = {
      "fever": {
        conditions: { "Flu": 0.9, "COVID-19": 0.8 },
        questions: ["Do you also have a cough?", "Have you experienced chills?"]
      },
      "cough": {
        conditions: { "Flu": 0.7, "COVID-19": 0.85 },
        questions: ["Is it a dry cough?", "Do you feel chest tightness?"]
      },
      "headache": {
        conditions: { "Migraine": 0.95, "Flu": 0.4 },
        questions: ["Do you experience light sensitivity?", "Do headaches occur frequently?"]
      }
    };

    this.conditionDetails = {
      "Flu": {
        reasoning: ["You mentioned fever and cough, which are common flu symptoms."],
        specialty: "General Physician"
      },
      "COVID-19": {
        reasoning: ["Fever and cough are typical COVID-19 indicators."],
        specialty: "Infectious Disease Specialist"
      },
      "Migraine": {
        reasoning: ["Headache and related symptoms suggest migraine."],
        specialty: "Neurologist"
      }
    };

    this.conversationState = {
      symptoms: {},
      askedQuestions: new Set(),
      probabilities: {}
    };

    this.model = this.createDummyModel();
  }

  createDummyModel() {
    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 3, inputShape: [10], activation: 'softmax' }));
    model.compile({ optimizer: 'sgd', loss: 'categoricalCrossentropy' });
    return model;
  }

  async analyzeInput(text) {
    const tensorInput = tf.randomNormal([1, 10]); // Placeholder
    const prediction = await this.model.predict(tensorInput).data();
    const symptoms = Object.keys(this.symptomGraph);
    const symptomScores = {};

    symptoms.forEach((symptom, i) => {
      const score = prediction[i % prediction.length]; // Simple fake distribution
      if (score > 0.5) {
        symptomScores[symptom] = score;
      }
    });

    for (const [symptom, confidence] of Object.entries(symptomScores)) {
      this.updateSymptomState(symptom, confidence);
    }

    this.calculateProbabilities();

    if (this.needsMoreInformation()) {
      return this.generateIntelligentFollowUp();
    } else {
      return this.generateDiagnosis();
    }
  }

  updateSymptomState(symptom, confidence) {
    if (!this.conversationState.symptoms[symptom]) {
      this.conversationState.symptoms[symptom] = confidence;
    } else {
      this.conversationState.symptoms[symptom] = Math.max(
        this.conversationState.symptoms[symptom],
        confidence
      );
    }
  }

  calculateProbabilities() {
    const probs = {};
    for (const [symptom, confidence] of Object.entries(this.conversationState.symptoms)) {
      const graphEntry = this.symptomGraph[symptom];
      if (!graphEntry) continue;

      for (const [condition, weight] of Object.entries(graphEntry.conditions)) {
        probs[condition] = (probs[condition] || 0) + confidence * weight;
      }
    }
    this.conversationState.probabilities = probs;
  }

  needsMoreInformation() {
    return Object.keys(this.conversationState.symptoms).length < 2;
  }

  generateIntelligentFollowUp() {
    const availableQuestions = [];

    for (const symptom of Object.keys(this.conversationState.symptoms)) {
      const data = this.symptomGraph[symptom];
      if (data && data.questions) {
        for (const question of data.questions) {
          if (!this.conversationState.askedQuestions.has(question)) {
            availableQuestions.push(question);
            this.conversationState.askedQuestions.add(question);
          }
        }
      }
    }

    if (availableQuestions.length === 0) {
      return {
        text: "Can you describe any other symptoms you're experiencing?",
        isQuestion: true
      };
    }

    const question = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
    return {
      text: question,
      isQuestion: true
    };
  }

  generateDiagnosis() {
    const sortedConditions = Object.entries(this.conversationState.probabilities)
      .sort((a, b) => b[1] - a[1]);

    const [topCondition, probability] = sortedConditions[0] || [];
    const details = this.conditionDetails[topCondition] || {};

    return {
      text: `Based on your symptoms, the most likely condition is **${topCondition}** (${(probability * 100).toFixed(1)}%).`,
      isDiagnosis: true,
      reasoning: details.reasoning || [],
      specialty: details.specialty || 'General'
    };
  }

  resetConversation() {
    this.conversationState = {
      symptoms: {},
      askedQuestions: new Set(),
      probabilities: {}
    };
  }
}

export default SymptomAnalyzer;
