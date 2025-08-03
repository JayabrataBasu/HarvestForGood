# Base URL
$baseUrl = "http://localhost:8000"

Write-Host "Starting email configuration test..."

try {
    # Authentication
    Write-Host "Authenticating..."
    $loginUrl = "$baseUrl/api/token/"
    $loginData = @{
        "username" = "jay123"
        "password" = "qwerty123"
    } | ConvertTo-Json -Compress

    $tokenResponse = Invoke-RestMethod `
        -Uri $loginUrl `
        -Method Post `
        -Body $loginData `
        -ContentType "application/json"

    Write-Host "Authentication successful!"
    Write-Host "Token: $($tokenResponse.access)"

    # Set up headers
    $headers = @{
        "Authorization" = "Bearer $($tokenResponse.access)"
        "Content-Type"  = "application/json"
    }

    # Test email settings
    Write-Host "`nChecking email settings..."
    $settingsUrl = "$baseUrl/api/email-settings/"
    $settingsResponse = Invoke-RestMethod `
        -Uri $settingsUrl `
        -Method Get `
        -Headers $headers

    Write-Host "Email Settings Retrieved:"
    Write-Host "HOST: $($settingsResponse.EMAIL_HOST)"
    Write-Host "PORT: $($settingsResponse.EMAIL_PORT)"
    Write-Host "TLS: $($settingsResponse.EMAIL_USE_TLS)"
    Write-Host "USER: $($settingsResponse.EMAIL_HOST_USER)"

    # Test email sending
    Write-Host "`nSending test email..."
    $emailUrl = "$baseUrl/api/test-email/"
    $emailData = @{
        "subject"        = "Test Email from PowerShell"
        "message"        = "If you receive this, email configuration is working!"
        "recipient_list" = @("harvestforgood01@gmail.com")
    } | ConvertTo-Json -Compress

    $emailResponse = Invoke-RestMethod `
        -Uri $emailUrl `
        -Method Post `
        -Headers $headers `
        -Body $emailData

    Write-Host "Email test response: $($emailResponse.status)"
}
catch {
    Write-Host "`nError occurred:"
    Write-Host "Message: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)"
        Write-Host "Status Description: $($_.Exception.Response.StatusDescription)"
        Write-Host "`nIf you see '530 Authentication Required':"
        Write-Host "1. Check Railway environment variables are set"
        Write-Host "2. Verify Gmail app password is correct (16 chars, no spaces)"
        Write-Host "3. Ensure Gmail 2FA is enabled"
    }
}

Write-Host "`nTest completed!"
