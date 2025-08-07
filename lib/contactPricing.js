/**
 * Contact Pricing Service
 * Calculates coin cost for contacting students based on various factors
 */

export const calculateContactCost = (request) => {
  let baseCost = 5; // Base cost in coins
  
  // Factor 1: Urgency multiplier
  const urgencyMultiplier = {
    'urgent': 2.0,
    'within a week': 1.5,
    'flexible': 1.0,
  };
  
  const urgency = request.urgency?.toLowerCase() || 'flexible';
  baseCost *= urgencyMultiplier[urgency] || 1.0;
  
  // Factor 2: Price range multiplier (higher paying jobs cost more to contact)
  const priceAmount = parseFloat(request.price_amount) || 0;
  if (priceAmount > 100) {
    baseCost *= 1.8;
  } else if (priceAmount > 50) {
    baseCost *= 1.4;
  } else if (priceAmount > 25) {
    baseCost *= 1.2;
  }
  
  // Factor 3: Popularity multiplier (how many tutors have viewed this)
  const viewCount = request.view_count || 0;
  if (viewCount > 20) {
    baseCost *= 2.5;
  } else if (viewCount > 10) {
    baseCost *= 2.0;
  } else if (viewCount > 5) {
    baseCost *= 1.5;
  }
  
  // Factor 4: Subject premium (certain subjects are more in demand)
  const premiumSubjects = ['mathematics', 'physics', 'chemistry', 'computer science', 'programming'];
  const hassPremiumSubject = request.subjects?.some(subject => 
    premiumSubjects.includes(subject.name?.toLowerCase())
  );
  if (hassPremiumSubject) {
    baseCost *= 1.3;
  }
  
  // Factor 5: Time since posted (newer requests cost more)
  const postedDate = new Date(request.created_at);
  const daysSincePosted = (Date.now() - postedDate.getTime()) / (1000 * 60 * 60 * 24);
  if (daysSincePosted < 1) {
    baseCost *= 1.6;
  } else if (daysSincePosted < 3) {
    baseCost *= 1.3;
  }
  
  // Round to nearest integer, minimum 3 coins
  return Math.max(3, Math.round(baseCost));
};

export const getPopularityLevel = (viewCount) => {
  if (viewCount > 20) return { level: 'Very High', color: 'bg-red-100 text-red-800' };
  if (viewCount > 10) return { level: 'High', color: 'bg-orange-100 text-orange-800' };
  if (viewCount > 5) return { level: 'Medium', color: 'bg-yellow-100 text-yellow-800' };
  return { level: 'Low', color: 'bg-green-100 text-green-800' };
};

export const getUrgencyInfo = (urgency) => {
  const urgencyLower = urgency?.toLowerCase() || 'flexible';
  
  switch (urgencyLower) {
    case 'urgent':
      return { 
        level: 'Urgent', 
        color: 'bg-red-100 text-red-800',
        description: 'Student needs help immediately'
      };
    case 'within a week':
      return { 
        level: 'Within a week', 
        color: 'bg-yellow-100 text-yellow-800',
        description: 'Student needs help within 7 days'
      };
    case 'flexible':
      return { 
        level: 'Flexible', 
        color: 'bg-green-100 text-green-800',
        description: 'Student has flexible timeline'
      };
    default:
      return { 
        level: 'Unknown', 
        color: 'bg-gray-100 text-gray-800',
        description: 'Timeline not specified'
      };
  }
};
