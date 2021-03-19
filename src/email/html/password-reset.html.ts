export const resetPassword = (username: string, link: string): string =>
  `
    <p>Hello ${username},</p>
    <br />
    <p>Your password reset link: <a href="${link}" target="_blank"><b>${link}</b></a></p>
    <p>Or go to this link: ${link}</p>
    <p><small>This link will expire in 30 minutes.</small></p>
    <br />
    <p>Best regards,</p>
    <p>The Tracky Track Team</p>
  `;
