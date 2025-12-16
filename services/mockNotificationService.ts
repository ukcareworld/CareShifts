
export const sendVerificationEmail = async (email: string, name: string) => {
  console.group('📧 MOCK EMAIL SERVICE');
  console.log(`%cTo: ${email}`, 'color: #3b82f6; font-weight: bold;');
  console.log(`Subject: Welcome to CareShifts - Verify your account`);
  console.log(`Body: Hi ${name}, welcome to CareShifts! Please click the link below to verify your email address.`);
  console.groupEnd();
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
};

export const sendBookingNotifications = async (
  worker: { name: string; email?: string; mobileNumber?: string }, 
  shift: { title: string; date: string; careHomeName: string }
) => {
  console.group('🔔 MOCK NOTIFICATION SERVICE');
  
  if (worker.email) {
    console.log(`%c📧 Email sent to ${worker.email}`, 'color: #3b82f6');
    console.log(`Subject: New Shift Request at ${shift.careHomeName}`);
    console.log(`Body: Hello ${worker.name}, you have been selected for the shift "${shift.title}" on ${shift.date}. Please log in to accept or reject.`);
  }

  if (worker.mobileNumber) {
    console.log(`%c📱 SMS sent to ${worker.mobileNumber}`, 'color: #10b981');
    console.log(`Message: CareShifts Alert: You have a new shift request from ${shift.careHomeName} for ${shift.date}. Check app for details.`);
  }
  
  console.groupEnd();
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
};
