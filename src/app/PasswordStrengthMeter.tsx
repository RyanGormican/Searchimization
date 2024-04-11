const getPasswordStrength = (password) => {
  // Define criteria for password strength
  const minLength = 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

  // Calculate password strength score based on criteria
  let score = 0;
  if (password.length >= minLength) score++;
  if (hasUppercase) score++;
  if (hasLowercase) score++;
  if (hasNumber) score++;
  if (hasSpecialChar) score++;

  return score;
};


const PasswordStrengthMeter = ({ password }) => {
  const strength = getPasswordStrength(password);

  // Define CSS classes for different password strength levels
  const strengthClasses = [
    "w-1/5 bg-red-500",
    "w-2/5 bg-yellow-500",
    "w-3/5 bg-yellow-300",
    "w-4/5 bg-green-500",
    "w-full bg-green-700",
  ];

  // Determine the CSS class based on the password strength score
  const meterClass = strengthClasses[Math.min(strength, strengthClasses.length - 1)];

  return (
    <div className="h-2 bg-gray-200 rounded-md overflow-hidden">
    <div className={`h-full transition-all duration-500 ${meterClass}`} />
    </div>
  );
};
export default PasswordStrengthMeter;
