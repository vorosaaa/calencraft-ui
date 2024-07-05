const predefinedColors: string[] = [
  // Gray shades
  "rgba(160, 160, 160, 0.9)", // Dark charcoal
  "rgba(140, 140, 140, 0.9)", // Very dark charcoal
  "rgba(120, 120, 120, 0.9)", // Dim gray

  // Blue shades
  "rgba(70, 110, 140, 0.9)", // Dark blue
  "rgba(40, 70, 100, 0.9)", // Navy blue
  "rgba(20, 40, 70, 0.9)", // Midnight blue

  // Brown shades
  "rgba(140, 110, 90, 0.9)", // Dark brown
  "rgba(110, 80, 60, 0.9)", // Chocolate brown
  "rgba(80, 50, 30, 0.9)", // Espresso brown

  // Green shades
  "rgba(36, 143, 36, 0.9)", // Random green
  "rgba(100, 140, 80, 0.9)", // Dark green
  "rgba(40, 80, 20, 0.9)", // Pine green

  // Other shades
  "rgba(180, 140, 140, 0.9)", // Dark pink
  "rgba(200, 160, 80, 0.9)", // Orange
  "rgba(160, 80, 80, 0.9)", // Reddish-brown
  "rgba(160, 100, 140, 0.9)", // Mauve
  "rgba(140, 160, 100, 0.9)", // Olive
  "rgba(200, 180, 140, 0.9)", // Tan
  "rgba(160, 180, 200, 0.9)", // Slate
  // Add more colors as needed
];

export function generateRandomGradient(): string {
  const colors: string[] = [];

  for (let i = 0; i < 2; i++) {
    colors.push(
      predefinedColors[Math.floor(Math.random() * predefinedColors.length)],
    );
  }

  const degree: number = Math.floor(Math.random() * 360);
  const colorStops: string = colors
    .map((color, index) => {
      const percentage: number = (index + 1) * (100 / 2);
      return `${color} ${percentage}%`;
    })
    .join(", ");
  return `linear-gradient(${degree}deg, ${colorStops})`;
}
