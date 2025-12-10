# Translations Guide - Publipack Application

This document describes all user-facing text strings in the application and where they are used.

## File Structure

- **Source file**: `src/shared/lib/translations.ts` - Contains all English translations
- **Translation file**: `translations.es.ts` (to be created) - Spanish translations

## Translation Keys by Screen/Component

### 1. Main Screen (`src/components/main-screen.tsx`)

**Location**: Landing page with sponsor cards and spin button

- `mainScreen.title` - "READY TO WIN?" - Main heading
- `mainScreen.subtitle` - "Spin the wheel and win rewards from our sponsors" - Subtitle text
- `mainScreen.subtitleBold` - "win rewards" - Bold part of subtitle
- `mainScreen.spinNowButton` - "SPIN NOW" - Main action button
- `mainScreen.countdownMessage` - "Or wait for the countdown" - Shown when countdown is active
- `mainScreen.cooldownMessage` - "Come back tomorrow for another spin" - Shown during cooldown period

---

### 2. Slot Machine / Spinning Screen (`src/shared/ui/slot-machine.tsx`)

**Location**: Screen shown during slot machine animation

- `slotMachine.title` - "Spinning" - Screen title during spin animation

---

### 3. You Won Screen (`src/shared/ui/you-won.tsx`)

**Location**: Screen shown when user wins

- `youWon.title` - "YOU WON!" - Main heading
- `youWon.congratulations` - "Congratulations - You've" - First part of congratulations message
- `youWon.congratulationsBold` - "won {name} {reward}" - Prize information (placeholders: {name}, {reward})

---

### 4. Didn't Win Screen (`src/shared/ui/didnt-win.tsx`)

**Location**: Screen shown when user doesn't win

- `didntWin.title` - "Didn't Win" - Main heading
- `didntWin.message` - "Try again for another chance to win!" - Encouragement message
- `didntWin.spinAgainButton` - "SPIN AGAIN" - Action button

---

### 5. You Lost Screen (`src/shared/ui/you-lost.tsx`)

**Location**: Screen shown when user loses (after cooldown)

- `youLost.title` - "Try again tomorrow!" - Main heading
- `youLost.message` - "Better luck next time. Come back tomorrow for another spin" - Message text
- `youLost.playAgainButton` - "Play Again 24h" - Action button

---

### 6. Claim Reward Screen (`src/shared/ui/claim-reward.tsx`)

**Location**: Form screen for claiming prize

**Screen Headers:**
- `claimReward.title` - "Claim your Reward" - Main heading
- `claimReward.titleBold` - "Reward" - Bold part of title
- `claimReward.subtitle` - "Fill in your details to receive your voucher" - Instructions

**Form Fields:**
- `claimReward.fullNamePlaceholder` - "Full name" - Input placeholder
- `claimReward.phonePlaceholder` - "Phone Number" - Input placeholder
- `claimReward.emailPlaceholder` - "Email Address" - Input placeholder

**Buttons:**
- `claimReward.getVoucherButton` - "Get My Voucher" - Submit button
- `claimReward.submittingButton` - "Submitting..." - Loading state

**Email Content** (sent to user after form submission):
- `claimReward.emailSubject` - "🎉 You've Won a Prize from Publipacks!" - Email subject line
- `claimReward.emailGreeting` - "Hi {fullName}," - Email greeting (placeholder: {fullName})
- `claimReward.emailThankYou` - "Thank you for playing with publipacks.com! The safest platform to win amazing awards near you!" - Thank you message
- `claimReward.emailCongratulations` - "👉 Congratulations — you've won a prize!" - Congratulations message
- `claimReward.emailPrizeInfo` - "{sponsorName}: {reward}" - Prize details (placeholders: {sponsorName}, {reward})
- `claimReward.emailEnjoy` - "Enjoy free prizes and exclusive discounts all around the world." - Benefits message
- `claimReward.emailSignUp` - "Sign up to receive free offers directly to your email, — click here to join: https://app.publipacks.com" - Call to action
- `claimReward.emailKeepPlaying` - "Keep playing, keep winning, and keep discovering amazing rewards!" - Encouragement
- `claimReward.emailCheers` - "Cheers," - Closing
- `claimReward.emailTeam` - "The app.publipacks.com Team" - Team signature
- `claimReward.emailWebsite` - "app.publipacks.com" - Website
- `claimReward.emailCopyright` - "©️ 2025 Publicpacks.com. All rights reserved." - Copyright
- `claimReward.emailFooter` - "Terms & Conditions | Privacy Policy | Data Protection Policy" - Footer links

---

### 7. Claim Success Screen (`src/shared/ui/claim-success.tsx`)

**Location**: Success confirmation screen after form submission

