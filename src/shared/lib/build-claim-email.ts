interface ClaimEmailInput {
  fullName: string;
  sponsorName: string;
  sponsorReward: string;
  brandUrl?: string;
}

interface ClaimEmailContent {
  subject: string;
  htmlContent: string;
  textContent: string;
}

export function buildClaimEmail(input: ClaimEmailInput): ClaimEmailContent {
  const { fullName, sponsorName, sponsorReward, brandUrl = "" } = input;

  return {
    subject: "🎉 Thanks for playing with app.publipacks.com",
    htmlContent: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
              <h1 style="color: #163446; text-align: center; margin-bottom: 30px;">🎉 Thanks for playing!</h1>
              <p>Hi ${fullName},</p>
              <p>Thank you for playing with publipacks! The safest platform to win amazing awards near you!</p>
              <div style="background: #E9F9FF; padding: 20px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #44D2FD;">
                <p style="margin: 0; font-weight: bold; color: #124258;">👉 Congratulations — you've won a prize!</p>
                <p style="margin: 10px 0 0 0; color: #154F6A;">${sponsorName}: ${sponsorReward}</p>
              </div>
              <p>Enjoy free prizes and exclusive discounts all around the world.</p>
              <p>Sign up to receive free offers directly to your email, —
                <a href="${brandUrl}" style="color: #44D2FD; text-decoration: none;"> click here to join</a>.
              </p>
              <p>Keep playing, keep winning, and keep discovering amazing rewards!</p>
              <p style="margin-top: 30px;">Cheers,<br><strong>The app.publipacks.com Team</strong></p>
              <hr style="border: none; border-top: 1px solid #ddd; margin: 40px 0 20px 0;">
              <div style="text-align: center; font-size: 12px; color: #666; margin-top: 20px;">
                <p style="margin: 5px 0;">©️ 2025 Publicpacks.com. All rights reserved.</p>
              </div>
            </div>
          `,
    textContent: `Hi ${fullName},

Thank you for playing with publipacks.com! The safest platform to win amazing awards near you!

👉 Congratulations — you've won a prize!
${sponsorName}: ${sponsorReward}

Enjoy free prizes and exclusive discounts all around the world.

Sign up to receive free offers directly to your email, — click here to join: ${brandUrl}

Keep playing, keep winning, and keep discovering amazing rewards!

Cheers,
The app.publipacks.com Team

©️ 2025 Publicpacks.com. All rights reserved.`,
  };
}
