export const resetPasswordEmail = (
  email: string,
  first_name: string,
  urlToFE: string
) => {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>Password Reset Request</title>
    <style media="all" type="text/css">
      /* Global resets */
      body {
        font-family: Helvetica, sans-serif;
        font-size: 16px;
        line-height: 1.3;
        margin: 0;
        padding: 0;
        background-color: #f4f5f6;
      }
      table {
        width: 100%;
        border-collapse: collapse;
      }
      table td {
        font-family: Helvetica, sans-serif;
        font-size: 16px;
        vertical-align: top;
      }
      /* Container */
      .container {
        margin: 0 auto;
        max-width: 600px;
        padding: 24px;
        background-color: #ffffff;
        border: 1px solid #eaebed;
        border-radius: 16px;
      }
      /* Typography */
      h1 {
        font-size: 24px;
        color: #333333;
      }
      p {
        font-size: 16px;
        color: #333333;
        margin-bottom: 16px;
      }
      a {
        color: #0867ec;
        text-decoration: underline;
      }
      /* Button */
      .btn {
        width: 100%;
        padding: 12px 24px;
        background-color: #0867ec;
        color: #ffffff;
        text-align: center;
        border-radius: 4px;
        font-weight: bold;
        text-decoration: none;
        display: inline-block;
        margin-bottom: 16px;
      }
      .btn:hover {
        background-color: #ec0867;
      }
      /* Footer */
      .footer {
        text-align: center;
        font-size: 14px;
        color: #9a9ea6;
        margin-top: 24px;
      }
      .footer a {
        color: #9a9ea6;
        text-decoration: none;
      }
      /* Responsive */
      @media only screen and (max-width: 640px) {
        .container {
          padding: 16px;
        }
        h1 {
          font-size: 20px;
        }
        p, a {
          font-size: 14px;
        }
        .btn {
          padding: 10px 20px;
          font-size: 14px;
        }
      }
    </style>
  </head>
  <body>
    <table role="presentation" class="body">
      <tr>
        <td>&nbsp;</td>
        <td class="container">
          <h1>Hello, ${first_name}</h1>
          <p>We received a request to reset your password. If you didn't make this request, you can ignore this email.</p>
          <p>To reset your password, please click the button below:</p>
          <a href="${urlToFE}" class="btn" target="_blank">Create New Password</a>
          <p>If you have any questions, feel free to contact our support team.</p>
          <p>Best regards,<br>Your Company Team</p>
          <div class="footer">
            <p>&copy; 2025 Your Company, All rights reserved.</p>
            <p><a href="mailto:support@yourcompany.com">support@yourcompany.com</a> | <a href="http://yourcompany.com/unsubscribe">Unsubscribe</a></p>
          </div>
        </td>
        <td>&nbsp;</td>
      </tr>
    </table>
  </body>
</html>`;
};
