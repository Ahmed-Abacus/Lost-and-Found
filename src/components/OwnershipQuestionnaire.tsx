"use client"
import React, { useState } from 'react';
import { LostItem } from '@/types/itemTypes';

interface OwnershipQuestionnaireProps {
  item: LostItem;
  onSuccess: () => void;
  onCancel: () => void;
}

const OwnershipQuestionnaire: React.FC<OwnershipQuestionnaireProps> = ({ 
  item, 
  onSuccess, 
  onCancel 
}) => {
  const [questionnaireQuestions, setQuestionnaireQuestions] = useState<{question: string, expectedAnswer?: string}[]>(
    generateAIQuestions(item)
  );
  const [questionnaireAnswers, setQuestionnaireAnswers] = useState<string[]>(
    Array(generateAIQuestions(item).length).fill("")
  );
  const [verificationScore, setVerificationScore] = useState<number | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Function to generate AI questions based on item details
  function generateAIQuestions(item: LostItem) {
    const questions: {question: string, expectedAnswer?: string}[] = [];
    
    // Add category-specific questions
    switch(item.category) {
      case 'Electronics':
        questions.push(
          { question: "What is the brand and model of your device?", expectedAnswer: `${item.phoneBrand} ${item.phoneModel}` },
          { question: "What color is your device?", expectedAnswer: item.phoneColor },
          { question: "Is there a case on your device? If yes, describe it.", expectedAnswer: item.phoneCase },
          { question: "What was the lock screen or wallpaper on your device?" },
          { question: "Can you provide the IMEI number or any identifying marks on the device?" }
        );
        break;
      
      case 'Wallet_Regular':
      case 'Credit_Card':
      case 'Cash':
      case 'Card_Holder':
        questions.push(
          { question: "What brand is your wallet?", expectedAnswer: item.itemBrand },
          { question: "What color is your wallet?", expectedAnswer: item.itemColor },
          { question: "What specific cards were in your wallet? List as many as you can remember." },
          { question: "Was there any cash in the wallet? If yes, approximately how much?", expectedAnswer: item.hasCash },
          { question: "Are there any unique features or identifying marks on your wallet?" }
        );
        break;
      
      case 'ID_Card':
      case 'Student_Card':
      case 'Driving_License':
      case 'Passport':
        questions.push(
          { question: "What is your full name as it appears on the document?", expectedAnswer: `${item.firstName} ${item.lastName}` },
          { question: "What organization issued the document?", expectedAnswer: item.idCardIssuer || item.university },
          { question: "What is the document number or ID number?" },
          { question: "When was the document issued or when does it expire?" },
          { question: "Are there any specific features on the document (photo, hologram, etc.)?" }
        );
        break;
      
      case 'Backpack':
      case 'Handbag':
        questions.push(
          { question: "What brand is your bag?", expectedAnswer: item.bagBrand },
          { question: "What color is your bag?", expectedAnswer: item.bagColor },
          { question: "What material is your bag made of?", expectedAnswer: item.bagMaterial },
          { question: "What specific items were inside your bag?", expectedAnswer: item.bagContents },
          { question: "Are there any unique features, marks, or attachments on your bag?" }
        );
        break;
      
      case 'ClothesGeneral':
        questions.push(
          { question: "What type of clothing item is it?", expectedAnswer: item.clothesType },
          { question: "What size is the clothing item?", expectedAnswer: item.clothesSize },
          { question: "What color is the clothing item?", expectedAnswer: item.clothesColor },
          { question: "What brand is the clothing item?", expectedAnswer: item.clothesBrand },
          { question: "Are there any unique features, patterns, or marks on the clothing item?" }
        );
        break;
      
      default:
        // Generic questions for other categories
        questions.push(
          { question: "Please describe the item in detail, including color, size, and any identifying features." },
          { question: "When and where did you last have this item?" },
          { question: "Are there any unique marks or personal modifications to the item?" },
          { question: "Can you describe any contents or accessories that came with the item?" },
          { question: "Is there anything else specific about this item that only the owner would know?" }
        );
    }
    
    // Add general verification questions
    questions.push(
      { question: "When did you lose this item?", expectedAnswer: item.date },
      { question: "Where did you lose this item?", expectedAnswer: item.location }
    );
    
    return questions;
  }

  // Function to update questionnaire answers
  const updateQuestionnaireAnswer = (index: number, value: string) => {
    const newAnswers = [...questionnaireAnswers];
    newAnswers[index] = value;
    setQuestionnaireAnswers(newAnswers);
  };

  // Function to verify ownership based on answers
  const verifyOwnership = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    
    // Simulate AI verification process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Calculate verification score
    let score = 0;
    let totalPossiblePoints = 0;
    
    questionnaireQuestions.forEach((question, index) => {
      const userAnswer = questionnaireAnswers[index]?.toLowerCase().trim() || "";
      
      if (question.expectedAnswer) {
        const expectedAnswer = question.expectedAnswer.toLowerCase().trim();
        totalPossiblePoints += 100;
        
        // Exact match
        if (userAnswer === expectedAnswer) {
          score += 100;
        } 
        // Partial match - check if answer contains key parts
        else if (expectedAnswer.split(" ").some(word => word.length > 3 && userAnswer.includes(word))) {
          score += 50;
        }
        // Check for similar answers using simple matching
        else if (userAnswer.length > 0 && (
          expectedAnswer.includes(userAnswer) || 
          userAnswer.includes(expectedAnswer)
        )) {
          score += 30;
        }
      } else {
        // For open-ended questions, just check if they provided a substantial answer
        totalPossiblePoints += 50;
        if (userAnswer.length > 15) {
          score += 50;
        } else if (userAnswer.length > 5) {
          score += 25;
        }
      }
    });
    
    // Calculate percentage score
    const finalScore = Math.round((score / totalPossiblePoints) * 100);
    setVerificationScore(finalScore);
    setIsVerifying(false);
    
    // If score is high enough, trigger success callback
    if (finalScore >= 70) {
      // Wait 2 seconds to show the score before proceeding
      setTimeout(() => {
        onSuccess();
      }, 2000);
    }
  };

  return (
    <div className="mt-6 border-t pt-6">
      <h3 className="text-lg font-medium text-[#32230f] mb-4">
        Verify Your Ownership
      </h3>
      
      {verificationScore === null ? (
        <>
          <p className="text-sm text-gray-600 mb-4">
            To verify you're the rightful owner, please answer these questions about your item.
            Our AI system will analyze your answers to confirm your ownership.
          </p>
          
          <form onSubmit={verifyOwnership} className="space-y-4">
            {questionnaireQuestions.map((question, index) => (
              <div key={index} className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {question.question}
                </label>
                <textarea
                  value={questionnaireAnswers[index] || ""}
                  onChange={(e) => updateQuestionnaireAnswer(index, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6c2704]"
                  rows={2}
                  required
                />
              </div>
            ))}
            
            <div className="flex justify-end space-x-4 mt-6">
              <button
                type="button"
                onClick={onCancel}
                className="py-2 px-4 border border-gray-300 text-gray-700 rounded-lg shadow transition hover:bg-gray-50"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={isVerifying}
                className="py-2 px-4 bg-gradient-to-r from-[#32230f] to-[#6c2704] text-white rounded-lg shadow transition hover:opacity-90 flex items-center"
              >
                {isVerifying ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                  </>
                ) : "Submit Verification"}
              </button>
            </div>
          </form>
        </>
      ) : (
        <div className="space-y-4">
          <div className={`p-4 rounded-lg ${verificationScore >= 70 ? 'bg-green-100' : 'bg-yellow-100'}`}>
            <h3 className={`text-lg font-medium ${verificationScore >= 70 ? 'text-green-800' : 'text-yellow-800'} mb-2`}>
              Verification Result
            </h3>
            
            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${verificationScore >= 70 ? 'bg-green-600' : 'bg-yellow-500'}`} 
                  style={{ width: `${verificationScore}%` }}
                ></div>
              </div>
              <p className="text-sm mt-1 text-gray-600">Confidence Score: {verificationScore}%</p>
            </div>
            
            {verificationScore >= 70 ? (
              <p className="text-green-800">
                Your answers match our records with high confidence. You have been verified as the rightful owner.
                Please proceed to provide your contact information.
              </p>
            ) : (
              <p className="text-yellow-800">
                Your answers don't match our records with sufficient confidence. Please try again with more accurate details
                or contact our support team for manual verification.
              </p>
            )}
          </div>
          
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onCancel}
              className="py-2 px-4 border border-gray-300 text-gray-700 rounded-lg shadow transition hover:bg-gray-50"
            >
              Cancel
            </button>
            
            {verificationScore >= 70 && (
              <button
                type="button"
                onClick={onSuccess}
                className="py-2 px-4 bg-gradient-to-r from-[#32230f] to-[#6c2704] text-white rounded-lg shadow transition hover:opacity-90"
              >
                Continue
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnershipQuestionnaire;