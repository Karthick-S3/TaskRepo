
using MailKit.Net.Smtp;
using MimeKit;
using Microsoft.Extensions.Options;
using Backend.Models;
using MailKit.Security;
using System.Diagnostics;


namespace Backend.Repository
{
    public class MyWorkerService : BackgroundService
    {
        private readonly ILogger<MyWorkerService> _logger;
        private readonly EmailSettings _emailSettings;

        public MyWorkerService(ILogger<MyWorkerService> logger,IOptions<EmailSettings> emailSettings)
        {
            _logger = logger;
            _emailSettings = emailSettings.Value;
        }

      
        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Execution started at: {time}", DateTimeOffset.Now);
            

            try
            {
                while(!stoppingToken.IsCancellationRequested){
                TimeSpan delay = GetTimeUntilNextRun();
                await Task.Delay(delay, stoppingToken);
                StartService("iComp");
             
                 await Task.Delay(TimeSpan.FromHours(24), stoppingToken);
                }
              
            }
            catch (TaskCanceledException)
            {
             
                _logger.LogInformation("Service stopping before sending email.");
            }

            _logger.LogInformation("Execution stopping at: {time}", DateTimeOffset.Now);
        }
        private static TimeSpan GetTimeUntilNextRun()
        {
            DateTime now = DateTime.Now;
            DateTime nextRun = now.Date.AddDays(1).AddMinutes(1);
            return nextRun - now;
        }


   public async Task SendEmailAsync(string messageContent)
{
    try
    {
        var message = new MimeMessage();
        message.From.Add(new MailboxAddress("Service Notifications", _emailSettings.SenderEmail));
        message.To.Add(new MailboxAddress("Recipient", _emailSettings.RecipientEmail));

        // if (messageContent == "Started")
        // {
        //     message.Subject = "Service Started Notification";
        //     message.Body = new TextPart("html")
        //     {
        //         Text = @"
        //             <html>
        //             <body>
        //                 <img src='https://cdn-ilahcid.nitrocdn.com/IgUVUxklLZBZXuzpHWqURmbCeIMtyrQd/assets/images/optimized/rev-5a0cc59/email.uplers.com/blog/wp-content/uploads/2016/06/Background-Images-in-Emails.jpg' width='100%' height='600px' alt='Background Image'>
        //                 <p>Dear User,</p>
        //                 <p>The following Service(s) have been Started / Restarted in the Local environment.</p>
        //                 <p><b>Service Name(s):</b></p>
        //                 <ul>
        //                     <li>iCOMP Service_V1.0</li>
        //                 </ul>
        //                 <p>Regards,</p>
        //                 <p>This message was sent to you by iCOMP. This is a system-generated e-mail. We request you not to reply to this message.</p>
        //                 <p><b>Confidentiality Notice:</b></p>
        //                 <p>The information contained in this email and any attachments may be legally privileged and confidential. If you are not an intended recipient, you are hereby notified that any dissemination, distribution, or copying of this e-mail is strictly prohibited. If you have received this email in error, please notify the sender and permanently delete the e-mail and any attachments immediately. You should not retain a copy or use this e-mail or any attachments for any purpose, nor disclose all or any part of the contents to any other person.</p>
        //             </body>
        //             </html>"
        //     };
        // }

if (messageContent == "Started")
{
    message.Subject = "Service Started Notification";
    message.Body = new TextPart("html")
    {
        Text = @"
            <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f8f9fa;
                        margin: 0;
                        padding: 0;
                    }
                    .back {
                        background-color: #f8f9fa;
                        padding: 20px;
                    }
                    .background-badge {
                        height: 200px;
                        background-color: #04246a;
                    }
                    .cont {
                        background-color: rgb(241, 243, 255);
                        margin-top: -100px;
                        padding: 40px;
                        border-radius: 10px;
                    }
                    h1 {
                        text-align: center;
                        font-weight: bold;
                        color: #333333;
                        margin-bottom: 30px;
                    }
                    p {
                        color: #333333;
                        line-height: 1.5;
                    }
                    .footer p {
                        font-size: 12px;
                        color: #6c757d;
                    }
                    .logo {
                        height: 50px;
                        width: 100px;
                    }
                    .footer {
                        margin-top: 30px;
                    }
                    .footer a {
                        color: #ffffff !important;
                        background-color: #04246A;
                        padding: 10px 20px;
                        border-radius: 5px;
                        text-decoration: none;
                        font-weight: 500;
                        display: inline-block;
                    }
                    .footer img {
                        height: 50px;
                    }
                    .footer .d-flex {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }
                    .hr {
                        border-top: 1px solid #dee2e6;
                        margin: 40px 0;
                    }
                </style>
            </head>
            <body>
                <div class='back'>
                    <div class='background-badge'></div>
                    <div class='cont'>
                        <h1>WELCOME !</h1>
                        <div class='content'>
                            <p>Dear User,</p>
                            <p>The following Service(s) have been Started / Restarted in the Local environment:</p>
                            <p><b>Service Name(s):</b></p>
                            <ul>
                                <li>iCOMP Service_V1.0</li>
                            </ul>
                            <p>We wanted to keep you informed of these changes. If you have any questions or need further assistance, please don't hesitate to reach out.</p>
                            <p>Regards,</p>
                            <p>The iCOMP Team</p>
                        </div>
                        <div class='footer'>
                            <p>This message was sent to you by iCOMP. This is a system-generated e-mail. We request you not to reply to this message.</p>
                            <p><b>Confidentiality Notice:</b> The information contained in this email and any attachments may be legally privileged and confidential. If you are not an intended recipient, you are hereby notified that any dissemination, distribution, or copying of this e-mail is strictly prohibited. If you have received this email in error, please notify the sender and permanently delete the e-mail and any attachments immediately. You should not retain a copy or use this e-mail or any attachments for any purpose, nor disclose all or any part of the contents to any other person.</p>
                            <div class='d-flex'>
                                <img class='logo' src='https://www.iinterchange.com/wp-content/uploads/io-iinterchange-logo.svg' alt=''>
                                <a href='https://www.iinterchange.com/' target='_blank'>Stay Connected</a>
                            </div>
                        </div>
                        <div class='hr'></div>
                        <div class='container d-flex align-items-center justify-content-center w-100'>
                            <p>© Copyright iInterchange. All Rights Reserved</p>
                        </div>
                    </div>
                </div>
            </body>
            </html>"
    };
}






        else if (messageContent == "Stopped")
        {
            message.Subject = "Service Stopped Notification";
            message.Body = new TextPart("plain")
            {
               Text = $"Dear User,<br><br>" +
                    $"This is to inform you that the iCOMP Service(s) has been Stopped temporarily.<br><br>" +
                    $"<b>Service Name(s):</b><br>" +
                    $"<ul><li>iCOMP Service_V1.0</li></ul><br><br>" +
                    $"Regards,<br>" +
                    $"This message was sent to you by iCOMP. This is a system-generated e-mail. We request you not to reply to this message.<br><br>" +
                    $"<b>Confidentiality Notice:</b><br>" +
                    $"It will be restart by Admin soon Or otherwise restart automatically tomorrow 12.01 AM .Please be aware that certain iComp-related functionalities may not be available during this time.<br>Thank you for your attention and understanding."  
                    
            };
        }
        else
        {
            throw new ArgumentException("Invalid message content.");
        }

        using (var client = new SmtpClient())
        {
            _logger.LogInformation("Connecting to SMTP server: {SmtpServer}", _emailSettings.SmtpServer);
            await client.ConnectAsync(_emailSettings.SmtpServer, _emailSettings.SmtpPort, SecureSocketOptions.StartTls, CancellationToken.None);
            _logger.LogInformation("Authenticating SMTP server...");
            await client.AuthenticateAsync(_emailSettings.SenderEmail, _emailSettings.SenderPassword);
            _logger.LogInformation("Sending email...");
            await client.SendAsync(message);
            await client.DisconnectAsync(true);
            _logger.LogInformation("Email sent successfully.");
        }
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "An error occurred while sending the email");
    }
}


        public override Task StartAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("Worker Service started");
            return base.StartAsync(cancellationToken);
        }

        public override Task StopAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("Worker Service stopped");
            return base.StopAsync(cancellationToken);
        }

           public async Task StartService(string serviceName)
        {
            _logger.LogInformation("IComp Service Started");
            this.SendEmailAsync("Started");
            
            
            await Task.Run(() =>
            {
                var processInfo = new ProcessStartInfo
                {
                    FileName = "net",
                    Arguments = $"start \"{serviceName}\"",
                    RedirectStandardOutput = true,
                    UseShellExecute = false,
                    CreateNoWindow = true,
                    Verb = "runas" 
                };

                using (var process = Process.Start(processInfo))
                {
                    process.WaitForExit();
                }
            });
        }

        public async Task StopService(string serviceName)
        {
            _logger.LogInformation("IComp Service Stopped");
            SendEmailAsync("Stopped");
            await Task.Run(() =>
            {
                var processInfo = new ProcessStartInfo
                {
                    FileName = "net",
                    Arguments = $"stop \"{serviceName}\"",
                    RedirectStandardOutput = true,
                    UseShellExecute = false,
                    CreateNoWindow = true,
                    Verb = "runas" 
                };

                using (var process = Process.Start(processInfo))
                {
                    process.WaitForExit();
                }
            });
        }
    }
}
