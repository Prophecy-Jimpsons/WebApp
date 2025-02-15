export const generateUsername = (
  baseUsername: string,
  walletAddress: string | null,
  isCreatingGame: boolean,
): string => {
  // Clean up the base username and default to "Anonymous" if empty
  const cleanUsername = baseUsername.trim() || "Anonymous";

  if (walletAddress) {
    // For wallet users, append last 4 digits
    const lastFourDigits = walletAddress.slice(-4);
    return `${cleanUsername}#${lastFourDigits}`;
  }

  // For non-wallet users, generate random number based on create/join
  const min = isCreatingGame ? 1 : 50;
  const max = isCreatingGame ? 50 : 100;
  const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
  return `${cleanUsername}#${randomNum}`;
};

export const setUsername = (
  inputUsername: string,
  publicKey: string | null,
  isCreatingGame: boolean,
): string => {
  const cleanUsername = inputUsername.trim() || "Anonymous";
  let finalUsername: string;

  if (publicKey) {
    const lastFourDigits = publicKey.slice(-4);
    finalUsername = `${cleanUsername}#${lastFourDigits}`;
  } else {
    const min = isCreatingGame ? 1 : 50;
    const max = isCreatingGame ? 50 : 100;
    const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    finalUsername = `${cleanUsername}#${randomNum}`;
  }

  // Store username in localStorage
  localStorage.setItem("username", finalUsername);

  // Update game session if it exists
  const gameSession = localStorage.getItem("current_game_session");
  if (gameSession) {
    const session = JSON.parse(gameSession);
    session.username = finalUsername;
    localStorage.setItem("current_game_session", JSON.stringify(session));
  }

  return finalUsername;
};

export const getUsername = (): string => {
  return localStorage.getItem("username") || "Anonymous";
};
