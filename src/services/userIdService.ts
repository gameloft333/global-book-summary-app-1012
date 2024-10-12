export function generateUserId(): string {
  const existingUserId = localStorage.getItem('userId');
  if (existingUserId) {
    return existingUserId;
  }

  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 16; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  localStorage.setItem('userId', result);
  return result;
}