- `claimSuccess.title` - "Congratulations!" - Main heading
- `claimSuccess.emailMessage` - "Your prize has been sent to {email}" - Confirmation message (placeholder: {email})
- `claimSuccess.checkInbox` - "Check your inbox" - Instruction item
- `claimSuccess.rewardSaved` - "Your reward is also saved in My Rewards" - Additional info
- `claimSuccess.downloadRewardButton` - "Download Reward" - Action button
- `claimSuccess.playAgainButton` - "Play Again" - Action button

---

### 8. Win Buttons Component (`src/shared/ui/win-buttons.tsx`)

**Location**: Reusable button component used in multiple screens

- `winButtons.claimMyPrize` - "CLAIM MY PRIZE" - Claim button text
- `winButtons.spinAgain` - "SPIN AGAIN" - Spin again button text
- `winButtons.playAgain24h` - "Play Again 24h" - Play again button (cooldown state)

---

### 9. Activity Notifications (`src/shared/ui/activity-notification.tsx`)

**Location**: Pop-up notifications showing other users' wins

- `activityNotification.justWon` - "{name} just WON! {prize}" - Notification text (placeholders: {name}, {prize})

---

### 10. Form Validation Messages (`src/shared/ui/claim-reward.tsx`)

**Location**: Error messages shown in form validation

- `validation.fullNameRequired` - "Full name is required"
- `validation.fullNameMinLength` - "Full name must be at least 2 characters"
- `validation.fullNameMaxLength` - "Full name must be less than 80 characters"
- `validation.fullNameInvalidChars` - "Full name can only contain letters, spaces, hyphens, and apostrophes"
- `validation.phoneRequired` - "Phone number is required"
- `validation.phoneInvalidChars` - "Phone number contains invalid characters"
- `validation.phoneMinDigits` - "Phone number must contain at least 10 digits"
- `validation.emailRequired` - "Email is required"
- `validation.emailInvalid` - "Please enter a valid email address"

---

### 11. Sponsor Rewards (`src/shared/lib/constants.ts`)

**Location**: Reward descriptions for each sponsor brand

- `rewards.starbucks` - "Free Drink"
- `rewards.dominos` - "Free Pizza"
- `rewards.appleStore` - "App Store"
- `rewards.disney` - "Save up 25%"
- `rewards.netflix` - "Save up 15%"
- `rewards.nike` - "10% Off"
- `rewards.amc` - "Free Movie"
- `rewards.spotify` - "Free Month"

---

### 12. Activity Notification Prizes (`src/hooks/use-activity-notifications.ts`)

**Location**: Prize descriptions used in activity notifications

- `activityPrizes.starbucksFreeDrink` - "Starbucks Free Drink"
- `activityPrizes.dominosFreePizza` - "Domino's Free Pizza"
- `activityPrizes.appleStoreAppStore` - "Apple Store App Store"
- `activityPrizes.disneySaveUp25` - "Disney Save up 25%"
- `activityPrizes.netflixSaveUp15` - "Netflix Save up 15%"
- `activityPrizes.nike10Off` - "Nike 10% Off"
- `activityPrizes.amcFreeMovie` - "AMC Free Movie"
- `activityPrizes.spotifyFreeMonth` - "Spotify Free Month"

---

## Placeholders

Some translation strings contain placeholders that will be replaced with actual values:

- `{name}` - Sponsor name (e.g., "Starbucks")
- `{reward}` - Reward description (e.g., "Free Drink")
- `{fullName}` - User's full name
- `{email}` - User's email address
- `{sponsorName}` - Sponsor brand name
- `{prize}` - Prize description

**Important**: When translating, keep the placeholder format `{placeholderName}` exactly as shown.

---

## How to Create Spanish Translation

1. Copy `src/shared/lib/translations.ts` to `src/shared/lib/translations.es.ts`
2. Replace all English values with Spanish translations
3. Keep the same key structure and placeholder format
4. Update the import in components to use the Spanish file

Example:
```typescript
// translations.es.ts
export const translations = {
  mainScreen: {
    title: "¿LISTO PARA GANAR?",
    subtitle: "Gira la rueda y gana recompensas de nuestros patrocinadores",
    // ... etc
  },
  // ... rest of translations
}
```

---

## Notes for Translators

1. **Brand names**: Keep brand names (Starbucks, Domino's, Nike, etc.) in English
2. **URLs**: Keep URLs unchanged (e.g., https://app.publipacks.com)
3. **Placeholders**: Always preserve the `{placeholderName}` format
4. **Emojis**: Keep emojis as-is (🎉, 👉, etc.)
5. **Punctuation**: Maintain the same punctuation style
6. **Tone**: Keep the friendly, encouraging tone of the original

---

## Total Strings Count

- Main Screen: 6 strings
- Slot Machine: 1 string
- You Won: 3 strings
- Didn't Win: 3 strings
- You Lost: 3 strings
- Claim Reward: 18 strings (including email content)
- Claim Success: 5 strings
- Win Buttons: 3 strings
- Activity Notifications: 1 string
- Validation Messages: 10 strings
- Rewards: 8 strings
- Activity Prizes: 8 strings

**Total: 69 translatable strings**

