/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    colors: {
      zenGreen: "#C6E6B9",
      green: "#258B6A",
      zenBlue: "#B0E0D3",
      lightCoral: "#FFB5A7",
      lavendar: "#D0A9F5",
      softYellow: "#F8E47D",
      peach: "#FFDAB9",
      mistyPurple: "#D8A7D1",
      darkGreen: "#30534c",
      zenGray: "#E4E8E1",
      white: "#F5F8F4",
      linkBlue: "#4285F4",
      blue: "#25658B",
      red: "#8B4125",
      black: "#1F1F1F",
    },
    backgroundImage: {
      "zen-gradient": "linear-gradient(to right, #5C8D67, #3D7C6F)", // Custom gradient
    },
  },
  plugins: [],
};
