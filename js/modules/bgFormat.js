function formatBGGradient(topPercentage, bottomPercentage, topColor, bottomColor) {
    return `linear-gradient(calc(180deg + var(--bg-angle)), ${topColor} ${topPercentage}%, ${bottomColor} ${bottomPercentage}%)`;
}