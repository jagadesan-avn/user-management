export type ValidatorKeys = "email" | "password" | "first_name" | "last_name" | "avatar";

const validators: Record<ValidatorKeys, { regex: RegExp; message: string }> = {
  first_name: {
    regex: /^[A-Za-z\s'-]{2,20}$/,
    message: "2–20 characters are required",
  },
  last_name: {
    regex: /^[A-Za-z\s'-]{1,20}$/,
    message: "1–20 characters are required",
  },
  email: {
    regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Enter inputs in valid email format.",
  },
  avatar: {
    regex: /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/,
    message: "Enter inputs in valid link format.",
  },
  password: {
    regex: /^(?=.*[a-zA-Z]).{8,}$/,
    message: "(a-z)(A-Z) 8 characters are required",
  },
};
export const validateInputs = ({ name, value }: { name: string; value: string }) => {
  const validateInput = validators[name as ValidatorKeys];
  if (!validateInput.regex.test(value)) {
    return { [name]: validateInput.message };
  } else {
    return { [name]: "" }
  }
};
