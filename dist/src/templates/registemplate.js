"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.regisTemplateMail = void 0;
const regisTemplateMail = (username, urlFE) => {
    return `<!doctype html>
<html lang="en">
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>Account Verification Required</title>
    <style media="all" type="text/css">
    /* -------------------------------------
        GLOBAL RESETS
    ------------------------------------- */
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      font-size: 16px;
      line-height: 1.4;
      margin: 0;
      padding: 0;
      -ms-text-size-adjust: 100%;
      -webkit-text-size-adjust: 100%;
    }
    
    table {
      border-collapse: separate;
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
      width: 100%;
    }
    
    table td {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      font-size: 16px;
      vertical-align: top;
    }
    
    /* -------------------------------------
        BODY & CONTAINER
    ------------------------------------- */
    
    body {
      background-color: #f6f9fc;
      width: 100% !important;
      height: 100%;
      margin: 0;
      padding: 0;
    }
    
    .body {
      background-color: #f6f9fc;
      width: 100%;
    }
    
    .container {
      display: block;
      margin: 0 auto !important;
      max-width: 580px;
      padding: 10px;
      width: 580px;
    }
    
    .content {
      box-sizing: border-box;
      display: block;
      margin: 0 auto;
      max-width: 580px;
      padding: 10px;
    }
    
    /* -------------------------------------
        HEADER, FOOTER, MAIN
    ------------------------------------- */
    
    .main {
      background: #ffffff;
      border-radius: 8px;
      width: 100%;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    .wrapper {
      box-sizing: border-box;
      padding: 32px;
    }
    
    .content-block {
      padding-bottom: 10px;
      padding-top: 10px;
    }
    
    .footer {
      clear: both;
      margin-top: 10px;
      text-align: center;
      width: 100%;
    }
    
    .footer td,
    .footer p,
    .footer span,
    .footer a {
      color: #8898aa;
      font-size: 14px;
      text-align: center;
    }
    
    /* -------------------------------------
        TYPOGRAPHY
    ------------------------------------- */
    
    h1 {
      color: #2d3748;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      font-weight: 600;
      line-height: 1.4;
      margin: 0;
      margin-bottom: 24px;
      font-size: 24px;
    }
    
    p,
    ul,
    ol {
      color: #4a5568;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      font-size: 16px;
      font-weight: normal;
      margin: 0;
      margin-bottom: 16px;
      line-height: 1.5;
    }
    
    a {
      color: #3182ce;
      text-decoration: underline;
    }
    
    /* -------------------------------------
        BUTTONS
    ------------------------------------- */
    
    .btn {
      box-sizing: border-box;
      width: 100%;
      margin-bottom: 16px;
    }
    
    .btn > tbody > tr > td {
      padding-bottom: 16px;
    }
    
    .btn table {
      width: auto;
    }
    
    .btn table td {
      background-color: #ffffff;
      border-radius: 6px;
      text-align: center;
    }
    
    .btn a {
      background-color: #3182ce;
      border: solid 1px #3182ce;
      border-radius: 6px;
      box-sizing: border-box;
      color: #ffffff;
      cursor: pointer;
      display: inline-block;
      font-size: 16px;
      font-weight: 600;
      margin: 0;
      padding: 14px 28px;
      text-decoration: none;
      text-transform: none;
      transition: all 0.2s ease;
    }
    
    .btn-primary table td {
      background-color: #3182ce;
    }
    
    .btn-primary a {
      background-color: #3182ce;
      border-color: #3182ce;
      color: #ffffff;
    }
    
    .btn-primary table td:hover {
      background-color: #2c5aa0 !important;
    }
    
    .btn-primary a:hover {
      background-color: #2c5aa0 !important;
      border-color: #2c5aa0 !important;
    }
    
    /* -------------------------------------
        OTHER STYLES THAT MIGHT BE USEFUL
    ------------------------------------- */
    
    .last {
      margin-bottom: 0;
    }
    
    .first {
      margin-top: 0;
    }
    
    .align-center {
      text-align: center;
    }
    
    .align-right {
      text-align: right;
    }
    
    .align-left {
      text-align: left;
    }
    
    .clear {
      clear: both;
    }
    
    .mt0 {
      margin-top: 0;
    }
    
    .mb0 {
      margin-bottom: 0;
    }
    
    .preheader {
      color: transparent;
      display: none;
      height: 0;
      max-height: 0;
      max-width: 0;
      opacity: 0;
      overflow: hidden;
      mso-hide: all;
      visibility: hidden;
      width: 0;
    }
    
    .powered-by a {
      text-decoration: none;
    }
    
    .verification-code {
      background-color: #f7fafc;
      border: 1px solid #e2e8f0;
      border-radius: 4px;
      padding: 16px;
      margin: 16px 0;
      text-align: center;
      font-family: 'Courier New', monospace;
      font-size: 18px;
      font-weight: bold;
      color: #2d3748;
    }
    
    /* -------------------------------------
        RESPONSIVE AND MOBILE FRIENDLY STYLES
    ------------------------------------- */
    
    @media only screen and (max-width: 620px) {
      table.body h1 {
        font-size: 28px !important;
        margin-bottom: 10px !important;
      }
      
      table.body p,
      table.body ul,
      table.body ol,
      table.body td,
      table.body span,
      table.body a {
        font-size: 16px !important;
      }
      
      table.body .wrapper,
      table.body .article {
        padding: 10px !important;
      }
      
      table.body .content {
        padding: 0 !important;
      }
      
      table.body .container {
        padding: 0 !important;
        width: 100% !important;
      }
      
      table.body .main {
        border-left-width: 0 !important;
        border-radius: 0 !important;
        border-right-width: 0 !important;
      }
      
      table.body .btn table {
        width: 100% !important;
      }
      
      table.body .btn a {
        width: 100% !important;
      }
      
      table.body .img-responsive {
        height: auto !important;
        max-width: 100% !important;
        width: auto !important;
      }
    }
    
    /* -------------------------------------
        PRESERVE THESE STYLES IN THE HEAD
    ------------------------------------- */
    
    @media all {
      .ExternalClass {
        width: 100%;
      }
      
      .ExternalClass,
      .ExternalClass p,
      .ExternalClass span,
      .ExternalClass font,
      .ExternalClass td,
      .ExternalClass div {
        line-height: 100%;
      }
      
      .apple-link a {
        color: inherit !important;
        font-family: inherit !important;
        font-size: inherit !important;
        font-weight: inherit !important;
        line-height: inherit !important;
        text-decoration: none !important;
      }
      
      #MessageViewBody a {
        color: inherit;
        text-decoration: none;
        font-size: inherit;
        font-family: inherit;
        font-weight: inherit;
        line-height: inherit;
      }
      
      .btn-primary table td:hover {
        background-color: #2c5aa0 !important;
      }
      
      .btn-primary a:hover {
        background-color: #2c5aa0 !important;
        border-color: #2c5aa0 !important;
      }
    }
    </style>
  </head>
  <body>
    <span class="preheader">Please verify your email address to complete your registration.</span>
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body">
      <tr>
        <td>&nbsp;</td>
        <td class="container">
          <div class="content">
            <!-- START CENTERED WHITE CONTAINER -->
            <table role="presentation" class="main">
              <!-- START MAIN CONTENT AREA -->
              <tr>
                <td class="wrapper">
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                    <tr>
                      <td>
                        <h1>Welcome to our platform, ${username}!</h1>
                        <p>Thank you for creating an account with us. To complete your registration and secure your account, please verify your email address by clicking the button below.</p>
                        
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary">
                          <tbody>
                            <tr>
                              <td align="center">
                                <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                  <tbody>
                                    <tr>
                                      <td>
                                        <a href="${urlFE}" target="_blank">Verify Email Address</a>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        
                        <p>If the button above doesn't work, you can also copy and paste the following link into your browser:</p>
                        <p><a href="${urlFE}" target="_blank">${urlFE}</a></p>
                        
                        <p><strong>Important:</strong> This verification link will expire in 24 hours for security reasons. If you don't verify your email within this time, you'll need to request a new verification email.</p>
                        
                        <p>If you didn't create an account with us, please ignore this email or contact our support team if you have concerns.</p>
                        
                        <p>Best regards,<br>The Support Team</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <!-- END MAIN CONTENT AREA -->
            </table>
            <!-- END MAIN CONTENT AREA -->

            <!-- START FOOTER -->
            <div class="footer">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td class="content-block">
                    <span class="apple-link">© 2024 Your Company Name. All rights reserved.</span>
                  </td>
                </tr>
                <tr>
                  <td class="content-block">
                    <span>Need help? <a href="mailto:support@yourcompany.com">Contact Support</a></span>
                  </td>
                </tr>
                <tr>
                  <td class="content-block">
                    <span>Don't want to receive these emails? <a href="#">Unsubscribe</a></span>
                  </td>
                </tr>
              </table>
            </div>
            <!-- END FOOTER -->
            
          </div>
        </td>
        <td>&nbsp;</td>
      </tr>
    </table>
  </body>
</html>`;
};
exports.regisTemplateMail = regisTemplateMail;
