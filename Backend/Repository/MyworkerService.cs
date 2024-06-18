
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
            DateTime nextRun = now.Date.AddDays(1).AddMinutes(1); // Tomorrow at 12:01 AM
            return nextRun - now;
        }


   public async Task SendEmailAsync(string messageContent)
{
    try
    {
        var message = new MimeMessage();
        message.From.Add(new MailboxAddress("Service Notifications", _emailSettings.SenderEmail));
        message.To.Add(new MailboxAddress("Recipient", _emailSettings.RecipientEmail));

        if (messageContent == "Started")
        {
            message.Subject = "Service Started Notification";
            message.Body = new TextPart("plain")
            {
                Text = $"Dear User,\n\n" +
                       $"This is to inform you that the iComp Service has been started.\n" +
                       $"Thank you for your attention.\n\n" +
                       $"Best regards,\n" +
                       $"iComp pvt LTD"
            };
        }
        else if (messageContent == "Stopped")
        {
            message.Subject = "Service Stopped Notification";
            message.Body = new TextPart("plain")
            {
               Text = $"Dear User,\n\n" +
                       $"This is to inform you that the iComp Service has been stopped temporarily.\n" +
                       $"It will be restart by Admin soon Or otherwise restart automatically tomorrow 12.01 AM .\n" +
                       $"Please be aware that certain iComp-related functionalities may not be available during this time.\n" +
                       $"Thank you for your attention and understanding.\n\n" +
                       $"Best regards,\n" +
                       $"iComp pvt LTD"
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
                    Verb = "runas" // Run as administrator
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
                    Verb = "runas" // Run as administrator
                };

                using (var process = Process.Start(processInfo))
                {
                    process.WaitForExit();
                }
            });
        }
    }
}
