export const paymentConfirmationMail = (
  transactionid: string,
  status: string,
  amount: number,
  quantity: number,
  email: string,
  first_name: string,
  last_name: string,
  event_name: string,
  start_date: string,
  end_date: string,
  city: string,
  address: string
) => {
  const fullName = `${first_name} ${last_name}`;
  const paymentAmount = amount.toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
  });
  const paymentDate = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const statusHTML =
    status.toUpperCase() === "PAID"
      ? `<strong style="color:#28a745;">${status}</strong>`
      : `<strong>${status}</strong>`;

  const eventDatesHTML = end_date
    ? `<li><strong>Event Dates:</strong> ${start_date} to ${end_date}</li>`
    : `<li><strong>Event Dates:</strong> ${start_date}</li>`;

  return `<!doctype html>
<html lang="en">
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>Payment Confirmation</title>
    <style media="all" type="text/css">
      body {
        font-family: Helvetica, sans-serif;
        -webkit-font-smoothing: antialiased;
        font-size: 16px;
        line-height: 1.3;
        -ms-text-size-adjust: 100%;
        -webkit-text-size-adjust: 100%;
        background-color: #f4f5f6;
        margin: 0;
        padding: 0;
      }
      table {
        border-collapse: separate;
        mso-table-lspace: 0pt;
        mso-table-rspace: 0pt;
        width: 100%;
      }
      table td {
        font-family: Helvetica, sans-serif;
        font-size: 16px;
        vertical-align: top;
      }
      .container {
        margin: 0 auto !important;
        max-width: 600px;
        padding: 0;
        padding-top: 24px;
        width: 600px;
      }
      .content {
        box-sizing: border-box;
        display: block;
        margin: 0 auto;
        max-width: 600px;
        padding: 0;
      }
      .main {
        background: #ffffff;
        border: 1px solid #eaebed;
        border-radius: 16px;
        width: 100%;
      }
      .wrapper {
        box-sizing: border-box;
        padding: 24px;
      }
      .btn {
        box-sizing: border-box;
        min-width: 100% !important;
        width: 100%;
      }
      .btn > tbody > tr > td {
        padding-bottom: 16px;
      }
      .btn table {
        width: auto;
      }
      .btn table td {
        background-color: #ffffff;
        border-radius: 4px;
        text-align: center;
      }
      .btn a {
        background-color: #0867ec;
        border: solid 2px #0867ec;
        border-radius: 4px;
        box-sizing: border-box;
        color: #ffffff;
        cursor: pointer;
        display: inline-block;
        font-size: 16px;
        font-weight: bold;
        margin: 0;
        padding: 12px 24px;
        text-decoration: none;
        text-transform: capitalize;
      }
      .footer {
        clear: both;
        padding-top: 24px;
        text-align: center;
        width: 100%;
        color: #9a9ea6;
        font-size: 16px;
      }
    </style>
  </head>
  <body>
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body">
      <tr>
        <td>&nbsp;</td>
        <td class="container">
          <div class="content">

            <!-- START CENTERED WHITE CONTAINER -->
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="main">

              <!-- START MAIN CONTENT AREA -->
              <tr>
                <td class="wrapper">
                  <h1>Payment Confirmation</h1>
                  <p>Hi ${fullName},</p>
                  <p>Thank you for your payment for the event <strong>${event_name}</strong>. We have successfully received your payment with the following details:</p>
                  <ul>
                    <li><strong>Transaction ID:</strong> ${transactionid}</li>
                    <li><strong>Payment Date:</strong> ${paymentDate}</li>
                    <li><strong>Status:</strong> ${statusHTML}</li>
                    <li><strong>Amount:</strong> ${paymentAmount}</li>
                    <li><strong>Quantity:</strong> ${quantity} ticket(s)</li>
                    ${eventDatesHTML}
                    <li><strong>Location:</strong> ${city}, ${address}</li>
                  </ul>
                  
                  <p>If you have any questions, feel free to contact our support team.</p>
                  <p>Thank you for choosing our service!</p>
                </td>
              </tr>

              <!-- END MAIN CONTENT AREA -->
            </table>

            <!-- START FOOTER -->
            <div class="footer">
              <p>LoketKU.com, PT Loket Indonesia, Jl. Polisi Istimewa 14, Surabaya</p>
              <p>Don't like these emails? <a href="http://htmlemail.io/blog" style="color:#0867ec; text-decoration:underline;">Unsubscribe</a>.</p>
              <p>Powered by <a href="http://htmlemail.io" style="color:#0867ec; text-decoration:none;">PT Automatic Mail Loketindo</a></p>
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
export default paymentConfirmationMail;
