import validator from "validator"

export function passwordValidator(password) {
    if(!password) return "Please fill this field"
    if(!validator.isStrongPassword(password)) return "Enter a strong password, must contain numbers,letters,special letters"
  return ''
}